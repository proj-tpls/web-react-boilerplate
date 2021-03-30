import React, { Component, Fragment } from 'react';
import { message } from 'antd';
import { Form } from 'torenia';
import { connect } from 'dva';
import { set } from 'utils/storage';
import helper from 'utils/helper';

import styles from './index.css';

class DefaultVolume extends Component {

  constructor(props) {
    super(props);
    this.form = React.createRef();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { workBench } = this.props;
    const { defaultVolume } = workBench;
    return !helper.shallowEqual(defaultVolume, nextProps.workBench.defaultVolume);
  }

  get formProps() {
    const { workBench } = this.props;
    const { defaultVolume } = workBench;

    return {
      ref: this.form,
      className: styles.settingForm,
      itemLayout: {
        labelCol: {
          span: 8
        },
        wrapperCol: {
          span: 16
        },
      },
      defaultValue: {
        value: defaultVolume.value
      },
      fields: [
        {
          name: 'value',
          label: '默认交易股数(股)',
          widget: 'InputNumber',
          min: 100,
          step: 100,
          // formatter: value => `${value} 股`,
          // parser: value => value.replace(/\s股/, ''),
          style: { width: 150 },
          decorator: {
            rules: [
              { pattern: /^\d+00$/, message: '必须是100整数倍' }
            ],
          },
          itemProps: {
            labelAlign: 'left',
          },
        },
      ],
      onSubmit: (values) => {
        if (set('defaultVolume', values)) {
          // dispatch({
          //   type: 'workBench/putState',
          //   payload: {
          //     stockInput: {
          //       ...stockInput,
          //       volume: values.value
          //     }
          //   }
          // });
          message.success('保存完成');
        }
        else {
          message.error('保存失败');
        }
      },
      submitText: '保存',
      // opBtn: false
    };
  }

  render() {
    return <Form {...this.formProps}/>
  }
}

export default connect((model) => (model))(DefaultVolume);
