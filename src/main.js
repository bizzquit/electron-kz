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

  /* ********СЛУШАТЕЛЬ СОБЫТИЙ  START********* */

  let newWindow;
  // слушаем сигнал 'openOrg' и открываем новое окно
  ipcMain.on('openOrg', (event, id) => {
    if (!newWindow) {
      newWindow = createNewWin('organization/index.html', mainWindow, 800, 800);
      storage.setItem('idOrg', id);
    }

    //createNewWin.webContents.send('idOrg', id);
    //ipcMain.on('idOrg', id);
    //console.log(id);
  });
  ipcMain.on('addedOrganization', () => {
    if (!newWindow) {
      newWindow = createNewWin('addNewOrg/index.html', mainWindow, 800, 800);
    }
  });

  /* ********СЛУШАТЕЛЬ СОБЫТИЙ END********* */

  /* Меню */

  ipcMain.on('main', () => {
    mainWindow.loadFile('src/index.html');
  });
  ipcMain.on('gain', () => {
    mainWindow.loadFile('src/modules/addNewOrg/addNewOrg.html');
  });
  ipcMain.on('costs', () => {
    mainWindow.loadFile('src/modules/costs/index.html');
  });
  ipcMain.on('settings', () => {
    mainWindow.loadFile('src/modules/settings/index.html');
  });
  ipcMain.on('plans', () => {
    mainWindow.loadFile('src/modules/settings/index.html');
  });

  /* Меню END */

  // отображение окна после полной загрузки
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};


app.on('ready', () => {
  createWindow();

 /* const menu = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(menu);

  const ctxMenu = new Menu();
  ctxMenu.append(new MenuItem(subMenu));

  mainWindow.webContents.on('context-menu', (e, params) => {
    // console.log(params);
    ctxMenu.popup(mainWindow, params.x, params.y);
  });
});

app.on('window-all-closed', () => {

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {

  if (mainWindow === null) {
    createWindow();
  }*/
});
