# NinjaOne API - Configuration et Utilisation

## 📋 Résumé

API NestJS pour l'intégration avec NinjaOne (région EU). L'API permet de récupérer des données sur les organisations, techniciens, appareils et tickets.

## ✅ Configuration réussie

### Authentification
- **Région**: Europe (`https://eu.ninjarmm.com`)
- **Type d'authentification**: OAuth 2.0 Client Credentials
- **Statut**: ✅ Fonctionnel

### Fichier .env
```
CLIENT_ID=EPn-C2V8MCFVh11AerkGNOuFiX4
CLIENT_SECRET=5oEPoGgG5zqFavkyYTqvOc3T0gG96xWAMzfW6edoEMH6ZQFYFbEHOQ
NINJA_ONE_BASE_URL=https://eu.ninjarmm.com
```

## 🚀 Démarrage

```bash
cd ninja-one_api
npm install
npm run start:dev
```

L'API démarre sur **http://localhost:3000**

## 📡 Endpoints disponibles

### 1. Authentification
```bash
# Tester l'authentification
GET http://localhost:3000/ninja-one/auth/test

# Tester toutes les régions (pour debug)
GET http://localhost:3000/ninja-one/auth/test-all-regions
```

### 2. Organizations (Clients) ✅
```bash
# Récupérer toutes les organisations (348 organizations)
GET http://localhost:3000/ninja-one/organizations

# Exemple de réponse:
[
  {
    "name": "Solution Logique",
    "nodeApprovalMode": "AUTOMATIC",
    "id": 2
  },
  {
    "name": "COLLET CONFORT HABITAT",
    "nodeApprovalMode": "AUTOMATIC",
    "id": 4
  }
]
```

### 3. Technicians (Employés/Utilisateurs) ✅
```bash
# Récupérer tous les techniciens (16 techniciens)
GET http://localhost:3000/ninja-one/technicians

# Exemple de réponse:
[
  {
    "id": 1,
    "uid": "da30be5c-e379-4ab1-be98-a1c3003af649",
    "firstName": "Anthony",
    "lastName": "BARON",
    "email": "anthony@solution-logique.fr",
    "phone": "+33695467206",
    "enabled": true,
    "administrator": true,
    "userType": "TECHNICIAN"
  }
]
```

### 4. Devices (Appareils) ✅
```bash
# Récupérer tous les appareils
GET http://localhost:3000/ninja-one/devices
```

### 5. Tickets 🚧
```bash
# Récupérer les tickets (avec filtres optionnels)
GET http://localhost:3000/ninja-one/tickets

# Avec filtres:
GET http://localhost:3000/ninja-one/tickets?df=2025-01-01&dt=2025-10-23&clientId=2&status=OPEN&pageSize=100
```

**Paramètres de filtre disponibles**:
- `df`: Date de début (format: yyyy-MM-dd)
- `dt`: Date de fin (format: yyyy-MM-dd)
- `clientId`: ID de l'organisation/client
- `assignedTo`: Email ou ID du technicien assigné
- `status`: Statut du ticket (OPEN, IN_PROGRESS, CLOSED, etc.)
- `type`: Type de ticket
- `severity`: Sévérité du ticket
- `pageSize`: Nombre de résultats par page
- `after`: Curseur pour la pagination

**Note**: Les tickets nécessitent que le module Ticketing soit activé dans votre compte NinjaOne.

### 6. Ticket Boards ✅
```bash
# Récupérer les tableaux de tickets
GET http://localhost:3000/ninja-one/ticket-boards
```

### 7. Ticket Statuses ✅
```bash
# Récupérer les statuts de tickets disponibles
GET http://localhost:3000/ninja-one/ticket-statuses
```

## 📊 Exemples d'utilisation

### Récupérer les tickets d'un client spécifique
```bash
curl "http://localhost:3000/ninja-one/tickets?clientId=2"
```

### Récupérer les tickets entre deux dates
```bash
curl "http://localhost:3000/ninja-one/tickets?df=2025-10-01&dt=2025-10-23"
```

### Récupérer les tickets assignés à un technicien
```bash
curl "http://localhost:3000/ninja-one/tickets?assignedTo=anthony@solution-logique.fr"
```

### Récupérer les tickets ouverts d'un client spécifique
```bash
curl "http://localhost:3000/ninja-one/tickets?clientId=2&status=OPEN"
```

## 🔧 Structure du projet

```
ninja-one_api/
├── src/
│   ├── ninja-one/
│   │   ├── ninja-one.controller.ts  # Routes/endpoints
│   │   ├── ninja-one.service.ts     # Logique métier & appels API
│   │   └── ninja-one.module.ts      # Module NestJS
│   ├── app.module.ts
│   └── main.ts
├── .env                              # Configuration (credentials)
├── package.json
└── README_API.md                     # Ce fichier
```

## 📝 Notes importantes

1. **Région EU**: Vos credentials sont configurés pour la région Europe (`eu.ninjarmm.com`)
2. **Token**: L'authentification génère un token qui expire après 3600 secondes (1 heure)
3. **Cache de token**: Le service garde le token en cache et le renouvelle automatiquement
4. **Tickets**: Si vous n'avez pas accès aux tickets, vérifiez:
   - Que le module Ticketing est activé dans votre compte NinjaOne
   - Que votre app API a les scopes nécessaires ("monitoring" et "management")
   - Que votre type d'application est "API Services (machine-to-machine)"

## 🐛 Dépannage

### Les tickets ne fonctionnent pas
Le module Ticketing doit être activé dans NinjaOne:
1. Allez dans Administration → Apps → API
2. Vérifiez que votre application a le type "API Services (machine-to-machine)"
3. Vérifiez les scopes: "Monitoring" et "Management"
4. Si nécessaire, créez une nouvelle application API avec ces paramètres

### Erreur "Client app not exist"
Vous utilisez la mauvaise région. Vérifiez que `NINJA_ONE_BASE_URL=https://eu.ninjarmm.com` dans votre `.env`

## 📚 Documentation NinjaOne
- API Documentation: https://app.ninjarmm.com/apidocs-beta/
- OAuth Setup: https://www.ninjaone.com/docs/integrations/how-to-set-up-api-oauth-token/
