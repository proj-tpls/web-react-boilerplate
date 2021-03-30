import React from 'react';
import { message } from 'antd';
import { Form } from 'torenia';
import { connect } from 'dva';
import { label2code, code2label } from 'utils/keycode';
import { set } from 'utils/storage';
import ShortcutBase from '../shortcutBase';
import helper from 'utils/helper';

import styles from './index.css';

class ShortcutCancelOrder extends ShortcutBase {

  constructor(props) {
    super(props);
    // this.formRef = React.createRef();
  }

  onCancelAllKeyDown = (e) => {
    this.handleKeyDown(e, 'cancelAll', this.formRef.props.form);
  }

  onCancelLatestKeyDown = (e) => {
    this.handleKeyDown(e, 'cancelLatest', this.formRef.props.form);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { workBench } = this.props;
    const { shortcut } = workBench;
    const { cancelAll, cancelLatest } = shortcut;

    return !helper.shallowEqual(cancelAll, nextProps.workBench.shortcut.cancelAll) ||
      !helper.shallowEqual(cancelLatest, nextProps.workBench.shortcut.cancelLatest);
  }

  get formProps() {
    const { workBench } = this.props;
    const { shortcut } = workBench;
    const originalCancelAll = shortcut.cancelAll && code2label(shortcut.cancelAll);
    const originalCancelLatest = shortcut.cancelLatest && code2label(shortcut.cancelLatest);

    return {
      // ref: this.formRef,
      wrappedComponentRef: ref => this.formRef = ref,
      className: styles.settingForm,
      itemLayout: {
        labelCol: {
          span: 12
        },
        wrapperCol: {
          span: 12
        },
      },
      defaultValue: {
        cancelAll: originalCancelAll,
        cancelLatest: originalCancelLatest
      },
      fields: [
        {
          name: 'cancelAll',
          label: '撤全部',
          placeholder: '快捷键',
          className: styles.input,
          onKeyDown: this.onCancelAllKeyDown,
          itemProps: {
            labelAlign: 'left',
          },
          // decorator: {
          //   rules: [
          //     { required: true, message: '请输入快捷键' },
          //   ],
          // },
          allowClear: true
        },
        {
          name: 'cancelLatest',
          label: '撤最近一笔委托',
          placeholder: '快捷键',
          className: styles.input,
          onKeyDown: this.onCancelLatestKeyDown,
          itemProps: {
            labelAlign: 'left',
          },
          // decorator: {
          //   rules: [
          //     { required: true, message: '请输入快捷键' },
          //   ],
          // },
          allowClear: true
        },
      ],
      onSubmit: ({ cancelAll, cancelLatest }) => {
        if (cancelAll === originalCancelAll && cancelLatest === originalCancelLatest) {
          message.success('保存完成');
          return;
        }

        shortcut.cancelAll = cancelAll ? label2code(cancelAll) : '';
        shortcut.cancelLatest = cancelLatest ? label2code(cancelLatest) : '';

        set('shortcut', shortcut) ?  message.success('保存完成') : message.error('保存失败');
      },
      submitText: '保存',
      // opBtn: false
    };
  }

  render() {
    return (
      <Form {...this.formProps} />
    );
  }
}

export default connect((model) => (model))(ShortcutCancelOrder);
