import React, { Component } from 'react';

class Page extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { inner, children, ...otherProps } = this.props;
    return <div {...otherProps}>{children}</div>;
  }
}

export default Page;
