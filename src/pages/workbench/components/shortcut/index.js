import React, { Component } from 'react';
// import { Form } from 'torenia';
import { connect } from 'dva';
import { Tabs } from 'antd';
// import ShortcutBase from '../shortcutBase';
import ShortcutVolume from '../shortcutVolume';
import ShortcutPrice from '../shortcutPrice';
import ShortcutOffset from '../shortcutOffset';
import ShortcutOrdering from '../shortcutOrdering';
import ShortcutCancelOrder from '../shortcutCancelOrder';
// import helper from 'utils/helper';

// import styles from './index.css';

const { TabPane } = Tabs;

const tabData = {
  // base: {
  //   label: '通用',
  //   component: <ShortcutBase />,
  // },
  ordering: {
    label: '下单',
    component: <ShortcutOrdering />,
  },
  cancelOrder: {
    label: '撤单',
    component: <ShortcutCancelOrder />,
  },
  offset: {
    label: '一键清股',
    component: <ShortcutOffset />,
  },
  volumeTimes: {
    label: '调整股数',
    component: <ShortcutVolume />,
  },
  priceTimes: {
    label: '调整价格',
    component: <ShortcutPrice />,
  },
};

class Shortcut extends Component {

  onTabChange = () => {

  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return false;
  // }

  render() {
    const tabs = [];
    for (let tabKey in tabData) {
      const data = tabData[tabKey];
      tabs.push(<TabPane tab={data.label} key={tabKey}>{data.component}</TabPane>);
    }
    return (
      <Tabs defaultActiveKey="base" onChange={this.onTabChange} animated={false} size='small' className='topmenu-tablecolumns-tabs'>{tabs}</Tabs>
    );
  }
}

export default connect((model) => (model))(Shortcut);
// connect(({ workBench }) => ({ workBench })) 这样写法只注入workBench
// connect((model) => (model)) 这样写法注入所有页面和app的model
