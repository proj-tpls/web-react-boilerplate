import React, { Component } from 'react';
import { connect } from 'dva';
// import { Link, routerRedux } from 'dva/router';
import Page from 'components/page';
import { Button, Badge } from 'antd';
// import SplitPane, { Pane } from 'react-split-pane-fixed';
import SplitPane from 'react-split-pane-fixed';
import Pane from 'react-split-pane-fixed/lib/Pane'
import TopMenu from './components/topMenu';
import StockInput from './components/stockInput';
import CapitalTable from './components/capitalTable';
import LoginModal from './components/loginModal';
import LeftPane from './components/leftPane';
import RightPane from './components/rightPane';
import Level2Quote from './components/level2Quote';
import CommonQuotes from './components/commonQuotes';
import { syncToStore } from 'utils/storage';
import helper from 'utils/helper';

import styles from './index.css';

let ipcRenderer;
if (window.require) {
  const electronInstance = window.require('electron');
  ipcRenderer = electronInstance && electronInstance.ipcRenderer;
}
// async function sleep(t) {
//   return new Promise(resolve => {
//     setTimeout(() => resolve(), t);
//   });
// }

class WorkBench extends Component {

  constructor(props) {
    super(props);
    this.horizontalSplitPane1 = React.createRef();
    this.verticalSplitPane1 = React.createRef();
    this.verticalSplitPane2 = React.createRef();

    let sizes1 = JSON.parse(localStorage.getItem('kingfisher_horizontal_SplitPane1_sizes') || '[]');
    let sizes2 = JSON.parse(localStorage.getItem('kingfisher_vertical_SplitPane1_sizes') || '[]');
    let sizes3 = JSON.parse(localStorage.getItem('kingfisher_vertical_SplitPane2_sizes') || '[]');

    sizes1 = sizes1.map(item => item + 'px');
    sizes2 = sizes2.map(item => item + 'px');
    sizes3 = sizes3.map(item => item + 'px');

    this.state = {
      sizes1,
      sizes2,
      sizes3,
    };
  }

  showLoginModal = () => {
    this.props.dispatch({
      type: 'workBench/putState',
      payload: {
        loginModalVisiable: true
      }
    });
  }

  logoutFromTradeServer = () => {
    const { workBench } = this.props;
    const { login } = workBench;
    window.td_socket.emit('json', { type: 'logout', payload: { userId: login.data.userId } });
  }

  componentDidUpdate(prevProps, prevState) {
    const { workBench, dispatch } = this.props;
    const { login, status } = workBench;

    if (login.success) {
      sessionStorage.setItem('kingfisher_userid', login.data.userId);
    }

    if (status.message && status.message !== prevProps.workBench.status.message) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        dispatch({
          type: 'workBench/putStatus',
          payload: ''
        });
      }, 5000);
    }
  }

  onBeforeWinUnload = () => {
    const sizes1 = this.horizontalSplitPane1.current.state.sizes;
    const sizes2 = this.verticalSplitPane1.current.state.sizes;
    const sizes3 = this.verticalSplitPane2.current.state.sizes;

    localStorage.setItem('kingfisher_horizontal_SplitPane1_sizes', JSON.stringify(sizes1));
    localStorage.setItem('kingfisher_vertical_SplitPane1_sizes', JSON.stringify(sizes2));
    localStorage.setItem('kingfisher_vertical_SplitPane2_sizes', JSON.stringify(sizes3));
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.onBeforeWinUnload, false);
    if (ipcRenderer) {
      ipcRenderer.on('close', () => {
        this.onBeforeWinUnload();
        ipcRenderer.send('forceQuit');
      });
    }

    syncToStore([
      'commonSetting', // 常规设置
      'defaultVolume', // 默认股数
      'shortcut', // 快捷键
    ]);

    // 移除所有tabindex='0'的元素上的tabindex属性, 解决点击tab之后全局键盘事件不响应的问题
    document.querySelectorAll('.card-container [tabindex="0"]').forEach(item => {
      item.removeAttribute('tabindex');
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { workBench } = this.props;
    const { status, isLogin, tdConnected, mdConnected } = workBench;
    return !helper.shallowEqual(status, nextProps.workBench.status) ||
      !helper.shallowEqual(isLogin, nextProps.workBench.isLogin) ||
      !helper.shallowEqual(tdConnected, nextProps.workBench.tdConnected) ||
      !helper.shallowEqual(mdConnected, nextProps.workBench.mdConnected);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.horizontalSplitPane1 = null;
    this.verticalSplitPane1 = null;
    this.verticalSplitPane2 = null;
    window.removeEventListener('beforeunload', this.onBeforeWinUnload, false);
    if (ipcRenderer) {
      ipcRenderer.removeAllListeners('close');
    }
  }

  render() {
    const { workBench } = this.props;
    const { status, isLogin, tdConnected, mdConnected } = workBench;
    const { sizes1, sizes2, sizes3 } = this.state;

    return (
      <Page className={styles.page}>
        <SplitPane split='horizontal' ref={this.horizontalSplitPane1}>
          <Pane className={styles.up} initialSize={sizes1[0]}>
            <div className={styles.menu}>
              <TopMenu />
              {
                isLogin
                ? <Button className={styles.loginAndLogoutBtn} type='link' onClick={this.logoutFromTradeServer}>登出</Button>
                : <Button className={styles.loginAndLogoutBtn} type='link' onClick={this.showLoginModal}>登录</Button>
              }
            </div>
            <div className={styles.capital}>
              <CapitalTable />
            </div>
            <SplitPane split='vertical' ref={this.verticalSplitPane2} className={styles.quote}>
              <Pane initialSize={sizes3[0]} minSize='220px' className='pane-commonQuotes'><CommonQuotes /></Pane>
              <Pane initialSize={sizes3[1]} className={styles.level2}><Level2Quote /></Pane>
            </SplitPane>
          </Pane>
          <Pane className={styles.down} initialSize={sizes1[1]} minSize='180px'>
            <div className={styles.action}>
              <StockInput />
            </div>
            <SplitPane split='vertical' ref={this.verticalSplitPane1}>
              <Pane minSize='220px' initialSize={sizes2[0]}><LeftPane /></Pane>
              <Pane minSize='220px' initialSize={sizes2[1]}><RightPane /></Pane>
            </SplitPane>
            <div className={styles.statusBar}>
              <span className={status.type}>{status.message}</span>
              <Badge className={styles.tdConnectBadge} status={tdConnected && isLogin ? 'success' : 'error'} text='交易'/>
              <Badge className={styles.mdConnectBadge} status={mdConnected ? 'success' : 'error'} text='行情'/>
            </div>
          </Pane>
        </SplitPane>
        <LoginModal/>
      </Page>
    );
  }
}

export default connect((model) => (model))(WorkBench);
// connect(({ workBench }) => ({ workBench })) 这样写法只注入workBench
// connect((model) => (model)) 这样写法注入所有页面和app的model
