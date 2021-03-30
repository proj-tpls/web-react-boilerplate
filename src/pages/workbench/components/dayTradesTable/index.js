import React, { Component, Fragment } from 'react';
import { Table, Radio } from 'antd';
import { connect } from 'dva';
import tableColumnsData from 'utils/tableColumns';
import helper from 'utils/helper';
import { Direction } from 'utils/dict';

import styles from './index.css';

const RadioGroup = Radio.Group;

const emptyData = null;
class DayTradesTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tableType: 'detail'
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { workBench } = this.props;
    const { tableHeaderDict, tableColumns, dayTrades } = workBench;

    return !helper.shallowEqual(tableHeaderDict, nextProps.workBench.tableHeaderDict) ||
      !helper.shallowEqual(tableColumns, nextProps.workBench.tableColumns) ||
      !helper.shallowEqual(dayTrades, nextProps.workBench.dayTrades) ||
      !helper.shallowEqual(this.state, nextState);
  }

  get detailColumns() {
    const { workBench } = this.props;
    const { tableHeaderDict, tableColumns } = workBench;

    // orderId: '72985',
    //    tradedTime: '09:35:02',
    //    stockCode: '002610',
    //    stockName: '爱康科技',
    //    direction: '1',
    //    tradedPrice: '2.440',
    //    tradedVolume: '1100',
    //    turnover: '2684.000',
    //    shareHolderCode: '0186889253',
    //    tradingMarket: '深圳A股',
    //    tradeId: '0104000002192969',

    const columns = tableColumnsData.dayTrades.filter(column => !tableColumns.dayTrades || tableColumns.dayTrades.indexOf(column.dataIndex) !== -1);

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

  totalData(data = []) {
    const { workBench } = this.props;
    const { commonSetting } = workBench;
    const {
      leastCommissionPerTime,
      stampTaxRatio,
      commissionRatio,
      transferFeeRadio,
      stampTaxTwoSide,
      commissionRatioTwoSide,
      leastCommissionPerTimeTwoSide,
      transferFeeRadioTwoSide,
    } = commonSetting;

    const map = {};
    data && data.forEach(({ stockCode, direction, turnover, tradedPrice, tradedVolume, stockName }) => {
      let item = map[stockCode];
      if (!item) {
        item = { stockCode, stockName, buyAmount: 0, sellAmount: 0, buyVolume: 0, sellVolume: 0, amountDiff: 0, commission: 0, tVolume: 0, tProfit: 0, tCommission: 0 };
        map[stockCode] = item;
      }

      switch(direction) {
        case Direction.BUY: {
          item.buyAmount += +turnover;
          item.buyVolume += +tradedVolume;
          break;
        }
        case Direction.SELL: {
          item.sellAmount += +turnover;
          item.sellVolume += +tradedVolume;
          break;
        }
      }
    });

    for (let stockCode in map) {
      const item = map[stockCode];
      // if (!item.sellVolume) { // 只有买没有卖则不能算是做T
      //   delete map[stockCode];
      //   continue;
      // }
      item.avgBuyPrice = item.buyVolume ? item.buyAmount / item.buyVolume : 0;
      item.avgSellPrice = item.sellVolume ? item.sellAmount / item.sellVolume : 0;
      item.amountDiff = item.sellAmount - item.buyAmount;

      item.commission += stampTaxRatio * item.sellAmount;
      let commission = commissionRatio * item.sellAmount;
      item.commission += Math.max(commission, leastCommissionPerTime);
      item.commission += transferFeeRadio * item.sellAmount;
      if (stampTaxTwoSide) {
        item.commission += stampTaxRatio * item.buyAmount;
      }
      if (commissionRatioTwoSide) {
        commission = commissionRatio * item.buyAmount;
        item.commission += Math.max(commission, leastCommissionPerTimeTwoSide ? leastCommissionPerTime : 0);
      }
      if (transferFeeRadioTwoSide) {
        item.commission += transferFeeRadio * item.buyAmount;
      }
      // 有买有卖则是做T
      if (item.buyVolume && item.sellVolume) {
        item.tVolume = Math.min(item.buyVolume, item.sellVolume);
        item.tCommission = item.commission;
        item.commission = 0;
        item.tProfit = (item.avgSellPrice - item.avgBuyPrice) * item.tVolume;
      }

    }

    return Object.values(map);
  }

  onRadioChange = e => {
    this.setState({
      tableType: e.target.value
    });
  }

  render() {
    const { workBench } = this.props;
    const { dayTrades } = workBench;
    let data = dayTrades.success ? dayTrades.data.filter(item => item.tradeId !== '' && item.cancelFlag === '0') : emptyData;

    let columns = this.detailColumns;
    let rowKey = 'tradeId';
    if (this.state.tableType === 'doTTotal') { // 汇总
      columns = tableColumnsData.totalDayTrades;
      data = this.totalData(data);
      rowKey = 'stockCode';
    }

    return (
      <Fragment>
        <Table className={styles.table} bordered columns={columns} dataSource={data} pagination={false} size={'small'} rowKey={rowKey}/>
        <RadioGroup onChange={this.onRadioChange} defaultValue='detail' className={styles.radioGroup}>
          <Radio value='doTTotal'>做T成交汇总</Radio>
          <Radio value='detail'>成交明细</Radio>
        </RadioGroup>
      </Fragment>
    );
  }
}

export default connect((model) => (model))(DayTradesTable);
