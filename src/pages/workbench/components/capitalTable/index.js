import React, { Component } from 'react';
import { Table, Button } from 'antd';
import { connect } from 'dva';
import tableColumnsData from 'utils/tableColumns';
import helper from 'utils/helper';

import styles from './index.css';

const emptyData = [{}];
class CapitalTable extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    const { workBench } = this.props;
    const { tableHeaderDict, tableColumns, capital, deepQuotes, position } = workBench;

    return !helper.shallowEqual(tableHeaderDict, nextProps.workBench.tableHeaderDict) ||
      !helper.shallowEqual(tableColumns, nextProps.workBench.tableColumns) ||
      !helper.shallowEqual(capital, nextProps.workBench.capital) ||
      !helper.shallowEqual(position, nextProps.workBench.position) ||
      !helper.shallowEqual(deepQuotes, nextProps.workBench.deepQuotes);
  }

  refresh = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.isRefreshBySearch = true;
    const userId = sessionStorage.getItem('kingfisher_userid');
    window.td_socket.emit('json', { type: 'refresh', payload: { userId } });
    this.timer = setTimeout(() => this.isRefreshBySearch = false, 1000);
  }

  get columns() {
    const { workBench } = this.props;
    const { tableHeaderDict, tableColumns } = workBench;

    const columns = tableColumnsData.capital.filter(column => !tableColumns.capital || tableColumns.capital.indexOf(column.dataIndex) !== -1);

    if (tableHeaderDict.success) {
      const dict = tableHeaderDict.data;
      dict && columns.forEach(column => {
        const title = dict[column.dataIndex];
        if (title) {
          column.title = title;
        }
      })
    }

    // columns.push({
    //   title: '操作',
    //   dataIndex: '',
    //   key: 'action',
    //   width: 60,
    //   render: () => <Button type='primary' size='small' onClick={this.refreshCapital}>查询(Q)</Button>,
    // });

    return columns;
  }

  // components = {
  //   header: {
  //     cell: ResizeableTableHeader,
  //   },
  // };

  // handleResize = index => (e, { size }) => {
  //   this.setState(({ columns }) => {
  //     const nextColumns = [...columns];
  //     nextColumns[index] = {
  //       ...nextColumns[index],
  //       width: size.width,
  //     };
  //     return { columns: nextColumns };
  //   });
  // };

  render() {
    const { workBench } = this.props;
    const { capital, position, deepQuotes } = workBench;

    let data;
    if (capital.success) {
      data = capital.data;
    }
    else {
      data = emptyData;
    }

    const capitalData = data[0];

    if (!this.isRefreshBySearch && capitalData.hasOwnProperty('balance') && position.success && deepQuotes.success) {
      const positionList = position.data.filter(item => item.position !== '0');
      let marketValue = 0, useDynamic = true;
      for (let item of positionList) {
        const quote = deepQuotes.data[item.stockCode];
        if (!quote || !quote.lastPrice) {
          useDynamic = false;
          break;
        }
        const n = +item.position;
        marketValue += quote.lastPrice * n;
      }

      if (useDynamic) {
        capitalData.marketValue = marketValue.toFixed(2);
        capitalData.total = (marketValue + (+capitalData.available) + (+capitalData.frozen)).toFixed(2);
      }
    }
    // const columns = this.columns.map((col, index) => ({
    //   ...col,
    //   onHeaderCell: column => ({
    //     width: column.width,
    //     onResize: this.handleResize(index),
    //   }),
    // }));

    return (
      <div className={styles.container}>
        <Table className='capital-table' bordered columns={this.columns} dataSource={data} pagination={false} size={'small'} rowKey='userId'/>
        <Button className={styles.refreshBtn} type='primary' onClick={this.refresh}>查询(Q)</Button>
      </div>
    );
  }
}

export default connect((model) => (model))(CapitalTable);
