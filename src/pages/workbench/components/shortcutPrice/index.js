import React from 'react';
import { message, Icon, Tooltip } from 'antd';
import { Form } from 'torenia';
import { connect } from 'dva';
import { label2code, code2label } from 'utils/keycode';
import { set } from 'utils/storage';
import ShortcutBase from '../shortcutBase';
import helper from 'utils/helper';

import styles from './index.css';

class ShortcutPrice extends ShortcutBase {

  constructor(props) {
    super(props);
    // this.formRef = React.createRef();
  }

  onIncreaseKeyDown = (e) => {
    this.handleKeyDown(e, 'priceIncrease', this.formRef.props.form);
  }

  onDecreaseKeyDown = (e) => {
    this.handleKeyDown(e, 'priceDecrease', this.formRef.props.form);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { workBench } = this.props;
    const { shortcut } = workBench;
    const { priceIncrease, priceDecrease, priceStep } = shortcut;

    return !helper.shallowEqual(priceIncrease, nextProps.workBench.shortcut.priceIncrease) ||
      !helper.shallowEqual(priceDecrease, nextProps.workBench.shortcut.priceDecrease) ||
      !helper.shallowEqual(priceStep, nextProps.workBench.shortcut.priceStep);
  }

  get formProps() {
    const { workBench } = this.props;
    const { shortcut } = workBench;
    const originalPriceIncrease = shortcut.priceIncrease && code2label(shortcut.priceIncrease);
    const originalPriceDecrease = shortcut.priceDecrease && code2label(shortcut.priceDecrease);
    const originalPriceStep = shortcut.priceStep;

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
        priceIncrease: originalPriceIncrease,
        priceDecrease: originalPriceDecrease,
        priceStep: originalPriceStep
      },
      fields: [
        {
          name: 'priceIncrease',
          label: <span>递增价格 <Tooltip title="每次按键以设置的调整步长加价格"><Icon type="question-circle" /></Tooltip></span>,
          placeholder: '快捷键',
          className: styles.input,
          onKeyDown: this.onIncreaseKeyDown,
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
          name: 'priceDecrease',
          label: <span>递减价格 <Tooltip title="每次按键以设置的调整步长减价格"><Icon type="question-circle" /></Tooltip></span>,
          placeholder: '快捷键',
          className: styles.input,
          onKeyDown: this.onDecreaseKeyDown,
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
          name: 'priceStep',
          label: <span>调整步长 <Tooltip title="每次按键以此步长值调整价格"><Icon type="question-circle" /></Tooltip></span>,
          placeholder: '步长',
          className: styles.input,
          itemProps: {
            labelAlign: 'left',
          },
          decorator: {
            rules: [
              // { required: true, message: '请输入步长' },
              { pattern: /^\d*(\.\d*)?$/, message: '数字格式不正确' }
            ],
          },
        },
      ],
      onSubmit: ({ priceIncrease, priceDecrease, priceStep }) => {
        priceStep = +priceStep;
        if (priceIncrease === originalPriceIncrease && priceDecrease === originalPriceDecrease && priceStep === originalPriceStep) {
          message.success('保存完成');
          return;
        }

        shortcut.priceIncrease = priceIncrease ? label2code(priceIncrease) : '';
        shortcut.priceDecrease = priceDecrease ? label2code(priceDecrease) : '';
        shortcut.priceStep = +priceStep;

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

export default connect((model) => (model))(ShortcutPrice);
