const Data = require('./rscalt/settings/data');
const { ipcRenderer } = require('electron');


const tekDateValue = document.querySelector('.nav-wrapper .tekDate');
const settData = Data.getSettings('globalSettings');

const now = new Date();
const monthA = 'января,февраля,марта,апреля,мая,июня,июля,августа,сентября,октября,ноября,декабря'.split(',');
const monthB = 'январь,февраль,март,апрель,май,июнь,июль,август,сентябрь,октябрь,ноябрь,декабрь'.split(',');

const tekDate = `Сегодня ${now.getDate()} ${monthA[now.getMonth()]} ${now.getFullYear()} года`;
//tekDateValue.textContent = tekDate;

const listOrg = Data.getAllData('organizations');


/* Немного VUE -> списки проще выводить и прочее */

// eslint-disable-next-line no-undef
const userName = new Vue({
  el: '#userName',
  data: {
    userName: settData.nameUser,
  },
});

/* Отрисовываем список организаций */
// eslint-disable-next-line no-undef
let app = new Vue({
  el: '#list-org',
  data: {
    list: listOrg,
  },
});


const listItem = document.querySelectorAll('.list-items .list-item');
const btnAddLs = document.querySelector('.add-ls');

listItem.forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const id = e.target.parentNode.attributes.id.value;
    // console.log(id);
    ipcRenderer.send('openOrg', id);
  });
});

btnAddLs.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('click')
  //ipcRenderer.send('addedOrganization');
});

document.addEventListener('DOMContentLoaded', () => {
  M.updateTextFields();
});
