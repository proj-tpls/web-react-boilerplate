import React, { Component } from 'react';
import { Layout } from 'antd';
import Menu from './menu';

import styles from './side.css';

const { Sider: AntSider } = Layout;

class Sider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }

  onCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });

    // window.dispatchEvent(new Event('resize'));
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.timer = setTimeout(
      () => window.dispatchEvent(new Event('resize')),
      200,
    );
    // this.timer = setTimeout(() => {
    //   let resizeEvent = window.document.createEvent('UIEvents');
    //   resizeEvent.initUIEvent('resize', true, false, window, 0);
    //   window.dispatchEvent(resizeEvent);
    // }, 100);
    // setTimeout(() => {
    //   const tvf = window.$tvf;
    //   if (tvf) {
    //     tvf.resizeFrame();
    //     const tradeviewList = tvf.tradeviewList;
    //     tradeviewList && tradeviewList.forEach(tv => setTimeout(() => tv.resize(), 50));
    //   }
    // }, 100);
    // IE use below
    // var resizeEvent = window.document.createEvent('UIEvents');
    // resizeEvent .initUIEvent('resize', true, false, window, 0);
    // window.dispatchEvent(resizeEvent);
  };

  render() {
    const { collapsed } = this.state;
    const { collapsedSiderWidth } = this.props;
    return (
      <AntSider
        theme="light"
        style={{
          overflow: "auto",
          // height: "100vh",
          // position: "sticky",
          // top: 0,
          // left: 0
        }}
        className={styles.sider}
        collapsible
        collapsed={collapsed}
        onCollapse={this.onCollapse}
        collapsedWidth={collapsedSiderWidth}
      >
        <Menu
          collapsed={collapsed}
          affix={this.props.affixSider}
          collapsedWidth={collapsedSiderWidth}
        />
      </AntSider>
    );
  }
}

export default Sider;
