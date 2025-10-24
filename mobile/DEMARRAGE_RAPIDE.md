# 🚀 Démarrage Rapide - Application Mobile

## ✅ Modifications effectuées

L'application mobile utilise maintenant **l'API directe** sans WatermelonDB. Vous pouvez tester sur votre téléphone (iPhone ou Android) avec **Expo Go**.

### Ce qui a été modifié :

1. ✅ **API directe** - Toutes les données viennent du backend en temps réel
2. ✅ **Configuration IP réseau** - Support des connexions depuis votre téléphone
3. ✅ **Safe Area fixée** - La bottom navigation respecte les boutons natifs du téléphone
4. ✅ **Écrans mis à jour** :
   - InterventionsScreen
   - PlanningScreen
   - TasksScreen

---

## 📋 Prérequis

### 1. Trouver l'adresse IP de votre machine

**Sur Windows :**
```bash
ipconfig
```
Cherchez "IPv4" (exemple : `192.168.1.100`)

**Sur Mac/Linux :**
```bash
ifconfig | grep "inet "
# ou
ip addr
```

### 2. Configurer l'IP dans l'application

**Fichier à modifier :** [src/config/api.config.ts](src/config/api.config.ts)

```typescript
// ⚠️ CONFIGUREZ VOTRE IP ICI ⬇️
const BACKEND_IP = '192.168.1.100'; // Remplacez par votre IP locale !
const BACKEND_PORT = '3000';
```

**⚠️ IMPORTANT :** Remplacez `192.168.1.100` par **votre vraie adresse IP** !

---

## 🎬 Lancer l'application

### Étape 1 : Démarrer le backend

```bash
cd backend
npm run start:dev
```

Vérifiez que le backend tourne sur `http://votre-ip:3000`

### Étape 2 : Démarrer l'application mobile

```bash
cd mobile
npm start
```

Vous verrez un QR code s'afficher dans le terminal.

### Étape 3 : Scanner le QR code

**Sur iPhone :**
1. Téléchargez **Expo Go** depuis l'App Store
2. Ouvrez l'app **Caméra** native
3. Scannez le QR code
4. L'application s'ouvre dans Expo Go

**Sur Android :**
1. Téléchargez **Expo Go** depuis le Google Play Store
2. Ouvrez **Expo Go**
3. Scannez le QR code depuis l'app
4. L'application se charge

---

## 🔧 Dépannage

### Erreur : "Network request failed"

**Cause :** Le téléphone ne peut pas accéder au backend.

**Solutions :**

1. **Vérifiez que votre téléphone et votre PC sont sur le même réseau Wi-Fi**

2. **Vérifiez l'IP dans** `src/config/api.config.ts` :
   ```bash
   # Sur votre machine, trouvez l'IP :
   ipconfig    # Windows
   ifconfig    # Mac/Linux
   ```

3. **Testez l'accès au backend depuis le navigateur de votre téléphone** :
   - Ouvrez Safari (iPhone) ou Chrome (Android)
   - Allez sur `http://VOTRE_IP:3000/api/docs`
   - Si ça ne charge pas, le backend n'est pas accessible

4. **Désactivez le pare-feu temporairement** (Windows Defender, etc.)

### Erreur : "Unable to resolve module"

```bash
cd mobile
rm -rf node_modules
npm install
npm start
```

### La bottom navigation cache les boutons du téléphone

**Déjà corrigé !** Le code utilise maintenant `useSafeAreaInsets` pour respecter les zones système.

### Les données ne s'affichent pas

1. **Vérifiez que le backend tourne** :
   ```bash
   curl http://VOTRE_IP:3000/api/v1/auth/login
   ```

2. **Vérifiez l'IP configurée** dans `src/config/api.config.ts`

3. **Regardez les logs dans le terminal** Expo pour voir les erreurs réseau

---

## 📱 Fonctionnalités disponibles

### Écrans opérationnels :

- ✅ **Planning** - Vue jour/semaine/mois
- ✅ **Tâches du jour** - Avec progression
- ✅ **Interventions** - Liste complète avec filtres
- ✅ **Calendrier** - Basique (à améliorer)
- ⏳ **Clients** - À implémenter
- ⏳ **Projets** - À implémenter
- ⏳ **Profil** - À implémenter

### Données en temps réel :

- Les interventions sont chargées depuis le backend
- Rafraîchir en tirant vers le bas (pull-to-refresh)
- Pas de mode hors ligne pour l'instant

---

## 🎯 Prochaines étapes

### Pour tester avec de vraies données :

1. **Assurez-vous que le backend a des données** :
   - Vérifiez la base PostgreSQL
   - Allez sur `http://localhost:3000/api/docs` (Swagger)
   - Testez les endpoints manuellement

2. **Créez un utilisateur de test** si besoin

3. **Implémentez l'authentification** (actuellement désactivée pour les tests)

### Pour activer le mode hors ligne plus tard :

- On réactivera WatermelonDB avec un **EAS Build**
- On implémentera la synchronisation bidirectionnelle
- Pour l'instant, l'API directe suffit pour tester l'UI

---

## 🆘 Aide rapide

### Commandes utiles :

```bash
# Relancer l'app mobile
cd mobile && npm start

# Relancer le backend
cd backend && npm run start:dev

# Voir l'IP de votre machine
ipconfig              # Windows
ifconfig              # Mac/Linux

# Nettoyer et réinstaller
cd mobile
rm -rf node_modules package-lock.json
npm install
```

### Raccourcis Expo :

- `r` - Reload l'application
- `m` - Ouvrir le menu developer sur le téléphone
- `j` - Ouvrir le debugger Chrome
- `c` - Nettoyer le cache et reload

---

## 📞 Contact

Si vous avez des erreurs, copiez-collez :
1. Le message d'erreur du terminal
2. Le contenu de `src/config/api.config.ts`
3. L'IP de votre machine

**Bon développement ! 🎉**
