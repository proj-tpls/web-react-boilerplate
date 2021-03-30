import tableColumnsData from './tableColumns';

const hasOwnProperty = Object.prototype.hasOwnProperty;

function tryGetTableColumnsData() {
  let tableColumns;
  try {
    const s = localStorage.getItem('kingfisher_table_columns');
    if (s) {
      tableColumns = JSON.parse(s);
    }
    else {
      tableColumns = initTableColumnsData();
    }
  }
  catch(e) {
    tableColumns = initTableColumnsData();
  }

  return tableColumns;
}

function initTableColumnsData() {
  const tableColumns = {};
  for (let tabKey in tableColumnsData) {
    tableColumns[tabKey] = tableColumnsData[tabKey].map(column => column.dataIndex);
  }
  return tableColumns;
}

function trySaveTableColumnsData(data) {
  const tableColumns = tryGetTableColumnsData();
  for (let key in data) {
    tableColumns[key] = data[key];
  }

  try {
    localStorage.setItem('kingfisher_table_columns', JSON.stringify(tableColumns));
    return true;
  }
  catch(e) {}
}

function isShortcutKeyExists(key, ) {
  const { getState } = window.g_app._store;
  const { workBench } = getState();
  const { usedKeys } = workBench;
  return usedKeys[key];
}

function getExchangeIdFromStockCode(stockCode, specialForZS = true) {
  // 深圳股票代码以“0”开头，其中“002”开头的是中小板，“000”开头的是主板，“3”开头的是创业板
  // 深圳B股代码是以200开头，新股申购的代码是以00开头，配股代码以080开头
  // 权证：深市是031打头
  if (/^[023]/.test(stockCode)) {
    if (specialForZS) {
      const { getState } = window.g_app._store;
      const { workBench } = getState();
      const { login } = workBench;
      if (login.success && login.data.brokerName && login.data.brokerName.indexOf('招商') !== -1) { // 招商证券的深圳交易所代码是2
        return '2';
      }
    }

    return '0';
  }
  // 上海股票代码以“6”开头，全部为沪市的主板
  // 上海B股代码是以900开头，新股申购的代码是以730开头，配股代码以700开头
  // 权证：沪市是580打头
  if (/^[6795]/.test(stockCode)) {
    return '1';
  }
  // 新三板挂牌的股票代码一般都是以400、430、830开头
  if (/^[48]/.test(stockCode)) {
    return '6';
  }
}

function getExchangeFromStockCode(stockCode, specialForZS = true) {
  // 深圳股票代码以“0”开头，其中“002”开头的是中小板，“000”开头的是主板，“3”开头的是创业板
  // 深圳B股代码是以200开头，新股申购的代码是以00开头，配股代码以080开头
  // 权证：深市是031打头
  let exchangeId = '', exchangeName = '', exchangeCode = '';
  if (/^0/.test(stockCode)) {
    exchangeName = '深圳A股';
    if (/^000/.test(stockCode)) {
      exchangeName = '深圳主板';
    }
    else if (/^002/.test(stockCode)) {
      exchangeName = '中小板';
    }
    else if (/^00/.test(stockCode)) {
      exchangeName = '深圳新股';
    }
    else if (/^080/.test(stockCode)) {
      exchangeName = '深圳配股';
    }
    else if (/^031/.test(stockCode)) {
      exchangeName = '深圳权证';
    }
    exchangeId = '0';
  }
  else if (/^3/.test(stockCode)) {
    exchangeName = '创业板';
    exchangeId = '0';
  }
  else if (/^200/.test(stockCode)) {
    exchangeName = '深圳B股';
    exchangeId = '0';
  }
  // 上海股票代码以“6”开头，全部为沪市的主板
  // 上海B股代码是以900开头，新股申购的代码是以730开头，配股代码以700开头
  // 权证：沪市是580打头
  else if (/^6/.test(stockCode)) {
    exchangeName = '上海A股';
    if (/^688/.test(stockCode)) {
      exchangeName = '科创板';
      exchangeId = '1';
    }
    exchangeId = '1';
  }
  else if (/^900/.test(stockCode)) {
    exchangeName = '上海B股';
    exchangeId = '1';
  }
  else if (/^730|732/.test(stockCode)) {
    exchangeName = '上海新股';
    exchangeId = '1';
  }
  else if (/^700/.test(stockCode)) {
    exchangeName = '上海配股';
    exchangeId = '1';
  }
  else if (/^580/.test(stockCode)) {
    exchangeName = '上海权证';
    exchangeId = '1';
  }
  // 新三板挂牌的股票代码一般都是以400、430、830开头
  else if (/^830|430|400/.test(stockCode)) {
    exchangeName = '新三板';
    exchangeId = '6';
  }

  if (exchangeId === '0') {
    exchangeCode = 'SZE';
    if (specialForZS) {
      const { getState } = window.g_app._store;
      const { workBench } = getState();
      const { login } = workBench;
      if (login.success && login.data.brokerName && login.data.brokerName.indexOf('招商') !== -1) { // 招商证券的深圳交易所代码是2
        exchangeId = '2';
      }
    }
  }
  else if (exchangeId === '1') {
    exchangeCode = 'SHE';
  }

  return { exchangeId, exchangeName, exchangeCode };
}

function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}

function shallowCompare(instance, nextProps, nextState) {
  return (
    !shallowEqual(instance.props, nextProps) ||
    !shallowEqual(instance.state, nextState)
  );
}

function toFixed(n, precision = 3) {
  try {
    return (+n).toFixed(precision);
  }
  catch(e) {}

  return n;
}

function toFixedNumber(n, precision = 3) {
  try {
    return +(+n).toFixed(precision);
  }
  catch(e) {}

  return +n;
}

function isNumber(n) {
  return typeof n === 'number';
}

function isString(s) {
  return typeof s === 'string';
}

function sleep(t) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), t);
  });
}

function isETF(stockCode) {
  return ['510300', '510050', '510500'].includes(stockCode);
}

export default {
  tryGetTableColumnsData,
  trySaveTableColumnsData,
  toFixed,
  toFixedNumber,
  isNumber,
  isString,
  isShortcutKeyExists,
  getExchangeFromStockCode,
  getExchangeIdFromStockCode,
  shallowEqual,
  shallowCompare,
  sleep,
  isETF
}
