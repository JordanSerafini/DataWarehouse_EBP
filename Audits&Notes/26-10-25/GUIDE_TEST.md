# 🧪 Guide de Test - Session 26 Octobre 2025

## 🚀 Démarrage Rapide

### 1. Préparer la base de données

```bash
# Depuis la racine du projet
cd Database/seeds

# Exécuter les seeds dans l'ordre
psql -h localhost -U postgres -d ebp_db -f 003_jordan_colleague_ebp.sql
psql -h localhost -U postgres -d ebp_db -f 004_test_interventions_jordan.sql
```

**Résultat attendu** :
- ✅ Colleague Jordan créé dans EBP
- ✅ 5 interventions de test créées (1 PENDING, 1 IN_PROGRESS, 2 SCHEDULED, 1 COMPLETED)

### 2. Lancer le backend

```bash
cd backend
npm run start:dev
```

**Vérifier** : http://localhost:3000/api/docs

### 3. Lancer le mobile

```bash
cd mobile
npx expo start
```

**Scan QR code** avec Expo Go sur smartphone

---

## 🧪 Plan de Tests

### Test 1 : Login & Biométrie

**Objectif** : Vérifier l'authentification

1. **Login classique** :
   - Email : `jordan@solution-logique.fr`
   - Password : `password123`
   - ✅ Connexion réussie
   - ✅ Modal biométrie proposée

2. **Activation biométrie** :
   - ✅ Clic "Activer"
   - ✅ Prompt Face ID/Touch ID
   - ✅ Stockage sécurisé

3. **Logout → Login biométrique** :
   - ✅ Bouton biométrique visible
   - ✅ Auto-login avec Face ID

---

### Test 2 : Interventions - Workflow PENDING → IN_PROGRESS

**Objectif** : Démarrer une intervention

1. **Voir la liste** :
   - ✅ 5 interventions visibles
   - ✅ Filtres statut fonctionnels
   - ✅ Recherche fonctionne

2. **Sélectionner INT-TEST-001 (PENDING)** :
   - ✅ Détails affichés
   - ✅ Badge "En attente" orange
   - ✅ Bouton "Démarrer l'intervention"

3. **Démarrer** :
   - ✅ Clic bouton
   - ✅ Confirmation
   - ✅ Statut → IN_PROGRESS (bleu)
   - ✅ TimeSheet visible
   - ✅ Upload photos/signature activés

---

### Test 3 : TimeSheet

**Objectif** : Enregistrer le temps passé

**Sur INT-TEST-002 (déjà IN_PROGRESS)** :

1. **Voir TimeSheet** :
   - ✅ Temps initial : 01:00:00 (1h déjà passée)
   - ✅ Chronomètre affiché
   - ✅ État "En pause"

2. **Démarrer chronomètre** :
   - ✅ Clic "Démarrer"
   - ✅ Temps incrémente chaque seconde
   - ✅ État "En cours..."
   - ✅ Bouton "Pause" visible

3. **Pause** :
   - ✅ Temps arrêté
   - ✅ Bouton "Démarrer" visible

4. **Saisie manuelle** :
   - ✅ Clic icône crayon
   - ✅ Modal heures/minutes
   - ✅ Saisir "2h 30min"
   - ✅ Appliquer
   - ✅ Temps affiché : 02:30:00

5. **Sauvegarder** :
   - ✅ Clic "Enregistrer le temps"
   - ✅ Loading
   - ✅ Toast "Temps enregistré avec succès"
   - ✅ Vérifier DB : `AchievedDuration_DurationInHours = 2.5`

**Vérification backend** :
```bash
# Vérifier l'endpoint
curl -X PUT http://localhost:3000/api/v1/interventions/{id}/time \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"timeSpentSeconds": 9000}'
```

---

### Test 4 : Photos avec GPS

**Objectif** : Upload photos géolocalisées

1. **Prendre photo** :
   - ✅ Clic "Caméra"
   - ✅ Autorisation GPS
   - ✅ Photo prise
   - ✅ Preview avec coordonnées
   - ✅ Upload automatique

2. **Galerie** :
   - ✅ Photo apparaît dans PhotoGallery
   - ✅ Clic photo → Full-screen modal
   - ✅ Badge GPS si coordonnées

3. **Supprimer photo** :
   - ✅ Icône poubelle
   - ✅ Confirmation
   - ✅ Photo supprimée

---

### Test 5 : Signature Client

**Objectif** : Capturer signature

1. **Ouvrir SignaturePad** :
   - ✅ Canvas tactile visible
   - ✅ Input "Nom du signataire"

2. **Dessiner signature** :
   - ✅ Trait tactile fonctionne
   - ✅ Bouton "Effacer"
   - ✅ Preview signature (avec checkmark vert)

3. **Enregistrer** :
   - ✅ Saisir nom "M. Dupont"
   - ✅ Clic "Enregistrer"
   - ✅ Upload
   - ✅ Toast success

---

### Test 6 : Clôture Intervention

**Objectif** : Terminer IN_PROGRESS → COMPLETED

**Sur INT-TEST-002** :

1. **Conditions** :
   - ✅ Statut IN_PROGRESS
   - ✅ Photos uploadées (optionnel)
   - ✅ Signature uploadée (optionnel)
   - ✅ TimeSheet enregistré

2. **Clôturer** :
   - ✅ Clic "Clôturer l'intervention"
   - ✅ Prompt "Rapport d'intervention"
   - ✅ Saisir rapport
   - ✅ Validation
   - ✅ Statut → COMPLETED (vert)
   - ✅ Badge "Terminée"

