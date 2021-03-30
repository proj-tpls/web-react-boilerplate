import React, { Component } from 'react';
import { Layout, Menu, Icon, Dropdown } from 'antd';
import { connect } from 'dva';
import { withRouter, routerRedux } from 'dva/router';
// const { ipcRenderer } = window.require('electron');
// import Notice from 'components/notice';
// import logo from '../../assets/logo.png';
// import text from '../../assets/title/title.png';

const { Header: AntHeader } = Layout;

import styles from './header.css';

class Header extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   isMax: false
    // }
  }

  // componentDidMount() {
  //   ipcRenderer.on('isMax', (event, isMax) => {
  //     this.setState({
  //       isMax
  //     })
  //   })
  // }

  // componentWillUnmount() {
  //   ipcRenderer.removeAllListeners('isMax');
  // }

  onMenuClick = ({ key }) => {
    // const { dispatch } = this.props;
    if ('logout' === key) {
      /* dispatch({
        type: 'app/logout',
      }); */
      // window.location.href = buildUrl('sso', 'logout');
    } else if ('changepassword' === key) {
      // window.location.href = buildUrl('sso', 'changePassword');
    }
  };

  // minWin = () => {
  //   ipcRenderer.send('app:min')
  // }

  // maxWin = () => {
  //   ipcRenderer.send('app:unmax')
  // }

  // quitWin = () => {
  //   ipcRenderer.send('app:quit')
  // }

  render() {
    // const { app } = this.props;
    // const { isMax } = this.state;
    return (
      <AntHeader className={styles.header}>
        <div style={{ flex: 1 }}>
          {/* <a className={styles.appTitle} href={buildUrl('www')}>
            <img src={logo} className={styles.logo}/>
            <img src={text} className={styles.text}/>
          </a> */}
          {/* <a className={styles.appTitle} href="javascript:void(0)">
            <img src={logo} className={styles.logo} />
            <img src={text} className={styles.text} />
          </a> */}
        </div>
        {/* <Notice to="/inmail" count={99} /> */}
        {
          // app.userInfo &&
          // <Dropdown
          //   overlay={
          //     <Menu
          //       className="header-item"
          //       style={{ lineHeight: '64px' }}
          //       onClick={this.onMenuClick}
          //     >
          //       <Menu.Item key="changepassword">
          //         <Icon type="safety-certificate" />
          //         修改密码
          //       </Menu.Item>
          //       <Menu.Item key="logout">
          //         <Icon type="logout" />
          //         退出
          //       </Menu.Item>
          //     </Menu>
          //   }
          // >
          //   <span className={styles.avatar}>
          //     <Icon type="user" />
          //     {app.userInfo.userName || app.userInfo.mobile || app.userInfo.email}
          //   </span>
          // </Dropdown> || null
        }
        {/* <Icon type="minus" className={styles.min} onClick={() => this.minWin()}/>
        <Icon type={isMax ? 'switcher' : 'border'} className={styles.max} onClick={() => this.maxWin()}/>
        <Icon type="close" className={styles.quit} onClick={() => this.quitWin()}/> */}
      </AntHeader>
    );
  }
}

export default withRouter(
  connect(({ app, loading }) => ({ app, loading }))(Header),
);
