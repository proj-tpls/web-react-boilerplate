export default [
  {
    path: '/',
    component: require('E:\\projects\\iguzhi\\xy\\app\\webApp\\mc-client\\src\\layouts\\index.js').default,
    routes: [
      {
        path: '/',
        exact: true,
        component: require('E:\\projects\\iguzhi\\xy\\app\\webApp\\mc-client\\src\\pages\\index.js').default,
      },
      {
        path: '/notfound',
        exact: true,
        component: require('E:\\projects\\iguzhi\\xy\\app\\webApp\\mc-client\\src\\pages\\notfound\\index.js').default,
      },
      {
        path: '/workbench',
        exact: true,
        component: require('E:\\projects\\iguzhi\\xy\\app\\webApp\\mc-client\\src\\pages\\workbench\\index.js').default,
      },
    ],
  },
];
