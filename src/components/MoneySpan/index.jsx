import React from 'react';

const MoneySpan = props => {
  const { number } = props;
  const formatNumber = num => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  return <span style={{ fontWeight: '600' }}>{formatNumber(number)} VNĐ</span>;
};

export default MoneySpan;
