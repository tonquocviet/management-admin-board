import { Button, Card, Col, Form, Input, Row, message, Tooltip, Modal, Icon } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import StandardTable from './components/StandardTable';
import styles from './style.less';
import { WAIT_INTERVAL } from '@/utils/common';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ accountManagement, loading }) => ({
  accountManagement,
  loading: loading.effects['accountManagement/fetch'],
  loadingToggle: loading.effects['accountManagement/toggleStatus'],
}))

class AccountList extends Component {
  state = {
    searchValue: '',
  };

  timer = null;

  currentPager = null;

  columns = [
    {
      title: 'Tên tài khoản',
      dataIndex: 'username',
      align: 'center',
      render: text => (
        <Button
          type="link"
        >
          {text}
        </Button>
      ),
    },
    {
      title: 'Họ và tên',
      sorter: true,
      dataIndex: 'full_name',
    },
    {
      title: 'Giới tính',
      align: 'center',
      dataIndex: 'sex_type',
      // eslint-disable-next-line @typescript-eslint/camelcase
      render: sex_type => <span>{sex_type ? 'Nam' : 'Nữ'}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      align: 'center',
    },
    {
      title: 'Quyền',
      dataIndex: 'role',
      render: a => {
        const role = this.props.accountManagement.roleList.find(r => r.id === a) || {};
        return <span>{role.name}</span>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status_account',
      align: 'center',
      render: status => <span>{status ? 'Đang hoạt động' : 'Đã khóa'}</span>,
    },
    {
      title: 'Hành động',
      render: record => (
        <div>
          {record.status_account ? (
            <Tooltip title="Khóa">
              <Button
                type="link"
                style={{ color: '#ff4d4f' }}
                icon="lock"
                onClick={() => {
                  this.showConfirmToggleAccountStatus(record);
                }}
                block
              />
            </Tooltip>
          ) : (
              <Tooltip title="Mở">
                <Button
                  type="link"
                  onClick={() => {
                    this.showConfirmToggleAccountStatus(record);
                  }}
                  icon="unlock"
                  block
                />
              </Tooltip>
            )}
        </div>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountManagement/fetch',
    });
    dispatch({
      type: 'accountManagement/fetchRolesList',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    this.currentPager = { pagination, filtersArg, sorter };
    const { dispatch } = this.props;
    const { searchValue } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      searchValue,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'accountManagement/fetch',
      payload: params,
    });
  };

  showConfirmToggleAccountStatus = record => {
    Modal.confirm({
      title: `Bạn có chắc muốn ${record.status_account ? 'Khóa' : 'Mở'} tài khoản ${record.username} không?`,
      content: '',
      okText: 'Có',
      cancelText: 'Không',
      onOk: () => {
        this.handleToggle(record);
      },
      onCancel: () => {},
    });
  };

  handleToggle = row => {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountManagement/toggleStatus',
      payload: row,
      callback: res => {
        if (res && res.success) {
          message.success('Chuyển đổi trạng thái thành công!');
          if (!this.currentPager) {
            dispatch({
              type: 'accountManagement/fetch',
            });
          } else {
            const { pagination, filtersArg, sorter } = this.currentPager;
            this.handleStandardTableChange(pagination, filtersArg, sorter);
          }
        }
      },
    });
  };

  handleSearch = value => {
    clearTimeout(this.timer);
    this.setState({
      searchValue: value,
    });
    this.timer = setTimeout(this.search, WAIT_INTERVAL);
  };

  search = () => {
    const { dispatch } = this.props;
    if (!this.currentPager) {
      dispatch({
        type: 'accountManagement/fetch',
        payload: { searchValue: this.state.searchValue },
      });
    } else {
      const { pagination, filtersArg, sorter } = this.currentPager;
      pagination.current = 1;
      this.handleStandardTableChange(pagination, filtersArg, sorter);
    }
  };

  handleClearInput = () => {
    this.setState(
      {
        searchValue: '',
      },
      this.search,
    );
  };

  handleChangeIcon = () => {
    if (this.state.searchValue) {
      return <Icon type="close" onClick={() => this.handleClearInput()} />;
    }
    return <Icon type="search" />;
  };

  render() {
    const {
      accountManagement: { data },
      loading,
      loadingToggle,
    } = this.props;
    const { searchValue } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Row style={{ marginBottom: '16px' }}>
              <Col md={8} sm={24} xs={24}>
                <Input
                  value={searchValue}
                  suffix={
                    searchValue ? (
                      <Icon
                        style={{ color: '#ca4f4f' }}
                        type="close-circle"
                        onClick={() => this.handleClearInput()}
                      />
                    ) : (
                      <Icon style={{ color: '#aaaaaa' }} type="search" />
                    )
                  }
                  placeholder="Nhập nội dung tìm kiếm"
                  onChange={e => this.handleSearch(e.target.value)}
                />
              </Col>
              <Col md={16} sm={24} xs={24} className={styles.customLayoutBtn}>
                <div>
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                    Thêm tài khoản
                  </Button>
                </div>
              </Col>
            </Row>
            <StandardTable
              rowKey="id"
              loading={loading || loadingToggle}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(AccountList);
