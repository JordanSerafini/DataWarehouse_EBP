/**
 * Configuration PM2 pour l'API NinjaOne
 *
 * Utilisation:
 * - Démarrer: pm2 start ecosystem.config.js
 * - Arrêter: pm2 stop ninjaone-api
 * - Redémarrer: pm2 restart ninjaone-api
 * - Logs: pm2 logs ninjaone-api
 * - Monitoring: pm2 monit
 *
 * Auto-démarrage au boot:
 * - pm2 startup
 * - pm2 save
 */

module.exports = {
  apps: [
    {
      name: 'ninjaone-api',
      script: 'dist/main.js',
      cwd: '/root/DataWarehouse_EBP/ninja-one_api', // ⚠️ Adapter selon votre chemin
      instances: 1,
      exec_mode: 'fork',
      watch: false,

      // Variables d'environnement
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },

      // Auto-restart
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',

      // Logs
      error_file: '/var/log/pm2/ninjaone-api-error.log',
      out_file: '/var/log/pm2/ninjaone-api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Performance
      max_memory_restart: '500M',

      // Gestion des erreurs
      kill_timeout: 5000,
      listen_timeout: 10000,
      shutdown_with_message: true,
    },
  ],
};
