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
      // this.showMsg('请输入证券代码');
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
        this.showMsg('请先登录');
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
        // 向上取整百, 这么做的原因是考虑假设持股102股, 但由于这里输入股数必须整百, 若想能把持股全部卖委托则只能向上取整百为200
        // 当实际报单时会取持股量与这里的设置的值最小值进行报单, 若取整百为100, 则只会报100股单还剩2股, 这样是不合理的
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
      message.warn('请先选择股票或输入股票代码');
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
            market = '深圳';
            break;
          case '1':
            market = '上海';
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
          <div className={styles.title}>证券代码</div>
          <Input
            style={{ width: '80px', marginRight: '10px' }}
            value={stockCode}
            onChange={this.handleStockCodeInputChange}
            onKeyPress={this.handleStockCodeInputPress}
            onBlur={this.handleStockCodeInputBlur}
          />
        </div>
        <div>
          <div className={styles.title}>委托数量</div>
          <Input
            style={{ width: '150px', marginRight: '10px' }}
            addonAfter='股'
            value={volume}
            onChange={this.handleVolumeChange}
            onBlur={this.handleVolumeBlur}
          />
        </div>
        <div>
          <div className={styles.title}>委托价格</div>
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
          <div className={styles.title}>股东代码</div>
          <Select style={{ width: '210px', marginRight: '10px' }} value={stockInput.shareHolderCode} onChange={this.handleStockHolderChange} allowClear placeholder='请选择股东代码'>{options}</Select>
        </div>

        <Button className={styles.buyBtn} style={{ marginRight: '10px' }} onClick={() => this.doTrade('buy')}>买(B)</Button>
        <Button className={styles.sellBtn} style={{ marginRight: '10px' }} onClick={() => this.doTrade('sell')}>卖(S)</Button>
        <div className={styles.checkboxGroup}>
          <Tooltip placement='top' title='勾选后可使用快捷键功能'>
            <Checkbox onChange={this.handleRapidChange} checked={enableShortcut}>快速</Checkbox>
          </Tooltip>
          <Tooltip placement='bottom' title='勾选后将以做T交易模式限制最大下单数量'>
          <Checkbox onChange={this.handleDoTChange} checked={enableDoT} style={{marginLeft: 0}}>做T</Checkbox>
          </Tooltip>
        </div>
      </div>
    );
  }
}

export default connect((model) => (model))(StockInput);
