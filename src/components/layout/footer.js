import React, { Component } from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

class Footer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AntFooter style={{ textAlign: 'center', padding: '15px', background: '#fff' }}>
        <span style={{marginRight: 15}}>v2.0.3</span>
        <span>您好，交易员</span>
      </AntFooter>
    );
  }
}

export default Footer;
