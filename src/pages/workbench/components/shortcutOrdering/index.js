import React, { Fragment } from 'react';
import { Table, Input, InputNumber, Select, Form, Button, message } from 'antd';
import { connect } from 'dva';
import { OrderingPriceType, OrderingDirection, OrderingAction } from 'utils/dict';
import { label2code, code2label } from 'utils/keycode';
import helper from 'utils/helper';
import { set } from 'utils/storage';
import ShortcutBase from '../shortcutBase';

import styles from './index.css';

const SelectOption = Select.Option;

const directionOptions = dictToOptions(OrderingDirection);
const priceTypeOptions =  dictToOptions(OrderingPriceType);
const actionOptions =  dictToOptions(OrderingAction);

function dictToOptions(dictData) {
  return dictData.toCheckboxArray().map(({ value, label, key }) => <SelectOption value={value} key={key}>{label}</SelectOption>);
}

const defaultControl = {
  Control: Input,
  props: {
    allowClear: true,
    size: 'small'
  }
};

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {

  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing && this.control.focus) {
        this.control.focus();
      }
    });
  };

  save = e => {
    // 设个延迟是为了可以点击到输入框的清除图标, 否则会和onBlur事件的影响相冲突造成点击不到清除图标
    setTimeout(() => {
      const { record, handleSave } = this.props;
      this.form.validateFields((error, values) => {
        if (error && error[e.currentTarget.id]) {
          return;
        }

        this.toggleEdit();
        handleSave({
          ...record,
          ...values
        });
      });
    }, 200);
  };

  getControl() {
    let data;

    switch(this.props.dataIndex) {
      case 'shortcutKey': {
        data = {
          Control: Input,
          props: {
            allowClear: true,
            // placeholder: '快捷键',
            size: 'small',
            className: 'shortcut-key',
            onKeyDown: e => this.props.onKeyDown(e, this.props.dataIndex, this.form)
          }
        };
        break;
      }
      case 'direction': {
        data = {
          Control: Select,
          children: directionOptions,
          props: {
            allowClear: true,
            // placeholder: '买卖',
            size: 'small',
            className: 'direction',
            showArrow: false
          }
        };
        break;
      }
      case 'priceType': {
        data = {
          Control: Select,
          children: priceTypeOptions,
          props: {
            allowClear: true,
            // placeholder: '价格',
            size: 'small',
            className: 'price-type',
            showArrow: false
          }
        }
        break;
      }
      case 'priceDiff': {
        data = {
          Control: InputNumber,
          props: {
            step: this.props.priceStep || 0.01,
            size: 'small',
            className: 'price-diff',
            max: 100,
            min: -100
          }
        };
        break;
      }
      case 'action': {
        data = {
          Control: Select,
          children: actionOptions,
          props: {
            allowClear: true,
            // placeholder: '动作',
            size: 'small',
            className: 'action',
            showArrow: false
          }
        }
        break;
      }
      default: data = defaultControl;
    }

    const { Control, props, children } = data;
    return <Control {...props} ref={node => (this.control = node)} onPressEnter={this.save} onBlur={this.save}>{children}</Control>;
  };

  renderCell = (form) => {
    // const { getFieldDecorator } = form;
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    if (editing) {
      let initialValue = record[dataIndex];
      if (dataIndex === 'shortcutKey') {
        initialValue = code2label(initialValue);
      }
      return (
        <Form.Item style={{ margin: 0 }}>
          {form.getFieldDecorator(dataIndex, {
            initialValue
          })(this.getControl())}
        </Form.Item>
      );
    }
    else {
      const childrenCopy = [...children];
      if (childrenCopy[2]) {
        switch(dataIndex) {
          case 'shortcutKey': {
            childrenCopy[2] = code2label(childrenCopy[2]);
            break;
          }
          case 'direction': {
            childrenCopy[2] = OrderingDirection.valueIndex[childrenCopy[2]].text;
            break;
          }
          case 'priceType': {
            childrenCopy[2] = OrderingPriceType.valueIndex[childrenCopy[2]].text;
            break;
          }
          case 'action': {
            childrenCopy[2] = OrderingAction.valueIndex[childrenCopy[2]].text;
            break;
          }
        }
      }

      return (
        <div
          className={`editable-cell-value-wrap ${dataIndex}`}
          style={{ paddingRight: 0 }}
          onDoubleClick={this.toggleEdit}
        >
          {childrenCopy}
        </div>
      );
    }
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      priceStep,
      handleSave,
      onKeyDown,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
      </td>
    );
  }
}
class ShortcutOrdering extends ShortcutBase {

