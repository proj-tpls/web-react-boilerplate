import { Direction, PositionDirection } from 'utils/dict';
import helper from './helper';

const cancelableOrders = [
  {
    title: '委托编号',
    dataIndex: 'orderId',
    width: 60,
  },
  {
    title: '委托日期',
    dataIndex: 'orderDate',
    width: 60,
  },
  // {
  //   title: '操作日期',
  //   dataIndex: 'actionDate',
  //   width: 60,
  // },
  {
    title: '委托时间',
    dataIndex: 'orderTime',
    width: 60,
  },
  {
    title: '证券代码',
    dataIndex: 'stockCode',
    width: 60,
  },
  {
    title: '证券名称',
    dataIndex: 'stockName',
    width: 60,
  },
  {
    title: '委托状态',
    dataIndex: 'orderStatus',
    width: 60,
  },
  {
    title: '买卖',
    dataIndex: 'direction',
    width: 60,
  },
  {
    title: '委托价格',
    dataIndex: 'orderPrice',
    width: 60,
  },
  {
    title: '委托数量',
    dataIndex: 'orderVolume',
    width: 60,
  },
  {
    title: '成交量',
    dataIndex: 'tradedVolume',
    width: 60,
  },
  {
    title: '撤单量',
    dataIndex: 'cancelVolume',
    width: 60,
  },
  {
    title: '股东代码',
    dataIndex: 'shareHolderCode',
    width: 60,
  },
];

const capital = [
  {
    title: '账号',
    dataIndex: 'userId',
    width: 60,
  },
  // {
  //   title: '币种',
  //   dataIndex: 'currency',
  //   width: 60,
  // },
  {
    title: '余额',
    dataIndex: 'balance',
    width: 60,
  },
  {
    title: '可用资金',
    dataIndex: 'available',
    width: 60,
  },
  {
    title: '冻结资金',
    dataIndex: 'frozen',
    width: 60,
  },
  {
    title: '可取资金',
    dataIndex: 'desirable',
    width: 60,
  },
  {
    title: '参考市值',
    dataIndex: 'marketValue',
    width: 60,
  },
  // {
  //   title: '手续费',
  //   dataIndex: 'commission',
  //   width: 60,
  // },
  {
    title: '总资产',
    dataIndex: 'total',
    width: 60,
  },
  {
    title: '融资负债',
    dataIndex: 'financingDebt',
    width: 60,
  },
  {
    title: '融券市值',
    dataIndex: 'slMarket', // securities loan
    width: 60,
  },
];

const dayOrders = [
  {
    title: '委托编号',
    dataIndex: 'orderId',
    width: 60,
  },
  {
    title: '证券代码',
    dataIndex: 'stockCode',
    width: 60,
  },
  {
    title: '证券名称',
    dataIndex: 'stockName',
    width: 60,
  },
  {
    title: '买卖',
    dataIndex: 'direction',
    width: 60,
  },
  {
    title: '委托价格',
    dataIndex: 'orderPrice',
    width: 60,
  },
  {
    title: '委托数量',
    dataIndex: 'orderVolume',
    width: 60,
  },
  {
    title: '成交量',
    dataIndex: 'tradedVolume',
    width: 60,
  },
  {
    title: '成交额',
    dataIndex: 'turnover',
    width: 60,
    render: text => convertNumber(text),
  },
  {
    title: '成交均价',
    dataIndex: 'tradedAvgPrice',
    width: 60,
  },
  {
    title: '委托状态',
    dataIndex: 'orderStatus',
    width: 60,
  },
  {
    title: '委托时间',
    dataIndex: 'orderTime',
    width: 60,
  },
  {
    title: '股东代码',
    dataIndex: 'shareHolderCode',
    width: 60,
  },
  {
    title: '交易市场',
    dataIndex: 'tradingMarket',
    width: 60,
  },
];

