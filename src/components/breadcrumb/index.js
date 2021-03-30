import React, { PureComponent } from 'react';
import { Breadcrumb as AntBreadcrumb, Icon } from 'antd';
import { Link } from 'dva/router';
import config from 'utils/config';

const { menu } = config;

class Breadcrumb extends PureComponent {

  itemRender = (route, params, routes, paths) => {
    const last = routes.indexOf(route) === routes.length - 1;
    return last ? (
      <span>{route.breadcrumbName}</span>
    ) : (
      <Link to={`/${paths.join('/')}`} style={{WebkitAppRegion: 'no-drag'}}>{route.breadcrumbName}</Link>
    );
  };
  get routes() {
    let {
      location: { pathname },
      app: { breadcrumbRoutes: routes },
    } = this.props;
    if (routes) {
      return routes;
    }
    let paths = pathname.split('/').filter(p => p);
    paths = paths.map(p => ({ path: `/${p}` }));
    paths.reduce((url, p) => {
      const pathname = `${url}${p.path}`;
      let tabTitle = '';
      const m = menu.find(m => {
        if (m.route.includes(':id')) {
          const reg = new RegExp(`^${m.route.replace(/:id/g, '[^/]+')}$`);
          return reg.test(pathname);
        } else {
          return m.route === pathname;
        }
      });
      if (m) {
        tabTitle = m.route.endsWith(':id')
          ? pathname.split('/').pop()
          : m.title ?? '';
      }
      p.breadcrumbName = tabTitle;
      return pathname === '/' ? '' : pathname;
    }, '');

    return paths.filter(p => p.breadcrumbName);
  }

  render() {
    return (
      <AntBreadcrumb
        style={{
          padding: '15px',
          background: '#fff',
          WebkitAppRegion: 'drag',
          WebkitUserSelect: 'none'
        }}
        itemRender={this.itemRender}
        routes={this.routes}
        separator={<Icon type="caret-right"/>}
      />
    );
  }
}

export default Breadcrumb;
