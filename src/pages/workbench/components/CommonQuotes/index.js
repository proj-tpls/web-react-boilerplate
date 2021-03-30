import React, { Component, Fragment } from 'react';
import { Table, Menu } from 'antd';
import { connect } from 'dva';
import tableColumnsData from 'utils/tableColumns';
import helper from 'utils/helper';

import styles from './index.css';

const MenuItem = Menu.Item;

class CommonQuotes extends Component  {

  constructor(props) {
    super(props);
    this.state = {
      xPos: 0,
      yPos: 0,
      menuShown: false,
      selectedStock: {}
    };

    this.menuRef = React.createRef();
  }

  componentDidMount() {
    // this.menuRef.current.addEventListener('blur', this.blurMenu, false);
  }

  componentWillUnmount() {
    // this.menuRef.current.removeEventListener('blur', this.blurMenu, false);
  }

  blurMenu = () => {
    this.setState({
      menuShown: false
    });
  }

  get columns() {
    const { workBench } = this.props;
    const { tableColumns } = workBench;

    const columns = tableColumnsData.commonQuotes.filter(column => !tableColumns.commonQuotes || tableColumns.commonQuotes.indexOf(column.dataIndex) !== -1);
    return columns;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { workBench } = this.props;
    const { deepQuotes, tableColumns, optionalStocks } = workBench;

    return !helper.shallowEqual(deepQuotes, nextProps.workBench.deepQuotes) ||
      !helper.shallowEqual(tableColumns, nextProps.workBench.tableColumns) ||
      !helper.shallowEqual(optionalStocks, nextProps.workBench.optionalStocks) ||
      !helper.shallowEqual(this.state, nextState);
  }

  selectRow(stock) {
    const { dispatch, workBench } = this.props;
    const { stockInput, shareHolderCode, optionalStocks } = workBench;
    const { stockCode, lastPrice } = stock;
    const exchangeId = optionalStocks[stockCode] && optionalStocks[stockCode].accountType || helper.getExchangeIdFromStockCode(stockCode, false);

    const newStockInput = { ...stockInput, stockCode, price: lastPrice };

    if (exchangeId && shareHolderCode.success) {
      const selectShareHolderCodeItem = shareHolderCode.data.filter(item => item.accountType == exchangeId)[0];
      if (selectShareHolderCodeItem) {
        newStockInput.shareHolderCode = selectShareHolderCodeItem.shareHolderCode;
      }
    }

    dispatch({
      type: 'workBench/putState',
      payload: {
        selectedStock: stock,
        stockInput: newStockInput
      }
    });

    // 使用深度行情数据时不需要下面的代码
    // window.md_socket.emit('json', {
    //   type: 'level2Quote',
    //   payload: stock.stockCode
    // });
  }

  showContextMenu(event, record) {
    event.preventDefault();
    const xPos = event.pageX + "px";
    const yPos = event.pageY + "px";
    this.setState({
      xPos,
      yPos,
      menuShown: true,
      selectedStock: record
    }, () => {
      this.menuRef.current.focus();
    });
  }

  selectMenuItem = ({ key }) => {
    switch(key) {
      case 'deleteSelected': {
        this.props.dispatch({
          type: 'workBench/removeOptionStocks',
          payload: { stockCode: this.state.selectedStock.stockCode }
        });
        break;
      }
      case 'deleteAll': {
        this.props.dispatch({
          type: 'workBench/removeAllOptionStocks'
        });
        break;
      }
    }

    this.setState({
      menuShown: false
    });
  }

  render() {
    const { workBench } = this.props;
    const {
      // commonQuotes,
      deepQuotes,
      optionalStocks
    } = workBench;
    const data = deepQuotes.success ? Object.values(deepQuotes.data).filter(item => optionalStocks[item.stockCode]).sort((a, b) => a.stockCode > b.stockCode ? 1 : -1) : null;

    const { menuShown, xPos, yPos } = this.state;

    return (
      // <div className={styles.container} id='commonQuotes'>
      <Fragment>
        <Table
          bordered
          columns={this.columns}
          dataSource={data}
          pagination={false}
          size={'small'}
          onRow={record => {
            return {
              onDoubleClick: () => this.selectRow(record),
              onContextMenu: event => this.showContextMenu(event, record),
            };
          }}
          rowKey='stockCode'
        />
        <div tabIndex='-1' onBlur={this.blurMenu} ref={this.menuRef} className={styles.menu} style={{ display: menuShown ? 'block' : 'none', left: xPos, top: yPos }}>
          <Menu onClick={this.selectMenuItem} selectable={false}>
            <MenuItem key='deleteSelected'>删除选中</MenuItem>
            <MenuItem key='deleteAll'>删除全部</MenuItem>
          </Menu>
        </div>
      </Fragment>
      // </div>
    );
  }
}

export default connect((model) => (model))(CommonQuotes);
