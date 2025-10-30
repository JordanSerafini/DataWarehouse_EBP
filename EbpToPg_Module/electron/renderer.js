/**
 * EBP Sync Manager - Renderer Process
 * Gère l'interface utilisateur et la communication avec le main process
 */

const { ipcRenderer } = require('electron');
const API_URL = 'http://localhost:3000/api';

let verificationResults = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    setupTabs();
    await loadConfig();
    checkServerHealth();
    setupLogListener();

    // Vérifier la santé du serveur toutes les 5 secondes
    setInterval(checkServerHealth, 5000);
});

// Tab Management
function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active panel
            panels.forEach(p => p.classList.remove('active'));
            document.getElementById(`${tabName}-panel`).classList.add('active');

            // Load data for specific panels
            if (tabName === 'backup') {
                loadBackupsList();
            } else if (tabName === 'server') {
                updateServerStatus();
                refreshConnectionInfo();
            }
        });
    });
}

// Configuration
async function loadConfig() {
    try {
        const config = await ipcRenderer.invoke('get-config');

        document.getElementById('ebpServer').value = config.ebpServer || '';
        document.getElementById('ebpDatabase').value = config.ebpDatabase || '';
        document.getElementById('ebpUser').value = config.ebpUser || 'sa';
        document.getElementById('ebpPassword').value = config.ebpPassword || '';

        document.getElementById('pgHost').value = config.pgHost || 'localhost';
        document.getElementById('pgPort').value = config.pgPort || 5432;
        document.getElementById('pgDatabase').value = config.pgDatabase || 'sli_db';
        document.getElementById('pgUser').value = config.pgUser || 'postgres';
        document.getElementById('pgPassword').value = config.pgPassword || 'postgres';
    } catch (error) {
        showToast('Erreur lors du chargement de la configuration', 'error');
    }
}

async function saveConfig() {
    const config = {
        ebpServer: document.getElementById('ebpServer').value,
        ebpDatabase: document.getElementById('ebpDatabase').value,
        ebpUser: document.getElementById('ebpUser').value,
        ebpPassword: document.getElementById('ebpPassword').value,
        pgHost: document.getElementById('pgHost').value,
        pgPort: parseInt(document.getElementById('pgPort').value),
        pgDatabase: document.getElementById('pgDatabase').value,
        pgUser: document.getElementById('pgUser').value,
        pgPassword: document.getElementById('pgPassword').value,
        port: 3000,
    };

    try {
        const result = await ipcRenderer.invoke('save-config', config);
        if (result.success) {
            showToast('Configuration sauvegardée avec succès!', 'success');
            setTimeout(() => checkServerHealth(), 2000);
        } else {
            showToast(`Erreur: ${result.error}`, 'error');
        }
    } catch (error) {
        showToast('Erreur lors de la sauvegarde', 'error');
    }
}

async function loadConfigFromEnv() {
    try {
        showToast('Chargement depuis .env...', 'info');
        const result = await ipcRenderer.invoke('load-config-from-env');

        if (result.success) {
            // Recharger la config dans l'interface
            await loadConfig();
            showToast('Configuration rechargée depuis .env!', 'success');
            addLog('Configuration rechargée depuis le fichier .env', 'success');
        } else {
            showToast(`Erreur: ${result.error}`, 'error');
        }
    } catch (error) {
        showToast('Erreur lors du rechargement', 'error');
    }
}

async function testEBPConnection() {
    const config = {
        ebpServer: document.getElementById('ebpServer').value,
        ebpDatabase: document.getElementById('ebpDatabase').value,
        ebpUser: document.getElementById('ebpUser').value,
        ebpPassword: document.getElementById('ebpPassword').value,
    };

    if (!config.ebpServer || !config.ebpDatabase) {
        showToast('Veuillez remplir tous les champs EBP', 'warning');
        return;
    }

    showToast('Test de connexion EBP en cours...', 'info');

    try {
        const result = await ipcRenderer.invoke('test-ebp-connection', config);
        if (result.success) {
            showToast(result.message, 'success');
        } else {
            showToast(`Échec de connexion: ${result.error}`, 'error');
        }
    } catch (error) {
        showToast('Erreur lors du test de connexion', 'error');
    }
}

