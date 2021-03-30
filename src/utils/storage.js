const PREFIX = 'kingfisher_';
const toString = Object.prototype.toString;

/**
 * 1. 根据forceStorage判断是否强制从localStorage中取
 * 2. 若forceStorage为false, 先从store的workBench中取, 若取到直接返回值; 否则从localStorage取, 若取到则往store的workBench中再同步一下值, 最后返回值
 * @param {String} key
 * @param {Boolean} forceStorage
 */
export function get(key, forceStorage = false) {
  const { dispatch, getState } = window.g_app._store;
  const { workBench } = getState();
  const originalData = workBench[key];
  if (!forceStorage && isNotUndefined(originalData)) {
    return originalData;
  }

  let data;
  const underlineKey = underline(key);
  try {
    const s = localStorage.getItem(PREFIX + underlineKey);
    if (s) {
      data = JSON.parse(s);
      replaceBoolean(data);
    }
  }
  catch(e) {}

  if (isNotUndefined(data)) {
    if (isNotUndefined(originalData) && isPlainObject(originalData) && isPlainObject(data)) {
      data = { ...originalData, ...data };
    }
    dispatch({
      type: 'workBench/putState',
      payload: {
        [key]: data
      }
    });

    // 如果是快捷键, 则更新已使用的键值
    if (key === 'shortcut') {
      updateUserdKeys(data);
    }
  }

  return data;
}

/**
 * 把值存在localStorage中并根据参数saveToStore决定是否同步到store的workBench中
 * @param {String} key
 * @param {*} value
 * @param {Boolean} saveToStore
 */
export function set(key, value, saveToStore = true) {
  const underlineKey = underline(key);
  try {
    const s = JSON.stringify(value);
    if (s) {
      localStorage.setItem(PREFIX + underlineKey, s);
      if (saveToStore) {
        const { dispatch, getState } = window.g_app._store;
        const { workBench } = getState();
        const originalData = workBench[key];
        if (isNotUndefined(originalData) && isPlainObject(originalData) && isPlainObject(value)) {
          value = { ...originalData, ...value };
        }
        const data = {
          [key]: value
        };
        switch(key) {
          case 'defaultVolume': { // 修改默认股数时同步数据
            data.stockInput = {
              ...workBench.stockInput,
              volume: value.value
            };
            break;
          }
        }
        dispatch({
          type: 'workBench/putState',
          payload: data
        });

        // 如果是快捷键, 则更新已使用的键值
        if (key === 'shortcut') {
          updateUserdKeys(value);
        }
      }
      return true;
    }
  }
  catch(e) {}
}

/**
 * 从localStorage中取keys中的key对应的值并同步到store的workBench中
 * @param {Array} keys
 */
export function syncToStore(keys) {
  return keys.map(key => get(key, { forceStorage: true }));
}

/**
 * 替换字符串'true'、'false'为对应Boolean值
 * @param {Array|Object} data
 */
function replaceBoolean(data) {
  if (typeof data === 'object') {
    if (isArray(data)) { // array
      data.forEach(item => {
        replaceBoolean(item);
      });
    }
    else if (isPlainObject(data)) { // plain object
      for (let k in data) {
        if (data[k] === 'true') {
          data[k] = true;
        }
        else if (data[k] === 'false') {
          data[k] = false;
        }
      }
    }
  }
}

function updateUserdKeys(data) {
  const { dispatch } = window.g_app._store;
  const {
    volumeIncrease,
    volumeDecrease,
    cancelAll,
    cancelLatest,
    oneKeyClearPosition,
    oneKeyClearPositionForSelectedStock,
    sendOrder
  } = data;

  const keys = {
    'F2': true,
    'F4': true,
    'F5': true,
    'F9': true,
    'KeyQ': true,
  };

  volumeIncrease && (keys[volumeIncrease] = true);
  volumeDecrease && (keys[volumeDecrease] = true);
  cancelAll && (keys[cancelAll] = true);
  cancelLatest && (keys[cancelLatest] = true);
  oneKeyClearPosition && (keys[oneKeyClearPosition] = true);
  oneKeyClearPositionForSelectedStock && (keys[oneKeyClearPositionForSelectedStock] = true);
  for (let k in sendOrder) {
    keys[k] = true;
  }

  dispatch({
    type: 'workBench/putState',
    payload: {
      usedKeys: keys
    }
  });
}

function isNotUndefined(data) {
  return typeof data !== 'undefined';
}

function isPlainObject(data) {
  return toString.call(data) === '[object Object]';
}

function isArray(data) {
  return toString.call(data) === '[object Array]';
}

// 驼峰化拼接, abc_def -> abcDef
function camelize(s) {
  return s.replace(/_([a-zA-Z])/g, function(m, n) {
    return n.toUpperCase();
  });
}

// 下划线拼接, abcDef -> abc_def
function underline(s) {
  return s.replace(/[A-Z]/g, function(m) {
    return '_' + m.toLowerCase();
  });
}
