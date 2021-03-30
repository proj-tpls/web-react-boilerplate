import io from 'socket.io-client';
import { message, notification } from 'antd';
import config from './config';
import helper from 'utils/helper';

function init() {
  if (window.td_socket) {
    window.td_socket.close();
  }
  const store = window.g_app._store;
  const { dispatch, getState } = store;
  const tdUrl = localStorage.getItem('kingfisher_td_url') || config.tdUrl;

  dispatch({
    type: 'workBench/putStatus',
    payload: `连接交易服务器 ${tdUrl}`
  });

  const socket = io(tdUrl);

  socket.on('connect', () => {
    dispatch({
      type: 'workBench/putState',
      payload: {
        tdConnected: true
      }
    });
    const userId = sessionStorage.getItem('kingfisher_userid');
    userId && socket.emit('json', { type: 'session', payload: { userId } });
  });

  // handle the event sent with socket.send()
  socket.on('json', (type, payload) => {
    switch(type) {
      case 'login': {
        if (payload.success) {
          dispatch({
            type: 'workBench/putJson',
            payload: {
              loginModalVisiable: false,
              loginFormSpinning: false,
              isLogin: true,
              login: payload
            }
          });

          const { userId } = payload.data;
          // const { workBench } = store.getState('workBench');
          // socket.emit('json', {
          //   type: workBench.leftPaneActiveKey,
          //   payload: { userId }
          // });
          // socket.emit('json', {
          //   type: workBench.rightPaneActiveKey,
          //   payload: { userId }
          // });
          try {
            const optionalStocks = JSON.parse(localStorage.getItem(`kingfisher_${userId}_optionalstocks`) || '{}');
            dispatch({
              type: 'workBench/putOptionalStocks',
              payload: optionalStocks
            });

            // const stocks = Object.keys(optionalStocks).join(',');

            // window.md_socket.emit('json', {
            //   type: 'commonQuotes',
            //   payload: stocks
            // });
          }
          catch(e) {}
        }
        else {
          dispatch({
            type: 'workBench/putJson',
            payload: {
              loginFormSpinning: false,
              isLogin: false
            }
          });
        }
        break;
      }
      case 'logout': {
        if (payload.success) {
          dispatch({
            type: 'workBench/resetState'
          });
          sessionStorage.removeItem('kingfisher_userid');
        }
        break;
      }
      case 'tdConnected': {
        dispatch({
          type: 'workBench/putState',
          payload: {
            tdConnected: payload,
          }
        });
        break;
      }
      case 'optionalStock': {
        if (payload.success) {
          const newOptionalStocks = {};
          payload.data.forEach(item => {
            newOptionalStocks[item.stockCode] = item;
          });
          dispatch({
            type: 'workBench/putOptionalStocks',
            payload: newOptionalStocks
          });

          const { workBench } = getState();
          const { stockInput, shareHolderCode, optionalStocks } = workBench;

          if (!newOptionalStocks[stockInput.stockCode]) {
            return;
          }

          const addedStock = optionalStocks[stockInput.stockCode];

          if (addedStock) {
            const exchangeId = addedStock.accountType || helper.getExchangeIdFromStockCode(addedStock.stockCode, false);

            let newStockInput = { ...stockInput };

            if (exchangeId && shareHolderCode.success) {
              const selectShareHolderCodeItem = shareHolderCode.data.filter(item => item.accountType == exchangeId)[0];
              if (selectShareHolderCodeItem) {
                newStockInput.shareHolderCode = selectShareHolderCodeItem.shareHolderCode;
              }
            }

            dispatch({
              type: 'workBench/putState',
              payload: {
                stockInput: newStockInput
              }
            });

            setTimeout(() => {
              // TODO: test
              const { workBench } = getState();
              const { deepQuotes, stockInput } = workBench;
              if (deepQuotes.success && deepQuotes.data[stockInput.stockCode]) {
                const selectedStock = deepQuotes.data[stockInput.stockCode];
                if (selectedStock) {
                  newStockInput = { ...stockInput };
                  newStockInput.price = selectedStock.lastPrice;
                  dispatch({
                    type: 'workBench/putState',
                    payload: {
                      selectedStock,
                      stockInput: newStockInput
                    }
                  });
                }
              }
            }, 1000);
          }

          // window.md_socket.emit('json', {
          //   type: 'level2Quote',
          //   payload: payload.data.map(item => item.stockCode).join(',')
          // });
          return;
        }
      }
    }
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
      if (!payload.type) {
        if (payload.success === false) {
          payload.type = 'error';
        }
        else {
          payload.type = 'info';
        }
      }
      message[payload.type] && message[payload.type](payload.message);
    }
  });

  socket.on('notification', ({ type, message = '', description = '', success }) => {
    if (message || description) {
      if (!type) {
        if (success === false) {
          type = 'error';
        }
        else {
          type = 'info';
        }
      }
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
        tdConnected: false,
        isLogin: false,
        login: {},
        capital: {},
        shareHolderCode: {},
        dayOrders: {},
        dayTrades: {},
        cancelableOrders: {},
        position: {}
      }
    });
  });

  window.td_socket = socket;
}

export default {
  init
};
