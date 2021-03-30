import React, { Component, Fragment } from 'react';
// import { Table, Row, Col } from 'antd';
import { connect } from 'dva';
import helper from 'utils/helper';

import styles from './index.css';

const upColor = '#ea2705';
const downColor = '#07b707';

class Level2Quote extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    const { workBench } = this.props;
    const { deepQuotes, optionalStocks, selectedStock } = workBench;

    return !helper.shallowEqual(deepQuotes, nextProps.workBench.deepQuotes) ||
      !helper.shallowEqual(optionalStocks, nextProps.workBench.optionalStocks) ||
      !helper.shallowEqual(selectedStock, nextProps.workBench.selectedStock);
  }

  render() {
    const { workBench } = this.props;
    const {
      // level2Quote,
      deepQuotes,
      optionalStocks,
      selectedStock
    } = workBench;
    let quote, totalAskVol = 0, totalBidVol = 0;
    const quoteList = [];
    if (deepQuotes.success && deepQuotes.count) {
      const level2Quote = {
        data: selectedStock && deepQuotes.data[selectedStock.stockCode] ? {
          [selectedStock.stockCode]: deepQuotes.data[selectedStock.stockCode]
        } : {}
      };
      for (let stockCode in level2Quote.data) {
        const precision = helper.isETF(stockCode) ? 3 : 2;
        quote = level2Quote.data[stockCode];
        const stock = optionalStocks[stockCode];
        quote.stockName = stock && stock.stockName || '';

        if (helper.isNumber(quote.askPrice10)) {
          quoteList.push(
            <div className={styles.row} key='ask10'>
              <span className={styles.label}>卖十</span>
              <span className={styles.price} style={calcColor(selectedStock, quote.askPrice10)}>{toFixedPrice(quote.askPrice10, precision)}</span>
              <span className={styles.volume}>{toFixedVolume(quote.askVolume10)}</span>
            </div>
          );
          totalAskVol += quote.askVolume10;
        }
        if (helper.isNumber(quote.askPrice9)) {
          quoteList.push(
            <div className={styles.row} key='ask9'>
              <span className={styles.label}>卖九</span>
              <span className={styles.price} style={calcColor(selectedStock, quote.askPrice9)}>{toFixedPrice(quote.askPrice9, precision)}</span>
              <span className={styles.volume}>{toFixedVolume(quote.askVolume9)}</span>
            </div>
          );
          totalAskVol += quote.askVolume9;
        }
        if (helper.isNumber(quote.askPrice8)) {
          quoteList.push(
            <div className={styles.row} key='ask8'>
              <span className={styles.label}>卖八</span>
              <span className={styles.price} style={calcColor(selectedStock, quote.askPrice8)}>{toFixedPrice(quote.askPrice8, precision)}</span>
              <span className={styles.volume}>{toFixedVolume(quote.askVolume8)}</span>
            </div>
          );
          totalAskVol += quote.askVolume8;
        }
        if (helper.isNumber(quote.askPrice7)) {
          quoteList.push(
            <div className={styles.row} key='ask7'>
              <span className={styles.label}>卖七</span>
              <span className={styles.price} style={calcColor(selectedStock, quote.askPrice7)}>{toFixedPrice(quote.askPrice7, precision)}</span>
              <span className={styles.volume}>{toFixedVolume(quote.askVolume7)}</span>
            </div>
          );
          totalAskVol += quote.askVolume7;
        }
        if (helper.isNumber(quote.askPrice6)) {
          quoteList.push(
            <div className={styles.row} key='ask6'>
              <span className={styles.label}>卖六</span>
              <span className={styles.price} style={calcColor(selectedStock, quote.askPrice6)}>{toFixedPrice(quote.askPrice6, precision)}</span>
              <span className={styles.volume}>{toFixedVolume(quote.askVolume6)}</span>
            </div>
          );
          totalAskVol += quote.askVolume6;
        }
        if (helper.isNumber(quote.askPrice5)) {
          quoteList.push(
            <div className={styles.row} key='ask5'>
              <span className={styles.label}>卖五</span>
              <span className={styles.price} style={calcColor(selectedStock, quote.askPrice5)}>{toFixedPrice(quote.askPrice5, precision)}</span>
              <span className={styles.volume}>{toFixedVolume(quote.askVolume5)}</span>
            </div>
          );
          totalAskVol += quote.askVolume5;
        }
        if (helper.isNumber(quote.askPrice4)) {
          quoteList.push(
            <div className={styles.row} key='ask4'>
              <span className={styles.label}>卖四</span>
              <span className={styles.price} style={calcColor(selectedStock, quote.askPrice4)}>{toFixedPrice(quote.askPrice4, precision)}</span>
              <span className={styles.volume}>{toFixedVolume(quote.askVolume4)}</span>
            </div>
          );
          totalAskVol += quote.askVolume4;
        }
        if (helper.isNumber(quote.askPrice3)) {
          quoteList.push(
            <div className={styles.row} key='ask3'>
              <span className={styles.label}>卖三</span>
              <span className={styles.price} style={calcColor(selectedStock, quote.askPrice3)}>{toFixedPrice(quote.askPrice3, precision)}</span>
              <span className={styles.volume}>{toFixedVolume(quote.askVolume3)}</span>
            </div>
          );
          totalAskVol += quote.askVolume3;
        }
        if (helper.isNumber(quote.askPrice2)) {
          quoteList.push(
            <div className={styles.row} key='ask2'>
              <span className={styles.label}>卖二</span>
              <span className={styles.price} style={calcColor(selectedStock, quote.askPrice2)}>{toFixedPrice(quote.askPrice2, precision)}</span>
              <span className={styles.volume}>{toFixedVolume(quote.askVolume2)}</span>
            </div>
          );
          totalAskVol += quote.askVolume2;
        }
        if (helper.isNumber(quote.askPrice1)) {
          quoteList.push(
            <div className={styles.row} key='ask1'>
              <span className={styles.label}>卖一</span>
              <span className={styles.price} style={calcColor(selectedStock, quote.askPrice1)}>{toFixedPrice(quote.askPrice1, precision)}</span>
              <span className={styles.volume}>{toFixedVolume(quote.askVolume1)}</span>
            </div>
          );
          totalAskVol += quote.askVolume1;
        }
        quoteList.push(<div className={styles.bidAskSplitLine} key='splitLine'></div>);
        if (helper.isNumber(quote.bidPrice1)) {
          quoteList.push(
            <div className={styles.row} key='bid1'>
              <span className={styles.label}>买一</span>
              <span className={styles.price} style={calcColor(selectedStock, quote.bidPrice1)}>{toFixedPrice(quote.bidPrice1, precision)}</span>
              <span className={styles.volume}>{toFixedVolume(quote.bidVolume1)}</span>
            </div>
          );
          totalBidVol += quote.bidVolume1;
        }
        if (helper.isNumber(quote.bidPrice2)) {
          quoteList.push(
            <div className={styles.row} key='bid2'>
              <span className={styles.label}>买二</span>
              <span className={styles.price} style={calcColor(selectedStock, quote.bidPrice2)}>{toFixedPrice(quote.bidPrice2, precision)}</span>
              <span className={styles.volume}>{toFixedVolume(quote.bidVolume2)}</span>
            </div>
          );
          totalBidVol += quote.bidVolume2;
        }
        if (helper.isNumber(quote.bidPrice3)) {
          quoteList.push(
            <div className={styles.row} key='bid3'>
              <span className={styles.label}>买三</span>
              <span className={styles.price} style={calcColor(selectedStock, quote.bidPrice3)}>{toFixedPrice(quote.bidPrice3, precision)}</span>
              <span className={styles.volume}>{toFixedVolume(quote.bidVolume3)}</span>
            </div>
          );
          totalBidVol += quote.bidVolume3;
        }
        if (helper.isNumber(quote.bidPrice4)) {
          quoteList.push(
            <div className={styles.row} key='bid4'>
              <span className={styles.label}>买四</span>
              <span className={styles.price} style={calcColor(selectedStock, quote.bidPrice4)}>{toFixedPrice(quote.bidPrice4, precision)}</span>
              <span className={styles.volume}>{toFixedVolume(quote.bidVolume4)}</span>
            </div>
          );
          totalBidVol += quote.bidVolume4;
        }
        if (helper.isNumber(quote.bidPrice5)) {
          quoteList.push(
            <div className={styles.row} key='bid5'>
              <span className={styles.label}>买五</span>
              <span className={styles.price} style={calcColor(selectedStock, quote.bidPrice5)}>{toFixedPrice(quote.bidPrice5, precision)}</span>
              <span className={styles.volume}>{toFixedVolume(quote.bidVolume5)}</span>
            </div>
          );
          totalBidVol += quote.bidVolume5;
        }
        if (helper.isNumber(quote.bidPrice6)) {
          quoteList.push(
            <div className={styles.row} key='bid6'>
              <span className={styles.label}>买六</span>
              <span className={styles.price} style={calcColor(selectedStock, quote.bidPrice6)}>{toFixedPrice(quote.bidPrice6, precision)}</span>
              <span className={styles.volume}>{toFixedVolume(quote.bidVolume6)}</span>
            </div>
          );
          totalBidVol += quote.bidVolume6;
        }
        if (helper.isNumber(quote.bidPrice7)) {
          quoteList.push(
            <div className={styles.row} key='bid7'>
              <span className={styles.label}>买七</span>
              <span className={styles.price} style={calcColor(selectedStock, quote.bidPrice7)}>{toFixedPrice(quote.bidPrice7, precision)}</span>
              <span className={styles.volume}>{toFixedVolume(quote.bidVolume7)}</span>
            </div>
          );
          totalBidVol += quote.bidVolume7;
        }
        if (helper.isNumber(quote.bidPrice8)) {
          quoteList.push(
            <div className={styles.row} key='bid8'>
              <span className={styles.label}>买八</span>
              <span className={styles.price} style={calcColor(selectedStock, quote.bidPrice8)}>{toFixedPrice(quote.bidPrice8, precision)}</span>
              <span className={styles.volume}>{toFixedVolume(quote.bidVolume8)}</span>
            </div>
          );
          totalBidVol += quote.bidVolume8;
        }
        if (helper.isNumber(quote.bidPrice9)) {
          quoteList.push(
            <div className={styles.row} key='bid9'>
              <span className={styles.label}>买九</span>
              <span className={styles.price} style={calcColor(selectedStock, quote.bidPrice9)}>{toFixedPrice(quote.bidPrice9, precision)}</span>
              <span className={styles.volume}>{toFixedVolume(quote.bidVolume9)}</span>
            </div>
          );
          totalBidVol += quote.bidVolume9;
        }
        if (helper.isNumber(quote.bidPrice10)) {
          quoteList.push(
            <div className={styles.row} key='bid10'>
              <span className={styles.label}>买十</span>
              <span className={styles.price} style={calcColor(selectedStock, quote.bidPrice10)}>{toFixedPrice(quote.bidPrice10, precision)}</span>
              <span className={styles.volume}>{toFixedVolume(quote.bidVolume10)}</span>
            </div>
          );
          totalBidVol += quote.bidVolume10;
        }
      }
    }

    const hasBothVol = totalBidVol && totalAskVol;

    return (
      <Fragment>
        <div className={styles.stockDesc}>
          <span className={styles.stockCode}>{quote && quote.stockCode || ''}</span>
          <span className={styles.stockName}>{quote && quote.stockName || ''}</span>
        </div>
        <div className={styles.progress}>
          <div className={styles.progressLeftLabel}>买</div>
          <div className={styles.progressOuter} style={{backgroundColor: hasBothVol ? '#25e725' : '#ddd'}}>
            <div className={styles.progressInner} style={{width: hasBothVol ? ((totalBidVol / (totalBidVol + totalAskVol)) * 100 + '%') : 0}}></div>
          </div>
          <div className={styles.progressRightLabel}>卖</div>
        </div>
        <div className={styles.level2QuoteContainer}>
          <div className={styles.level2Quote}>{quoteList}</div>
        </div>
      </Fragment>
    );
  }
}

function calcColor(selectedStock, price) {
  if (selectedStock && price) {
    return price > selectedStock.preClosePrice ? { color: upColor } : (price < selectedStock.preClosePrice ? { color: downColor } : null);
  }
}

function toFixedPrice(n, precision = 3) {
  return helper.isNumber(n) ? n.toFixed(precision) : n;
}

function toFixedVolume(n) {
  return helper.isNumber(n) ? (n / 100).toFixed(0) : '';
}

export default connect((model) => (model))(Level2Quote);
