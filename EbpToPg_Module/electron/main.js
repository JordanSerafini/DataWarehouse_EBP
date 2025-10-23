/**
 * EBP Sync Manager - Main Process
 * Interface Electron pour gérer la synchronisation EBP vers PostgreSQL
 */

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const Store = require('electron-store');
const { fork } = require('child_process');
require('dotenv').config();

// Configuration du store pour sauvegarder les paramètres
const store = new Store({
  defaults: {
    ebpServer: process.env.CLIENT_EBP_SERVER || '',
    ebpDatabase: process.env.CLIENT_EBP_DATABASE || '',
    ebpUser: process.env.EBP_USER || 'sa',
    ebpPassword: process.env.EBP_PASSWORD || '',
    pgHost: process.env.PG_HOST || 'localhost',
    pgPort: parseInt(process.env.PG_PORT || '5432'),
    pgDatabase: process.env.PG_DATABASE || 'ebp_db',
    pgUser: process.env.PG_USER || 'postgres',
    pgPassword: process.env.PG_PASSWORD || 'postgres',
    port: parseInt(process.env.PORT || '3000'),
  },
});

// Initialiser le store avec les valeurs du .env si les champs sont vides
if (!store.get('ebpServer') && process.env.CLIENT_EBP_SERVER) {
  store.set('ebpServer', process.env.CLIENT_EBP_SERVER);
}
if (!store.get('ebpDatabase') && process.env.CLIENT_EBP_DATABASE) {
  store.set('ebpDatabase', process.env.CLIENT_EBP_DATABASE);
}
if (!store.get('ebpPassword') && process.env.EBP_PASSWORD) {
  store.set('ebpPassword', process.env.EBP_PASSWORD);
}
if (!store.get('pgPassword') && process.env.PG_PASSWORD) {
  store.set('pgPassword', process.env.PG_PASSWORD);
}

let mainWindow;
let serverProcess = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    title: 'EBP Sync Manager',
    backgroundColor: '#f5f5f5',
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Ouvrir DevTools en développement
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Démarrer le serveur Express en arrière-plan
function startServer() {
  if (serverProcess) return;

  const serverPath = path.join(__dirname, '..', 'dist', 'server.js');

  // Vérifier si le fichier compilé existe
  const fs = require('fs');
  if (!fs.existsSync(serverPath)) {
    console.log('Server file not found, trying ts-node...');
    const tsServerPath = path.join(__dirname, '..', 'src', 'server.ts');

    serverProcess = fork(tsServerPath, [], {
      execArgv: ['-r', 'ts-node/register'],
      env: {
        ...process.env,
        ...getEnvFromStore(),
      },
    });
  } else {
    serverProcess = fork(serverPath, [], {
      env: {
        ...process.env,
        ...getEnvFromStore(),
      },
    });
  }

  serverProcess.on('message', (msg) => {
    if (mainWindow) {
      mainWindow.webContents.send('server-log', msg);
    }
  });

  serverProcess.on('error', (error) => {
    console.error('Server process error:', error);
    if (mainWindow) {
      mainWindow.webContents.send('server-error', error.message);
    }
  });

  serverProcess.on('exit', (code) => {
    console.log(`Server process exited with code ${code}`);
    serverProcess = null;
  });
}

// Récupérer les variables d'environnement depuis le store
function getEnvFromStore() {
  return {
    CLIENT_EBP_SERVER: store.get('ebpServer'),
    CLIENT_EBP_DATABASE: store.get('ebpDatabase'),
    EBP_USER: store.get('ebpUser'),
    EBP_PASSWORD: store.get('ebpPassword'),
    PG_HOST: store.get('pgHost'),
    PG_PORT: store.get('pgPort'),
    PG_DATABASE: store.get('pgDatabase'),
    PG_USER: store.get('pgUser'),
    PG_PASSWORD: store.get('pgPassword'),
    PORT: store.get('port'),
  };
}

// Arrêter le serveur
function stopServer() {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
}

