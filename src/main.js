const electron = require('electron');
const { app, BrowserWindow, ipcMain } = require('electron');
const Data = require('./rscalt/settings/data');
const storage = require('electron-localstorage');
const createNewWin = require('./rscalt/settings/modules').createNewWin;
const templateMenu = require('./rscalt/settings/menu').templateMenu;
const subMenu = require('./rscalt/settings/menu').subMenu;

const Menu = electron.Menu;
const MenuItem = electron.MenuItem;

Data.createData('globalSettings');
const settData = Data.getSettings('globalSettings');


if (require('electron-squirrel-startup')) {
  app.quit();
}

// главное окно
let mainWindow;

const createWindow = () => {
 //Читаем файл настроек окна и прочего
  if (settData) {
    mainWindow = new BrowserWindow({
      width: settData.width,
      height: settData.height,
      webPreferences: {
        nodeIntegration: true,
      },
    });
  } else {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
      },
    });
  }

  mainWindow.loadURL(`file://${__dirname}/start-page.html`);

  mainWindow.webContents.openDevTools();


  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};


app.on('ready', createWindow);

app.on('window-all-closed', () => {

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {

  if (mainWindow === null) {
    createWindow();
  }
});
