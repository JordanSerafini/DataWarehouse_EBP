# 📱 Application Mobile EBP - Phase 1 Intégration Frontend

Application mobile React Native Expo pour la gestion terrain des interventions, clients et projets.

## 🎯 Objectifs

Application mobile **offline-first** permettant aux techniciens et responsables de :
- Consulter leur planning (jour/semaine/mois)
- Gérer leurs tâches quotidiennes
- Accéder aux informations clients et chantiers
- Synchroniser les données avec le backend NestJS

## ✨ Fonctionnalités Implémentées

### ✅ Phase 1 - Base de l'Application

#### 🏗️ Architecture
- **Stack Technique**: Expo + React Native + TypeScript
- **Base de données locale**: WatermelonDB (SQLite) pour offline-first
- **State Management**: Zustand (léger et performant)
- **Navigation**: React Navigation v7 (Bottom Tabs + Stack)
- **UI/UX**: React Native Paper (Material Design 3)
- **Animations**: React Native Reanimated 3

#### 📊 Modules Fonctionnels

**1. Module Planning** ✅
- Vues jour/semaine/mois
- Navigation entre périodes
- Filtrage par statut (Planifié, En cours, Terminé, Annulé)
- Pull-to-refresh pour synchronisation
- Indicateurs visuels de statut (codes couleur)
- FAB pour créer une intervention

**2. Module Tâches du Jour** ✅
- Agrégation de toutes les interventions du jour
- Regroupement par statut (À faire, En cours, Terminées)
- Barre de progression journalière
- Statistiques en temps réel (total, terminées, %)
- Pull-to-refresh

**3. Système de Permissions** ✅
- Contrôle d'accès basé sur les rôles (RBAC)
- 6 rôles supportés: SUPER_ADMIN, ADMIN, PATRON, CHEF_CHANTIER, COMMERCIAL, TECHNICIEN
- Matrice de permissions complète
- Vérification au niveau écran et action

**4. Synchronisation Offline-First** ✅
- Architecture Pull/Push avec WatermelonDB
- Synchronisation automatique toutes les 30 minutes
- Détection des changements locaux non synchronisés
- Gestion des conflits
- Tracking de la dernière synchronisation

**5. Logging & Notifications** ✅
- Logger centralisé avec 5 niveaux (DEBUG, INFO, WARN, ERROR, SYNC)
- Persistance locale des logs (max 1000 entrées)
- Toast notifications modernes (succès, erreur, warning, info)
- Notifications de synchronisation

#### 📱 Écrans Créés

| Écran | Statut | Description |
|-------|--------|-------------|
| **Planning** | ✅ Complet | Vues jour/semaine/mois avec navigation |
| **Tâches du jour** | ✅ Complet | Dashboard des tâches avec progression |
| **Interventions** | 🚧 Placeholder | Liste complète (à implémenter) |
| **Détail Intervention** | 🚧 Placeholder | Fiche détaillée (à implémenter) |
| **Clients** | 🚧 Placeholder | Liste clients (à implémenter) |
| **Détail Client** | 🚧 Placeholder | Fiche client (à implémenter) |
| **Projets** | 🚧 Placeholder | Liste projets/chantiers (à implémenter) |
| **Détail Projet** | 🚧 Placeholder | Fiche projet (à implémenter) |
| **Profil** | ✅ Complet | Profil utilisateur + déconnexion |

## 🗂️ Architecture du Projet

```
mobile/
├── src/
│   ├── components/         # Composants réutilisables (à créer)
│   ├── config/
│   │   ├── api.config.ts   # Configuration endpoints backend
│   │   └── database.ts     # Configuration WatermelonDB
│   ├── models/             # Modèles WatermelonDB
│   │   ├── schema.ts       # Schéma de la base locale
│   │   ├── Intervention.ts # Modèle Intervention
│   │   ├── Customer.ts     # Modèle Client
│   │   ├── Project.ts      # Modèle Projet
│   │   └── index.ts
│   ├── navigation/
│   │   └── AppNavigator.tsx # Navigation principale
│   ├── screens/            # Écrans de l'application
│   │   ├── Planning/
│   │   │   └── PlanningScreen.tsx
│   │   ├── Tasks/
│   │   │   └── TasksScreen.tsx
│   │   ├── Interventions/
│   │   ├── Customers/
│   │   ├── Projects/
│   │   └── Profile/
│   ├── services/
│   │   ├── api.service.ts  # Communication backend
│   │   └── sync.service.ts # Synchronisation offline-first
│   ├── stores/             # State management (Zustand)
│   │   ├── authStore.ts    # Authentification & utilisateur
│   │   └── syncStore.ts    # État de synchronisation
│   ├── types/              # Définitions TypeScript
│   │   ├── user.types.ts
│   │   ├── intervention.types.ts
│   │   ├── customer.types.ts
│   │   ├── project.types.ts
│   │   └── index.ts
│   └── utils/
│       ├── logger.ts       # Service de logging
│       ├── toast.ts        # Notifications toast
│       └── permissions.ts  # Système de permissions RBAC
├── App.tsx                 # Point d'entrée de l'app
├── app.json               # Configuration Expo
├── package.json
└── tsconfig.json
```

