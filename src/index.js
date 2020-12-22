const { app, BrowserWindow } = require('electron');
const path = require('path');

const log = require('electron-log');
const {autoUpdater} = require('electron-updater');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

 let mainWindow = null;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  log.info('app ready');
  autoUpdater.checkForUpdates();
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


// autoUpdater section
function sendStatusToWindow(text) {
  log.info(text);
  if (mainWindow) {
    mainWindow.webContents.send('message', text);
  }
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('update-available');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('update-not-available');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('error' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed : " + progressObj.bytesPerSecond;
  log_message += " - Download : " + progressObj.percent + "%";
  log_message += "(" + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', () => {
  sendStatusToWindow('update-downloaded');
  autoUpdater.quitAndInstall();
})