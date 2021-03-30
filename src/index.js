import './global.js';
import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './router';
import Container from './container';
import config from 'utils/config';
import helper from 'utils/helper';
import _ from 'lodash';
import tdWebsocket from 'utils/tdWebsocket';
import mdWebsocket from 'utils/mdWebsocket';
import { parseKeyboardEvent, label2code, code2label } from 'utils/keycode';
import { InputNumber, message, Modal } from 'antd';
import { Form } from 'torenia';
import { sendOrder, cancelAll, cancelLatest, clearPosition } from 'utils/trade';

const { confirm } = Modal;

Form.registerFormWidget('InputNumber', InputNumber);
// const { ipcRenderer } = window.require('electron');

// ipcRenderer.on('env', (event, isDev) => {
//   isDev || document.addEventListener('keydown', (evt) => {
//     if (evt.ctrlKey && evt.shiftKey && 73 === evt.keyCode || 123 === evt.keyCode) {
//       evt.preventDefault();
//       return false;
//     }
//   });
// });

function render() {
  ReactDOM.render(
    <Container>
      <Routes />
    </Container>,
    document.getElementById('root'),
  );
}

render();

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
}, false);

tdWebsocket.init();
mdWebsocket.init();

const { dispatch, getState } = window.g_app._store;
const body = document.body;

const doVolumeIncrease = _.throttle(function() {
  const { workBench } = getState();
  const { stockInput, shortcut } = workBench;
  const volume = stockInput.volume + shortcut.volumeStep;
  dispatch({
    type: 'workBench/putState',
    payload: {
      stockInput: {
        ...stockInput,
        volume: volume < Number.MAX_SAFE_INTEGER ? volume : volume - shortcut.volumeStep
      }
    }
  });
}, 100);

const doVolumeDecrease = _.throttle(function() {
  const { workBench } = getState();
  const { stockInput, shortcut } = workBench;
  const volume = stockInput.volume - shortcut.volumeStep;
  dispatch({
    type: 'workBench/putState',
    payload: {
      stockInput: {
        ...stockInput,
        volume: volume >= config.minVolume ? volume : config.minVolume
      }
    }
  });
}, 100);

const doPriceIncrease = _.throttle(function() {
  const { workBench } = getState();
  const { stockInput, shortcut } = workBench;
  // if (!stockInput.stockCode) {
  //   return;
  // }
  const step = shortcut.priceStep || 0.01;
  let stepPrecision = /\.(\d+)/.exec(step);
  stepPrecision = stepPrecision && stepPrecision[1] && stepPrecision[1].length;
  let precision = helper.isETF(stockInput.stockCode) ? 3 : 2;
  if (stepPrecision) {
    precision = Math.max(stepPrecision, precision);
  }
  let price = stockInput.price + step;
  price = +price.toFixed(precision);
  if (price < 0) {
    price = 0;
  }
  dispatch({
    type: 'workBench/putState',
    payload: {
      stockInput: {
        ...stockInput,
        price
      }
    }
  });
}, 100);

const doPriceDecrease = _.throttle(function() {
  const { workBench } = getState();
  const { stockInput, shortcut } = workBench;
  // if (!stockInput.stockCode) {
  //   return;
  // }
  const step = shortcut.priceStep || 0.01;
  let stepPrecision = /\.(\d+)/.exec(step);
  stepPrecision = stepPrecision && stepPrecision[1] && stepPrecision[1].length;
  let precision = helper.isETF(stockInput.stockCode) ? 3 : 2;
  if (stepPrecision) {
    precision = Math.max(stepPrecision, precision);
  }
  let price = stockInput.price - step;
  price = +price.toFixed(precision);
  if (price < 0) {
    price = 0;
  }
  dispatch({
    type: 'workBench/putState',
    payload: {
      stockInput: {
        ...stockInput,
        price
      }
    }
  });
}, 100);

