import React, { Component } from 'react';
import { message } from 'antd';
import { parseKeyboardEvent, label2code, code2label } from 'utils/keycode';
import helper from 'utils/helper';


class ShortcutBase extends Component {

  constructor(props) {
    super(props);
    // this.formRef = React.createRef();
  }

  handleKeyDown = (e, propertyName, form) => {
    e.preventDefault();
    e.stopPropagation();

    // const { dispatch, workBench } = this.props;
    // const { usedKeys } = workBench;

    // const keys = { ...usedKeys };

    const downKey = parseKeyboardEvent(e);

    // const originalKeyLabel = form.getFieldValue(propertyName);

    // if (originalKeyLabel === downKey.label) {
    //   return;
    // }

    // if (helper.isShortcutKeyExists(downKey.code)) {
    //   message.error(`快捷键( ${downKey.label} )冲突, 换一个试试`, 1);
    //   return;
    // }

    form.setFieldsValue({
      [propertyName]: downKey.label
    });

    // delete keys[label2code(originalKeyLabel)];

    // dispatch({
    //   type: 'workBench/putState',
    //   payload: {
    //     usedKeys: {
    //       ...keys,
    //       [downKey.code]: true
    //     }
    //   }
    // });
  }

}

export default ShortcutBase;
