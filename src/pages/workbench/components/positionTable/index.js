import React, { Component, Fragment } from 'react';
import { Table, Radio } from 'antd';
import { connect } from 'dva';
import tableColumnsData from 'utils/tableColumns';
import helper from 'utils/helper';
import { Direction, PositionDirection } from 'utils/dict';

import styles from './index.css';

const RadioGroup = Radio.Group;

const emptyData = null;
class PositionTable extends Component {

  state = {
    tableType: 'position'
  };

  onRadioChange = e => {
    this.setState({
      tableType: e.target.value
    });
  }

  get totalColumns() {
    const { workBench } = this.props;
    const { tableHeaderDict, tableColumns } = workBench;

    // stockCode: '002765',
    //    stockName: '蓝黛科技',
    //    position: '9000',
    //    availableBalance: '9000',
    //    buyFrozen: '0',
    //    sellFrozen: '0',
    //    referencePL: '783.90',
    //    plRatio: '1.50',
    //    marketValue: '53010.00',
    //    referenceCostPrice: '5.803',
    //    referenceMarketPrice: '5.890',
    //    shareBalance: '9000',
    //    shareHolderCode: '0186889253',
    //    tradingMarket: '深圳A股',

    const columns = tableColumnsData.position.filter(column => !tableColumns.position || tableColumns.position.indexOf(column.dataIndex) !== -1);

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

  shouldComponentUpdate(nextProps, nextState) {
    const { workBench } = this.props;
    const { position, deepQuotes, doTPosition } = workBench;
    return !helper.shallowEqual(position, nextProps.workBench.position) ||
      !helper.shallowEqual(deepQuotes, nextProps.workBench.deepQuotes) ||
      !helper.shallowEqual(doTPosition, nextProps.workBench.doTPosition) ||
      !helper.shallowEqual(this.state, nextState);
  }

  selectStock(stock) {
    const { dispatch, workBench } = this.props;
    const { stockInput, deepQuotes, login, shareHolderCode, optionalStocks } = workBench;
    const stockCode = stock.stockCode;
    // if (!/^\d{0,6}$/.test(stockCode)) {
    //   return;
    // }

    if (!stockCode) {
      // this.showMsg('请输入证券代码');
      return;
    }

    if (stockCode.length < 6) {
      return;
    }

    const newStockInput = { ...stockInput, stockCode };

    if (deepQuotes.success && deepQuotes.data[stockCode]) {
      const exchangeId = optionalStocks[stockCode] && optionalStocks[stockCode].accountType || helper.getExchangeIdFromStockCode(stockCode, false);

      if (exchangeId && shareHolderCode.success) {
        const selectShareHolderCodeItem = shareHolderCode.data.filter(item => item.accountType == exchangeId)[0];
        if (selectShareHolderCodeItem) {
          newStockInput.shareHolderCode = selectShareHolderCodeItem.shareHolderCode;
        }
      }

      const selectedStock = deepQuotes.data[stockCode];
      newStockInput.price = selectedStock.lastPrice;
      dispatch({
        type: 'workBench/putState',
        payload: {
          selectedStock,
          stockInput: newStockInput
        }
      });
    }
    else {
      if (!login.success) {
        this.showMsg('请先登录');
        return;
      }
      dispatch({
        type: 'workBench/putState',
        payload: {
          stockInput: newStockInput
        }
      });
      window.td_socket.emit('json', { type: 'optionalStock', payload: { stockCode, userId: login.data.userId } });
    }
  }

  render() {
    const { workBench } = this.props;
    const { position, deepQuotes, doTPosition } = workBench;
    const { tableType } = this.state;
    let data, columns;

    if (tableType === 'doTPosition') {
      columns = tableColumnsData.dayPosition;

      if (doTPosition.success) {
        doTPosition.data.forEach(item => {
          if (deepQuotes.success) {
            const quote = deepQuotes.data[item.stockCode];
            if (!quote || !quote.lastPrice) {
              return;
            }
            item.lastPrice = quote.lastPrice;
            item.priceLimit = quote.priceLimit;
            item.dynamicPL = item.direction === PositionDirection.LONG ? (item.lastPrice - item.avgPrice) * item.volume : (item.avgPrice - item.lastPrice) * item.volume;
          }
        });
        data = doTPosition.data;
      }
      else {
        data = emptyData;
      }
    }
    else { // tableType === 'position'
      columns = this.totalColumns;
      if (position.success) {
        data = position.data.filter(item => item.position !== '0');
        deepQuotes.success &&
        data.forEach(item => {
          const quote = deepQuotes.data[item.stockCode];
          if (!quote || !quote.lastPrice) {
            return;
          }
          const n = +item.position;
          const referenceCostPrice = +item.referenceCostPrice;
          item.referenceMarketPrice = quote.lastPrice;
          const priceDiff = quote.lastPrice - referenceCostPrice;
          const marketValue = quote.lastPrice * n;
          const referencePL = priceDiff * n;
          item.marketValue = marketValue.toFixed(2);
          item.referencePL = referencePL.toFixed(2);
          item.plRatio = (referencePL * 100 / marketValue).toFixed(2) + '%';
        });
      }
      else {
        data = emptyData;
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
      <Fragment>
        <Table
          className={styles.table}
          bordered
          columns={columns}
          dataSource={data}
          pagination={false}
          size={'small'}
          rowKey='stockCode'
          onRow={record => {
            return {
              onDoubleClick: () => this.selectStock(record),
            };
          }}
        />
        <RadioGroup onChange={this.onRadioChange} defaultValue='position' className={styles.radioGroup}>
          <Radio value='doTPosition'>做T持仓</Radio>
          {/* <Radio value='detail'>明细</Radio> */}
          <Radio value='position'>持股汇总</Radio>
        </RadioGroup>
      </Fragment>
    );
  }
}

export default connect((model) => (model))(PositionTable);
