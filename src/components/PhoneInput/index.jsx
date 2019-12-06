import { Input } from 'antd';
import React from 'react';

class PhoneInput extends React.Component {
  onChange = e => {
    const { value } = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if (
      (!Number.isNaN(value) && reg.test(value)) ||
      (value.toString().indexOf('0') === 0 && reg.test(value.slice(1, value.length))) ||
      value === ''
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
        placeholder={placeholder || 'Nhập số điện thoại'}
        maxLength={12}
      />
    );
  }
}

export default PhoneInput;
