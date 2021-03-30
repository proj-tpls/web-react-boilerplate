import { Menu as AntMenu, Icon, Affix } from 'antd';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import config from 'utils/config';
import { arrayToTree } from 'utils';
import ReactAuthority from 'react-authority';

// import logo from '../../assets/logo.png';
// import text from '../../assets/title/title.png';

// import styles from './menu.css';

const { menu, menuSort } = config;
const menuMap = {};
menu.forEach(m => (menuMap[m.key] = m));

function isKeyMatchMenu(menu, key, route) {
  let isMatch =
    (menu.key === key || menu.route === route) && menu.route !== '/';
  if (isMatch) {
    return true;
  }
  if (menu.key.includes(':id')) {
    isMatch = new RegExp(`^${menu.key.replace(/:id/g, '[^/]+')}$`).test(key);
  }
  if (isMatch) {
    return true;
  }
  if (menu.route.includes(':id')) {
    isMatch = new RegExp(`^${menu.route.replace(/:id/g, '[^/]+')}$`).test(
      route,
    );
  }
  return isMatch;
}

class Menu extends Component {
  constructor(props) {
    super(props);
    this.menuTree = arrayToTree(menu, 'key', 'pKey', 'children', m => m.menu);
    this.state = {
      openedKeys: Menu.getOpenedKeys(props),
      collapsed: props.collapsed,
      defaultSelectedKeys: [Menu.getCurrentKey(this.props)],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { collapsed } = nextProps;
    const { collapsed: oldCollapsed } = prevState;
    let state = { collapsed };
    if (collapsed && !oldCollapsed) {
      state.openedKeys = undefined;
    } else if (!collapsed && oldCollapsed) {
      state.openedKeys = Menu.getOpenedKeys(nextProps);
    }
    return { ...state };
  }

  static getCurrentKey(props) {
    let { pathname } = props.location;
    let key = pathname.replace(/^\//, '');
    let currentMenu;
    while (true) {
      currentMenu = menu.find(m => isKeyMatchMenu(m, key, pathname));
      if (!currentMenu || currentMenu.menu !== false) {
        break;
      } else {
        key = currentMenu.pKey;
        pathname = pathname.replace(/\/[^/]+$/, '');
      }
      if (!key && !pathname) {
        break;
      }
    }
    return currentMenu && currentMenu.key;
  }

  static getOpenedKeys(props) {
    let currentKey = Menu.getCurrentKey(props);
    const openedKeys = [];

    let pKey = menuMap[currentKey]?.pKey;
    while (pKey) {
      openedKeys.push(pKey);
      pKey = menuMap[pKey]?.pKey;
    }
    return openedKeys;
  }

  handleOpenChange = keys => {
    const { openedKeys = [] } = this.state;
    if (keys.length < openedKeys.length) {
      this.setState({ openedKeys: keys });
    } else {
      const oldSet = new Set(openedKeys);
      let addKey = '';
      for (let k of keys) {
        if (!oldSet.has(k)) {
          addKey = k;
          break;
        }
      }

      const addPKey = menuMap[addKey].pKey;
      const newOpenedKeys = keys.filter(k => {
        return k === addKey || menuMap[k].pKey !== addPKey;
      });
      this.setState({
        openedKeys: newOpenedKeys,
      });
    }
  };

  renderMenu([...menus]) {

    const {
      app: { permissions = [] },
    } = this.props;
    menus.sort((a, b) => {
      let first = menuSort.find(m => m === a.key || m === b.key);
      return !first || first === a.key ? -1 : 1;
    });
    return menus.map(m => {
      if (m.children) {
        return (
          <ReactAuthority key={m.key} code={m.code} permission={permissions}>
            <AntMenu.SubMenu
              key={m.key}
              title={
                <span>
                  <Icon type={m.icon} />
                  <span>{m.title}</span>
                </span>
              }
            >
              {this.renderMenu(m.children)}
            </AntMenu.SubMenu>
          </ReactAuthority>
        );
      } else {
        return (
          <ReactAuthority key={m.key} code={m.code} permission={permissions}>
            <AntMenu.Item key={m.key}>
              <Link to={m.route}>
                <Icon type={m.icon} />
                <span>{m.title}</span>
              </Link>
            </AntMenu.Item>
          </ReactAuthority>
        );
      }
    });
  }

  componentDidUpdate() {
    const defaultSelectedKeys = [Menu.getCurrentKey(this.props)];
    if (this.state.defaultSelectedKeys[0] !== defaultSelectedKeys[0]) {
      this.setState({defaultSelectedKeys});
    }
  }

  render() {
    const { collapsed, defaultSelectedKeys, openedKeys } = this.state;
    const { collapsedWidth } = this.props;
    const openKeyProps = {};
    if (openedKeys) {
      openKeyProps.openKeys = openedKeys;
    }
    const WrapperComponent = this.props.affix ? Affix : Fragment;
    return (
      <WrapperComponent>
        <AntMenu
          theme="light"
          mode={collapsed ? 'vertical' : 'inline'}
          // inlineCollapsed={collapsed}
          selectedKeys={defaultSelectedKeys}
          {...openKeyProps}
          onOpenChange={this.handleOpenChange}
          style={{ width: collapsed ? collapsedWidth : 'auto' }}
          onSelect={({selectedKeys}) => this.setState({defaultSelectedKeys: selectedKeys}) }
        >
          {/* <div className={styles.menuLogo}>
            <img src={logo} className={styles.logo} />
            <img src={text} className={styles.text} />
          </div> */}
          {this.renderMenu(this.menuTree)}
        </AntMenu>
      </WrapperComponent>
    );
  }
}

export default withRouter(
  connect(({ app, loading }) => ({ app, loading }))(Menu),
);