const dayTrades = [
  {
    title: '委托编号',
    dataIndex: 'orderId',
    width: 60,
  },
  {
    title: '成交编号',
    dataIndex: 'tradeId',
    width: 60,
  },
  {
    title: '成交时间',
    dataIndex: 'tradedTime',
    width: 60,
  },
  {
    title: '证券代码',
    dataIndex: 'stockCode',
    width: 60,
  },
  {
    title: '证券名称',
    dataIndex: 'stockName',
    width: 60,
  },
  {
    title: '买卖',
    dataIndex: 'direction',
    width: 60,
    render: text => Direction.getTextFromValue(text),
  },
  {
    title: '成交价',
    dataIndex: 'tradedPrice',
    width: 60,
  },
  {
    title: '成交量',
    dataIndex: 'tradedVolume',
    width: 60,
  },
  {
    title: '成交额',
    dataIndex: 'turnover',
    width: 60,
    render: text => convertNumber(text),
  },
  {
    title: '股东代码',
    dataIndex: 'shareHolderCode',
    width: 60,
  },
  {
    title: '交易市场',
    dataIndex: 'tradingMarket',
    width: 60,
  },
];

const position = [
  {
    title: '证券代码',
    dataIndex: 'stockCode',
    width: 60,
  },
  {
    title: '证券名称',
    dataIndex: 'stockName',
    width: 60,
  },
  {
    title: '持股',
    dataIndex: 'position',
    width: 60,
  },
  {
    title: '可用余额',
    dataIndex: 'availableBalance',
    width: 60,
  },
  {
    title: '买入冻结',
    dataIndex: 'buyFrozen',
    width: 60,
  },
  {
    title: '卖出冻结',
    dataIndex: 'sellFrozen',
    width: 60,
  },
  {
    title: '参考盈亏',
    dataIndex: 'referencePL',
    width: 60,
    render: text => calcColor(text)
  },
  {
    title: '盈亏比例',
    dataIndex: 'plRatio',
    width: 60,
    render: text => calcColor(text)
  },
  {
    title: '市场价格',
    dataIndex: 'marketValue',
    width: 60,
  },
  {
    title: '参考成本价',
    dataIndex: 'referenceCostPrice',
    width: 60,
  },
  {
    title: '参考市值',
    dataIndex: 'referenceMarketPrice',
    width: 60,
  },
  {
    title: '股份余额',
    dataIndex: 'shareBalance',
    width: 60,
  },
  {
    title: '股东代码',
    dataIndex: 'shareHolderCode',
    width: 60,
  },
  {
    title: '交易市场',
    dataIndex: 'tradingMarket',
    width: 60,
  },
];

