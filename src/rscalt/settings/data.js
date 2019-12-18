const db = require('electron-db');
const fs = require('fs');
const path = require('path');

// папка для ДБ
const locPath = path.join('src', 'db');


// Ф-я получает все данные из базы NAME
const getSettings = (nameDb) => {
  let result = {};
  db.getAll(nameDb, locPath, (suc, data) => {
    result = data[0];
  });
  return result;
};

// получили настройки окна и прочего
const settData = getSettings('globalSettings');
//const tekMonth = settData.tekMonth;

// ф-я создания таблицы в параметрах имя таблицы
const createData = (nameDb) => {
  // проверяем есть ли данная папка - если нет => создаем
  fs.access(locPath, fs.constants.F_OK, (err) => {
    if (err) {
      fs.mkdirSync(locPath);
      db.createTable(nameDb, locPath, () => {
      });
    }
    createData(nameDb);
  });
// Проверка существования файла таблицы Если нет = создаем
  fs.access(path.join(locPath, `${nameDb}.json`), fs.constants.F_OK, (err) => {
    if (err) {
      db.createTable(nameDb, locPath, () => {
      });
    }
  });
};

// получаем массив данных из базы nameDb
const tekList = (nameDb) => {
  const arr = [];
  db.getAll(nameDb, locPath, (suc, data) => {
    for (let i = 0; i < data.length; i++) {
      arr.push(data[i]);
    }
  });
  return arr;
};


const insertGainCost = (nameDb, obj) => {
  // проверка id и присвоение уникального
  const newObj = [];
  db.getAll(nameDb, locPath, (suc, data) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].month === tekMonth) {
        newObj.push(data[i]);
      }
    }
  });

  const key = Object.keys(obj)[0];
  let insert = true;
  for (let i = 0; i < newObj.length; i++) {
    const keysInDb = Object.keys(newObj[i])[0];
    // Проверяем есть или нет ключь в БД
    if (key === keysInDb) {
      if (confirm(" В этом месяце уже заведена: - " + key + " = " + newObj[i][keysInDb] + "  Добавить?")) {
        db.deleteRow(nameDb, locPath, {id: Number(`${newObj[i].id}`) }, () => { });
        obj[`${key}`] = Number((newObj[i][keysInDb] += obj[key]));
      } else {
        insert = false;
      }
    }
  }
  if (insert) {
    obj.month = tekMonth;
    db.insertTableContent(nameDb, locPath, obj, () => {
    });
  }
};


// Добавление новой записи и проверка уникального id
const insertNewOrg = (nameDb, obj) => {
  // проверка id и присвоение уникального
  let newId;
  db.getAll(nameDb, locPath, (err, docs) => {
    newId = docs.length + 1;
    for (let i = 0; i < docs.length; i++) {
      // Создаем уникальный ID
      if (Number(newId) === Number(docs[i].id_org)) {
        newId += 1;
        i = 0;
      }
    }
    obj.id_org = newId;
  });
  db.insertTableContent(nameDb, locPath, obj, (suc, msg) => {
  });
};


const getAllRowById = (nameDb, id) => {
  let arr = [];
  db.getRows(nameDb, locPath, { idOrg: id }, (suc, data) => {
    if (suc) {
      arr = data;
    }
  });
  return arr;
};

const getAllData = (nameDb) => {
  let result = {};
  db.getAll(nameDb, locPath, (suc, data) => {
    result = data;
  });
  return result;
};


// ф-я обновляет существ-ие поля
const updateInfo = (id, set) => {
  // на вход берем id и чистим всю инфу с данным id
  // Получаем все базы и запихиваем в массив обрезая расширения
  const allBase = fs.readdirSync(locPath);
  const objDb = [];
  for (let i = 0; i < allBase.length; i++) {
    objDb.push(path.parse(allBase[i]).name);
  }
  for (let y = 0; y < objDb.length; y++) {
    // eslint-disable-next-line no-undef
    db.getField(dbName[y], locPath, key, (suc, data) => {
      if (suc) {
        console.log(data);
      }
    });
  }
  const keySet = Object.keys(set);
  console.log(keySet);
// Прогоняем по всем базам => грохаем все данные
  /*  */
  /*db.updateRow(objDb[y], locPath, {'id_org': id}, set, () => {
  });
}*/
};


const deleteInfoOrg = (id) => {
  // на вход берем id и чистим всю инфу с данным id
  // Получаем все базы и запихиваем в массив обрезая расширения
  let allBase = fs.readdirSync(locPath);
  let objDb =[];
  for (let i = 0; i < allBase.length; i++) {
    objDb.push(path.parse(allBase[i]).name);
  }
  // Прогоняем по всем базам => грохаем все данные
  for (let y = 0; y < objDb.length; y++) {
    db.deleteRow(objDb[y], locPath, { 'id_org': id }, (suc, msg) => {
      console.log(msg);
    });
  }
};

module.exports = {
  createData,
  insertNewOrg,
  getAllRowById,
  getAllData,
  deleteInfoOrg,
  updateInfo,
  getSettings,
  insertGainCost,
 // tekMonth,
  tekList,
};
