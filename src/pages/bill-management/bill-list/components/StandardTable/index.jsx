/* eslint-disable no-underscore-dangle */
import { Table } from 'antd';
import React, { Component } from 'react';
import styles from './index.less';

class StandardTable extends Component {
  handleTableChange = (pagination, filters, sorter, ...rest) => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(pagination, filters, sorter, ...rest);
    }
  };

  render() {
    const { data, rowKey, ...rest } = this.props;
    const { list = [], pagination = false } = data || {};
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      ...pagination,
    };
    return (
      <div className={styles.staffGroupList}>
        <Table
          bordered
          rowKey="id"
          dataSource={list}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          {...rest}
          scroll={{ x: 'max-content' }}
        />
      </div>
    );
  }
}

export default StandardTable;
