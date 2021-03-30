import { Utils } from 'torenia';
import { message as m } from 'antd';
import { routerRedux } from 'dva/router';
// import electronRequest from './electronRequest';
import { parseUrl } from './urlparser';
import config from './config';
// const { ipcRenderer } = window.require("electron");
const { request } = Utils;

const { axios } = request;

request.cors('http://49.234.35.135:8005')

// axios.defaults.timeout = 10000;
axios.defaults.baseURL = config.marketUrl;
// axios.defaults.withCredentials = true;
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  324: '服务器已断开连接，且未发送任何数据。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

// axios.defaults.withCredentials = true;
// axios.defaults.headers.get['User-Agent'] = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36"

axios.interceptors.request.use(config => {

  const { extra = {} } = config;
  config.url = config.url.replace(/:(\w+)/g, (str, sub1) => {
    return sub1 in extra ? extra[sub1] : `:${sub1}`;
  });
  config.url = `${config.url}`;

  // 前缀为/api/electron的请求都是需要通过向ipcMain发送消息的方式查询结果的
  // if (/\/api\/electron\//.test(config.url)) {
  //   config.adapter = electronRequestAdapter;
  // }

  return config;
});

axios.interceptors.response.use(
  response => {
    const { data = {}, config } = response;
    const { extra = {}, method } = config;
    const { errMsg, msg: successMsg } = extra;
    const { message: msg } = data;

    let finalMsg = msg || errMsg;
    if (!isSuccess(data)) {
      errMsg === false ||
        // notification.error({
        //   message: '请求错误',
        //   description:
        //     msg || errMsg || `${methodMeaning[method]}失败` || '请求失败',
        // });
        (finalMsg && m.error(finalMsg));
    } else {
      successMsg === false ||
        (!successMsg && method === 'get' && !msg) ||
        (finalMsg && m.success(finalMsg));
    }

    if (response.config.needOriginResponse) {
      return response;
    } else {
      return response.data;
    }
  },
  (error) => {
    const { response } = error;

    const { status, data = {} } = response || {};

    // if (401 === status) {
    //   // if (location.pathname !== '#/' && location.pathname !== '#/startPage' && location.pathname !== '#/login') {
    //   //   ipcRenderer.send('app:toLoginPage');
    //   // }

    //   window.g_app._store.dispatch(routerRedux.replace('/login'));
    //   return;
    // }

    // notification.error({
    //   message: '请求错误',
    //   description: data.error && data.error.message || `未知错误`,
    // });
    let msg = (data.error && data.error.message) || codeMessage[status];
    msg && m.error(msg);
  },
);

export default request;

function isSuccess(data) {
  return data && (200 == data || 200 == data.code || data.success);
}

export { isSuccess };


// function electronRequestAdapter(config) {
//   return new Promise(async function dispatchElectronRequest(resolve, reject) {
//     const arr = /\/electron\/([\/a-zA-Z0-9]+)/.exec(config.url);
//     const electronRequestPath = arr && arr[1];
//     const electronRequestMethod = electronRequest[electronRequestPath];
//     if (electronRequestMethod) {
//       let { query } = parseUrl(config.url);
//       query = query || {};
//       try {
//         config.data = JSON.parse(config.data)
//       } catch {
//         config.data = {};
//       }
//       const rsp = await electronRequestMethod({ ...query, ...config.data });
//       if (rsp.success === false) {
//         if (rsp.error && rsp.error.message.includes('timeout')) {
//           reject({response: {error: {message: '请求超时了，可能网络不太好哦~'}}});
//         } else if (rsp.message) {
//           reject({response: {error: {message: rsp.message}}})
//         }
//         resolve({data: rsp, config});
//       } else {
//         resolve({data: { success: true, data: rsp }, config});
//       }
//     } else {
//       resolve({data: { success: false }, config});
//     }
//   })
// }