---

### Test 7 : Carte GPS Interventions

**Objectif** : Voir interventions sur carte

1. **Toggle Liste/Carte** :
   - ✅ InterventionsScreen
   - ✅ Bouton "Carte" visible
   - ✅ Clic → MapView

2. **Carte interactive** :
   - ✅ 5 marqueurs colorés :
     - Orange : PENDING
     - Bleu : IN_PROGRESS
     - Gris : SCHEDULED
     - Vert : COMPLETED
   - ✅ Callout avec détails
   - ✅ Distance calculée (haversine)
   - ✅ Bouton "Me localiser"

3. **Navigation** :
   - ✅ Clic marqueur → Callout
   - ✅ Clic callout → InterventionDetails

---

### Test 8 : Recherche Clients

**Objectif** : Recherche avancée avec filtres

1. **SearchBar** :
   - ✅ Taper "lyon"
   - ✅ Debouncing 500ms
   - ✅ Résultats filtrés

2. **Filtres** :
   - ✅ Clic icône filtre
   - ✅ Modal filtres
   - ✅ Saisir ville "Paris"
   - ✅ Saisir CP "75008"
   - ✅ Appliquer
   - ✅ Chips filtres affichés
   - ✅ Badge compteur (2)

3. **Réinitialiser** :
   - ✅ Bouton "Réinitialiser"
   - ✅ Filtres effacés

4. **Pagination** :
   - ✅ Scroll bas de liste
   - ✅ Chargement automatique page suivante
   - ✅ Loader visible

---

### Test 9 : Vue 360° Client

**Objectif** : Voir détails complets client

1. **Sélectionner client** :
   - ✅ Clic sur carte client
   - ✅ Navigation → CustomerDetails

2. **Infos affichées** :
   - ✅ Nom + contact
   - ✅ Adresse complète
   - ✅ Téléphone cliquable (appel direct)
   - ✅ Email cliquable (mailto:)
   - ✅ Bouton GPS (Google Maps)

3. **KPIs** :
   - ✅ Nombre interventions
   - ✅ CA total (formaté €)

4. **Stats documents** :
   - ✅ Par type (Devis, Factures)
   - ✅ Nombre + montant

5. **Historique** :
   - ✅ 5 dernières interventions
   - ✅ Dates formatées (français)
   - ✅ Nom technicien
   - ✅ Clic → InterventionDetails

6. **Actions rapides** :
   - ✅ Téléphone → Appel direct
   - ✅ Email → Ouvre mail app
   - ✅ GPS → Google Maps navigation

---

## 📊 Checklist Complète

### Backend ✅
- [ ] Serveur démarré sur :3000
- [ ] Swagger docs accessible
- [ ] Endpoint TimeSheet visible
- [ ] Seeds exécutés

### Mobile ✅
- [ ] Expo démarré
- [ ] App scannée
- [ ] Login fonctionnel
- [ ] Biométrie testée

### Workflow Interventions ✅
- [ ] Liste visible
- [ ] Démarrage PENDING → IN_PROGRESS
- [ ] TimeSheet fonctionnel
- [ ] Photos upload OK
- [ ] Signature upload OK
- [ ] Clôture IN_PROGRESS → COMPLETED

### Clients ✅
- [ ] Recherche fonctionne
- [ ] Filtres fonctionnent
- [ ] Pagination OK
- [ ] Vue 360° complète
- [ ] Actions rapides OK

### Carte GPS ✅
- [ ] Toggle Liste/Carte
- [ ] Marqueurs colorés
- [ ] Callout détails
- [ ] Distance calculée
- [ ] Navigation markers

---

## 🐛 Debugging

### Erreur : "Cannot connect to backend"
```bash
# Vérifier backend
cd backend
npm run start:dev

# Vérifier mobile app.json
"extra": {
  "apiUrl": "http://localhost:3000"  # ou IP machine si device physique
}
```

### Erreur : "Login failed 400"
```bash
# Vérifier que Jordan existe
psql -h localhost -U postgres -d ebp_db -c "SELECT * FROM mobile.users WHERE email = 'jordan@solution-logique.fr';"

# Re-créer si besoin
psql -h localhost -U postgres -d ebp_db -f Database/migrations/009_create_users_table.sql
```

### Erreur : "No interventions"
```bash
# Re-créer interventions
psql -h localhost -U postgres -d ebp_db -f Database/seeds/004_test_interventions_jordan.sql
```

### Vérifier TimeSheet en DB
```sql
SELECT
  "ScheduleEventNumber",
  "Caption",
  "EventState",
  "AchievedDuration_DurationInHours"
FROM public."ScheduleEvent"
WHERE "ColleagueId" = 'JORDAN'
ORDER BY "StartDateTime" DESC;
```

---

## 🎯 Résultats Attendus

Après tous les tests :

✅ **Authentification** : Login + biométrie fonctionnels
✅ **Interventions** : Workflow complet PENDING → IN_PROGRESS → COMPLETED
✅ **TimeSheet** : Chronomètre + saisie + save backend
✅ **Photos** : Upload avec GPS fonctionnel
✅ **Signature** : Capture + preview + upload
✅ **Carte GPS** : Interventions géolocalisées
✅ **Clients** : Recherche + filtres + vue 360°
✅ **Navigation** : Toutes les transitions fluides

---

**Version** : 26 octobre 2025
**Tests** : Mobile + Backend
