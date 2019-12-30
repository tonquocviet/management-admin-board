import { Input } from 'antd';
import React from 'react';

class CMNDInput extends React.Component {
  onChange = e => {
    const { value } = e.target;
    const reg = /^-?(|[1-9][0-9]*)(\.[0-9]*)?$/;
    if (
      (!Number.isNaN(value) && reg.test(value)) || value === ''
    ) {
      this.props.onChange(value);
    }
  };

  render() {
    const { value, placeholder } = this.props;
    return (
      <Input
        {...this.props}
        value={value}
        onChange={this.onChange}
        placeholder={placeholder || 'Nhập số CMND'}
        maxLength={10}
      />
    );
  }
}

export default CMNDInput;
