import React from 'react';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { withRouter } from 'react-router-dom';
import Layout from './layout';

export default withRouter(props => {
  return (
    <LocaleProvider locale={zh_CN}>
      <Layout affixSider={true} collapsedSiderWidth={50}>
        {props.children}
      </Layout>
    </LocaleProvider>
  );
});