const commonQuotes = [
  {
    title: '证券代码',
    dataIndex: 'stockCode',
    width: 60,
  },
  // {
  //   title: '市场代码',
  //   dataIndex: 'marketCode',
  //   width: 60,
  // },
  {
    title: '最新价',
    dataIndex: 'lastPrice',
    width: 60,
    render: (text, item) => calcColor(text, item),
  },
  {
    title: '昨收价',
    dataIndex: 'preClosePrice',
    width: 60,
    render: (text, item) => helper.toFixed(text, helper.isETF(item.stockCode) ? 3 : 2),
  },
  {
    title: '买一价',
    dataIndex: 'bidPrice1',
    width: 60,
    render: (text, item) => calcColor(text, item),
  },
  {
    title: '买一量',
    dataIndex: 'bidVolume1',
    width: 60,
    render: text => (text / 100).toFixed(0), // 手, 1手100股
  },
  {
    title: '卖一价',
    dataIndex: 'askPrice1',
    width: 60,
    render: (text, item) => calcColor(text, item),
  },
  {
    title: '卖一量',
    dataIndex: 'askVolume1',
    width: 60,
    render: text => (text / 100).toFixed(0),
  },
  {
    title: '开盘价',
    dataIndex: 'open',
    width: 60,
    render: (text, item) => calcColor(text, item),
  },
  {
    title: '收盘价',
    dataIndex: 'close',
    width: 60,
    render: (text, item) => calcColor(text, item),
  },
  {
    title: '最高价',
    dataIndex: 'high',
    width: 60,
    render: (text, item) => calcColor(text, item),
  },
  {
    title: '最低价',
    dataIndex: 'low',
    width: 60,
    render: (text, item) => calcColor(text, item),
  },
  {
    title: '成交量',
    dataIndex: 'volume',
    width: 60,
    render: text => convertNumber(text / 100) + '手',
  },
  {
    title: '成交额',
    dataIndex: 'turnover',
    width: 60,
    render: text => convertNumber(text),
  },
  {
    title: '涨跌幅',
    dataIndex: 'priceLimit',
    width: 60,
    render: text => calcColor(helper.toFixed(text, 2) + '%'),
  },
  {
    title: '涨跌',
    dataIndex: 'riseAndFall',
    width: 60,
    render: (text, item) => helper.toFixed(text, helper.isETF(item.stockCode) ? 3 : 2),
  },
  {
    title: '振幅',
    dataIndex: 'amplitude',
    width: 60,
    render: text => helper.toFixed(text, 2) + '%',
  },
  {
    title: '总买量',
    dataIndex: 'totalBuyVolume',
    width: 60,
    render: text => convertNumber(text / 100) + '手',
  },
  {
    title: '总卖量',
    dataIndex: 'totalSellVolume',
    width: 60,
    render: text => convertNumber(text / 100) + '手',
  },
  {
    title: '买均价',
    dataIndex: 'avgBuyPrice',
    width: 60,
    render: (text, item) => helper.toFixed(text, helper.isETF(item.stockCode) ? 4 : 3),
  },
  {
    title: '卖均价',
    dataIndex: 'avgSellPrice',
    width: 60,
    render: (text, item) => helper.toFixed(text, helper.isETF(item.stockCode) ? 4 : 3),
  },
  {
    title: '流入资金',
    dataIndex: 'inflowFunds',
    width: 60,
    render: text => convertNumber(text),
  },
  {
    title: '流出资金',
    dataIndex: 'outflowFunds',
    width: 60,
    render: text => convertNumber(text),
  },
  {
    title: '内盘',
    dataIndex: 'inner',
    width: 60,
    render: text => convertNumber(text / 100),
  },
  {
    title: '外盘',
    dataIndex: 'outer',
    width: 60,
    render: text => convertNumber(text / 100),
  },
  {
    title: '换手率',
    dataIndex: 'turnoverRate',
    width: 60,
    render: text => helper.toFixed(text, 2) + '%',
  },
  // {
  //   title: '静态市盈率',
  //   dataIndex: 'silentPERatio',
  //   width: 60,
  //   render: (text, item) => helper.toFixed(text, helper.isETF(item.stockCode) ? 3 : 2),
  // },
  // {
  //   title: 'TTM市盈率',
  //   dataIndex: 'ttmPERatio',
  //   width: 60,
  //   render: (text, item) => helper.toFixed(text, helper.isETF(item.stockCode) ? 3 : 2),
  // },
  // {
  //   title: '动态市盈率',
  //   dataIndex: 'dynamicPERatio',
  //   width: 60,
  //   render: (text, item) => helper.toFixed(text, helper.isETF(item.stockCode) ? 3 : 2),
  // },
  {
    title: '涨停价',
    dataIndex: 'upperLimitPrice',
    width: 60,
    render: (text, item) => helper.toFixed(text, helper.isETF(item.stockCode) ? 3 : 2),
  },
  {
    title: '跌停价',
    dataIndex: 'lowerLimitPrice',
    width: 60,
    render: (text, item) => helper.toFixed(text, helper.isETF(item.stockCode) ? 3 : 2),
  },
  {
    title: '量比',
    dataIndex: 'volumeRatio',
    width: 60,
    render: text => helper.toFixed(text, 2),
  },
  {
    title: '委比',
    dataIndex: 'commitRatio',
    width: 60,
    render: text => helper.toFixed(text, 2),
  },
  {
    title: '昨日虚实度',
    dataIndex: 'preDelta',
    width: 60,
  }
];


