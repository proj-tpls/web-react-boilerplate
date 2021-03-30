import React, { Component } from 'react';
import { Icon, Badge } from 'antd';
import { Link } from 'dva/router';
import styles from './index.css';

class Notice extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { to, count } = this.props;
    return (
      <span className={styles.notice}>
        <Link to={to}>
          <Badge count={count}>
            <Icon type="bell" />
          </Badge>
        </Link>
      </span>
    );
  }
}

export default Notice;
