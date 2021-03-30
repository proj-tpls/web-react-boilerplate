import React, { Component } from 'react';
import { message } from 'antd';
import { Form } from 'torenia';
import { connect } from 'dva';
import config from 'utils/config';
import tdWebsocket from 'utils/tdWebsocket';
import mdWebsocket from 'utils/mdWebsocket';

import styles from './index.css';

class ServerSetting extends Component {

  get formProps() {
    const { dispatch } = this.props;
    const originalTdUrl = localStorage.getItem('kingfisher_td_url') || config.tdUrl;
    const originalMdUrl = localStorage.getItem('kingfisher_md_url') || config.mdUrl;
    return {
      className: styles.settingForm,
      itemLayout: {
        labelCol: {
          span: 5
        },
        wrapperCol: {
          span: 15
        },
      },
      defaultValue: {
        tdUrl: originalTdUrl,
        mdUrl: originalMdUrl,
      },
      fields: [
        {
          name: 'tdUrl',
          label: '交易',
          placeholder: 'ws://domain-or-ip:port',
          decorator: {
            rules: [
              { required: true, message: '请输入交易服务器地址' },
              { pattern: /^(ws|wss):\/\/.+$/i, message: '交易服务器地址格式不正确' }
            ],
          },
        },
        {
          name: 'mdUrl',
          label: '行情',
          placeholder: 'http://domain-or-ip:port',
          decorator: {
            rules: [
              { required: true, message: '请输入行情服务器地址' },
              { pattern: /^(ws|wss):\/\/.+$/i, message: '行情服务器地址格式不正确' }
            ],
          },
        },
      ],
      onSubmit: ({ tdUrl, mdUrl }) => {
        if (tdUrl === originalTdUrl && mdUrl === originalMdUrl) {
          message.info('保存完成');
          return;
        }

        if (tdUrl !== originalTdUrl) {
          localStorage.setItem('kingfisher_td_url', tdUrl);
          dispatch({
            type: 'workBench/resetState'
          });
          tdWebsocket.init();
        }

        if (mdUrl !== originalMdUrl) {
          localStorage.setItem('kingfisher_md_url', mdUrl);
          // dispatch({
          //   type: 'workBench/resetState'
          // });
          mdWebsocket.init();
        }

        message.info('保存完成');
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

export default connect((model) => (model))(ServerSetting);