const totalDayTrades = [
  {
    title: '证券代码',
    dataIndex: 'stockCode',
    width: 60,
  },
  {
    title: '证券名称',
    dataIndex: 'stockName',
    width: 60,
  },
  {
    title: '买入均价',
    dataIndex: 'avgBuyPrice',
    width: 60,
    render: (text, item) => helper.toFixed(text, helper.isETF(item.stockCode) ? 4 : 3),
  },
  {
    title: '卖出均价',
    dataIndex: 'avgSellPrice',
    width: 60,
    render: (text, item) => helper.toFixed(text, helper.isETF(item.stockCode) ? 4 : 3),
  },
  {
    title: '买入金额',
    dataIndex: 'buyAmount',
    width: 60,
    render: text => helper.toFixed(text, 2),
  },
  {
    title: '卖出金额',
    dataIndex: 'sellAmount',
    width: 60,
    render: text => helper.toFixed(text, 2),
  },
  {
    title: '买卖金额差',
    dataIndex: 'amountDiff',
    width: 60,
    render: text => helper.toFixed(text, 2),
  },
  {
    title: '手续费',
    dataIndex: 'commission',
    width: 60,
    render: text => helper.toFixed(text, 2),
  },
  {
    title: '做T数量',
    dataIndex: 'tVolume',
    width: 60,
    render: text => text.toFixed(0),
  },
  {
    title: '做T盈亏',
    dataIndex: 'tProfit',
    width: 60,
    render: text => calcColor(helper.toFixed(text, 2)),
  },
  {
    title: '做T手续费',
    dataIndex: 'tCommission',
    width: 60,
    render: text => helper.toFixed(text, 2),
  },
];

const dayPosition = [
  {
    title: '证券代码',
    dataIndex: 'stockCode',
    width: 60,
  },
  {
    title: '证券名称',
    dataIndex: 'stockName',
    width: 60,
  },
  {
    title: '仓位方向',
    dataIndex: 'direction',
    width: 60,
    render: text => PositionDirection.getTextFromValue(text),
  },
  {
    title: '持仓数量',
    dataIndex: 'volume',
    width: 60,
    // render: (text, item) => helper.toFixed(text, helper.isETF(item.stockCode) ? 3 : 2),
  },
  {
    title: '持仓均价',
    dataIndex: 'avgPrice',
    width: 60,
    render: (text, item) => helper.toFixed(text, helper.isETF(item.stockCode) ? 4 : 3),
  },
  {
    title: '最新价',
    dataIndex: 'lastPrice',
    width: 60,
    // render: (text, item) => calcColor(text, item),
  },
  {
    title: '涨跌幅',
    dataIndex: 'priceLimit',
    width: 60,
    render: text => calcColor(helper.toFixed(text, 2) + '%'),
  },
  {
    title: '浮动盈亏',
    dataIndex: 'dynamicPL',
    width: 60,
    render: (text, item) => calcColor(helper.toFixed(text, 2)),
  }
];


function convertNumber(n) {
  if (n > 1e13) {
    return (n / 1e13).toFixed(2) + '万亿';
  }
  if (n > 1e12) {
    return (n / 1e8).toFixed(0) + '亿';
  }
  // if (n > 1e11) {
  //   return (n / 1e11).toFixed(2) + '百亿';
  // }
  if (n > 1e8) {
    return (n / 1e8).toFixed(2) + '亿';
  }
  if (n > 1e7) {
    return (n / 10000).toFixed(0) + '万';
  }
  // if (n > 1e6) {
  //   return (n / 1e6).toFixed(2) + '百万';
  // }
  if (n > 10000) {
    return (n / 10000).toFixed(2) + '万';
  }

  return n;
}

const upColor = '#ea2705';
const downColor = '#07b707';

function calcColor(price, stock) {
  if (typeof stock === 'undefined') {
    let handledValue = +price.replace('%', ''); // /%$/.test(price) ? +price.replace('%', '') / 100 : +price;
    if (isNaN(handledValue)) { // 如果不是数字
      handledValue = 0;
      price = '';
    }
    return handledValue > 0 ? <span style={{ color: upColor }}>{price}</span> : (handledValue < 0 ? <span style={{ color: downColor }}>{price}</span> : price);
  }

  const fixedPrice = price.toFixed(helper.isETF(stock.stockCode) ? 3 : 2);
  if (price) {
    return price > stock.preClosePrice ? <span style={{ color: upColor }}>{fixedPrice}</span> : (price < stock.preClosePrice ? <span style={{ color: downColor }}>{fixedPrice}</span> : fixedPrice);
  }
  else {
    return fixedPrice;
  }
}

export default {
  // td
  capital,
  cancelableOrders,
  dayOrders,
  dayTrades,
  dayPosition,
  position,
  totalDayTrades,
  // md
  commonQuotes,
};
