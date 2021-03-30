// import request from 'utils/request';
// import config from 'utils/config';
// const { ipcRenderer } = window.require('electron');

// export function currentUser() {
//   return request({
//     url: `${config.apiPrefix}/session`,
//   });
// }

// export function logout() {
//   return request({
//     method: 'delete',
//     url: `${config.apiPrefix}/session`,
//     extra: {
//       msg: false,
//     }
//   });
// }

// export function getMachineId() {
//   // const pro = new Promise((resolve) => {
//   //   ipcRenderer.once('machineId', (event, id) => {
//   //     resolve(id);
//   //   });
//   // });

//   // ipcRenderer.send('sys:getMachineId');

//   // return pro;
// }

// export function tradeDict() {
//   return request({
//     url: `${config.apiPrefix}/tradeDict`,
//   });
// }

// export function now() {
//   return request({
//     url: `${config.apiPrefix}/now`,
//   });
// }
