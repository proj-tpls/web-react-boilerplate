import { message } from 'antd';
import helper from './helper';
import { PositionDirection } from './dict';

/**
 * 下单
 * @param {Object} payload
 * @param {String} payload.stockCode
 * @param {String} payload.direction 'buy' | 'sell'
 * @param {Number} payload.price
 * @param {Number} payload.volume
 * @param {String} payload.priceType 可选 'marketPrice' | 'bidPrice1' | 'askPrice1' | 'lastPrice' | 'lowerLimitPrice'| 'upperLimitPrice'
 * @param {String} payload.shareHolderCode
 */
export function sendOrder(payload) {
  const { getState } = window.g_app._store;
  const { workBench } = getState();
  const {
    // selectedStock,
    // deepQuotes,
    capital,
    commonSetting,
    login,
    position,
    stockInput,
    doTPosition,
  } = workBench;
  const { autoMaxVolumeOrderingWhenBuy, autoMaxVolumeOrderingWhenSell } = commonSetting;

  if (!login.success) {
    message.error('请先登录账户', 1);
    return;
  }
  const { userId } = login.data;
  // 买入时需要先判断资金够不够买
  if (payload.direction === 'buy') {
    const capitalData = capital.success && capital.data && capital.data[0];
    if (!capitalData) {
      message.error('未获取到账户资金数据', 1);
      return;
    }

    let { available } = capitalData;
    available = +available;
    const buyNeedAmount = payload.volume * payload.price;

    if (buyNeedAmount > available) { // 可用资金不够
      if (autoMaxVolumeOrderingWhenBuy) { // 以可买最大股数报单
        payload.volume = Math.floor(available / payload.price / 100) * 100 // 买的时候必须整百股的买
        if (payload.volume === 0) {
          message.error('资金不足', 1);
          return;
        }
        window.td_socket.emit('json', { type: 'sendOrder', payload: { ...payload, userId } });
      }
      else {
        message.error('资金不足', 1);
      }
    }
    else {
      // 若开启做T交易模式
      if (stockInput.enableDoT && doTPosition.success) {
        const pos = doTPosition.data.find(item => item.stockCode === payload.stockCode);
        if (pos && payload.direction === 'buy' && 'SHORT' === PositionDirection.getAliasFromValue(pos.direction)) {
          payload.volume = Math.min(payload.volume, pos.volume);
        }
      }

      window.td_socket.emit('json', { type: 'sendOrder', payload: { ...payload, userId } });
    }
  }
  // 卖出
  else {
    if (!position.success) {
      message.error('未获取到持股数据', 1);
      return;
    }

    const positionList = position.data.filter(item => item.position !== '0' && item.stockCode === payload.stockCode);

    if (!positionList.length) {
      message.error(`${payload.stockCode} 无持股可以卖出`, 1);
      return;
    }

    const positionVolume = positionList.map(item => +item.availableBalance).reduce((prev, curr) => prev + curr);

    if (positionVolume <= 0) {
      message.error(`${payload.stockCode} 无可用持股可以卖出`, 1);
      return;
    }

    if (payload.volume > positionVolume && autoMaxVolumeOrderingWhenSell) { // 卖出的股数大于持股数时以可卖最大股数报单
      payload.volume = positionVolume;
    }

    // 若开启做T交易模式
    if (stockInput.enableDoT && doTPosition.success) {
      const pos = doTPosition.data.find(item => item.stockCode === payload.stockCode);
      if (pos && payload.direction === 'sell' && 'LONG' === PositionDirection.getAliasFromValue(pos.direction)) {
        payload.volume = Math.min(payload.volume, pos.volume);
      }
    }

    window.td_socket.emit('json', { type: 'sendOrder', payload: { ...payload, userId } });
  }
}


/**
 * 撤单
 * @param {Object} payload
 * @param {String} payload.stockCode
 * @param {String} payload.orderRef
 */
export function cancelOrder({ stockCode, orderId }) {
  const { getState } = window.g_app._store;
  const { workBench } = getState();
  const {
    login,
  } = workBench;

  if (!login.success) {
    message.error('请先登录账户', 1);
    return;
  }

  const { userId } = login.data;
  window.td_socket.emit('json', { type: 'cancelOrder', payload: { stockCode, orderRef: orderId, userId } });
}

/**
 * 批量撤单
 * @param {Object} payload
 * @param {Array[String]} payload.stockCodeList
 * @param {Array[String]} payload.orderRefList
 */
export function cancelOrders({ stockCodeList, orderRefList }) {
  const { getState } = window.g_app._store;
  const { workBench } = getState();
  const {
    login,
  } = workBench;

  if (!login.success) {
    message.error('请先登录账户', 1);
    return;
  }
  const { userId } = login.data;
  window.td_socket.emit('json', { type: 'cancelOrders', payload: { stockCodeList, orderRefList, userId } });
}


