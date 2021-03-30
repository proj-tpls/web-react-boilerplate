import menu from '../.torenia/menu';

const config = {
  name: '翠鸟',
  menu,
  menuSort: [],
  noPerssmisionPages: [
    '/',
    '/workbench',
    '/forbidden',
    '/error',
    '/notfound',
  ],
  emptyLayoutPages: ['/workbench', '/notfound'],
  normalLayoutSetting: {

  },
  // apiPrefix: 'http://119.45.142.13/api',
  // assetsPrefix: 'http://119.45.142.13/numgame',
  tdUrl: 'ws://121.4.69.17:8082', // 交易服务器
  mdUrl: 'ws://121.4.69.17:8081', // 行情服务器
  minVolume: 100, // 最小报单股数
};


export default config;
