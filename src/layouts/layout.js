import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Helmet } from 'react-helmet';
import { withRouter } from 'dva/router';
import config from 'utils/config';
import EmptyLayout from './emptyLayout';
import NormalLayout from './normalLayout';

const { emptyLayoutPages = [], menu, normalLayoutSetting } = config;

const Layout = props => {
  const { children, location } = props;

  let { pathname } = location;
  pathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
  let PageLayout = NormalLayout;
  if (emptyLayoutPages.includes(pathname)) {
    PageLayout = EmptyLayout;
  }

  let layoutSetting = normalLayoutSetting[pathname] || {};

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
  tabTitle = '翠鸟股票交易软件' // [tabTitle, '翠鸟股票交易软件'].filter(c => c).join(' - ');

  return (
    <PageLayout {...props} layoutSetting={layoutSetting}>
      <Helmet>
        <title>{tabTitle}</title>
      </Helmet>
      {children}
    </PageLayout>
  );
};

Layout.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
};

export default withRouter(
  connect(({ app, loading }) => ({ app, loading }))(Layout),
);
