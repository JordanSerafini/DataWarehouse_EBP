# 📱 EBP Mobile - Guide Utilisateur Rapide

## 🚀 Nouvelles Fonctionnalités (26 Oct 2025)

### 🔐 Authentification Biométrique

**Activation :**
1. Connectez-vous avec email/mot de passe
2. Une popup propose d'activer Face ID / Touch ID
3. Cliquez "Activer" → Authentification biométrique
4. Vos identifiants sont stockés de manière sécurisée

**Utilisation :**
- À la prochaine connexion, cliquez sur le bouton avec l'icône 👆
- Authentifiez-vous avec votre visage ou empreinte
- Connexion instantanée !

**Gestion :**
- Allez dans **Profil** → Section "Sécurité"
- Utilisez le switch pour activer/désactiver

---

### 🔧 Interventions Terrain - Workflow Complet

**1. Démarrer une intervention :**
```
Interventions → Sélectionner une intervention "En attente"
→ Bouton "Démarrer l'intervention"
→ Statut passe à "En cours" 🔵
```

**2. Ajouter des photos :**
```
Dans l'intervention en cours :
→ Section "Photos"
→ "Prendre une photo" (caméra) OU "Galerie"
→ Upload automatique avec GPS 📍
→ Badge vert ✅ quand uploadée
```

**3. Signature client :**
```
Section "Signature client"
→ "Capturer signature client"
→ Saisir nom du client
→ Client signe dans le cadre
→ "Valider" → Upload automatique
```

**4. Clôturer l'intervention :**
```
Bouton "Clôturer l'intervention"
→ Saisir le rapport d'intervention (obligatoire)
→ Valider
→ Statut passe à "Terminée" ✅
```

---

## 📋 Fonctionnalités Disponibles

### Authentification
- ✅ Login email/mot de passe
- ✅ Face ID / Touch ID (iOS/Android)
- ✅ Auto-login au démarrage
- ✅ Stockage sécurisé (Keychain/EncryptedSharedPreferences)
- ✅ Gestion dans Profil

### Interventions
- ✅ Liste interventions (mes interventions)
- ✅ Détail intervention avec toutes les infos
- ✅ Workflow : PENDING → IN_PROGRESS → COMPLETED
- ✅ Upload photos (caméra ou galerie)
- ✅ Géolocalisation automatique des photos
- ✅ Signature client (canvas tactile)
- ✅ Rapport d'intervention
- ✅ Navigation Maps (adresse client)
- ✅ Pull-to-refresh

### Profil
- ✅ Informations utilisateur
- ✅ Changement rapide de compte (dev)
- ✅ Gestion biométrie (ON/OFF)
- ✅ Dernière synchronisation
- ✅ Logout

---

## 🎯 Workflow Type - Technicien Terrain

### Matin
```
1. Ouvrir l'app
2. Auto-login biométrique 👆
3. Voir ses interventions du jour
```

### Sur site
```
1. Cliquer sur l'intervention
2. Bouton "Ouvrir dans Maps" → Navigation
3. Arrivé → "Démarrer l'intervention"
4. Pendant le travail :
   - Prendre photos des installations
   - Prendre photos des problèmes
5. Fin du travail :
   - Faire signer le client
   - Saisir le rapport
   - "Clôturer l'intervention"
```

### Soir
```
Toutes les interventions sont synchronisées ✅
Logout → App prête pour demain
```

---

## 🔧 Endpoints Backend Utilisés

### Authentification
- `POST /auth/login` - Login classique
- `POST /auth/refresh` - Refresh token (auto)

### Interventions
- `GET /api/v1/interventions/my-interventions` - Liste
- `GET /api/v1/interventions/:id` - Détail
- `PUT /api/v1/interventions/:id/start` - Démarrer
- `PUT /api/v1/interventions/:id/complete` - Clôturer
- `POST /api/v1/interventions/:id/photos` - Upload photo
- `POST /api/v1/interventions/:id/signature` - Upload signature
- `GET /api/v1/interventions/:id/files` - Liste fichiers
- `DELETE /api/v1/interventions/files/:fileId` - Supprimer fichier

---

## 📱 Compatibilité

### Testée sur
- ✅ Expo Go (iOS/Android)
- ✅ Simulateur iOS
- ✅ Émulateur Android

### Requis
- iOS 13+ ou Android 6+
- Connexion internet
- Caméra (pour photos)
- Face ID / Touch ID (optionnel, pour biométrie)
- GPS (optionnel, pour géolocalisation)

---

## 🐛 Problèmes Connus & Solutions

### "Biométrie non disponible"
**Cause :** Device sans Face ID/Touch ID ou Expo Go limité
**Solution :** Normal en émulateur, tester sur device physique

### "Erreur lors du chargement de l'intervention"
**Cause :** Backend non accessible ou intervention inexistante
**Solution :** Vérifier connexion réseau et backend URL

### Photos ne s'uploadent pas
**Cause :** Permissions caméra/galerie refusées
**Solution :** Aller dans Paramètres → EBP Mobile → Autoriser caméra + galerie

### WatermelonDB désactivé
**Cause :** Expo Go ne supporte pas les native modules
**Solution :** Normal en dev, créer development build pour production

---

## 📞 Support

### Logs utiles
```javascript
// Activer logs détaillés
console.log('[BiometricService] ...')
console.log('[InterventionService] ...')
```

### Debug
- Vérifier URL backend dans `api.service.ts`
- Vérifier token JWT dans authStore
- Vérifier permissions dans Paramètres device

---

## 🎨 Design System

### Couleurs
- **Primary:** #6200ee (violet Material Design)
- **Success:** #4caf50 (vert)
- **Error:** #f44336 (rouge)
- **Warning:** #ff9800 (orange)
- **Info:** #2196f3 (bleu)

### Statuts Interventions
- 🟠 **PENDING** - En attente (orange)
- 🔵 **IN_PROGRESS** - En cours (bleu)
- 🟢 **COMPLETED** - Terminée (vert)
- 🔴 **CANCELLED** - Annulée (rouge)

---

## ⚡ Raccourcis Clavier (Dev)

### Expo Dev Tools
- `r` - Reload app
- `m` - Toggle menu
- `d` - Toggle devtools
- `i` - Open iOS simulator
- `a` - Open Android emulator

### VS Code (recommandé)
- `Cmd+Shift+P` → "Expo: Start"
- `Cmd+K Cmd+S` - Keyboard shortcuts

---

## 📚 Documentation Technique

Pour les développeurs, voir :
- **AVANCEMENT_26-10-25.md** - État d'avancement détaillé
- **PHASE1_RESUME.md** - Résumé Phase 1 (Architecture)
- **MIGRATION_STORES.md** - Guide stores Zustand
- **NATIVEWIND_GUIDE.md** - Guide styling
- **CLAUDE.md** (racine) - Documentation projet complète

---

## 🎯 Prochaines Fonctionnalités

### Bientôt disponible
- [ ] Carte GPS interventions à proximité
- [ ] TimeSheet (enregistrement temps)
- [ ] Galerie photos (voir les photos uploadées)
- [ ] Mode offline complet (WatermelonDB)
- [ ] Dark mode

### En développement
- [ ] Clients 360° (historique, stats)
- [ ] Projets & Devis
- [ ] Calendrier optimisé
- [ ] Notifications push
- [ ] Voice commands

---

**Version :** 1.0.0
**Dernière mise à jour :** 26 octobre 2025
**Auteur :** Équipe EBP Mobile