async function testPGConnection() {
    const config = {
        pgHost: document.getElementById('pgHost').value,
        pgPort: parseInt(document.getElementById('pgPort').value),
        pgDatabase: document.getElementById('pgDatabase').value,
        pgUser: document.getElementById('pgUser').value,
        pgPassword: document.getElementById('pgPassword').value,
    };

    if (!config.pgHost || !config.pgDatabase || !config.pgUser) {
        showToast('Veuillez remplir tous les champs PostgreSQL', 'warning');
        return;
    }

    showToast('Test de connexion PostgreSQL en cours...', 'info');

    try {
        const result = await ipcRenderer.invoke('test-pg-connection', config);
        if (result.success) {
            showToast(result.message, 'success');
        } else {
            showToast(`Échec de connexion: ${result.error}`, 'error');
        }
    } catch (error) {
        showToast('Erreur lors du test de connexion', 'error');
    }
}

// Server Health Check
async function checkServerHealth() {
    try {
        const response = await fetch(`${API_URL}/../health`);
        const data = await response.json();

        const statusDot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');

        if (data.status === 'healthy') {
            statusDot.classList.add('connected');
            statusText.textContent = 'Connecté';
        } else {
            statusDot.classList.remove('connected');
            statusText.textContent = 'Déconnecté';
        }
    } catch (error) {
        const statusDot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');
        statusDot.classList.remove('connected');
        statusText.textContent = 'Serveur éteint';
    }
}

// Synchronization
async function startFullSync() {
    const dropAndCreate = document.getElementById('dropAndCreate').checked;
    const tablesInput = document.getElementById('syncTables').value.trim();
    const tables = tablesInput ? tablesInput.split(',').map(t => t.trim()) : undefined;

    const syncProgress = document.getElementById('syncProgress');
    const syncResults = document.getElementById('syncResults');

    syncProgress.style.display = 'block';
    syncResults.style.display = 'none';

    document.getElementById('syncStatus').innerHTML = '<p>Synchronisation en cours...</p>';
    document.getElementById('progressFill').style.width = '50%';

    addLog(`Démarrage de la synchronisation ${dropAndCreate ? 'destructive' : 'incrémentale'}`, 'info');

    try {
        const response = await fetch(`${API_URL}/sync/full`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tables, dropAndCreate }),
        });

        const data = await response.json();

        document.getElementById('progressFill').style.width = '100%';

        if (data.success) {
            displaySyncResults(data);
            showToast('Synchronisation terminée avec succès!', 'success');
            addLog(`Synchronisation réussie: ${data.summary.totalRowsSynced} lignes`, 'success');
        } else {
            showToast(`Erreur: ${data.error}`, 'error');
            addLog(`Erreur de synchronisation: ${data.error}`, 'error');
        }
    } catch (error) {
        showToast('Erreur lors de la synchronisation', 'error');
        addLog(`Erreur: ${error.message}`, 'error');
    } finally {
        setTimeout(() => {
            syncProgress.style.display = 'none';
        }, 1000);
    }
}

