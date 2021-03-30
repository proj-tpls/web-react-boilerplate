import io from 'socket.io-client';
import { message, notification } from 'antd';
import config from './config';

function init() {
  if (window.md_socket) {
    window.md_socket.close();
  }

  const { dispatch, getState } = window.g_app._store;
  const mdUrl = localStorage.getItem('kingfisher_md_url') || config.mdUrl;

  dispatch({
    type: 'workBench/putStatus',
    payload: `连接行情服务器 ${mdUrl}`
  });

  const socket = io(mdUrl);

  socket.on('connect', () => {
    dispatch({
      type: 'workBench/putState',
      payload: {
        mdConnected: true
      }
    });

    try {
      const userId = sessionStorage.getItem('kingfisher_userid');
      if (userId) {
        // socket.emit('json', {
        //   type: 'session',
        //   payload: {
        //     userId
        //   }
        // });
        const optionalStocks = JSON.parse(localStorage.getItem(`kingfisher_${userId}_optionalstocks`) || '{}');
        const stocks = Object.keys(optionalStocks).join(',');

        socket.emit('json', {
          type: 'deepQuotes',
          payload: {
            stockCodes: stocks,
            userId
          }
        });

        // socket.emit('json', {
        //   type: 'commonQuotes',
        //   payload: stocks
        // });
      }
    }
    catch(e) {}

    // try {
    //   const { workBench } = getState();
    //   const { selectedStock } = workBench;

    //   selectedStock && socket.emit('json', {
    //     type: 'level2Quote',
    //     payload: selectedStock.stockCode
    //   });
    // }
    // catch(e) {}
  });

  // handle the event sent with socket.send()
  socket.on('json', (type, payload) => {
    // console.log(performance.now())
    dispatch({
      type: 'workBench/putJson',
      payload: {
        ...payload,
        type
      }
    });
  });

  socket.on('message', (payload) => {
    if (payload.message) {
      message[payload.type] && message[payload.type](payload.message);
    }
  });

  socket.on('notification', ({ type, message = '', description = '' }) => {
    if (message || description) {
      notification[type] && notification[type]({
        message,
        description,
        duration: null,
        placement: 'bottomRight'
      });
    }
  });

  socket.on('status', (payload) => {
    dispatch({
      type: 'workBench/putStatus',
      payload
    });
  });

  socket.on('disconnect', () => {
    dispatch({
      type: 'workBench/putState',
      payload: {
        mdConnected: false
      }
    });
  });

  window.md_socket = socket;
}

export default {
  init
};