  constructor(props) {
    super(props);
    this.state = { dataSource: null };
    this.columns = [
      {
        title: '快捷键',
        dataIndex: 'shortcutKey',
        width: 60,
        editable: true,
      },
      {
        title: '买卖',
        dataIndex: 'direction',
        width: 60,
        editable: true,
      },
      {
        title: '价格',
        dataIndex: 'priceType',
        width: 60,
        editable: true,
      },
      {
        title: '超价(元)',
        dataIndex: 'priceDiff',
        width: 60,
        editable: true,
      },
      {
        title: '动作',
        dataIndex: 'action',
        width: 60,
        editable: true,
      },
    ];
  }

  componentDidMount() {
    this.reset();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { workBench } = this.props;
    const { shortcut } = workBench;
    const { sendOrder, priceStep } = shortcut;

    return !helper.shallowEqual(sendOrder, nextProps.workBench.shortcut.sendOrder) ||
      !helper.shallowEqual(priceStep, nextProps.workBench.shortcut.priceStep) ||
      !helper.shallowEqual(this.state.dataSource, nextState.dataSource);
  }

  reset = () => {
    const { workBench } = this.props;
    const { shortcut } = workBench;
    const { sendOrder } = shortcut;

    const data = [];
    for (let k in sendOrder) {
      const d = { ...sendOrder[k] };
      d.key = k;
      data.push(d);
    }

    // 填充满十行
    for (let i = data.length; i < 10; i++) {
      data.push({
        key: i + '',
        shortcutKey: '',
        direction: '',
        priceType: '',
        priceDiff: '',
        action: '',
      });
    }

    this.setState({
      dataSource: data
    });
  };

  save = async() => {
    await helper.sleep(500);
    const { workBench } = this.props;
    const { shortcut } = workBench;

    const data = {};
    this.state.dataSource.forEach(item => {
      const { shortcutKey, direction, priceType, priceDiff, action } = item;
      if (shortcutKey && direction && priceType && helper.isNumber(priceDiff) && action) {
        data[shortcutKey] = item;
      }
    });

    shortcut.sendOrder = data;

    set('shortcut', shortcut) ?  message.success('保存完成') : message.error('保存失败');
  }

  onKeyDown = (e, dataIndex, form) => {
    this.handleKeyDown(e, dataIndex, form);
  }

  // handleDelete = key => {
  //   const dataSource = [...this.state.dataSource];
  //   this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  // }

  // handleAdd = () => {
  //   const { dataSource } = this.state;
  //   const count = dataSource.length;
  //   const newData = {
  //     key: count,
  //     shortcutKey: '',
  //     direction: '',
  //     priceType: '',
  //     priceDiff: '',
  //     action: '',
  //   };
  //   this.setState({
  //     dataSource: [...dataSource, newData]
  //   });
  // }

  // onBlur或onPressEnter事件触发时先更新state中的dataSource
  handleSave = row => {
    if (row.shortcutKey) {
      row.shortcutKey = label2code(row.shortcutKey) || row.shortcutKey;
    }
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  }

  render() {
    const { workBench } = this.props;
    const { shortcut } = workBench;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          dataIndex: col.dataIndex,
          editable: col.editable,
          title: col.title,
          handleSave: this.handleSave,
          onKeyDown: this.onKeyDown,
          priceStep: shortcut.priceStep
        }),
      };
    });

    return (
      <Fragment>
        <EditableContext.Provider value={this.props.form}>
          <Table
            className='shortcut-table'
            components={components}
            dataSource={this.state.dataSource}
            columns={columns}
            rowClassName='editable-row'
            pagination={false}
            size='small'
            // onRow={record => {
            //   return {
            //     onClick: e => this.selectRow(e, record), // 点击选中行
            //   };
            // }}
            // scroll={{ y: 330 }}
          />
        </EditableContext.Provider>
        <div className={styles.btnWrapper}>
          <Button type='primary' onClick={this.save}>保存</Button>
          <Button type='default' style={{marginLeft: 15}} onClick={this.reset}>重置</Button>
        </div>
      </Fragment>
    );
  }
}

export default connect((model) => (model))(ShortcutOrdering);