function displaySyncResults(data) {
    const resultsDiv = document.getElementById('syncResults');
    const contentDiv = document.getElementById('syncResultsContent');

    // Séparer les résultats par catégorie
    const successResults = data.results.filter(r => r.status === 'success');
    const errorResults = data.results.filter(r => r.status === 'error');

    let html = `
        <div class="result-item success">
            <h4>📊 Résumé Global</h4>
            <p><strong>Total tables:</strong> ${data.summary.totalTables}</p>
            <p><strong>✅ Réussies:</strong> ${data.summary.success}</p>
            <p><strong>❌ Échouées:</strong> ${data.summary.errors}</p>
            <p><strong>📝 Lignes totales:</strong> ${data.summary.totalRowsSynced.toLocaleString()}</p>
            <p><strong>⏱️ Durée totale:</strong> ${(data.summary.totalDuration / 1000).toFixed(2)}s</p>
        </div>
    `;

    // Section Erreurs (toujours visible si présente)
    if (errorResults.length > 0) {
        html += `
            <div class="result-category error">
                <div class="category-header" onclick="toggleCategory('error-section')">
                    <h3>❌ Tables Échouées (${errorResults.length})</h3>
                    <span class="toggle-icon">▼</span>
                </div>
                <div id="error-section" class="category-content">
        `;

        errorResults.forEach(result => {
            html += `
                <div class="result-item error">
                    <h4>❌ ${result.tableName}</h4>
                    <p><strong>Lignes:</strong> ${result.rowsSynced.toLocaleString()}</p>
                    <p><strong>Durée:</strong> ${(result.duration / 1000).toFixed(2)}s</p>
                    <p style="color: #F44336;"><strong>Erreur:</strong> ${result.error || 'Erreur inconnue'}</p>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    }

    // Section Succès (repliable par défaut si beaucoup de tables)
    if (successResults.length > 0) {
        const collapsed = successResults.length > 10 ? 'collapsed' : '';
        const toggleIcon = successResults.length > 10 ? '▶' : '▼';

        html += `
            <div class="result-category success">
                <div class="category-header" onclick="toggleCategory('success-section')">
                    <h3>✅ Tables Réussies (${successResults.length})</h3>
                    <span class="toggle-icon">${toggleIcon}</span>
                </div>
                <div id="success-section" class="category-content ${collapsed}">
        `;

        successResults.forEach(result => {
            html += `
                <div class="result-item success">
                    <h4>✅ ${result.tableName}</h4>
                    <p><strong>Lignes:</strong> ${result.rowsSynced.toLocaleString()}</p>
                    <p><strong>Durée:</strong> ${(result.duration / 1000).toFixed(2)}s</p>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    }

    contentDiv.innerHTML = html;
    resultsDiv.style.display = 'block';
}

function toggleCategory(sectionId) {
    const section = document.getElementById(sectionId);
    const header = section.previousElementSibling || section.parentElement.querySelector('.category-header');
    const icon = header.querySelector('.toggle-icon');

    if (section.classList.contains('collapsed')) {
        section.classList.remove('collapsed');
        icon.textContent = '▼';
    } else {
        section.classList.add('collapsed');
        icon.textContent = '▶';
    }
}

// Verification
async function startVerification() {
    const tablesInput = document.getElementById('verifyTables').value.trim();
    const tables = tablesInput ? tablesInput.split(',').map(t => t.trim()) : undefined;
    const sampleSize = parseInt(document.getElementById('sampleSize').value);

    showToast('Vérification en cours...', 'info');
    addLog('Démarrage de la vérification', 'info');

    try {
        const response = await fetch(`${API_URL}/sync/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tables, sampleSize }),
        });

        const data = await response.json();

        if (data.success) {
            verificationResults = data.results;
            displayVerificationResults(data);
            showToast('Vérification terminée!', 'success');
            addLog(`Vérification terminée: ${data.summary.ok} OK, ${data.summary.errors} erreurs`, 'success');
        } else {
            showToast(`Erreur: ${data.error}`, 'error');
            addLog(`Erreur de vérification: ${data.error}`, 'error');
        }
    } catch (error) {
        showToast('Erreur lors de la vérification', 'error');
        addLog(`Erreur: ${error.message}`, 'error');
    }
}

function displayVerificationResults(data) {
    const resultsDiv = document.getElementById('verifyResults');
    const contentDiv = document.getElementById('verifyResultsContent');
    const repairBtn = document.getElementById('repairBtn');

    // Séparer les résultats par catégorie
    const okResults = data.results.filter(r => r.status === 'ok');
    const warningResults = data.results.filter(r => r.status === 'warning');
    const errorResults = data.results.filter(r => r.status === 'error');

    let html = `
        <div class="result-item ${data.summary.errors > 0 ? 'warning' : 'success'}">
            <h4>📊 Résumé</h4>
            <p><strong>Tables vérifiées:</strong> ${data.summary.totalTables}</p>
            <p><strong>✅ OK:</strong> ${data.summary.ok}</p>
            <p><strong>⚠️ Avertissements:</strong> ${data.summary.warnings}</p>
            <p><strong>❌ Erreurs:</strong> ${data.summary.errors}</p>
            <p><strong>Problèmes totaux:</strong> ${data.summary.totalIssues}</p>
        </div>
    `;

    // Section Erreurs (toujours visible si présente)
    if (errorResults.length > 0) {
        html += `
            <div class="result-category error">
                <div class="category-header" onclick="toggleCategory('verify-error-section')">
                    <h3>❌ Tables avec Erreurs (${errorResults.length})</h3>
                    <span class="toggle-icon">▼</span>
                </div>
                <div id="verify-error-section" class="category-content">
        `;

        errorResults.forEach(result => {
            html += `
                <div class="result-item error">
                    <h4>❌ ${result.tableName}</h4>
                    <p><strong>EBP:</strong> ${result.ebpRowCount} lignes | <strong>PostgreSQL:</strong> ${result.pgRowCount} lignes</p>
                    <p><strong>Échantillons vérifiés:</strong> ${result.samplesChecked}</p>
                    <p><strong>Correspondances:</strong> ${result.samplesMatched}/${result.samplesChecked}</p>
                    ${result.dataIntegrityIssues.length > 0 ? `<p style="color: #F44336;"><strong>Problèmes:</strong> ${result.dataIntegrityIssues.length}</p>` : ''}
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    }

    // Section Avertissements (repliable par défaut)
    if (warningResults.length > 0) {
        const collapsed = warningResults.length > 5 ? 'collapsed' : '';
        const toggleIcon = warningResults.length > 5 ? '▶' : '▼';

        html += `
            <div class="result-category warning">
                <div class="category-header" onclick="toggleCategory('verify-warning-section')">
                    <h3>⚠️ Tables avec Avertissements (${warningResults.length})</h3>
                    <span class="toggle-icon">${toggleIcon}</span>
                </div>
                <div id="verify-warning-section" class="category-content ${collapsed}">
        `;

        warningResults.forEach(result => {
            html += `
                <div class="result-item warning">
                    <h4>⚠️ ${result.tableName}</h4>
                    <p><strong>EBP:</strong> ${result.ebpRowCount} lignes | <strong>PostgreSQL:</strong> ${result.pgRowCount} lignes</p>
                    <p><strong>Échantillons vérifiés:</strong> ${result.samplesChecked}</p>
                    <p><strong>Correspondances:</strong> ${result.samplesMatched}/${result.samplesChecked}</p>
                    ${result.dataIntegrityIssues.length > 0 ? `<p style="color: #FF9800;"><strong>Problèmes:</strong> ${result.dataIntegrityIssues.length}</p>` : ''}
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    }

    // Section OK (repliable par défaut si beaucoup de tables)
    if (okResults.length > 0) {
        const collapsed = okResults.length > 10 ? 'collapsed' : '';
        const toggleIcon = okResults.length > 10 ? '▶' : '▼';

        html += `
            <div class="result-category success">
                <div class="category-header" onclick="toggleCategory('verify-ok-section')">
                    <h3>✅ Tables Réussies (${okResults.length})</h3>
                    <span class="toggle-icon">${toggleIcon}</span>
                </div>
                <div id="verify-ok-section" class="category-content ${collapsed}">
        `;

        okResults.forEach(result => {
            html += `
                <div class="result-item success">
                    <h4>✅ ${result.tableName}</h4>
                    <p><strong>EBP:</strong> ${result.ebpRowCount} lignes | <strong>PostgreSQL:</strong> ${result.pgRowCount} lignes</p>
                    <p><strong>Échantillons vérifiés:</strong> ${result.samplesChecked}</p>
                    <p><strong>Correspondances:</strong> ${result.samplesMatched}/${result.samplesChecked}</p>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    }

    contentDiv.innerHTML = html;
    resultsDiv.style.display = 'block';

    // Afficher le bouton de réparation si nécessaire
    if (data.summary.errors > 0 || data.summary.warnings > 0) {
        repairBtn.style.display = 'block';
    } else {
        repairBtn.style.display = 'none';
    }
}

async function repairSync() {
    if (!verificationResults) {
        showToast('Aucun résultat de vérification disponible', 'warning');
        return;
    }

    showToast('Réparation en cours...', 'info');
    addLog('Démarrage de la réparation', 'info');

    try {
        const response = await fetch(`${API_URL}/sync/repair`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ verificationResults }),
        });

        const data = await response.json();

        if (data.success) {
            displaySyncResults(data);
            showToast('Réparation terminée!', 'success');
            addLog(`Réparation réussie: ${data.summary.totalRowsSynced} lignes`, 'success');

            // Masquer le bouton de réparation
            document.getElementById('repairBtn').style.display = 'none';
        } else {
            showToast(`Erreur: ${data.error}`, 'error');
            addLog(`Erreur de réparation: ${data.error}`, 'error');
        }
    } catch (error) {
        showToast('Erreur lors de la réparation', 'error');
        addLog(`Erreur: ${error.message}`, 'error');
    }
}

// Backup
async function createBackup() {
    const format = document.getElementById('backupFormat').value;
    const tablesInput = document.getElementById('backupTables').value.trim();
    const tables = tablesInput ? tablesInput.split(',').map(t => t.trim()) : undefined;
    const forceOS = document.getElementById('backupOS').value || undefined;

    showToast('Création du backup en cours...', 'info');
    addLog('Démarrage de la création du backup', 'info');

    const requestBody = { format, tables };
    if (forceOS) {
        requestBody.forceOS = forceOS;
        addLog(`Système forcé: ${forceOS}`, 'info');
    }

    try {
        const response = await fetch(`${API_URL}/backup/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (data.success) {
            showToast(`Backup créé: ${data.sizeInMB} MB`, 'success');
            addLog(`Backup créé avec succès: ${data.filePath}`, 'success');
            loadBackupsList();
        } else {
            showToast(`Erreur: ${data.error}`, 'error');
            addLog(`Erreur de backup: ${data.error}`, 'error');
        }
    } catch (error) {
        showToast('Erreur lors de la création du backup', 'error');
        addLog(`Erreur: ${error.message}`, 'error');
    }
}

async function loadBackupsList() {
    try {
        const response = await fetch(`${API_URL}/backup/list`);
        const data = await response.json();

        const listDiv = document.getElementById('backupsList');

        if (data.success && data.backups.length > 0) {
            let html = `<p><strong>Dossier:</strong> ${data.backupDir}</p>`;
            data.backups.forEach(backup => {
                html += `
                    <div class="backup-item">
                        <div class="backup-info">
                            <strong>${backup.fileName}</strong>
                            <small>Taille: ${backup.sizeInMB} MB | Créé: ${new Date(backup.created).toLocaleString('fr-FR')}</small>
                        </div>
                        <div class="backup-actions">
                            <button class="btn btn-danger btn-small" onclick="deleteBackup('${backup.fileName}')">
                                🗑️ Supprimer
                            </button>
                        </div>
                    </div>
                `;
            });
            listDiv.innerHTML = html;
        } else {
            listDiv.innerHTML = '<p>Aucun backup trouvé</p>';
        }
    } catch (error) {
        showToast('Erreur lors du chargement des backups', 'error');
    }
}

async function deleteBackup(fileName) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${fileName}?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/backup/${fileName}`, {
            method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
            showToast('Backup supprimé', 'success');
            loadBackupsList();
        } else {
            showToast(`Erreur: ${data.error}`, 'error');
        }
    } catch (error) {
        showToast('Erreur lors de la suppression', 'error');
    }
}

// Logs
function setupLogListener() {
    ipcRenderer.on('server-log', (event, log) => {
        addLog(log, 'info');
        addServerLog(log, 'info');
    });

    ipcRenderer.on('server-error', (event, error) => {
        addLog(error, 'error');
        addServerLog(error, 'error');
    });
}

function addServerLog(message, type = 'info') {
    const logsContainer = document.getElementById('serverLogsContainer');
    if (!logsContainer) return;

    const timestamp = new Date().toLocaleTimeString('fr-FR');

    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.textContent = `[${timestamp}] ${message}`;

    logsContainer.appendChild(logEntry);
    logsContainer.scrollTop = logsContainer.scrollHeight;

    while (logsContainer.children.length > 500) {
        logsContainer.removeChild(logsContainer.firstChild);
    }
}

function addLog(message, type = 'info') {
    const logsContainer = document.getElementById('logsContainer');
    const timestamp = new Date().toLocaleTimeString('fr-FR');

    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.textContent = `[${timestamp}] ${message}`;

    logsContainer.appendChild(logEntry);

    // Scroll to bottom
    logsContainer.scrollTop = logsContainer.scrollHeight;

    // Limiter à 1000 lignes
    while (logsContainer.children.length > 1000) {
        logsContainer.removeChild(logsContainer.firstChild);
    }
}

function clearLogs() {
    const logsContainer = document.getElementById('logsContainer');
    logsContainer.innerHTML = '<div class="log-entry">Logs effacés</div>';
}

// Server Control
async function startServerManually() {
    showToast('Démarrage du serveur...', 'info');

    try {
        const result = await ipcRenderer.invoke('start-server');
        if (result.success) {
            showToast(result.message, 'success');
            addLog(`Serveur démarré (PID: ${result.pid})`, 'success');
            setTimeout(updateServerStatus, 1000);
        } else {
            showToast(result.message, 'warning');
        }
    } catch (error) {
        showToast('Erreur lors du démarrage', 'error');
    }
}

async function stopServerManually() {
    if (!confirm('Êtes-vous sûr de vouloir arrêter le serveur?')) {
        return;
    }

    showToast('Arrêt du serveur...', 'info');

    try {
        const result = await ipcRenderer.invoke('stop-server');
        if (result.success) {
            showToast(result.message, 'success');
            addLog('Serveur arrêté', 'warning');
            setTimeout(updateServerStatus, 500);
        } else {
            showToast(result.message, 'warning');
        }
    } catch (error) {
        showToast('Erreur lors de l\'arrêt', 'error');
    }
}

async function restartServer() {
    showToast('Redémarrage du serveur...', 'info');

    try {
        const result = await ipcRenderer.invoke('restart-server');
        if (result.success) {
            showToast(result.message, 'success');
            addLog(`Serveur redémarré (PID: ${result.pid})`, 'success');
            setTimeout(updateServerStatus, 2000);
        } else {
            showToast('Erreur lors du redémarrage', 'error');
        }
    } catch (error) {
        showToast('Erreur lors du redémarrage', 'error');
    }
}

async function updateServerStatus() {
    try {
        const status = await ipcRenderer.invoke('get-server-status');

        const statusText = document.getElementById('serverStatusText');
        const pidText = document.getElementById('serverPID');
        const portText = document.getElementById('serverPort');

        if (status.isRunning) {
            statusText.textContent = '🟢 En cours d\'exécution';
            statusText.style.color = '#4CAF50';
            pidText.textContent = status.pid || '-';
        } else {
            statusText.textContent = '🔴 Arrêté';
            statusText.style.color = '#F44336';
            pidText.textContent = '-';
        }

        portText.textContent = status.port || 3000;
    } catch (error) {
        console.error('Error updating server status:', error);
    }
}

function clearServerLogs() {
    const logsContainer = document.getElementById('serverLogsContainer');
    logsContainer.innerHTML = '<div class="log-entry">Logs effacés</div>';
}

async function refreshConnectionInfo() {
    try {
        const config = await ipcRenderer.invoke('get-config');

        document.getElementById('infoEBPServer').textContent = config.ebpServer || '-';
        document.getElementById('infoEBPDatabase').textContent = config.ebpDatabase || '-';
        document.getElementById('infoPGDatabase').textContent =
            `${config.pgHost}:${config.pgPort}/${config.pgDatabase}`;

        showToast('Informations actualisées', 'success');
    } catch (error) {
        showToast('Erreur lors de l\'actualisation', 'error');
    }
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}
