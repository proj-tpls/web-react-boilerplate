import React, { Component } from 'react';
import { Tabs, Button } from 'antd';
import { connect } from 'dva';
import DayOrdersTable from '../dayOrdersTable';
import CancelableOrdersTable from '../cancelableOrdersTable';
import tabData from 'utils/tab';
import helper from 'utils/helper';

import styles from './index.css';

const { TabPane } = Tabs;

class LeftPane extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    const { workBench } = this.props;
    const { leftPaneActiveKey } = workBench;

    return !helper.shallowEqual(leftPaneActiveKey, nextProps.workBench.leftPaneActiveKey);
  }

  onTabClick = key => {
    this.props.dispatch({
      type: 'workBench/putState',
      payload: {
        leftPaneActiveKey: key
      }
    });
    const userId = sessionStorage.getItem('kingfisher_userid');
    userId && window.td_socket.emit('json', { type: key, payload: { userId } });
  }

  // showTableColumnsModal = () => {
  //   const { workBench, dispatch } = this.props;
  //   dispatch({
  //     type: 'workBench/putState',
  //     payload: {
  //       tableColumnsModalVisiable: true,
  //       activePaneTabKey: workBench.leftPaneActiveKey
  //     }
  //   });
  // }

  render() {
    const { workBench } = this.props;
    return (
      <div className='card-container'>
        <Tabs
          type='card'
          onTabClick={this.onTabClick}
          animated={false}
          activeKey={workBench.leftPaneActiveKey}
        >
          <TabPane tab={tabData['dayOrders']} key='dayOrders'>
            <DayOrdersTable />
          </TabPane>
          <TabPane tab={tabData['cancelableOrders']} key='cancelableOrders'>
            <CancelableOrdersTable />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default connect((model) => (model))(LeftPane);
