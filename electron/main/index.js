import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '../..');

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win = null;
const preload = path.join(__dirname, '../preload/index.js');
const indexHtml = path.join(RENDERER_DIST, 'index.html');

async function createWindow() {
  win = new BrowserWindow({
    title: 'ImgToolbox',
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    titleBarStyle: 'hidden',
    width: 800,
    height: 580,
    minWidth: 800,
    minHeight: 580,
    titleBarOverlay: {
      color: 'rgba(0,0,0,0)',
      height: 35,
      symbolColor: 'black',
    },
    autoHideMenuBar: true,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    // #298
    win.loadURL(VITE_DEV_SERVER_URL);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}

app.whenReady().then(async () => {
  await createWindow();
  registerEvent();
  testCode();
});

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

const registerEvent = () => {
  // 注册事件
  ipcMain.on('dark-mode:toggle', (_event, isDarkMode) => {
    win.setTitleBarOverlay({
      color: isDarkMode ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 255, 255, 0.7)',
      symbolColor: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgb(78, 89, 105)',
    });
  });
  ipcMain.handle('dialog:openFile', async (e, options) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(options);
    if (!canceled) {
      return filePaths;
    } else {
      return null;
    }
  });
  ipcMain.handle('api:format', async (e, options) => {
    return await apiFormat(options);
  });

  ipcMain.handle('api:getImgUrl', async (e, options) => {
    return await apiGetImgUrl(options);
  });
};

const apiFormat = (options) => {
  return new Promise((resolve, reject) => {
    const { id, filePath, formatType, fileOut } = options;
    if (!filePath) {
      reject({ message: '请传入文件路径' });
    }
    if (!fs.existsSync(filePath)) {
      reject({ message: '文件不存在' });
    }
    const fileName = path.basename(filePath);
    const toFileName = `${fileOut}\\${fileName.replace(/\.\w+$/, `.${formatType}`)}`;
    sharp(filePath)
      .toFormat(formatType)
      .toFile(toFileName, (err, info) => {
        if (err) {
          reject(err);
        }
        resolve({
          outputFilePath: toFileName,
          id,
          ...info,
        });
      });
  });
};

const apiGetImgUrl = (options) => {
  return new Promise(async (resolve, reject) => {
    const { filePath, fileType } = options;
    if (!filePath) {
      reject({ message: '请传入文件路径' });
    }
    if (!fs.existsSync(filePath)) {
      reject({ message: '文件不存在' });
    }
    const bitmap = fs.readFileSync(filePath);
    const b64 = Buffer.from(bitmap).toString('base64');
    resolve(b64);
  });
};

const testCode = () => {
  // const aa = 'D:\\node-projects\\img-operation-test\\1.jpeg';
  // const sharp = require('sharp');
  // sharp(aa)
  //   .toFormat('png')
  //   .toFile(
  //     'D:\\node-projects\\img-operation-test\\output.png',
  //     (err, info) => {
  //       console.log(info);
  //     }
  //   );
};