## 📦 Technologies & Dépendances

### Dépendances Principales

```json
{
  "@nozbe/watermelondb": "^0.28.0",           // Base de données locale
  "@react-navigation/native": "^7.1.18",      // Navigation
  "@react-navigation/native-stack": "^7.5.1", // Stack Navigator
  "@react-navigation/bottom-tabs": "^7.5.0",  // Bottom Tabs
  "axios": "^1.12.2",                         // Client HTTP
  "date-fns": "^4.1.0",                       // Manipulation de dates
  "expo": "~54.0.20",                         // Framework Expo
  "react": "19.1.0",
  "react-native": "0.81.5",
  "react-native-paper": "^5.x",               // UI Material Design
  "react-native-reanimated": "^3.x",          // Animations
  "toastify-react-native": "^7.2.3",          // Toast notifications
  "zustand": "^5.0.8"                         // State management
}
```

## 🚀 Démarrage Rapide

### Prérequis

- Node.js v22+ et npm
- Backend NestJS démarré (http://localhost:3000)
- PostgreSQL avec données EBP synchronisées

### Installation

```bash
cd mobile
npm install
```

### Lancement

```bash
# Démarrer Expo
npm start

# iOS (nécessite macOS)
npm run ios

# Android (nécessite Android Studio ou émulateur)
npm run android

# Web (pour développement)
npm run web
```

### Configuration

Modifier `src/config/api.config.ts` si le backend n'est pas sur localhost:3000 :

```typescript
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? 'http://localhost:3000'         // Development
    : 'https://api.votre-domaine.com', // Production
  // ...
};
```

## 🎨 UI/UX - Tendances 2025

L'application suit les meilleures pratiques UI/UX 2025 :

### ✅ Principes Appliqués

- **Minimalisme**: Design épuré, focus sur l'essentiel
- **Material Design 3**: Composants modernes et cohérents
- **Dark Mode Ready**: Thème préconfiguré (activation à venir)
- **Micro-interactions**: Animations fluides avec Reanimated 3
- **Accessibilité**: Support des lecteurs d'écran
- **Responsive**: Adapté à toutes les tailles d'écran
- **Gestures**: Navigation intuitive par gestes

### 🎨 Palette de Couleurs

```typescript
Primary:    #6200ee  // Violet Material
Secondary:  #03dac6  // Cyan
Success:    #4CAF50  // Vert
Warning:    #FF9800  // Orange
Error:      #F44336  // Rouge
Background: #f5f5f5  // Gris clair
Surface:    #ffffff  // Blanc
```

### 📱 Navigation

- **Bottom Tabs**: 6 onglets principaux
- **Stack Navigation**: Pour les écrans de détail
- **Gestures**: Swipe back, pull-to-refresh
- **FAB**: Actions flottantes contextuelles

## 🔐 Authentification & Permissions

### Rôles Supportés

| Rôle | Description | Permissions |
|------|-------------|-------------|
| **SUPER_ADMIN** | Administrateur système | Toutes les permissions |
| **ADMIN** | Administrateur | Gestion complète sauf système |
| **PATRON** | Patron | Vue d'ensemble + commercial |
| **CHEF_CHANTIER** | Chef de chantier | Gestion interventions + projets |
| **COMMERCIAL** | Commercial | Gestion commerciale + clients |
| **TECHNICIEN** | Technicien | Interventions terrain uniquement |

### Permissions par Module

Voir `src/utils/permissions.ts` pour la matrice complète.

## 🔄 Synchronisation

### Architecture Offline-First

```
┌─────────────────┐
│   Mobile App    │
│   (WatermelonDB)│
└────────┬────────┘
         │
         │ Sync
         │
┌────────▼────────┐
│   Backend API   │
│    (NestJS)     │
└────────┬────────┘
         │
         │
┌────────▼────────┐
│   PostgreSQL    │
│   (EBP Data)    │
└─────────────────┘
```

### Stratégie de Sync

1. **Pull**: Récupérer les données du serveur
   - Interventions modifiées depuis dernière sync
   - Clients actifs
   - Projets assignés

2. **Push**: Envoyer les modifications locales
   - Nouvelles interventions
   - Statuts mis à jour
   - Photos/signatures uploadées

3. **Résolution de conflits**
   - Horodatage serveur prioritaire
   - Logs de toutes les modifications

### Triggers de Synchronisation

- ✅ Automatique: Toutes les 30 minutes
- ✅ Manuel: Pull-to-refresh
- ✅ Au démarrage de l'app
- 🚧 Push instantané des modifications critiques (à venir)

## 📝 Logging

Tous les événements sont loggés avec 5 niveaux :

```typescript
logger.debug('CATEGORY', 'Message de debug', { data });
logger.info('CATEGORY', 'Information', { data });
logger.warn('CATEGORY', 'Avertissement', { data });
logger.error('CATEGORY', 'Erreur', { error });
logger.sync('Message de synchronisation', { stats });
```

Les logs sont :
- ✅ Persistés localement (max 1000 entrées)
- ✅ Consultables via l'écran Profil (à implémenter)
- ✅ Exportables en JSON
- ✅ Affichés en console en mode développement

## 🧪 Tests (À Implémenter)

```bash
# Tests unitaires
npm test

# Tests E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📦 Build & Déploiement

### Android

```bash
# Build APK
eas build --platform android --profile preview

# Build AAB (Google Play)
eas build --platform android --profile production
```

### iOS

```bash
# Build pour TestFlight
eas build --platform ios --profile preview

# Build pour App Store
eas build --platform ios --profile production
```

## 🚧 Prochaines Étapes

### Phase 2 - Écrans de Détail (Priorité Haute)

- [ ] Écran Détail Intervention complet
  - Affichage toutes les informations
  - Démarrer/Terminer/Annuler
  - Upload photos et signatures
  - Ajout de notes
  - Timeline d'activité

- [ ] Écran Détail Client
  - Informations complètes
  - Liste des contacts
  - Historique interventions
  - Projets associés

- [ ] Écran Détail Projet/Chantier
  - Informations projet
  - Liste interventions liées
  - Documents associés
  - Progression

### Phase 3 - Listes Complètes (Priorité Moyenne)

- [ ] Liste Interventions avec filtres
- [ ] Liste Clients avec recherche
- [ ] Liste Projets avec filtres
- [ ] Création d'intervention mobile
- [ ] Création de client mobile

### Phase 4 - Fonctionnalités Avancées (Priorité Basse)

- [ ] Mode hors-ligne complet
- [ ] Géolocalisation et cartes
- [ ] Notifications push
- [ ] Scan QR Code
- [ ] Export PDF
- [ ] Mode Dark
- [ ] Multi-langue (FR/EN)

## 🐛 Debugging

### Logs en Temps Réel

```bash
# Voir les logs
npx react-native log-android  # Android
npx react-native log-ios      # iOS
```

### Résolution de Problèmes

**Problème : WatermelonDB ne fonctionne pas**
```bash
# Nettoyer et réinstaller
rm -rf node_modules
npm install
```

**Problème : Synchronisation échoue**
- Vérifier que le backend est démarré
- Vérifier la configuration API_CONFIG
- Consulter les logs dans l'app

**Problème : Erreur de compilation TypeScript**
```bash
# Vérifier les types
npx tsc --noEmit
```

## 📚 Documentation Complémentaire

- [Backend API Documentation](../backend/README.md)
- [Audit Backend Complet](../backend/AUDIT_BACKEND_COMPLET.md)
- [Guide WatermelonDB](https://watermelondb.dev/docs)
- [React Navigation Docs](https://reactnavigation.org/)
- [React Native Paper](https://reactnativepaper.com/)

## 👥 Contributeurs

- **Claude AI** - Développement initial
- **Architecture**: Offline-First avec WatermelonDB
- **Backend**: NestJS avec 54 endpoints
- **Database**: PostgreSQL avec données EBP

## 📄 Licence

Propriétaire - Usage interne uniquement

---

**Version**: 1.0.0
**Date**: 24 octobre 2025
**Statut**: ✅ Phase 1 Terminée (Planning + Tâches du jour)
