import React, { Component } from 'react';
// import { Form } from 'torenia';
import { connect } from 'dva';
import { Tabs } from 'antd';
import TableColumnsForm from '../tableColumnsForm';
import tabData from 'utils/tab';
// import helper from 'utils/helper';

// import styles from './index.css';

const { TabPane } = Tabs;

class TableColumns extends Component {

  onTabChange = () => {

  }

  render() {
    const tabs = [];
    for (let tabKey in tabData) {
      tabs.push(
        <TabPane tab={tabData[tabKey].replace(/\(.+\)/, '')} key={tabKey}>
          <TableColumnsForm tabKey={tabKey}/>
        </TabPane>
      )
    }
    return (
      <Tabs defaultActiveKey="capital" onChange={this.onTabChange} animated={false} size='small' className='topmenu-tablecolumns-tabs'>{tabs}</Tabs>
    );
  }
}

export default connect((model) => (model))(TableColumns);
// connect(({ workBench }) => ({ workBench })) 这样写法只注入workBench
// connect((model) => (model)) 这样写法注入所有页面和app的model
