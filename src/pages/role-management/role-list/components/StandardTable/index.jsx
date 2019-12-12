/* eslint-disable react/prefer-stateless-function */
import { Table } from 'antd';
import React, { Component } from 'react';
import styles from './index.less';

class StandardTable extends Component {
  render() {
    const { data, rowKey, ...rest } = this.props;
    return (
      <div className={styles.staffGroupList}>
        <Table rowKey="id" dataSource={data || {}} {...rest} />
      </div>
    );
  }
}

export default StandardTable;
