import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, message, Select, Button, Checkbox, InputNumber, Tooltip } from 'antd';
import config from 'utils/config';
import helper from 'utils/helper';
import { sendOrder } from 'utils/trade';


import styles from './index.css';

// const CheckboxGroup = Checkbox.Group;

const Option = Select.Option;
// const InputGroup = Input.Group;
class StockInput extends Component {

  componentDidMount() {
    setTimeout(() => {
      const { dispatch, workBench } = this.props;
      const { defaultVolume, stockInput } = workBench;
      dispatch({
        type: 'workBench/putState',
        payload: {
          stockInput: {
            ...stockInput,
            volume: defaultVolume.value
          }
        }
      });
    });
  }

  handleStockHolderChange = (value) => {
    const { dispatch, workBench } = this.props;
    const { stockInput } = workBench;
    dispatch({
      type: 'workBench/putState',
      payload: {
        stockInput: {
          ...stockInput,
          shareHolderCode: value
        }
      }
    });
  }

  handleStockCodeInputChange = e => {
    const stockCode = e.target.value;
    if (!/^\d{0,6}$/.test(stockCode)) {
      return;
    }

    const { dispatch, workBench } = this.props;
    const { stockInput/*, shareHolderCode*/ } = workBench;
    // const exchangeId = helper.getExchangeIdFromStockCode(stockCode, false);

    dispatch({
      type: 'workBench/putState',
      payload: {
        stockInput: {
          ...stockInput,
          stockCode: stockCode,
          // shareHolderCode: exchangeId && shareHolderCode.success && shareHolderCode.data.filter(item => item.accountType == exchangeId)[0]
        }
      }
    });
  }