export function cancelAll(stockCode) {
  const { getState } = window.g_app._store;
  const { workBench } = getState();
  const {
    login,
    cancelableOrders
  } = workBench;

  if (!login.success) {
    message.error('请先登录账户', 1);
    return;
  }
  const { userId } = login.data;

  if (!cancelableOrders.success) {
    message.error('未获取到挂单数据', 1);
  }

  if (cancelableOrders.data.length) {
    const stockCodeList = [], orderRefList = [];
    // 新股申购和配股申购的报单是没法撤销的, 这里直接过滤出正常买卖的报单
    cancelableOrders.data.filter(item => item.direction === '证券买入' || item.direction === '证券卖出').forEach(({ orderId, stockCode/*, orderVolume, tradedVolume, cancelVolume*/ }) => {
      stockCodeList.push(stockCode);
      orderRefList.push(orderId);
    });

    window.td_socket.emit('json', { type: 'cancelOrders', payload: { stockCodeList, orderRefList, userId } });
  }
}

export function cancelLatest(stockCode) {
  const { getState } = window.g_app._store;
  const { workBench } = getState();
  const {
    login,
    cancelableOrders
  } = workBench;

  if (!login.success) {
    message.error('请先登录账户', 1);
    return;
  }
  const { userId } = login.data;

  if (!cancelableOrders.success) {
    message.error('未获取到挂单数据', 1);
  }

  if (cancelableOrders.data.length) {
    const { stockCode, orderId: orderRef } = cancelableOrders.data[0];
    window.td_socket.emit('json', { type: 'cancelOrder', payload: { stockCode, orderRef, userId } });
  }
}

export function clearPosition(clearSelected = true) {
  const { getState } = window.g_app._store;
  const { workBench } = getState();
  const {
    login,
    stockInput,
    position,
    shortcut,
    deepQuotes,
    optionalStocks,
    shareHolderCode,
    doTPosition,
  } = workBench;

  const { stockCode, price, enableDoT } = stockInput;
  const { clearPositionPriceType, clearPositionPriceDiff } = shortcut;

  if (!login.success) {
    message.error('请先登录账户', 1);
    return;
  }

  if (!deepQuotes.success) {
    message.warn('无行情');
    return;
  }

  const { userId } = login.data;

  const precision = helper.isETF(stockCode) ? 3 : 2;

  if (position.success) {
    let data = position.data.filter(item => item.position !== '0' && +item.availableBalance > 0);
    // 清除选中股票的所有持股
    if (clearSelected) {
      data = data.filter(item => item.stockCode === stockCode);
    }

    if (!data.length) {
      message.warn(clearSelected ? `${stockCode} 无可卖持股` : '无可卖持股');
      return;
    }

    const payload = {
      directionList: [],
      priceTypeList: [],
      shareHolderCodeList: [],
      stockCodeList: [],
      priceList: [],
      volumeList: [],
      userId
    };

    data.forEach(({ availableBalance, stockCode }) => {
      const quote = deepQuotes.data[stockCode];

      if (!quote) {
        message.warn(`${stockCode} 无行情, 未能卖出`);
        return;
      }
      availableBalance = +availableBalance;

      // 若开启做T交易模式
      if (enableDoT && doTPosition.success) {
        const pos = doTPosition.data.find(item => item.stockCode === stockCode);
        if (pos && 'LONG' === PositionDirection.getAliasFromValue(pos.direction)) {
          availableBalance = Math.min(availableBalance, pos.volume);
        }
      }

      const exchangeId = optionalStocks[stockCode] && optionalStocks[stockCode].accountType || helper.getExchangeIdFromStockCode(stockCode, false);
      let selectShareHolderCodeItem;

      if (exchangeId && shareHolderCode.success) {
        selectShareHolderCodeItem = shareHolderCode.data.filter(item => item.accountType == exchangeId)[0];
        // TODO: 如果根据stockCode没有找到对应的股东代码则默认使用第一个股东代码
        if (!selectShareHolderCodeItem) {
          selectShareHolderCodeItem = shareHolderCode.data[0];
        }
      }
      payload.directionList.push('sell');
      payload.priceTypeList.push(clearPositionPriceType);
      payload.shareHolderCodeList.push(selectShareHolderCodeItem.shareHolderCode);
      payload.stockCodeList.push(stockCode);
      payload.priceList.push(clearPositionPriceType === 'marketPrice' ? price : +(quote[clearPositionPriceType] + clearPositionPriceDiff).toFixed(precision));
      payload.volumeList.push(availableBalance);
    });

    window.td_socket.emit('json', { type: 'sendOrders', payload });
  }
}

