import React, { Component } from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
import tableColumnsData from 'utils/tableColumns';
import helper from 'utils/helper';
import { cancelOrder } from 'utils/trade';

// import styles from './index.css';

const emptyData = null;
class CancelableOrdersTable extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    const { workBench } = this.props;
    const { tableHeaderDict, tableColumns, cancelableOrders } = workBench;

    return !helper.shallowEqual(tableHeaderDict, nextProps.workBench.tableHeaderDict) ||
      !helper.shallowEqual(tableColumns, nextProps.workBench.tableColumns) ||
      !helper.shallowEqual(cancelableOrders, nextProps.workBench.cancelableOrders);
  }

  get columns() {
    const { workBench } = this.props;
    const { tableHeaderDict, tableColumns } = workBench;

    // orderDate: '20201209',
    //    actionDate: '20201209',
    //    orderTime: '09:57:06',
    //    stockCode: '003026',
    //    stockName: '中晶科技',
    //    orderStatus: '已报',
    //    direction: '配售申购',
    //    orderPrice: '13.890',
    //    orderVolume: '9500',
    //    orderId: '217823',
    //    tradedVolume: '0',
    //    cancelVolume: '0',
    //    shareHolderCode: '0186889253',

    const columns = tableColumnsData.cancelableOrders.filter(column => !tableColumns.cancelableOrders || tableColumns.cancelableOrders.indexOf(column.dataIndex) !== -1);

    if (tableHeaderDict.success) {
      const dict = tableHeaderDict.data;
      dict && columns.forEach(column => {
        const title = dict[column.dataIndex];
        if (title) {
          column.title = title;
        }
      })
    }

    return columns;
  }

  cancelOrder(stock) {
    const { workBench } = this.props;
    const { commonSetting } = workBench;
    const { doubleClickCancelOrder } = commonSetting;
    doubleClickCancelOrder && cancelOrder(stock);
  }

  render() {
    const { workBench } = this.props;
    const { cancelableOrders } = workBench;
    const data = cancelableOrders.success ? cancelableOrders.data : emptyData;
    // const columns = this.columns.map((col, index) => ({
    //   ...col,
    //   onHeaderCell: column => ({
    //     width: column.width,
    //     onResize: this.handleResize(index),
    //   }),
    // }));

    return (
      <Table
        bordered
        columns={this.columns}
        dataSource={data}
        pagination={false}
        size='small'
        rowKey='orderId'
        onRow={record => {
          return {
            onDoubleClick: () => this.cancelOrder(record),
          };
        }}
      />
    );
  }
}

export default connect((model) => (model))(CancelableOrdersTable);
