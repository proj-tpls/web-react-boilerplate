import { Empty } from "antd";

const keyCodes = {
  '3:110': {
    label: '小键盘 .',
    code: 'NumpadDecimal'
  },
  '3:107': {
    label: '小键盘 +',
    code: 'NumpadAdd'
  },
  '3:109': {
    label: '小键盘 -',
    code: 'NumpadSubtract'
  },
  '3:106': {
    label: '小键盘 *',
    code: 'NumpadMultiply'
  },
  '3:111': {
    label: '小键盘 /',
    code: 'NumpadDivide'
  },
  '3:13': {
    label: '小键盘 Enter',
    code: 'NumpadEnter'
  },
  '0:144': {
    label: 'NumLock',
    code: 'NumLock'
  },
  // NumLocks 关闭时 点击小键盘区
  // '3:45': {
  //   label: '小键盘 0',
  //   code: 'Numpad0'
  // },
  // '3:35': {
  //   label: '小键盘 1',
  //   code: 'Numpad1'
  // },
  // '3:40': {
  //   label: '小键盘 2',
  //   code: 'Numpad2'
  // },
  // '3:34': {
  //   label: '小键盘 3',
  //   code: 'Numpad3'
  // },
  // '3:37': {
  //   label: '小键盘 4',
  //   code: 'Numpad4'
  // },
  // '3:12': {
  //   label: '小键盘 5',
  //   code: 'Numpad5'
  // },
  // '3:39': {
  //   label: '小键盘 6',
  //   code: 'Numpad6'
  // },
  // '3:36': {
  //   label: '小键盘 7',
  //   code: 'Numpad7'
  // },
  // '3:38': {
  //   label: '小键盘 8',
  //   code: 'Numpad8'
  // },
  // '3:33': {
  //   label: '小键盘 9',
  //   code: 'Numpad9'
  // },
  // '3:46': {
  //   label: '小键盘 .',
  //   code: 'NumpadDecimal'
  // },
  // 主键区和小键盘中间区域
  '0:145': {
    label: 'ScrollLock',
    code: 'ScrollLock'
  },
  '0:19': {
    label: 'Pause',
    code: 'Pause'
  },
  '0:45': {
    label: 'Insert',
    code: 'Insert'
  },
  '0:36': {
    label: 'Home',
    code: 'Home'
  },
  '0:33': {
    label: 'PageUp',
    code: 'PageUp'
  },
  '0:46': {
    label: 'Delete',
    code: 'Delete'
  },
  '0:35': {
    label: 'End',
    code: 'End'
  },
  '0:34': {
    label: 'PageDown',
    code: 'PageDown'
  },
  '0:38': {
    label: '↑',
    code: 'ArrowUp'
  },
  '0:40': {
    label: '↓',
    code: 'ArrowDown'
  },
  '0:37': {
    label: '←',
    code: 'ArrowLeft'
  },
  '0:39': {
    label: '→',
    code: 'ArrowRight'
  },
  //
  '0:27': {
    label: 'Esc',
    code: 'Escape'
  },
  '0:32': {
    label: 'Space',
    code: 'Space'
  },
  '0:9': {
    label: 'Tab',
    code: 'Tab'
  },
  '0:192': {
    label: '`~',
    code: 'Backquote'
  },
  '0:20': {
    label: 'CapsLock',
    code: 'CapsLock'
  },
  '0:189': {
    label: '-—',
    code: 'Minus'
  },
  '0:187': {
    label: '=+',
    code: 'Equal'
  },
  '0:8': {
    label: 'Backspace',
    code: 'Backspace'
  },
  '0:219': {
    label: '[{',
    code: 'BracketLeft'
  },
  '0:221': {
    label: ']}',
    code: 'BracketRight'
  },
  '0:220': {
    label: '\\|',
    code: 'Backslash'
  },
  '0:186': {
    label: ';:',
    code: 'Semicolon'
  },
  '0:222': {
    label: '\'"',
    code: 'Quote'
  },
  '0:13': {
    label: 'Enter',
    code: 'Enter'
  },
  '0:188': {
    label: ',<',
    code: 'Comma'
  },
  '0:190': {
    label: '.>',
    code: 'Period'
  },
  '0:191': {
    label: '/?',
    code: 'Slash'
  },
  //
  '1:16': {
    label: 'ShiftLeft',
    code: 'ShiftLeft'
  },
  '1:17': {
    label: 'CtrlLeft',
    code: 'ControlLeft'
  },
  '1:91': {
    label: 'CmdLeft',
    code: 'MetaLeft'
  },
  '1:18': {
    label: 'AltLeft',
    code: 'AltLeft'
  },
  //
  '2:16': {
    label: 'ShiftRight',
    code: 'ShiftRight'
  },
  '2:17': {
    label: 'CtrlRight',
    code: 'ControlRight'
  },
  '0:93': {
    label: 'CmdRight',
    code: 'ContextMenu'
  },
  '2:18': {
    label: 'AltRight',
    code: 'AltRight'
  },
};
// chars
for (let i = 97; i < 123; i++) {
  const c = String.fromCharCode(i).toUpperCase();
  keyCodes['0:' + (i - 32)] = {
    label: c,
    code: 'Key' + c
  };
}

// numbers
for (let i = 48; i < 58; i++) {
  const n = i - 48;
  keyCodes['0:' + i] = {
    label: n,
    code: 'Digit' + n
  };
}

// F1 - F12
for (let i = 1; i < 13; i++) {
  const fn = 'F' + i;
  keyCodes['0:' + (i + 111)] = {
    label: fn,
    code: fn
  };
}

// numpad numbers
for (let i = 0; i < 10; i++) {
  keyCodes['3:' + (i + 96)] = {
    label: '小键盘 ' + i,
    code: 'Numpad' + i
  };
}

const labels = {}, codes = {};

for (let i in keyCodes) {
  const [location, keyCode] = i.split(':').map(item => +item);
  const data = keyCodes[i];
  data.location = location;
  data.keyCode = keyCode;
  codes[data.label] = data.code;
  labels[data.code] = data.label;
}

const empty = {
  label: '无效按键',
  keyCode: null,
  location: null,
  code: null
};

export function parseKeyboardEvent(e) {
  const location = e.location;
  const keyCode = e.which || e.keyCode || e.charCode;

  const key = location + ':' + keyCode;
  return keyCodes[key] || empty;
}

export function label2code(label) {
  return codes[label];
}

export function code2label(code) {
  return labels[code];
}
