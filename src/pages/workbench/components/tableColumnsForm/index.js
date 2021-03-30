import React, { Component } from 'react';
import { Form } from 'torenia';
import { connect } from 'dva';
import { message } from 'antd';
import tableColumnsData from 'utils/tableColumns';
// import tabData from 'utils/tab';
import helper from 'utils/helper';

import styles from './index.css';

class TableColumnsForm extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    const { workBench } = this.props;
    const { tableHeaderDict, tableColumns } = workBench;
    return !helper.shallowEqual(tableHeaderDict, nextProps.workBench.tableHeaderDict) ||
      !helper.shallowEqual(tableColumns, nextProps.workBench.tableColumns);
  }

  get formOption() {
    const { dispatch, workBench, tabKey } = this.props;
    const { tableHeaderDict, tableColumns } = workBench;

    const columns = tableColumnsData[tabKey];
    const checkedColumnNames = tableColumns[tabKey] || columns.map(column => column.dataIndex);

    const options = tableHeaderDict.success && tabKey !== 'commonQuotes' // commonQuotes使用的自定义的列名，因为在服务器端没有生成dataIndex对应的列名
    ? columns.map(({ dataIndex }) => { return { value: dataIndex, label: tableHeaderDict.data[dataIndex] } })
    : columns.map(({ dataIndex, title }) => { return { value: dataIndex, label: title } });

    return {
      // ref: this.loginForm,
      className: styles.form,
      itemLayout: {
        labelCol: {
          span: 0
        },
        wrapperCol: {
          span: 24
        },
      },
      defaultValue: {
        [tabKey]: checkedColumnNames
      },
      fields: [
        {
          name: tabKey,
          // label: tabData[tabKey],
          options,
          widget: 'Checkbox.Group',
          decorator: {
            rules: [
              { required: true, message: '请至少选择一项' }
            ],
          },
        },
      ],
      onSubmit: (values) => {
        dispatch({
          type: 'workBench/putTableColumns',
          payload: values
        });
        const success = helper.trySaveTableColumnsData(values);
        if (success) {
          message.info('保存完成');
        }
      },
      submitText: '保存',
      // opBtn: false
    };
  }

  render() {
    return (
      <Form {...this.formOption} />
    );
  }
}

export default connect((model) => (model))(TableColumnsForm);
// connect(({ workBench }) => ({ workBench })) 这样写法只注入workBench
// connect((model) => (model)) 这样写法注入所有页面和app的model
