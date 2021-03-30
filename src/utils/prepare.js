import { Table } from 'torenia';
import config from './config';

Table.config({
  apiPrefix: config.apiPrefix,

  globalDataPreProcess:( data = {}) => {
    const { count, rows } = data.data || {};
    return { total: count, list: rows};
  },
});

Table.defaultProps.pageType = 'currentPage',
Table.defaultProps.pageKey = {
  limit: 'pageSize',
  offset: 'pageNum',
  order: 'order',
  orderBy: 'orderBy',
};
