/**
 * Electron Main Process
 * - Starts the embedded Express server
 * - Launches the Electron window pointing at the local server
 */

const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const { fork } = require('child_process');
const fs = require('fs');

let mainWindow;
let serverProcess;
const SERVER_PORT = 5000;

// ─── Start embedded Express server ───────────────────────────────────────────
function startServer() {
  const serverPath = app.isPackaged
    ? path.join(process.resourcesPath, 'server', 'electron-server.js')
    : path.join(__dirname, '..', 'server', 'electron-server.js');

  const clientBuildPath = app.isPackaged
    ? path.join(process.resourcesPath, 'client', 'build')
    : path.join(__dirname, '..', 'client', 'build');

  const logPath = path.join(app.getPath('userData'), 'server.log');

  serverProcess = fork(serverPath, [], {
    env: {
      ...process.env,
      PORT: SERVER_PORT,
      // Use userData directory for generated files so they persist properly
      GENERATED_FILES_DIR: path.join(app.getPath('userData'), 'generated-files'),
      CLIENT_BUILD_DIR: clientBuildPath,
      ELECTRON_MODE: 'true',
      ELECTRON_RUN_AS_NODE: '1',
    },
    silent: true,
  });

  const logStream = fs.createWriteStream(logPath, { flags: 'a' });
  logStream.write(`\n--- ${new Date().toISOString()} ---\n`);
  logStream.write(`serverPath=${serverPath}\n`);
  logStream.write(`clientBuildPath=${clientBuildPath}\n`);
  if (serverProcess.stdout) serverProcess.stdout.pipe(logStream, { end: false });
  if (serverProcess.stderr) serverProcess.stderr.pipe(logStream, { end: false });

  serverProcess.on('error', (err) => {
    console.error('Server process error:', err);
    logStream.write(`Server process error: ${err.stack || err}\n`);
  });

  serverProcess.on('exit', (code) => {
    console.log('Server process exited with code:', code);
    logStream.write(`Server process exited with code: ${code}\n`);
  });
}

// ─── Wait for server to be ready ─────────────────────────────────────────────
function waitForServer(url, retries = 90, delay = 1000) {
  return new Promise((resolve, reject) => {
    const http = require('http');
    let attempts = 0;

    const check = () => {
      attempts++;
      http.get(url, (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          retry();
        }
      }).on('error', () => {
        if (attempts >= retries) {
          reject(new Error('Server did not start in time'));
        } else {
          retry();
        }
      });
    };

    const retry = () => setTimeout(check, delay);
    check();
  });
}

// ─── Create the Electron window ───────────────────────────────────────────────
async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'SIF Generator',
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false, // show after ready
  });

  // Open external links in the default browser, not Electron
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Wait for Express to be ready, then load it
  try {
    await waitForServer(`http://localhost:${SERVER_PORT}/health`);
    mainWindow.loadURL(`http://localhost:${SERVER_PORT}`);
  } catch (err) {
    // If server fails, show an error page
    mainWindow.loadURL(`data:text/html,<h2 style="font-family:sans-serif;color:red;padding:40px">
      Failed to start the SIF Generator server.<br><br>
      Please make sure no other application is using port ${SERVER_PORT}.
    </h2>`);
  }
}

// ─── App lifecycle ────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  startServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  // Kill the server process when the window closes
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
