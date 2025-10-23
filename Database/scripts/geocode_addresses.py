#!/usr/bin/env python3
"""
Script de géocodage des adresses clients EBP
Utilise l'API Nominatim (OpenStreetMap) - gratuite mais rate-limited

Usage:
    python3 geocode_addresses.py --limit 100
    python3 geocode_addresses.py --all
    python3 geocode_addresses.py --customer-id CLIENT001
"""

import psycopg2
import sys
import time
import argparse
from typing import Optional, Tuple
from urllib.parse import urlencode
from urllib.request import urlopen
import json

# Configuration
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'user': 'postgres',
    'password': 'postgres',
    'database': 'ebp_db'
}

# Nominatim (OpenStreetMap) - GRATUIT
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search?"
USER_AGENT = "EBP_Mobile_App_Geocoding/1.0"

# Rate limiting (Nominatim policy: 1 request/second max)
SLEEP_BETWEEN_REQUESTS = 1.1  # secondes


def geocode_address(full_address: str) -> Optional[Tuple[float, float, float]]:
    """
    Géocode une adresse via Nominatim

    Returns:
        (latitude, longitude, quality_score) ou None si échec
    """
    try:
        params = {
            'q': full_address,
            'format': 'json',
            'addressdetails': 1,
            'limit': 1
        }

        url = NOMINATIM_URL + urlencode(params)

        # Headers obligatoires Nominatim
        headers = {
            'User-Agent': USER_AGENT
        }

        import urllib.request
        req = urllib.request.Request(url, headers=headers)

        with urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())

            if data and len(data) > 0:
                result = data[0]
                lat = float(result['lat'])
                lon = float(result['lon'])

                # Score de qualité basé sur le type de résultat
                quality = 1.0
                if 'importance' in result:
                    quality = min(float(result['importance']) * 2, 1.0)

                return (lat, lon, quality)

    except Exception as e:
        print(f"❌ Erreur géocodage: {e}", file=sys.stderr)

    return None


def update_customer_gps(conn, customer_id: str, latitude: float, longitude: float, quality: float):
    """Met à jour les coordonnées GPS d'un client"""
    cursor = conn.cursor()

    try:
        # Utiliser la procédure stockée
        cursor.execute("""
            CALL mobile.update_customer_gps(%s, %s, %s, 'nominatim', %s)
        """, (customer_id, latitude, longitude, quality))

        conn.commit()
        return True

    except Exception as e:
        conn.rollback()
        print(f"❌ Erreur mise à jour BDD: {e}", file=sys.stderr)
        return False
    finally:
        cursor.close()


