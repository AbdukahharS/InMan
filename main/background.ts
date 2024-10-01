import path from 'path'
import { app, ipcMain, screen, BrowserWindow } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  app.setPath('userData', path.join('D:', 'InMan', 'userData'));
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${path.join('D:', 'InMan', 'userData')} (development)`)
}

;(async () => {
  await app.whenReady()
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const mainWindow = createWindow('main', {
    width,
    height,
    // resizable: false,
    maximizable: true,
    
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  
  // Disable the menu bar
  mainWindow.setMenuBarVisibility(false);
  mainWindow.maximize()


  if (isProd) {
    await mainWindow.loadURL('app://./')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/`)
    mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})

ipcMain.on('go-back', (event) => {
  const window = BrowserWindow.getFocusedWindow();
  if (window.webContents.canGoBack()) {
    window.webContents.goBack();
  }
});

ipcMain.on('refresh', (event) => {
  const window = BrowserWindow.getFocusedWindow();
  window.webContents.reload();
});
