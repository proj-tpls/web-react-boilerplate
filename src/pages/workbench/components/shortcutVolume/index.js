import React from 'react';
import { message, Icon, Tooltip } from 'antd';
import { Form } from 'torenia';
import { connect } from 'dva';
import { label2code, code2label } from 'utils/keycode';
import { set } from 'utils/storage';
import ShortcutBase from '../shortcutBase';
import helper from 'utils/helper';

import styles from './index.css';

class ShortcutVolume extends ShortcutBase {

  constructor(props) {
    super(props);
    // this.formRef = React.createRef();
  }

  onIncreaseKeyDown = (e) => {
    this.handleKeyDown(e, 'volumeIncrease', this.formRef.props.form);
  }

  onDecreaseKeyDown = (e) => {
    this.handleKeyDown(e, 'volumeDecrease', this.formRef.props.form);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { workBench } = this.props;
    const { shortcut } = workBench;
    const { volumeIncrease, volumeDecrease, volumeStep } = shortcut;

    return !helper.shallowEqual(volumeIncrease, nextProps.workBench.shortcut.volumeIncrease) ||
      !helper.shallowEqual(volumeDecrease, nextProps.workBench.shortcut.volumeDecrease) ||
      !helper.shallowEqual(volumeStep, nextProps.workBench.shortcut.volumeStep);
  }

  get formProps() {
    const { workBench } = this.props;
    const { shortcut } = workBench;
    const originalVolumeIncrease = shortcut.volumeIncrease && code2label(shortcut.volumeIncrease);
    const originalVolumeDecrease = shortcut.volumeDecrease && code2label(shortcut.volumeDecrease);
    const originalVolumeStep = shortcut.volumeStep;

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
        volumeIncrease: originalVolumeIncrease,
        volumeDecrease: originalVolumeDecrease,
        volumeStep: originalVolumeStep
      },
      fields: [
        {
          name: 'volumeIncrease',
          label: <span>递增股数 <Tooltip title="每次按键以设置的调整步长加股数"><Icon type="question-circle" /></Tooltip></span>,
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
          name: 'volumeDecrease',
          label: <span>递减股数 <Tooltip title="每次按键以设置的调整步长减股数"><Icon type="question-circle" /></Tooltip></span>,
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
          name: 'volumeStep',
          label: <span>调整步长 <Tooltip title="每次按键以此步长值调整股数"><Icon type="question-circle" /></Tooltip></span>,
          placeholder: '步长',
          className: styles.input,
          widget: 'InputNumber',
          step: 100,
          min: 0,
          itemProps: {
            labelAlign: 'left',
          },
          decorator: {
            rules: [
              // { required: true, message: '请输入步长' },
              { pattern: /^\d*$/, message: '数字格式不正确' }
            ],
          },
        },
      ],
      onSubmit: ({ volumeIncrease, volumeDecrease, volumeStep }) => {
        volumeStep = +volumeStep;
        if (volumeIncrease === originalVolumeIncrease && volumeDecrease === originalVolumeDecrease && volumeStep === originalVolumeStep) {
          message.success('保存完成');
          return;
        }

        shortcut.volumeIncrease = volumeIncrease ? label2code(volumeIncrease) : '';
        shortcut.volumeDecrease = volumeDecrease ? label2code(volumeDecrease) : '';
        shortcut.volumeStep = +volumeStep;

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

export default connect((model) => (model))(ShortcutVolume);
