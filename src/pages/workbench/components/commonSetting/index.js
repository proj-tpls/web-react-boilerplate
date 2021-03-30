import React, { Component } from 'react';
import { message, Switch, Tooltip, Icon } from 'antd';
import { Form } from 'torenia';
import { connect } from 'dva';
import { set } from 'utils/storage';
import helper from 'utils/helper';

import styles from './index.css';

const itemProps = {
  itemProps: {
    labelAlign: 'left',
  }
};

class CommonSetting extends Component {

  state = {
    stampTaxTwoSide: false,
    commissionRatioTwoSide: true,
    leastCommissionPerTimeTwoSide: true,
    transferFeeRadioTwoSide: false
  };

  onTwoSideChange(data) {
    this.setState(data);
  }

  componentDidMount() {
    const { workBench } = this.props;
    const { commonSetting } = workBench;
    const {
      stampTaxTwoSide,
      commissionRatioTwoSide,
      leastCommissionPerTimeTwoSide,
      transferFeeRadioTwoSide
    } = commonSetting;

    this.setState({
      stampTaxTwoSide,
      commissionRatioTwoSide,
      leastCommissionPerTimeTwoSide,
      transferFeeRadioTwoSide
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { workBench } = this.props;
    const { commonSetting } = workBench;
    return !helper.shallowEqual(commonSetting, nextProps.workBench.commonSetting) ||
      !helper.shallowEqual(this.state, nextState);
  }

  get formProps() {
    const { workBench } = this.props;
    const { commonSetting } = workBench;
    let {
      doubleClickCancelOrder,
      autoMaxVolumeOrderingWhenBuy,
      autoMaxVolumeOrderingWhenSell,
      leastCommissionPerTime,
      stampTaxRatio,
      commissionRatio,
      transferFeeRadio,
    } = commonSetting;

    stampTaxRatio = stampTaxRatio ? +((+stampTaxRatio * 1000).toFixed(2)) : 1; // 印花税默认千分之一
    commissionRatio = commissionRatio ? +((+commissionRatio * 10000).toFixed(2)) : 3; // 佣金税默认万分之三
    leastCommissionPerTime = +leastCommissionPerTime; // 最低佣金税默认5元
    transferFeeRadio = transferFeeRadio ? +((+transferFeeRadio * 10000).toFixed(2)) : 1; // 其他杂费总和默认万分之一

    const {
      stampTaxTwoSide,
      commissionRatioTwoSide,
      leastCommissionPerTimeTwoSide,
      transferFeeRadioTwoSide
    } = this.state;

    return {
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
        doubleClickCancelOrder,
        autoMaxVolumeOrderingWhenBuy,
        autoMaxVolumeOrderingWhenSell,
        leastCommissionPerTime,
        stampTaxRatio,
        commissionRatio,
        transferFeeRadio,
      },
      fields: [
        {
          name: 'doubleClickCancelOrder',
          label: <span>鼠标双击撤单 <Tooltip title="双击今日委托或今日挂单的报单执行撤单指令"><Icon type="question-circle" /></Tooltip></span>,
          widget: 'Switch',
          checkedChildren: '开',
          unCheckedChildren: '关',
          ...itemProps
        },
        {
          name: 'autoMaxVolumeOrderingWhenBuy',
          label: '买入时资金不足以可买最大股数报单',
          widget: 'Switch',
          checkedChildren: '开',
          unCheckedChildren: '关',
          ...itemProps
        },
        {
          name: 'autoMaxVolumeOrderingWhenSell',
          label: '卖出时持股不足以可卖最大股数报单',
          widget: 'Switch',
          checkedChildren: '开',
          unCheckedChildren: '关',
          ...itemProps
        },
        {
          name: 'stampTaxRatio',
          label: '印花税',
          widget: 'Input',
          suffix: '‰',
          addonAfter: <Switch checkedChildren='双边' unCheckedChildren='单边' onChange={(value) => this.onTwoSideChange({stampTaxTwoSide: value})} checked={stampTaxTwoSide}/>,
          style: { width: 180 },
          decorator: {
            rules: [
              { required: true, message: '请输入数字' },
              { pattern: /^\d*(\.\d+)?$/, message: '数字格式不正确' }
            ],
          },
          ...itemProps
        },
        {
          name: 'commissionRatio',
          label: '券商佣金(一般在1‱~3‱之间)',
          widget: 'Input',
          suffix: '‱',
          addonAfter: <Switch checkedChildren='双边' unCheckedChildren='单边' onChange={(value) => this.onTwoSideChange({commissionRatioTwoSide: value})} checked={commissionRatioTwoSide}/>,
          style: { width: 180 },
          decorator: {
            rules: [
              { required: true, message: '请输入数字' },
              { pattern: /^\d*(\.\d+)?$/, message: '数字格式不正确' }
            ],
          },
          ...itemProps
        },
        {
          name: 'leastCommissionPerTime',
          label: '单笔交易最低佣金',
          widget: 'Input',
          suffix: '元',
          addonAfter: <Switch checkedChildren='双边' unCheckedChildren='单边' onChange={(value) => this.onTwoSideChange({leastCommissionPerTimeTwoSide: value})} checked={leastCommissionPerTimeTwoSide}/>,
          style: { width: 180 },
          decorator: {
            rules: [
              { required: true, message: '请输入数字' },
              { pattern: /^\d*(\.\d+)?$/, message: '数字格式不正确' }
            ],
          },
          ...itemProps
        },
        // {
        //   name: 'commissionTwoSide',
        //   label: '券商佣金双边计算',
        //   widget: 'Switch',
        //   checkedChildren: '开',
        //   unCheckedChildren: '关',
        //   ...itemProps
        // },
        {
          name: 'transferFeeRadio',
          label: '过户费',
          widget: 'Input',
          suffix: '‱',
          addonAfter: <Switch checkedChildren='双边' unCheckedChildren='单边' onChange={(value) => this.onTwoSideChange({transferFeeRadioTwoSide: value})} checked={transferFeeRadioTwoSide}/>,
          style: { width: 180 },
          decorator: {
            rules: [
              { required: true, message: '请输入数字' },
              { pattern: /^\d*(\.\d+)?$/, message: '数字格式不正确' }
            ],
          },
          ...itemProps
        },
        // {
        //   name: 'otherTaxTwoSide',
        //   label: '其他杂费双边计算',
        //   widget: 'Switch',
        //   checkedChildren: '开',
        //   unCheckedChildren: '关',
        //   ...itemProps
        // },
      ],
      onSubmit: (values) => {
        values.stampTaxRatio = +values.stampTaxRatio / 1000;
        values.commissionRatio = +values.commissionRatio / 10000;
        values.transferFeeRadio = +values.transferFeeRadio / 10000;
        values.leastCommissionPerTime = +values.leastCommissionPerTime;

        values = {
          ...this.state,
          ...values
        };

        set('commonSetting', values) ?  message.success('保存完成') : message.error('保存失败');
      },
      onReset: () => {
        const { workBench } = this.props;
        const { commonSetting } = workBench;
        const {
          stampTaxTwoSide,
          commissionRatioTwoSide,
          leastCommissionPerTimeTwoSide,
          transferFeeRadioTwoSide
        } = commonSetting;

        this.setState({
          stampTaxTwoSide,
          commissionRatioTwoSide,
          leastCommissionPerTimeTwoSide,
          transferFeeRadioTwoSide,
        });
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

export default connect((model) => (model))(CommonSetting);
