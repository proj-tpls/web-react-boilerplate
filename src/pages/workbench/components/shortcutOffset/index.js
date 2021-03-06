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
          label: <span>????????????????????? <Tooltip title="????????????????????????"><Icon type="question-circle" /></Tooltip></span>,
          placeholder: '?????????',
          className: styles.input,
          onKeyDown: this.onOneKeyClearPositionKeyDown,
          itemProps: {
            labelAlign: 'left',
          },
          // decorator: {
          //   rules: [
          //     { required: true, message: '??????????????????' },
          //   ],
          // },
          allowClear: true
        },
        {
          name: 'oneKeyClearPositionForSelectedStock',
          label: <span>?????????????????????????????? <Tooltip title="???????????????????????????????????????????????????"><Icon type="question-circle" /></Tooltip></span>,
          placeholder: '?????????',
          className: styles.input,
          onKeyDown: this.onOneKeyClearPositionForSelectedStockKeyDown,
          itemProps: {
            labelAlign: 'left',
          },
          // decorator: {
          //   rules: [
          //     { required: true, message: '??????????????????' },
          //   ],
          // },
          allowClear: true
        },
        {
          name: 'clearPositionPriceType',
          label: '??????????????????',
          placeholder: '????????????',
          widget: 'Select',
          className: styles.input,
          options: OrderingPriceType.toCheckboxArray(),
          itemProps: {
            labelAlign: 'left',
          },
          // decorator: {
          //   rules: [
          //     { required: true, message: '??????????????????' },
          //   ],
          // },
          allowClear: true
        },
        {
          name: 'clearPositionPriceDiff',
          label: '??????????????????(???)',
          placeholder: '?????????',
          widget: 'InputNumber',
          className: styles.input,
          step: shortcut.priceStep || 0.01,
          itemProps: {
            labelAlign: 'left',
          },
          // decorator: {
          //   rules: [
          //     { pattern: /^-?\d*(\.\d*)?$/, message: '?????????????????????' }
          //   ],
          // },
          // formatter: value => `${value} ???`,
          // parser: value => value.replace(/\s???/, ''),
        },
      ],
      onSubmit: ({ oneKeyClearPosition, oneKeyClearPositionForSelectedStock, clearPositionPriceType, clearPositionPriceDiff }) => {

        shortcut.oneKeyClearPosition = oneKeyClearPosition ? label2code(oneKeyClearPosition) : '';
        shortcut.oneKeyClearPositionForSelectedStock = oneKeyClearPositionForSelectedStock ? label2code(oneKeyClearPositionForSelectedStock) : '';
        shortcut.clearPositionPriceType = clearPositionPriceType;
        shortcut.clearPositionPriceDiff = clearPositionPriceDiff;

        set('shortcut', shortcut) ?  message.success('????????????') : message.error('????????????');
      },
      submitText: '??????',
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