def geocode_customers(limit: Optional[int] = None, customer_id: Optional[str] = None, auto_confirm: bool = False):
    """Géocode les clients sans GPS"""

    print("🌍 Démarrage géocodage adresses clients EBP")
    print("=" * 60)

    # Connexion BDD
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        print(f"✅ Connecté à {DB_CONFIG['database']}")
    except Exception as e:
        print(f"❌ Erreur connexion BDD: {e}", file=sys.stderr)
        return

    cursor = conn.cursor()

    # Récupérer les clients à géocoder
    if customer_id:
        query = """
            SELECT customer_id, name, full_address, city, zipcode
            FROM mobile.v_customers_to_geocode
            WHERE customer_id = %s
        """
        cursor.execute(query, (customer_id,))
        print(f"\n📍 Géocodage client: {customer_id}")
    else:
        query = """
            SELECT customer_id, name, full_address, city, zipcode
            FROM mobile.v_customers_to_geocode
            ORDER BY name
        """
        if limit:
            query += f" LIMIT {limit}"
            cursor.execute(query)
            print(f"\n📍 Géocodage des {limit} premiers clients")
        else:
            cursor.execute(query)
            print(f"\n📍 Géocodage de TOUS les clients")

    customers = cursor.fetchall()
    total = len(customers)

    if total == 0:
        print("✅ Aucun client à géocoder !")
        cursor.close()
        conn.close()
        return

    print(f"📊 {total} clients à traiter\n")
    print("⚠️  Rate limit: 1 requête/seconde (Nominatim policy)")
    print("⏱️  Temps estimé: ~{:.0f} secondes (~{:.1f} minutes)\n".format(
        total * SLEEP_BETWEEN_REQUESTS,
        total * SLEEP_BETWEEN_REQUESTS / 60
    ))

    # Confirmation si beaucoup de clients
    if total > 100 and not customer_id and not auto_confirm:
        response = input(f"⚠️  Géocoder {total} clients ? (y/N): ")
        if response.lower() not in ['y', 'yes', 'o', 'oui']:
            print("❌ Annulé")
            cursor.close()
            conn.close()
            return

    print("\n" + "=" * 60)
    print("🚀 Démarrage géocodage...\n")

    success_count = 0
    error_count = 0

    for idx, (cust_id, name, full_address, city, zipcode) in enumerate(customers, 1):
        print(f"[{idx}/{total}] {name[:30]:<30} ({city})")
        print(f"    📍 {full_address}")

        # Géocoder
        result = geocode_address(full_address)

        if result:
            lat, lon, quality = result
            print(f"    ✅ GPS: {lat:.6f}, {lon:.6f} (qualité: {quality:.2f})")

            # Mettre à jour BDD
            if update_customer_gps(conn, cust_id, lat, lon, quality):
                success_count += 1
            else:
                error_count += 1
        else:
            print(f"    ❌ Géocodage échoué")
            error_count += 1

        # Rate limiting (respecter Nominatim policy)
        if idx < total:
            time.sleep(SLEEP_BETWEEN_REQUESTS)

        print()

    # Résumé
    print("=" * 60)
    print("📊 RÉSUMÉ")
    print("=" * 60)
    print(f"✅ Succès:    {success_count}/{total} ({success_count/total*100:.1f}%)")
    print(f"❌ Échecs:    {error_count}/{total} ({error_count/total*100:.1f}%)")
    print()

    # Statistiques finales
    cursor.execute("""
        SELECT
            COUNT(*) as total,
            COUNT("MainDeliveryAddress_Latitude") as with_gps,
            ROUND((COUNT("MainDeliveryAddress_Latitude")::DECIMAL / COUNT(*)) * 100, 2) as pct
        FROM public."Customer"
        WHERE "ActiveState" = 1
    """)

    total_customers, with_gps, pct = cursor.fetchone()
    print(f"📊 Clients actifs avec GPS: {with_gps}/{total_customers} ({pct}%)")

    cursor.execute("SELECT COUNT(*) FROM mobile.v_customers_to_geocode")
    remaining = cursor.fetchone()[0]
    print(f"📍 Clients restant à géocoder: {remaining}")

    cursor.close()
    conn.close()

    print("\n✅ Géocodage terminé!")


def main():
    parser = argparse.ArgumentParser(
        description='Géocodage des adresses clients EBP via Nominatim (OpenStreetMap)'
    )

    group = parser.add_mutually_exclusive_group()
    group.add_argument(
        '--limit',
        type=int,
        help='Nombre maximum de clients à géocoder (ex: 100)'
    )
    group.add_argument(
        '--all',
        action='store_true',
        help='Géocoder TOUS les clients (peut être long !)'
    )
    group.add_argument(
        '--customer-id',
        type=str,
        help='Géocoder un client spécifique par son ID'
    )

    parser.add_argument(
        '--yes', '-y',
        action='store_true',
        help='Confirmer automatiquement sans demander (mode non-interactif)'
    )

    args = parser.parse_args()

    if args.all:
        geocode_customers(limit=None, auto_confirm=args.yes)
    elif args.customer_id:
        geocode_customers(customer_id=args.customer_id, auto_confirm=args.yes)
    elif args.limit:
        geocode_customers(limit=args.limit, auto_confirm=args.yes)
    else:
        # Par défaut: 10 premiers clients
        print("ℹ️  Aucun paramètre spécifié. Géocodage des 10 premiers clients.")
        print("   Utilisez --help pour voir toutes les options.\n")
        geocode_customers(limit=10, auto_confirm=args.yes)


if __name__ == '__main__':
    main()