document.addEventListener('keydown', (e) => {
  if (e.target !== body) {
    return;
  }

  e.preventDefault();
  // e.stopImmediatePropagation();
  e.stopPropagation();
  const { workBench } = getState();
  const { shortcut, stockInput, deepQuotes } = workBench;
  const { enableShortcut, stockCode, shareHolderCode, volume, price } = stockInput;
  const sendOrderKeys = shortcut.sendOrder;

  if (!enableShortcut) {
    return;
  }

  const key = parseKeyboardEvent(e);

  const keyData = sendOrderKeys[key.code];
  // 如果是下单键
  if (keyData) {
    if (!stockCode) {
      message.warn('请先选择股票或输入股票代码');
      return;
    }
    if (!deepQuotes.success) {
      message.warn('无行情');
      return;
    }
    const { direction, priceType, priceDiff, action } = keyData;
    // TODO: 调用下单指令
    if (action === 'needEnsure') {
      confirm({
        title: '报单提醒',
        content: '确定下单吗?',
        onOk() {
          const quote = deepQuotes.data[stockCode];
          if (!quote) {
            message.warn(`${stockCode} 无行情`);
            return;
          }
          const precision = helper.isETF(stockCode) ? 3 : 2;
          sendOrder({
            stockCode,
            direction,
            volume: stockInput.volume,
            price: priceType === 'marketPrice' ? stockInput.price : +(quote[priceType] + priceDiff).toFixed(precision), // 如果是市价, 则价格是多少都不重要
            priceType,
            shareHolderCode
          });
        },
        onCancel() {
          console.log('算了算了');
        },
      });
    }
    else {
      const quote = deepQuotes.data[stockCode];
      if (!quote) {
        message.warn(`${stockCode} 无行情`);
        return;
      }
      const precision = helper.isETF(stockCode) ? 3 : 2;
      sendOrder({
        stockCode,
        direction,
        volume: stockInput.volume,
        price: priceType === 'marketPrice' ? stockInput.price : +(quote[priceType] + priceDiff).toFixed(precision), // 如果是市价, 则价格是多少都不重要
        priceType,
        shareHolderCode
      });
    }
    return;
  }
  switch(key.code) {
    case shortcut.cancelAll: {
      cancelAll(stockCode);
      break;
    }
    case shortcut.cancelLatest: {
      cancelLatest(stockCode);
      break;
    }
    case shortcut.oneKeyClearPosition: {
      clearPosition(false);
      break;
    }
    case shortcut.oneKeyClearPositionForSelectedStock: {
      if (!stockCode) {
        message.warn('请先选择股票或输入股票代码');
        return;
      }
      clearPosition();
      break;
    }
    case 'KeyB': { // 买
      if (!stockCode) {
        message.warn('请先选择股票或输入股票代码');
        return;
      }
      sendOrder({
        stockCode,
        direction: 'buy',
        volume,
        price,
        shareHolderCode
      });
      break;
    }
    case 'KeyS': { // 卖
      if (!stockCode) {
        message.warn('请先选择股票或输入股票代码');
        return;
      }
      sendOrder({
        stockCode,
        direction: 'sell',
        volume,
        price,
        shareHolderCode
      });
      break;
    }
    case 'F4': {
      changeLeftPaneActiveKey('cancelableOrders', e);
      break;
    }
    case 'F9': {
      changeLeftPaneActiveKey('dayOrders', e);
      break;
    }
    case 'F2': {
      changeRightPaneActiveKey('dayTrades', e);
      break;
    }
    case 'F5': {
      changeRightPaneActiveKey('position', e);
      break;
    }
    case 'KeyQ': {
      const userId = sessionStorage.getItem('kingfisher_userid');
      window.td_socket.emit('json', { type: 'refresh', payload: { userId } });
      break;
    }
    case shortcut.priceIncrease: {
      doPriceIncrease();
      break;
    }
    case shortcut.priceDecrease: {
      doPriceDecrease();
      break;
    }
    case shortcut.volumeIncrease: {
      doVolumeIncrease();
      break;
    }
    case shortcut.volumeDecrease: {
      doVolumeDecrease();
      break;
    }
  }
}, true);

function changeLeftPaneActiveKey(key, e) {
  dispatch({
    type: 'workBench/putState',
    payload: {
      leftPaneActiveKey: key
    }
  });
  const userId = sessionStorage.getItem('kingfisher_userid');
  userId && window.td_socket.emit('json', { type: key, payload: { userId } });
}

function changeRightPaneActiveKey(key, e) {
  dispatch({
    type: 'workBench/putState',
    payload: {
      rightPaneActiveKey: key
    }
  });
  const userId = sessionStorage.getItem('kingfisher_userid');
  userId && window.td_socket.emit('json', { type: key, payload: { userId } });
}
