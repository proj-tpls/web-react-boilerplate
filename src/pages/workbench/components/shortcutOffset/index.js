import React from 'react';
import { message, Icon, Tooltip } from 'antd';
import { Form } from 'torenia';
import { connect } from 'dva';
import { label2code, code2label } from 'utils/keycode';
import { set } from 'utils/storage';
import { OrderingPriceType } from 'utils/dict';
import ShortcutBase from '../shortcutBase';
import helper from 'utils/helper';

import styles from './index.css';


class ShortcutOffset extends ShortcutBase {

  constructor(props) {
    super(props);
    // this.formRef = React.createRef();
  }

  onOneKeyClearPositionKeyDown = (e) => {
    this.handleKeyDown(e, 'oneKeyClearPosition', this.formRef.props.form);
  }

  onOneKeyClearPositionForSelectedStockKeyDown = (e) => {
    this.handleKeyDown(e, 'oneKeyClearPositionForSelectedStock', this.formRef.props.form);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { workBench } = this.props;
    const { shortcut } = workBench;
    const { oneKeyClearPosition, oneKeyClearPositionForSelectedStock, clearPositionPriceType, clearPositionPriceDiff, priceStep } = shortcut;

    return !helper.shallowEqual(oneKeyClearPosition, nextProps.workBench.shortcut.oneKeyClearPosition) ||
      !helper.shallowEqual(oneKeyClearPositionForSelectedStock, nextProps.workBench.shortcut.oneKeyClearPositionForSelectedStock) ||
      !helper.shallowEqual(clearPositionPriceType, nextProps.workBench.shortcut.clearPositionPriceType) ||
      !helper.shallowEqual(clearPositionPriceDiff, nextProps.workBench.shortcut.clearPositionPriceDiff) ||
      !helper.shallowEqual(priceStep, nextProps.workBench.shortcut.priceStep);
  }

  get formProps() {
    const { workBench } = this.props;
    const { shortcut } = workBench;
    const originalOneKeyClearPosition = shortcut.oneKeyClearPosition && code2label(shortcut.oneKeyClearPosition);
    const originalOneKeyClearPositionForSelectedStock = shortcut.oneKeyClearPositionForSelectedStock && code2label(shortcut.oneKeyClearPositionForSelectedStock);
    const originalClearPositionPriceType = shortcut.clearPositionPriceType;
    const originalClearPositionPriceDiff = shortcut.clearPositionPriceDiff;

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
        oneKeyClearPosition: originalOneKeyClearPosition,
        oneKeyClearPositionForSelectedStock: originalOneKeyClearPositionForSelectedStock,
        clearPositionPriceType: originalClearPositionPriceType,
        clearPositionPriceDiff: originalClearPositionPriceDiff,
      },
      fields: [
        {
          name: 'oneKeyClearPosition',
          label: <span>一键清所有持股 <Tooltip title="委托卖掉所有持股"><Icon type="question-circle" /></Tooltip></span>,
          placeholder: '快捷键',
          className: styles.input,
          onKeyDown: this.onOneKeyClearPositionKeyDown,
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
          name: 'oneKeyClearPositionForSelectedStock',
          label: <span>一键清选中股所有持股 <Tooltip title="委托卖掉当前选中证券代码的所有持股"><Icon type="question-circle" /></Tooltip></span>,
          placeholder: '快捷键',
          className: styles.input,
          onKeyDown: this.onOneKeyClearPositionForSelectedStockKeyDown,
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
          name: 'clearPositionPriceType',
          label: '清股报单价格',
          placeholder: '价格类型',
          widget: 'Select',
          className: styles.input,
          options: OrderingPriceType.toCheckboxArray(),
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
          name: 'clearPositionPriceDiff',
          label: '报单价格调整(元)',
          placeholder: '多少元',
          widget: 'InputNumber',
          className: styles.input,
          step: shortcut.priceStep || 0.01,
          itemProps: {
            labelAlign: 'left',
          },
          // decorator: {
          //   rules: [
          //     { pattern: /^-?\d*(\.\d*)?$/, message: '数字格式不正确' }
          //   ],
          // },
          // formatter: value => `${value} 元`,
          // parser: value => value.replace(/\s元/, ''),
        },
      ],
      onSubmit: ({ oneKeyClearPosition, oneKeyClearPositionForSelectedStock, clearPositionPriceType, clearPositionPriceDiff }) => {

        shortcut.oneKeyClearPosition = oneKeyClearPosition ? label2code(oneKeyClearPosition) : '';
        shortcut.oneKeyClearPositionForSelectedStock = oneKeyClearPositionForSelectedStock ? label2code(oneKeyClearPositionForSelectedStock) : '';
        shortcut.clearPositionPriceType = clearPositionPriceType;
        shortcut.clearPositionPriceDiff = clearPositionPriceDiff;

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

export default connect((model) => (model))(ShortcutOffset);
