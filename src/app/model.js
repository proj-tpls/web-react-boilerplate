// import { currentUser, logout, getMachineId, tradeDict, now } from './service';
// import { isSuccess } from 'utils/request';
// import config from 'utils/config';
import { routerRedux } from 'dva/router';

// const { noPerssmisionPages } = config;

export default {
  namespace: 'app',
  state: {
    // userInfo: null,
    // tradeDict: null,
    // machineId: null,
    // roles: [],
    // now: null,
    // permissions: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(async(location, type) => {
        const { pathname } = location;
        // if (!noPerssmisionPages.includes(pathname)) {
        //   dispatch({
        //     type: 'currentUserInfo',
        //   });
        // }
        if (pathname === '/') {
          dispatch(routerRedux.replace('/workbench'));
        }
        // else {
        //   dispatch(routerRedux.replace('/tradeReview'));
        // }
        // dispatch({
        //   type: 'currentUserInfo',
        // });
        // const { pathname } = location;
        // if (!this.state.userInfo) {
        //   if (!type && !noPerssmisionPages.includes(pathname)) {
        //     dispatch(routerRedux.replace('/login'));
        //   }
        //   else {
        //     dispatch(routerRedux.replace('/tradeReview'));
        //   }
        // }
        // else if (pathname === '/') {
        //   dispatch(routerRedux.replace('/tradeReview'));
        // }
      });
    },
  },
  effects: {

  },
  reducers: {
    putState(state, { payload }) {
      return { ...state, ...payload };
    },
    putBreadcrumbRoutes(state, { payload }) {
      return { ...state, breadcrumbRoutes: payload };
    },
  },
};
