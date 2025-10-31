/**
 * Configuration PM2 pour déploiement production
 * Backend Mobile EBP sur sli.mobile.back.jordan-s.org
 */

module.exports = {
  apps: [
    {
      name: 'sli-mobile-backend',
      script: './dist/main.js',
      instances: 2, // Mode cluster pour performance
      exec_mode: 'cluster',

      // Environment
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      // Logs
      error_file: '/var/log/pm2/sli-backend-error.log',
      out_file: '/var/log/pm2/sli-backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Performance
      max_memory_restart: '1G',
      autorestart: true,
      watch: false,

      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,

      // Monitoring
      min_uptime: '10s',
      max_restarts: 10,
    },
  ],

  // Configuration de déploiement (optionnel)
  deploy: {
    production: {
      user: 'root', // À adapter selon votre user SSH
      host: 'sli.mobile.back.jordan-s.org',
      ref: 'origin/master',
      repo: 'git@github.com:your-repo/DataWarehouse_EBP.git', // À adapter
      path: '/var/www/DataWarehouse_EBP',
      'post-deploy': 'cd backend && npm install --production && npm run build && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production',
      },
    },
  },
};
