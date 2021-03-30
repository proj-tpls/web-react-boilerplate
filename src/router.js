import React from 'react';
import { Route } from 'react-router-dom';
import { routerRedux } from 'dva/router';
import { createBrowserHistory, createHashHistory } from 'history';

import renderRoutes from 'utils/renderRoutes';
import routes from './.torenia/router';

const notfoundIndex = routes[0].routes.findIndex(m => m.path === '/notfound');
const notfound = routes[0].routes.splice(notfoundIndex, 1);
routes[0].routes.push(notfound[0]);

const { ConnectedRouter } = routerRedux;

window.g_history = createHashHistory({
  basename: window.routerBase,
});

export default () => (
  <ConnectedRouter history={window.g_history}>
    <Route render={({ location }) => renderRoutes(routes, {}, { location })} />
  </ConnectedRouter>
);
