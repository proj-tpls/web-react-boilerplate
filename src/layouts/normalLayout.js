import React, { Component } from 'react';
import { Layout, BackTop, Spin, Icon } from 'antd';
import Sider from 'components/layout/side';
import Header from 'components/layout/header';
import Footer from 'components/layout/footer';
import Breadcrumb from 'components/breadcrumb';
// const { ipcRenderer } = window.require('electron');
import styles from './normalLayout.css';
const { Content } = Layout;

class NormalLayout extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   isMax: false
    // };
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

  // minWin = () => {
  //   ipcRenderer.send('app:min');
  // }

  // maxWin = () => {
  //   ipcRenderer.send('app:unmax');
  // }

  // quitWin = () => {
  //   ipcRenderer.send('app:quit');
  // }

  render() {
    const {
      children,
      layoutSetting: {
        hasSider = true,
        hasDefaultBreadcrumb = true,
        hasHeader = false,
        hasFooter = true,
      },
      ...props
    } = this.props;
    const {
      app: { userInfo },
    } = props;
    // const { isMax } = this.state
    return (
      <div>
        {!userInfo ? (
          <Spin size="large">
            <div style={{ height: '100vh', width: '100vw' }} />
          </Spin>
        ) : (
          <Layout style={{ minHeight: '100vh' }}>
            {(hasHeader && <Header />) || null}
            <Layout>
              {(hasSider && <Sider {...props} />) || null}
              <Layout
                id="scrollContainer"
                style={{
                  position: 'relative',
                  paddingTop: hasHeader ? 15 : 0,
                  paddingLeft: 0, // hasHeader || hasSider ? '15px' : 0,
                  paddingRight: hasHeader ? 15 : 0,
                  paddingBottom: 0,
                  borderLeft: 'solid 1px #eee',
                  // minWidth: 950
                }}
              >
                {(hasDefaultBreadcrumb && <Breadcrumb {...this.props} />) ||
                  null}
                {/* <div className={styles.winTools}>
                  <Icon type="minus" className={styles.min} onClick={() => this.minWin()}/>
                  <Icon type={isMax ? 'switcher' : 'border'} className={styles.max} onClick={() => this.maxWin()}/>
                  <Icon type="close" className={styles.quit} onClick={() => this.quitWin()}/>
                </div> */}
                <Content
                  style={{
                    padding: '15px',
                    background: '#fff',
                    minHeight: 'auto',
                  }}
                >
                  {children}
                </Content>
                {(hasFooter && <Footer />) || null}
              </Layout>
            </Layout>
            <BackTop visibilityHeight={200} target={() => window} />
          </Layout>
        )}
      </div>
    );
  }
}

export default NormalLayout;
