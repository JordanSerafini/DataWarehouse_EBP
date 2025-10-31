# 🚀 Setup du sous-domaine ninjaone.jordan-s.org

Guide complet pour configurer le sous-domaine `ninjaone.jordan-s.org` qui proxifie vers l'API NinjaOne (port 3001).

## 📋 Prérequis

- ✅ Serveur Linux (Ubuntu/Debian)
- ✅ Accès root (sudo)
- ✅ Node.js installé
- ✅ DNS configuré : `ninjaone.jordan-s.org` → IP du serveur

## 🔧 Installation

### Étape 1: Transférer les fichiers sur le serveur

Depuis votre machine locale Windows, transférez les fichiers vers le serveur :

```bash
# Option 1: Utiliser SCP
scp nginx_ninjaone.conf setup_nginx_ninjaone.sh root@votre-serveur:/root/DataWarehouse_EBP/

# Option 2: Utiliser Git (si déjà commité)
ssh root@votre-serveur
cd /root/DataWarehouse_EBP
git pull
```

### Étape 2: Exécuter le script d'installation Nginx

Sur le serveur :

```bash
cd /root/DataWarehouse_EBP

# Rendre le script exécutable
chmod +x setup_nginx_ninjaone.sh

# Exécuter (avec sudo)
sudo ./setup_nginx_ninjaone.sh
```

Le script va :
1. ✅ Installer Nginx (si nécessaire)
2. ✅ Copier la configuration vers `/etc/nginx/sites-available/`
3. ✅ Créer le lien symbolique vers `/etc/nginx/sites-enabled/`
4. ✅ Tester la configuration Nginx
5. ✅ Recharger Nginx

### Étape 3: Build et démarrer l'API NinjaOne

```bash
cd /root/DataWarehouse_EBP/ninja-one_api

# Installer les dépendances
npm install

# Build TypeScript
npm run build

# Option A: Démarrer avec PM2 (recommandé pour production)
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Configurer auto-démarrage au boot

# Option B: Démarrer directement (dev)
npm run start:prod
```

### Étape 4: Tester la configuration

```bash
# Test local (sur le serveur)
curl http://localhost:3001/api/tickets/stats

# Test via le sous-domaine
curl http://ninjaone.jordan-s.org/health
curl http://ninjaone.jordan-s.org/api/tickets/stats
```

**Réponse attendue:**
```json
{
  "total": 1000,
  "open": 498,
  "closed": 467,
  ...
}
```

### Étape 5 (Optionnel): Configurer HTTPS avec Let's Encrypt

```bash
# Installer certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtenir un certificat SSL
sudo certbot --nginx -d ninjaone.jordan-s.org

# Le certificat sera automatiquement configuré dans Nginx
# Recharger Nginx
sudo systemctl reload nginx
```

Après activation HTTPS, dans votre app mobile ([api.config.ts](../mobile/src/config/api.config.ts)), changez :
```typescript
const USE_HTTP = false; // Passer en HTTPS
```

## 🧪 Tests et vérification

### 1. Vérifier que Nginx tourne

```bash
sudo systemctl status nginx
sudo nginx -t  # Tester la config
```

### 2. Vérifier que l'API NinjaOne tourne

```bash
# Avec PM2
pm2 status
pm2 logs ninjaone-api

# Vérifier le port
sudo netstat -tuln | grep 3001
# ou
sudo ss -tuln | grep 3001
```

### 3. Tester les endpoints depuis le mobile

URLs à tester depuis votre app mobile :
- `http://ninjaone.jordan-s.org/health` → "OK"
- `http://ninjaone.jordan-s.org/api/tickets?limit=10`
- `http://ninjaone.jordan-s.org/api/tickets/stats`
- `http://ninjaone.jordan-s.org/api/technicians/14/tickets`

### 4. Logs à surveiller

```bash
# Logs Nginx
tail -f /var/log/nginx/ninjaone_access.log
tail -f /var/log/nginx/ninjaone_error.log

# Logs API NinjaOne (PM2)
pm2 logs ninjaone-api

# Logs API NinjaOne (si lancé avec npm)
cd /root/DataWarehouse_EBP/ninja-one_api
npm run start:prod  # Voir les logs dans le terminal
```

