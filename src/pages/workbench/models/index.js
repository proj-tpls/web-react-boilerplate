// import { changeUsername } from '../services';
import helper from 'utils/helper';

export default {
  namespace: 'workBench',

  state: {
    settingModalVisiable: false,
    loginModalVisiable: false,
    loginFormSpinning: false,
    status: {},
    tradeServers: {},
    tableHeaderDict: {},
    selectedTradeServerIndex: undefined,
    shareHolderCode: {}, // 登录后交易服务器返回的股东代码列表
    capital: {},
    login: {},
    tdConnected: false,
    mdConnected: false,
    isLogin: false,
    dayOrders: {},
    dayTrades: {},
    cancelableOrders: {},
    position: {},
    doTPosition: {}, // 做T持仓
    leftPaneActiveKey: 'dayOrders',
    rightPaneActiveKey: 'dayTrades',
    // activePaneTabKey: 'dayOrders', // 点击设置tab中表格列头弹框时对应的激活的tab key
    // tableColumnsModalVisiable: false, // 用于设置tab中表格列头的弹框可见性
    tableColumns: helper.tryGetTableColumnsData(), // 存储tab中表格列头设置
    level2Quote: {},
    commonQuotes: {},
    deepQuotes: {},
    selectedStock: null,
    stockInput: {
      stockCode: '',
      volume: 100,
      price: 0,
      shareHolderCode: undefined, // 选择的股东代码
      // 启用快捷键下单, 该值存在的目的是为了防止误操作
      enableShortcut: true,
      // 启动做T限制, 开启后做T交易下单数量受持仓限制
      enableDoT: true
    },
    // 设置
    // 默认交易股数
    defaultVolume: {
      value: 100
    },
    // 常规设置
    commonSetting: {
      doubleClickCancelOrder: true,
      autoMaxVolumeOrderingWhenBuy: true,
      autoMaxVolumeOrderingWhenSell: true,
      leastCommissionPerTime: 5,
      stampTaxRatio: 0.001,
      commissionRatio: 0.0003,
      transferFeeRadio: 0.00002,
      stampTaxTwoSide: false,
      commissionRatioTwoSide: true,
      leastCommissionPerTimeTwoSide: true,
      transferFeeRadioTwoSide: true,
    },
    // 自选股
    optionalStocks: {},
    // 快捷键
    shortcut: {
      volumeIncrease: 'ArrowRight',
      volumeDecrease: 'ArrowLeft',
      volumeStep: 100,
      priceIncrease: 'ArrowUp',
      priceDecrease: 'ArrowDown',
      priceStep: 0.01,
      cancelAll: 'NumpadAdd',
      cancelLatest: 'NumpadSubtract',
      oneKeyClearPosition: 'NumpadDivide',
      oneKeyClearPositionForSelectedStock: 'NumpadMultiply',
      clearPositionPriceType: 'lastPrice',
      clearPositionPriceDiff: 0.1,
      sendOrder: {
        'Numpad1': {
          shortcutKey: 'Numpad1',
          direction: 'buy',
          priceType: 'bidPrice1',
          priceDiff: -0.01,
          action: 'noEnsure'
        },
        'Numpad3': {
          shortcutKey: 'Numpad3',
          direction: 'sell',
          priceType: 'askPrice1',
          priceDiff: 0.01,
          action: 'noEnsure'
        },
        'Numpad4': {
          shortcutKey: 'Numpad4',
          direction: 'buy',
          priceType: 'bidPrice1',
          priceDiff: 0,
          action: 'noEnsure'
        },
        'Numpad6': {
          shortcutKey: 'Numpad6',
          direction: 'sell',
          priceType: 'askPrice1',
          priceDiff: 0,
          action: 'noEnsure'
        },
        'Numpad7': {
          shortcutKey: 'Numpad7',
          direction: 'buy',
          priceType: 'bidPrice1',
          priceDiff: 0.01,
          action: 'noEnsure'
        },
        'Numpad9': {
          shortcutKey: 'Numpad9',
          direction: 'sell',
          priceType: 'askPrice1',
          priceDiff: -0.01,
          action: 'noEnsure'
        }
      },
    },
    usedKeys: { // 已使用的键值
      NumpadAdd: true,
      NumpadSubtract: true,
      NumpadDivide: true,
      NumpadMultiply: true,
      Numpad1: true,
      Numpad3: true,
      Numpad4: true,
      Numpad6: true,
      Numpad7: true,
      Numpad9: true,
      ArrowUp: true,
      ArrowDown: true,
      ArrowLeft: true,
      ArrowRight: true,
      KeyB: true,
      KeyS: true,
      KeyQ: true,
      F2: true,
      F4: true,
      F5: true,
      F9: true,
    },
  },

  effects: {
    *changeUsername({ payload }, { call, put }) {
      const res = yield call(changeUsername, payload);
      if (isSuccess(res)) {
        return res.data;
      }
    },
  },

  reducers: {
    resetState(state) {
      return {
        ...state,
        loginModalVisiable: false,
        loginFormSpinning: false,
        selectedTradeServerIndex: undefined,
        shareHolderCode: {},
        capital: {},
        login: {},
        isLogin: false,
        dayOrders: {},
        dayTrades: {},
        cancelableOrders: {},
        position: {},
      };
    },
    putState(state, { payload }) {
      return { ...state, ...payload };
    },
    putJson(state, { payload }) {
      if (payload.type) {
        return {
          ...state,
          [payload.type]: payload
        };
      }
      else {
        return { ...state, ...payload };
      }
    },
    putStatus(state, { payload }) {
      const payloadType = typeof payload;
      if (payloadType === 'string' || payloadType === 'number') {
        payload = {
          message: payload,
          type: 'info'
        };
      }
      else if (!payload.type) {
        payload.type = 'info';
      }
      return {
        ...state,
        status: payload
      };
    },
    putTableColumns(state, { payload }) {
      return {
        ...state,
        tableColumns: {
          ...state.tableColumns,
          ...payload
        }
      };
    },
    putOptionalStocks(state, { payload }) {
      const { optionalStocks, login } = state;

      const newOptionalStocks = { ...optionalStocks };

      if (login.success) {
        const userId = login.data.userId;
        // const stockCodes = Object.keys(optionalStocks).sort((a, b) => a > b ? 1 : -1);
        // while (stockCodes.length > 9) { // 保证最多只能添加10只股票
        //   const lastStockCode = stockCodes.pop();
        //   if (lastStockCode) {
        //     delete optionalStocks[lastStockCode];
        //   }
        // }

        for (let stockCode in payload) {
          newOptionalStocks[stockCode] = payload[stockCode];
        }
        localStorage.setItem(`kingfisher_${userId}_optionalstocks`, JSON.stringify(newOptionalStocks));
        // 添加自选股成功后 要往行情服务器发送订阅对应股票行情的
        const stocks = Object.keys(newOptionalStocks).join(',');

        window.md_socket.emit('json', {
          type: 'deepQuotes',
          payload: {
            stockCodes: stocks,
            userId
          }
        });

        // window.md_socket.emit('json', {
        //   type: 'commonQuotes',
        //   payload: stocks
        // });
      }
      return {
        ...state,
        optionalStocks: newOptionalStocks
      }
    },
    removeOptionStocks(state, { payload }) {
      const { optionalStocks, login, deepQuotes } = state;

      const newOptionalStocks = { ...optionalStocks };
      const newDeepQuotes = { ...deepQuotes };

      if (login.success) {
        const userId = login.data.userId;
        delete newOptionalStocks[payload.stockCode];
        localStorage.setItem(`kingfisher_${userId}_optionalstocks`, JSON.stringify(newOptionalStocks));

        const stocks = Object.keys(newOptionalStocks).join(',');

        window.md_socket.emit('json', {
          type: 'deepQuotes',
          payload: {
            stockCodes: stocks,
            userId
          }
        });

        if (newDeepQuotes.success) {
          delete newDeepQuotes.data[payload.stockCode];
        }
        // window.md_socket.emit('json', {
        //   type: 'commonQuotes',
        //   payload: stocks
        // });
      }

      return {
        ...state,
        optionalStocks: newOptionalStocks,
        deepQuotes: newDeepQuotes
      }
    },
    removeAllOptionStocks(state) {
      const { login } = state;

      const newOptionalStocks = {};

      if (login.success) {
        const userId = login.data.userId;
        localStorage.setItem(`kingfisher_${userId}_optionalstocks`, JSON.stringify(newOptionalStocks));

        const stocks = Object.keys(newOptionalStocks).join(',');

        window.md_socket.emit('json', {
          type: 'deepQuotes',
          payload: {
            stockCodes: stocks,
            userId
          }
        });
        // window.md_socket.emit('json', {
        //   type: 'commonQuotes',
        //   payload: stocks
        // });
      }

      return {
        ...state,
        optionalStocks: newOptionalStocks,
        deepQuotes: {}
      }
    }
  },
};
