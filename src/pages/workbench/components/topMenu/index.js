import React, { Component, Fragment } from 'react';
import { Menu, Icon, Modal, Tabs } from 'antd';
import { connect } from 'dva';
import ServerSetting from '../serverSetting';
import OptionalStocks from '../optionalStocks';
import TableColumns from '../tableColumns';
import Shortcut from '../shortcut';
import DefaultVolume from '../defaultVolume';
import CommonSetting from '../commonSetting';
import helper from 'utils/helper';

import styles from './index.css';

const { SubMenu } = Menu;
const { TabPane } = Tabs;
class TopMenu extends Component {
  state = {
    // settingModalVisiable: false,
    selectedMenuKey: ''
  };

  get settingModalProps() {
    const { workBench } = this.props;
    const { settingModalVisiable } = workBench;
    return {
      className: 'setting-modal',
      keyboard: false,
      visible: settingModalVisiable,
      // destroyOnClose: true,
      title: '设置',
      maskClosable: false,
      centered: true,
      footer: null,
      destroyOnClose: true,
      onCancel: () => {
        this.closeModal();
      },
    };
  }

  handleClick = e => {
    if (e.key === 'refresh') {
      setTimeout(() => location.reload(), 50);
      return;
    }
    this.setState({
      selectedMenuKey: e.key,
      // settingModalVisiable: true
    });

    this.props.dispatch({
      type: 'workBench/putState',
      payload: {
        settingModalVisiable: true
      }
    });
  }

  handleTabClick = key => {
    this.setState({
      selectedMenuKey: key
    });
  }

  closeModal() {
    this.props.dispatch({
      type: 'workBench/putState',
      payload: {
        settingModalVisiable: false
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { workBench } = this.props;
    const { settingModalVisiable } = workBench;
    return !helper.shallowEqual(settingModalVisiable, nextProps.workBench.settingModalVisiable) ||
      !helper.shallowEqual(this.state, nextState);
  }

  render() {
    const { selectedMenuKey } = this.state;
    let title;
    switch(selectedMenuKey) {
      case 'shortcut': {
        title = <div>设置<span className={styles.info}>请在英文输入状态或CapsLock开启后输入快捷键</span></div>;
        break;
      }
      case 'stocks': {
        title = <div>设置<span className={styles.info}>建议自选股不超过20只</span></div>;
        break;
      }
      default: title = '设置';
    }
    return (
      <Fragment>
        <Menu onClick={this.handleClick} mode='horizontal' style={{ lineHeight: '28px' }} selectable={false} triggerSubMenuAction='click'>
          {/* <Menu.Item key="mail">
            <Icon type="mail" />
            Navigation One
          </Menu.Item> */}
          <SubMenu
            title={
              <span className='submenu-title-wrapper'>
                <Icon type='setting' />
                设置
              </span>
            }
          >
            <Menu.Item key='server'>服务器</Menu.Item>
            <Menu.Item key='stocks'>自选股</Menu.Item>
            <Menu.Item key='shortcut'>快捷键</Menu.Item>
            <Menu.Item key='commonSetting'>常规设置</Menu.Item>
            <Menu.Item key='defaultVolume'>默认股数</Menu.Item>
            <Menu.Item key='columns'>表格列头</Menu.Item>
            <Menu.Item key='refresh'>刷新</Menu.Item>
            {/* <Menu.ItemGroup title="Item 2">
              <Menu.Item key="setting:3">Option 3</Menu.Item>
              <Menu.Item key="setting:4">Option 4</Menu.Item>
            </Menu.ItemGroup> */}
          </SubMenu>
          {/* <Menu.Item key="alipay">
            <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
              Navigation Four - Link
            </a>
          </Menu.Item> */}
        </Menu>
        <Modal {...this.settingModalProps} title={title}>
          <Tabs tabPosition='left' activeKey={selectedMenuKey} animated={false} onTabClick={this.handleTabClick}>
            <TabPane tab='服务器' key='server'>
              <ServerSetting />
            </TabPane>
            <TabPane tab='自选股' key='stocks'>
              <OptionalStocks />
            </TabPane>
            <TabPane tab='快捷键' key='shortcut'>
              <Shortcut />
            </TabPane>
            <TabPane tab='常规设置' key='commonSetting'>
              <CommonSetting />
            </TabPane>
            <TabPane tab='默认股数' key='defaultVolume'>
              <DefaultVolume />
            </TabPane>
            <TabPane tab='表格列头' key='columns'>
              <TableColumns />
            </TabPane>
          </Tabs>
        </Modal>
      </Fragment>
    );
  }
}

export default connect((model) => (model))(TopMenu);
