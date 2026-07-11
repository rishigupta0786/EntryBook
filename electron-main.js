const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow;
let nextServerProcess;
const PORT = 3000;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "EntryBook",
    icon: path.join(__dirname, 'public', 'favicon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Remove default menu bar
  mainWindow.setMenuBarVisibility(false);

  // Load a loading HTML first or try loading Next.js directly
  mainWindow.loadURL(`http://localhost:${PORT}`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Function to check if the Next.js server is ready
function pingNextServer() {
  const req = http.request({ host: 'localhost', port: PORT, method: 'GET', timeout: 2000 }, (res) => {
    if (res.statusCode === 200) {
      console.log('Next.js server is ready. Launching main window...');
      createMainWindow();
    } else {
      setTimeout(pingNextServer, 200);
    }
  });

  req.on('error', () => {
    setTimeout(pingNextServer, 200);
  });

  req.end();
}

app.whenReady().then(() => {
  const isPackaged = app.isPackaged;
  
  if (isPackaged) {
    // In production/packaged app, spawn the Next.js server
    // electron-builder places app files inside resources/app/
    const nextPath = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');
    
    console.log('Starting Next.js production server...');
    nextServerProcess = spawn('node', [nextPath, 'start', '-p', PORT.toString()], {
      cwd: __dirname,
      env: { ...process.env, NODE_ENV: 'production' },
      shell: true
    });

    nextServerProcess.stdout.on('data', (data) => {
      console.log(`[Next.js STDOUT]: ${data}`);
    });

    nextServerProcess.stderr.on('data', (data) => {
      console.error(`[Next.js STDERR]: ${data}`);
    });

    // Wait until the server responds on port 3000
    pingNextServer();
  } else {
    // In dev mode, assume 'npm run dev' is running Next.js on port 3000
    createMainWindow();
  }
});

app.on('window-all-closed', () => {
  // Gracefully stop the background Next.js server process
  if (nextServerProcess) {
    console.log('Terminating Next.js background process...');
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', nextServerProcess.pid, '/f', '/t']);
    } else {
      nextServerProcess.kill('SIGINT');
    }
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});