  handleStockCodeInputBlur = () => {
    const { dispatch, workBench } = this.props;
    const { stockInput, deepQuotes, login, shareHolderCode, optionalStocks } = workBench;
    const stockCode = stockInput.stockCode;
    // if (!/^\d{0,6}$/.test(stockCode)) {
    //   return;
    // }

    if (!stockCode) {
      // this.showMsg('?????????????????????');
      return;
    }

    if (stockCode.length < 6) {
      return;
    }

    if (deepQuotes.success && deepQuotes.data[stockCode]) {
      const exchangeId = optionalStocks[stockCode] && optionalStocks[stockCode].accountType || helper.getExchangeIdFromStockCode(stockCode, false);

      const newStockInput = { ...stockInput };

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
        this.showMsg('????????????');
        return;
      }
      window.td_socket.emit('json', { type: 'optionalStock', payload: { stockCode, userId: login.data.userId } });
    }
  }

  handleStockCodeInputPress = e => {
    if (e.charCode !== 13) {
      return;
    }

    this.handleStockCodeInputBlur();
  }

  showMsg(msg) {
    message.info(msg);
  }

  handleVolumeBlur = (e) => {
    const { dispatch, workBench } = this.props;
    const { stockInput } = workBench;
    let volume = e.target.value;

    if (volume.length >= 3) {
      if (!/00$/.test(volume)) {
        // ???????????????, ???????????????????????????????????????102???, ???????????????????????????????????????, ????????????????????????????????????????????????????????????200
        // ??????????????????????????????????????????????????????????????????????????????, ???????????????100, ????????????100????????????2???, ?????????????????????
        volume = Math.ceil(+volume / 100) * 100;
      }
      volume = +volume;
      if (volume < config.minVolume) {
        volume = config.minVolume;
      }
    }
    else {
      volume = config.minVolume;
    }

    dispatch({
      type: 'workBench/putState',
      payload: {
        stockInput: {
          ...stockInput,
          volume
        }
      }
    });
  }

  handleVolumeChange = (e) => {
    const volume = e.target.value;
    if (!/^\d*$/.test(volume)) {
      return;
    }

    const { dispatch, workBench } = this.props;
    const { stockInput } = workBench;
    dispatch({
      type: 'workBench/putState',
      payload: {
        stockInput: {
          ...stockInput,
          volume: +volume
        }
      }
    });
  }

  handleRapidChange = (e) => {
    const { dispatch, workBench } = this.props;
    const { stockInput } = workBench;
    dispatch({
      type: 'workBench/putState',
      payload: {
        stockInput: {
          ...stockInput,
          enableShortcut: e.target.checked
        }
      }
    });
  }

  handleDoTChange = (e) => {
    const { dispatch, workBench } = this.props;
    const { stockInput } = workBench;
    dispatch({
      type: 'workBench/putState',
      payload: {
        stockInput: {
          ...stockInput,
          enableDoT: e.target.checked
        }
      }
    });
  }

  handlePriceChange = (price) => {
    if (!/^\d*(\.\d*)?$/.test(price)) {
      return;
    }
    const { dispatch, workBench } = this.props;
    const { stockInput } = workBench;
    dispatch({
      type: 'workBench/putState',
      payload: {
        stockInput: {
          ...stockInput,
          price
        }
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { workBench } = this.props;
    const { shareHolderCode, /*selectedStock, */stockInput, shortcut } = workBench;
    return !helper.shallowEqual(shareHolderCode, nextProps.workBench.shareHolderCode) ||
    !helper.shallowEqual(shortcut.priceStep, nextProps.workBench.shortcut.priceStep) ||
      // !helper.shallowEqual(selectedStock, nextProps.workBench.selectedStock) ||
      !helper.shallowEqual(stockInput, nextProps.workBench.stockInput);
  }

  doTrade(direction) {
    const { workBench } = this.props;
    const { stockInput } = workBench;
    const { stockCode, shareHolderCode, volume, price } = stockInput;

    if (!stockCode) {
      message.warn('???????????????????????????????????????');
      return;
    }

    sendOrder({
      stockCode,
      direction,
      volume,
      price,
      shareHolderCode
    });
  }

  render() {
    const { workBench } = this.props;
    const { shareHolderCode, /*selectedStock, */stockInput, shortcut } = workBench;
    // const stockCode = selectedStock ? selectedStock.stockCode : '';
    const { stockCode, volume, price, enableShortcut, enableDoT } = stockInput;
    const options = [];
    if (shareHolderCode.success) {
      shareHolderCode.data.forEach(item => {
        let market;
        switch(item.accountType) {
          case '0':
            market = '??????';
            break;
          case '1':
            market = '??????';
            break;
          default:
            market = '';
        }
        options.push(<Option key={item.shareHolderCode} value={item.shareHolderCode}>{item.shareHolderName + ' ' + item.shareHolderCode + ' ' + market}</Option>);
      });
    }
    return (
      <div className={styles.container}>
        <div>
          <div className={styles.title}>????????????</div>
          <Input
            style={{ width: '80px', marginRight: '10px' }}
            value={stockCode}
            onChange={this.handleStockCodeInputChange}
            onKeyPress={this.handleStockCodeInputPress}
            onBlur={this.handleStockCodeInputBlur}
          />
        </div>
        <div>
          <div className={styles.title}>????????????</div>
          <Input
            style={{ width: '150px', marginRight: '10px' }}
            addonAfter='???'
            value={volume}
            onChange={this.handleVolumeChange}
            onBlur={this.handleVolumeBlur}
          />
        </div>
        <div>
          <div className={styles.title}>????????????</div>
          <InputNumber
            style={{ width: '120px', marginRight: '10px' }}
            value={price}
            onChange={this.handlePriceChange}
            step={shortcut.priceStep || 0.01}
            min={0}
            // onBlur={this.handleVolumeBlur}
          />
        </div>
        <div>
          <div className={styles.title}>????????????</div>
          <Select style={{ width: '210px', marginRight: '10px' }} value={stockInput.shareHolderCode} onChange={this.handleStockHolderChange} allowClear placeholder='?????????????????????'>{options}</Select>
        </div>

        <Button className={styles.buyBtn} style={{ marginRight: '10px' }} onClick={() => this.doTrade('buy')}>???(B)</Button>
        <Button className={styles.sellBtn} style={{ marginRight: '10px' }} onClick={() => this.doTrade('sell')}>???(S)</Button>
        <div className={styles.checkboxGroup}>
          <Tooltip placement='top' title='?????????????????????????????????'>
            <Checkbox onChange={this.handleRapidChange} checked={enableShortcut}>??????</Checkbox>
          </Tooltip>
          <Tooltip placement='bottom' title='??????????????????T????????????????????????????????????'>
          <Checkbox onChange={this.handleDoTChange} checked={enableDoT} style={{marginLeft: 0}}>???T</Checkbox>
          </Tooltip>
        </div>
      </div>
    );
  }
}

export default connect((model) => (model))(StockInput);
