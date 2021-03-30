import Dict from 'microdict';

// 下单所用
export const Direction = new Dict(
  { alias: 'BUY', text: '证券买入', value: '0' },
  { alias: 'SELL', text: '证券卖出', value: '1' },
);

// 为下单快捷键设置所用
export const OrderingPriceType = new Dict(
  // { alias: 'ASK_PRICE1', text: '卖五价', value: 'askPrice5' },
  // { alias: 'ASK_PRICE2', text: '卖四价', value: 'askPrice4' },
  // { alias: 'ASK_PRICE3', text: '卖三价', value: 'askPrice3' },
  // { alias: 'ASK_PRICE4', text: '卖二价', value: 'askPrice2' },
  { alias: 'ASK_PRICE5', text: '卖一价', value: 'askPrice1' },
  { alias: 'BID_PRICE1', text: '买一价', value: 'bidPrice1' },
  // { alias: 'BID_PRICE2', text: '买二价', value: 'bidPrice2' },
  // { alias: 'BID_PRICE3', text: '买三价', value: 'bidPrice3' },
  // { alias: 'BID_PRICE4', text: '买四价', value: 'bidPrice4' },
  // { alias: 'BID_PRICE5', text: '买五价', value: 'bidPrice5' },
  { alias: 'LAST_PRICE', text: '最新价', value: 'lastPrice' },
  { alias: 'MARKET_PRICE', text: '市价', value: 'marketPrice' },
  { alias: 'UPPER_LIMIT_PRICE', text: '涨停价', value: 'upperLimitPrice' },
  { alias: 'LOWER_LIMIT_PRICE', text: '跌停价', value: 'lowerLimitPrice' },
);

// 为下单快捷键设置所用
export const OrderingDirection = new Dict(
  { alias: 'BUY', text: '买', value: 'buy' },
  { alias: 'SELL', text: '卖', value: 'sell' },
);

// 为下单快捷键设置所用
export const OrderingAction = new Dict(
  { alias: 'NEED_ENSURE', text: '发出报单(带确认)', value: 'needEnsure' },
  { alias: 'NO_ENSURE', text: '发出报单(不带确认)', value: 'noEnsure' },
);

// 持仓方向
export const PositionDirection = new Dict(
  { alias: 'LONG', text: '多', value: '0' },
  { alias: 'SHORT', text: '空', value: '1' },
);
