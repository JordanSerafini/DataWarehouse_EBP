# Migration 014 : Amélioration du mapping Colleague → mobile.users

## Date d'exécution
2025-10-24

## Objectif
Améliorer la synchronisation entre `public.Colleague` (table EBP) et `mobile.users` pour corriger les problèmes d'emails, de noms complets et de mapping de rôles.

## Problèmes résolus

### 1. Encodage des caractères accentués dans les emails
**Avant :**
- `jrmy.anselmemartin@solution-logique.fr` (Jérémy)
- `grard.janin@solution-logique.fr` (Gérard)
- `frdric.surugue@solution-logique.fr` (Frédéric)
- `philippe.mign@solution-logique.fr` (Migné)

**Après :**
- `jeremy.anselmemartin@solution-logique.fr`
- `gerard.janin@solution-logique.fr`
- `frederic.surugue@solution-logique.fr`
- `philippe.migne@solution-logique.fr`

**Solution :** Utilisation de l'extension PostgreSQL `unaccent()` avec l'ordre correct :
```sql
REGEXP_REPLACE(
  LOWER(unaccent('Jérémy' || '.' || 'Anselme-Martin')),
  '[^a-z0-9.]', '', 'g'
)
-- Résultat: "jeremy.anselmemartin"
```

### 2. Noms complets incomplets
**Avant :**
- Seulement le nom de famille (Contact_Name)
- Ex: "Emonet", "Janin", "Rozier"

**Après :**
- Prénom + Nom (Contact_FirstName + Contact_Name)
- Ex: "Christophe Emonet", "Gérard Janin", "Benjamin Rozier"

### 3. Mapping des rôles selon IsSalesperson
**Avant :**
- Tous les collègues avaient le rôle "technicien" par défaut

**Après :**
- `IsSalesperson = true` → rôle `commercial`
- `IsSalesperson = false` → rôle `technicien`

**Résultat :**
- 7 commerciaux identifiés correctement
- 24 techniciens

### 4. Gestion des doublons d'email
**Avant :**
- Emails avec ID EBP ajouté : `christophe.emonet.christophee@solution-logique.fr`

**Après :**
- Suffixe numérique : `christophe.emonet@solution-logique.fr` et `christophe.emonet1@solution-logique.fr`

## Doublons légitimes identifiés

### Christophe Emonet
- **CE** (Id) → `IsSalesperson = true` → `commercial`
- **CHRISTOPHEE** (Id) → `IsSalesperson = false` → `technicien`
- *Même personne, deux rôles différents dans EBP*

### Frédéric Surugue
- **CR00011** (Id) → `technicien` → `frederic.surugue@solution-logique.fr`
- **FREDERIC** (Id) → `technicien` → `frederic.surugue1@solution-logique.fr`
- *Probablement doublon EBP à nettoyer*

## Résultats

### Statistiques finales
- **Total utilisateurs :** 34
  - 3 admins (admin, jordan, manager)
  - 31 collègues synchronisés depuis EBP
    - 7 commerciaux
    - 24 techniciens

### Utilisateurs mis à jour
31 utilisateurs ont été mis à jour par la migration, incluant :
- 19 collègues actifs
- 12 comptes techniques/groupe (EBP GROUPE, COMMERCIAL GROUPE, etc.)

## Fonctions créées

### 1. `mobile.sync_all_pending_colleagues(p_default_role, p_password_hash)`
Synchronise les collègues EBP qui ne sont pas encore dans mobile.users

**Paramètres :**
- `p_default_role` : Rôle par défaut (technicien)
- `p_password_hash` : Hash bcrypt du mot de passe par défaut (pass123)

**Logique :**
1. Parcourt tous les collègues avec `ActiveState = 1`
2. Ignore ceux déjà synchronisés
3. Génère email : `prenom.nom@solution-logique.fr` (avec `unaccent()`)
4. Gère les doublons avec suffixe numérique
5. Mappe le rôle selon `IsSalesperson`
6. Insère dans `mobile.users`

### 2. `mobile.update_existing_colleagues()`
Met à jour les utilisateurs existants avec le nouveau format

**Logique :**
1. Parcourt tous les utilisateurs liés à un collègue
2. Recalcule email, full_name, role selon les nouvelles règles
3. Met à jour si différent

## Tests effectués

### Test 1 : Login technicien
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jeremy.anselmemartin@solution-logique.fr","password":"pass123"}'
```

**Résultat :** ✅ Login réussi
- Rôle : technicien
- Permissions : interventions, photos, signatures
- ColleagueId : JEREMY

### Test 2 : Login commercial
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"christophe.emonet@solution-logique.fr","password":"pass123"}'
```

**Résultat :** ✅ Login réussi
- Rôle : commercial
- Permissions : sales, quotes, documents
- ColleagueId : CE

### Test 3 : API liste utilisateurs
```bash
curl http://localhost:3000/api/v1/users/list
```

**Résultat :** ✅ 34 utilisateurs retournés
- Triés par hiérarchie de rôle
- Emails correctement formatés
- Noms complets avec caractères accentués

## Rollback

Si nécessaire, exécuter :
```bash
psql -h localhost -U postgres -d ebp_db -f Database/migrations/014_improve_colleague_sync_rollback.sql
```

**Attention :** Le rollback supprime uniquement les fonctions, pas les données utilisateurs.

## Prochaines étapes recommandées

1. **Nettoyer les doublons EBP**
   - Identifier si CHRISTOPHEE et CE sont la même personne
   - Consolider FREDERIC et CR00011

2. **Standardiser la casse des noms**
   - Certains noms sont en MAJUSCULES (CLAUDE HETTLER, Thomas VIAL)
   - Uniformiser en Proper Case (Prénom Nom)

3. **Réviser les comptes techniques**
   - Vérifier si les comptes "GROUPE" sont nécessaires
   - Peut-être les désactiver ou leur donner un rôle spécial

4. **Tester l'application mobile**
   - Vérifier que les 34 utilisateurs s'affichent correctement
   - Tester le quick login avec différents rôles
   - Vérifier les permissions pour chaque rôle

## Fichiers modifiés

- `Database/migrations/014_improve_colleague_sync.sql` (créé)
- `Database/migrations/014_improve_colleague_sync_rollback.sql` (créé)
- Extension PostgreSQL `unaccent` installée

## Notes techniques

### Ordre des opérations pour l'email
**Critique** : L'ordre doit être respecté pour éviter la corruption des emails

```sql
-- ❌ INCORRECT (supprime les lettres majuscules avant lowercasing)
LOWER(REGEXP_REPLACE(unaccent(...), '[^a-z0-9.]', '', 'g'))

-- ✅ CORRECT (lowercase d'abord, puis suppression des caractères invalides)
REGEXP_REPLACE(LOWER(unaccent(...)), '[^a-z0-9.]', '', 'g')
```

### Extension unaccent
L'extension `unaccent` doit être installée :
```sql
CREATE EXTENSION IF NOT EXISTS unaccent;
```

Transformations :
- Jérémy → Jeremy
- Gérard → Gerard
- Frédéric → Frederic
- Migné → Migne

## Auteur
Migration créée et exécutée par Claude Code
Date : 2025-10-24
