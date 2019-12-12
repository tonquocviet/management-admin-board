import { Card, Form } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import StandardTable from './components/StandardTable';

@connect(({ roleListManagement, loading }) => ({
  roleListManagement,
  loading: loading.effects['roleListManagement/fetch'],
}))
class RoleSystemList extends Component {
  columns = [
    {
      title: 'Mã quyền',
      dataIndex: 'id',
    },
    {
      title: 'Tên quyền',
      dataIndex: 'name',
    },
    {
      title: 'Chi tiết',
      dataIndex: 'description',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleListManagement/fetch',
    });
  }

  render() {
    const {
      roleListManagement: { dataRole },
      loading,
    } = this.props;
    return (
      <PageHeaderWrapper>
        <Card className={styles.card} bordered={false}></Card>
        <Card className={styles.card} bordered={false}>
          <div className={styles.tableList}>
            <StandardTable loading={loading} data={dataRole} columns={this.columns} />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(RoleSystemList);