// IPC Handlers

// Récupérer la configuration
ipcMain.handle('get-config', async () => {
  return store.store;
});

// Recharger la configuration depuis .env
ipcMain.handle('load-config-from-env', async () => {
  try {
    // Recharger le .env
    require('dotenv').config({ override: true });

    // Mettre à jour le store avec les valeurs du .env
    store.set('ebpServer', process.env.CLIENT_EBP_SERVER || store.get('ebpServer'));
    store.set('ebpDatabase', process.env.CLIENT_EBP_DATABASE || store.get('ebpDatabase'));
    store.set('ebpUser', process.env.EBP_USER || store.get('ebpUser'));
    store.set('ebpPassword', process.env.EBP_PASSWORD || store.get('ebpPassword'));
    store.set('pgHost', process.env.PG_HOST || store.get('pgHost'));
    store.set('pgPort', parseInt(process.env.PG_PORT || store.get('pgPort')));
    store.set('pgDatabase', process.env.PG_DATABASE || store.get('pgDatabase'));
    store.set('pgUser', process.env.PG_USER || store.get('pgUser'));
    store.set('pgPassword', process.env.PG_PASSWORD || store.get('pgPassword'));
    store.set('port', parseInt(process.env.PORT || store.get('port')));

    return { success: true, config: store.store };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Sauvegarder la configuration
ipcMain.handle('save-config', async (event, config) => {
  try {
    Object.keys(config).forEach((key) => {
      store.set(key, config[key]);
    });

    // Redémarrer le serveur avec la nouvelle configuration
    stopServer();
    startServer();

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Tester la connexion EBP
ipcMain.handle('test-ebp-connection', async (event, config) => {
  const sql = require('mssql');

  const dbConfig = {
    server: config.ebpServer,
    database: config.ebpDatabase,
    authentication: {
      type: 'default',
      options: {
        userName: config.ebpUser,
        password: config.ebpPassword,
      },
    },
    options: {
      trustServerCertificate: true,
      encrypt: true,
    },
  };

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request().query('SELECT 1');
    await pool.close();
    return { success: true, message: 'Connexion EBP réussie!' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Tester la connexion PostgreSQL
ipcMain.handle('test-pg-connection', async (event, config) => {
  const { Client } = require('pg');

  const client = new Client({
    host: config.pgHost,
    port: config.pgPort,
    database: 'postgres', // Se connecter à postgres pour tester
    user: config.pgUser,
    password: config.pgPassword,
  });

  try {
    await client.connect();
    await client.query('SELECT 1');
    await client.end();
    return { success: true, message: 'Connexion PostgreSQL réussie!' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Ouvrir un dossier
ipcMain.handle('open-dialog', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result;
});

// Obtenir le chemin du dossier de backup
ipcMain.handle('get-backup-dir', async () => {
  return path.join(process.cwd(), 'backup');
});

// Contrôle du serveur
ipcMain.handle('start-server', async () => {
  try {
    if (serverProcess) {
      return { success: false, message: 'Le serveur est déjà démarré' };
    }
    startServer();
    return { success: true, message: 'Serveur démarré', pid: serverProcess ? serverProcess.pid : null };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('stop-server', async () => {
  try {
    if (!serverProcess) {
      return { success: false, message: 'Le serveur n\'est pas démarré' };
    }
    stopServer();
    return { success: true, message: 'Serveur arrêté' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('restart-server', async () => {
  try {
    stopServer();
    await new Promise(resolve => setTimeout(resolve, 1000));
    startServer();
    return { success: true, message: 'Serveur redémarré', pid: serverProcess ? serverProcess.pid : null };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-server-status', async () => {
  return {
    isRunning: serverProcess !== null,
    pid: serverProcess ? serverProcess.pid : null,
    port: store.get('port'),
  };
});

// Lifecycle
app.whenReady().then(() => {
  createWindow();
  startServer();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  stopServer();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', () => {
  stopServer();
});
