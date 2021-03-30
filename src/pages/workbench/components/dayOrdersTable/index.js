import React, { Component } from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
import tableColumnsData from 'utils/tableColumns';
import helper from 'utils/helper';
import { cancelOrder } from 'utils/trade';

// import styles from './index.css';

const emptyData = null;
class DayOrdersTable extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    const { workBench } = this.props;
    const { tableHeaderDict, tableColumns, dayOrders } = workBench;

    return !helper.shallowEqual(tableHeaderDict, nextProps.workBench.tableHeaderDict) ||
      !helper.shallowEqual(tableColumns, nextProps.workBench.tableColumns) ||
      !helper.shallowEqual(dayOrders, nextProps.workBench.dayOrders);
  }

  get columns() {
    const { workBench } = this.props;
    const { tableHeaderDict, tableColumns } = workBench;

    // orderId: '72985',
    //    stockCode: '002610',
    //    stockName: '爱康科技',
    //    direction: '证券卖出',
    //    orderPrice: '2.440',
    //    orderVolume: '38200',
    //    tradedVolume: '38200',
    //    turnover: '93208.00',
    //    tradedAvgPrice: '2.440',
    //    orderStatus: '已成',
    //    orderTime: '09:34:55',
    //    shareHolderCode: '0186889253',
    //    tradingMarket: '深圳A股',

    const columns = tableColumnsData.dayOrders.filter(column => !tableColumns.dayOrders || tableColumns.dayOrders.indexOf(column.dataIndex) !== -1);

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
    const { dayOrders } = workBench;
    const data = dayOrders.success ? dayOrders.data : emptyData;
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

export default connect((model) => (model))(DayOrdersTable);