## 🔥 Firewall et sécurité

Si vous utilisez UFW (Ubuntu Firewall) :

```bash
# Autoriser HTTP
sudo ufw allow 80/tcp

# Autoriser HTTPS (si certbot configuré)
sudo ufw allow 443/tcp

# Le port 3001 ne doit PAS être exposé publiquement
# (Nginx fait le proxy en interne)
sudo ufw status
```

## 📱 Configuration mobile finale

Dans [mobile/src/config/api.config.ts](../mobile/src/config/api.config.ts) :

```typescript
export const API_CONFIG = {
  // Backend principal
  BASE_URL: 'http://sli.mobile.back.jordan-s.org',

  // API NinjaOne ✅
  NINJAONE_BASE_URL: 'http://ninjaone.jordan-s.org',  // Ou https:// si certificat SSL

  // ...
};
```

Relancez l'app mobile et vérifiez les logs :
```
[TicketsService] API NinjaOne configurée: http://ninjaone.jordan-s.org/api
[TicketsScreen] Chargement de tous les tickets (admin/patron)
[TicketsScreen] 100 tickets chargés ✅
```

## 🐛 Troubleshooting

### Erreur "502 Bad Gateway"
```bash
# L'API NinjaOne ne tourne pas
pm2 status
pm2 restart ninjaone-api

# Vérifier les logs
pm2 logs ninjaone-api --lines 50
```

### Erreur "Connection refused" depuis le mobile
```bash
# Vérifier le DNS
nslookup ninjaone.jordan-s.org

# Vérifier que Nginx écoute sur le port 80
sudo netstat -tuln | grep :80

# Vérifier les logs Nginx
tail -f /var/log/nginx/ninjaone_error.log
```

### CORS errors
Les headers CORS sont déjà configurés dans `nginx_ninjaone.conf` :
```nginx
add_header 'Access-Control-Allow-Origin' '*' always;
```

Si problème persiste, vérifiez que le backend NestJS a aussi CORS activé dans `main.ts` :
```typescript
app.enableCors({
  origin: '*',
  credentials: true,
});
```

### L'API ne démarre pas
```bash
cd /root/DataWarehouse_EBP/ninja-one_api

# Vérifier le .env
cat .env

# Vérifier la connexion DB
psql -h localhost -U postgres -d sli_db -c "SELECT COUNT(*) FROM ninjaone.fact_tickets;"

# Tester manuellement
npm run start:dev
```

## 📊 Monitoring avec PM2

```bash
# Dashboard temps réel
pm2 monit

# Statistiques
pm2 list
pm2 show ninjaone-api

# Redémarrer en cas de problème
pm2 restart ninjaone-api

# Voir l'historique des restarts
pm2 logs ninjaone-api --lines 100
```

## ✅ Checklist finale

- [ ] DNS configuré : `ninjaone.jordan-s.org` pointe vers IP serveur
- [ ] Nginx installé et configuré
- [ ] API NinjaOne buildée (`npm run build`)
- [ ] API NinjaOne démarrée avec PM2
- [ ] `curl http://ninjaone.jordan-s.org/health` retourne "OK"
- [ ] `curl http://ninjaone.jordan-s.org/api/tickets/stats` retourne des stats
- [ ] App mobile configurée avec `NINJAONE_BASE_URL`
- [ ] App mobile affiche les tickets sans erreur
- [ ] (Optionnel) HTTPS configuré avec certbot

## 🎉 Résultat attendu

Depuis l'app mobile :
```
LOG [TicketsService] API NinjaOne configurée: http://ninjaone.jordan-s.org/api
LOG [TicketsScreen] useEffect déclenché, user: Jordan Pierre (SUPER_ADMIN)
LOG [TicketsScreen] canViewAllTickets pour SUPER_ADMIN: true
LOG [TicketsScreen] Chargement de tous les tickets (admin/patron)
LOG [TicketsScreen] 100 tickets chargés
```

Écran mobile : Liste des 100 tickets NinjaOne affichée avec filtres ! 🎊

---

**Besoin d'aide ?** Consultez les logs :
- Nginx : `tail -f /var/log/nginx/ninjaone_*.log`
- API : `pm2 logs ninjaone-api`
- Mobile : Logs dans l'app (console React Native)
