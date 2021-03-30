import React, { Component } from 'react';
import { Tabs, Button } from 'antd';
import { connect } from 'dva';
import DayTradesTable from '../dayTradesTable';
import PositionTable from '../positionTable';
import tabData from 'utils/tab';
import helper from 'utils/helper';

// import styles from './index.css';

const { TabPane } = Tabs;

class RightPane extends Component {

  onTabClick = key => {
    this.props.dispatch({
      type: 'workBench/putState',
      payload: {
        rightPaneActiveKey: key
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
  //       activePaneTabKey: workBench.rightPaneActiveKey
  //     }
  //   });
  // }
  shouldComponentUpdate(nextProps, nextState) {
    const { workBench } = this.props;
    const { rightPaneActiveKey } = workBench;
    return !helper.shallowEqual(rightPaneActiveKey, nextProps.workBench.rightPaneActiveKey);
  }

  render() {
    const { workBench } = this.props;
    return (
      <div className='card-container'>
        <Tabs
          type='card'
          onTabClick={this.onTabClick}
          animated={false}
          activeKey={workBench.rightPaneActiveKey}
        >
          <TabPane tab={tabData['dayTrades']} key='dayTrades'>
            <DayTradesTable />
          </TabPane>
          <TabPane tab={tabData['position']} key='position'>
            <PositionTable />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default connect((model) => (model))(RightPane);
