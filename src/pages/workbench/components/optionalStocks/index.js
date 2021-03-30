import React, { Component } from 'react';
import { Button, message, Input, Row, Col } from 'antd';
import { connect } from 'dva';
import helper from 'utils/helper';

import styles from './index.css';

class OptionalStocks extends Component {

  state = {
    msg: '',
    stockCode: ''
  }

  showMsg(content, millisec = 3000) {
    this.msgTimer && clearTimeout(this.msgTimer);
    this.setState({
      msg: content
    }, () => {
      this.msgTimer = setTimeout(() => this.setState({ msg: '' }), millisec);
    });
  }

  handleInputChange = (e) => {
    const stockCode = e.target.value;
    if (!/^\d{0,6}$/.test(stockCode)) {
      return;
    }
    this.setState({
      stockCode
    });
  }

  addStock = () => {
    const { workBench } = this.props;
    const { optionalStocks, login } = workBench;
    const { stockCode } = this.state;

    if (!login.success) {
      this.showMsg('请先登录');
      return;
    }

    if (!stockCode) {
      this.showMsg('请输入证券代码');
      return;
    }

    if (optionalStocks[stockCode]) {
      this.showMsg(`请勿重复添加 ${stockCode}`);
      return;
    }

    // if (Object.values(optionalStocks).length >= 10) {
    //   this.showMsg('最多添加10只证券');
    //   return;
    // }

    window.td_socket.emit('json', { type: 'optionalStock', payload: { stockCode, userId: login.data.userId } });
    this.setState({
      stockCode: ''
    });
  }

  removeStock = (stockCode) => {
    this.props.dispatch({
      type: 'workBench/removeOptionStocks',
      payload: { stockCode }
    });
  }

  componentWillUnmount() {
    if (this.msgTimer) {
      clearTimeout(this.msgTimer);
      this.msgTimer = null;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { workBench } = this.props;
    const { optionalStocks } = workBench;
    return !helper.shallowEqual(optionalStocks, nextProps.workBench.optionalStocks) ||
      !helper.shallowEqual(this.state, nextState);
  }

  render() {
    const { workBench } = this.props;
    const { optionalStocks } = workBench;
    const stockList = [];
    for (let stockCode in optionalStocks) {
      const stock = optionalStocks[stockCode];
      stockList.push(
        <Row type="flex" className={styles.stockRow} key={stockCode}>
          <Col span={9} style={{padding: '0 11px'}}>{stockCode}</Col>
          <Col span={9} style={{padding: '0 11px'}}>{stock.stockName}</Col>
          <Col span={6}><Button type='link' size='small' style={{width: '100%'}} onClick={() => this.removeStock(stockCode)}>移除</Button></Col>
        </Row>
      );
    }

    const { msg, stockCode } = this.state;
    return (
      <div className={styles.container}>
        <Row type="flex">
          <Col span={18}>
            <Input
              allowClear
              style={{ width: '100%', paddingRight: '12px' }}
              addonBefore='证券代码'
              onChange={this.handleInputChange}
              value={stockCode}
              onPressEnter={this.addStock}
              // placeholder="请输入证券代码"
            />
          </Col>
          <Col span={6}><Button type='primary' style={{width: '100%'}} onClick={this.addStock}>添加</Button></Col>
        </Row>
        <div className={styles.tip}>{msg}</div>
        <div className={styles.stockList}>{stockList}</div>
      </div>
    );
  }
}

export default connect((model) => (model))(OptionalStocks);
