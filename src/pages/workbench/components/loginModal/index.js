import React, { Component } from 'react';
import { Form } from 'torenia';
import { connect } from 'dva';
import { Modal, Spin } from 'antd';
import pinyin from 'tiny-pinyin';
import helper from 'utils/helper';

import styles from './index.css';

const isPinyinSupported = pinyin.isSupported();

class LoginModal extends Component {
  constructor(props) {
    super();
    // this.loginForm = React.createRef();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { workBench } = this.props;
    const { tradeServers, selectedTradeServerIndex, loginModalVisiable, loginFormSpinning } = workBench;

    return !helper.shallowEqual(tradeServers, nextProps.workBench.tradeServers) ||
      !helper.shallowEqual(selectedTradeServerIndex, nextProps.workBench.selectedTradeServerIndex) ||
      !helper.shallowEqual(loginFormSpinning, nextProps.workBench.loginFormSpinning) ||
      !helper.shallowEqual(loginModalVisiable, nextProps.workBench.loginModalVisiable);
  }

  get formOption() {
    const { dispatch, workBench } = this.props;
    const { tradeServers, selectedTradeServerIndex } = workBench;
    const serverOptions = [];
    if (tradeServers.success && tradeServers.data) {
      tradeServers.data.forEach(({ name, ip, port }, index) => {
        serverOptions.push({ label: `${name} ${ip}:${port}`, value: index, key: `${name}${ip}:${port}` }); // <Option key={name + ip + port} value={index}>{name}</Option>
      });
    }
    return {
      // ref: this.loginForm,
      wrappedComponentRef: ref => this.formRef = ref,
      className: styles.loginForm,
      itemLayout: {
        labelCol: {
          span: 5
        },
        wrapperCol: {
          span: 15
        },
      },
      defaultValue: {
        tradeServerIndex: selectedTradeServerIndex,
        version: '6.00',
        brokerId: 0
      },
      fields: [
        {
          name: 'tradeServerIndex',
          widget: 'Select',
          label: '交易服务器',
          placeholder: '必选',
          // style: { width: 100 },
          options: serverOptions,
          decorator: {
            rules: [
              { required: true, message: '请选择交易服务器' }
            ],
          },
          allowClear: true,
          showSearch: true,
          filterOption: (input, option) => {
            if (isPinyinSupported) {
              const py = pinyin.convertToPinyin(option.props.children);
              return py.toLowerCase().indexOf(input.toLowerCase()) === 0 || option.props.children.toLowerCase().indexOf(input.toLowerCase()) === 0
            }

            return option.props.children.toLowerCase().indexOf(input.toLowerCase()) === 0
          }
        },
        {
          name: 'version',
          label: '通达信版本',
          // placeholder: '可不填',
        },
        {
          name: 'brokerId',
          label: '营业部代码',
          // placeholder: '可不填',
        },
        {
          name: 'userId',
          label: '客户号',
          placeholder: '必填',
          decorator: {
            rules: [
              { required: true, message: '请输入客户号' }
            ],
          },
        },
        {
          name: 'capitalId',
          label: '资金账号',
          // placeholder: '可不填',
        },
        {
          name: 'password',
          widget: 'Password',
          label: '交易密码',
          placeholder: '必填',
          decorator: {
            rules: [{ required: true, message: '请输入交易密码' }],
          },
        },
        {
          name: 'signalCode',
          widget: 'Password',
          label: '通信密码',
          // placeholder: '可不填',
          // decorator: {
          //   rules: [{ required: true, message: '请输入通信密码' }],
          // },
        },
      ],
      onSubmit: ({ ...values }) => {
        if (tradeServers.success && tradeServers.data) {
          const { ip, port, name } = tradeServers.data[values.tradeServerIndex];
          values.ip = ip;
          values.port = port;
          values.tradeServerName = name;
          values.brokerName = name;
        }

        window.td_socket.emit('json', { type: 'login', payload: values });
        dispatch({
          type: 'workBench/putState',
          payload: {
            loginFormSpinning: true
          }
        });
      },
      submitText: '登录交易账号',
      // opBtn: false
    };
  }

  get loginModalProps() {
    const { workBench } = this.props;
    const { loginModalVisiable } = workBench;
    return {
      keyboard: false,
      visible: loginModalVisiable,
      // destroyOnClose: true,
      title: '登录证券账户',
      maskClosable: false,
      centered: true,
      footer: null,
      // okText: '登录',
      // cancelText: '重置',
      // cancelButtonProps: {
      //   onClick: () => {
      //     this.loginForm.props.form.resetFields();
      //   }
      // },
      onCancel: () => {
        this.closeModal();
      },
      // onOk: () => {
      //   const { validateFields } = this.loginForm.props.form;
      //   validateFields((errors, values) => {
      //     if (errors) {
      //       return;
      //     }
      //     if (tradeServers.success && tradeServers.data) {
      //       const { ip, port, name } = tradeServers.data[values.tradeServerIndex];
      //       values.ip = ip;
      //       values.port = port;
      //       values.tradeServerName = name;
      //     }

      //     window.td_socket.emit('json', { type: 'login', payload: values });
      //     dispatch({
      //       type: 'workBench/putState',
      //       payload: {
      //         loginFormSpinning: true
      //       }
      //     });
      //   });
      // },
    };
  }

  closeModal() {
    this.props.dispatch({
      type: 'workBench/putState',
      payload: {
        loginModalVisiable: false
      }
    });
  }

  render() {
    const { workBench } = this.props;
    const { loginFormSpinning } = workBench;
    return (
      <Modal {...this.loginModalProps}>
        <Spin tip='正在登录...' spinning={loginFormSpinning}>
          <Form {...this.formOption}></Form>
        </Spin>
      </Modal>
    );
  }
}

export default connect((model) => (model))(LoginModal);
// connect(({ workBench }) => ({ workBench })) 这样写法只注入workBench
// connect((model) => (model)) 这样写法注入所有页面和app的model
