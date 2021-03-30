import { Component } from "react";
import { Icon } from 'antd';

const iconStyle = {
  cursor: 'pointer'
}

class SecureView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secure: true,
    }
  }

  toggle = () => {
    const {
      secure,
    } =this.state;
    this.setState({
      secure: !secure
    });
  }

  render() {
    const {data} = this.props;
    const {
      secure,
    } =this.state;
    return (
      <>
        {secure ? <>&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</> : data}
        &nbsp;&nbsp;&nbsp;
        {secure ? <Icon type="eye-invisible" onClick={this.toggle} style={iconStyle} /> : <Icon type="eye" style={iconStyle}  onClick={this.toggle} />}
      </>
    )
  }
}

export default SecureView;
