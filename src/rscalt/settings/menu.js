// тут все понятно - менюшки (контекстные и другие)

const templateMenu = [
  {
    label: 'First',
    submenu: [
      {
        label: '1-1',
        click: () => {
          //  console.log('click 1-1');
        },
      },
    ],
  },
];

const subMenu = {
  label: 'Hello',
};

module.exports = {
  templateMenu,
  subMenu,
};
