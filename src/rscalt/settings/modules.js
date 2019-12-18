const { BrowserWindow } = require('electron');

// ф-я создания нового окна
const createNewWin = (filename, par = null, w = 400, h = 400, sh = false, mod = true) => {
  let addWin;
  addWin = new BrowserWindow({
    width: w,
    height: h,
    show: sh,
    modal: mod,
    parent: par,
    //frame: false,
  });
  addWin.loadURL(`file://${__dirname}/${filename}`);
  addWin.webContents.openDevTools();
  addWin.once('ready-to-show', () => {
    addWin.show();
  });
  addWin.on('closed', () => {
    addWin = null;
  });
};


module.exports = {
  createNewWin,
};
