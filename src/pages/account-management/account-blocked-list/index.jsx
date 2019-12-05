import { Button, Card, Col, Form, Input, Row, message, Modal, Icon, DatePicker } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import styles from './style.less';
import { WAIT_INTERVAL } from '@/utils/common';
import StandardTable from './components/StandardTable';

const FormItem = Form.Item;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ accountBlockedManagement, loading }) => ({
  accountBlockedManagement,
  loading: loading.effects['accountBlockedManagement/fetch'],
  loadingToggle: loading.effects['accountBlockedManagement/toggleStatus'],
}))

class AccountBlockedList extends Component {
  state = {
    formValues: {},
    searchValue: '',
    isSearch: false,
    // eslint-disable-next-line react/no-unused-state
    isReset: false,
    // eslint-disable-next-line react/no-unused-state
    modalVisible: false,
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
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      align: 'center',
    },
    {
      title: 'Quyền',
      dataIndex: 'role',
      render: a => {
        const role = this.props.accountBlockedManagement.roleList.find(r => r.id === a) || {};
        return <span>{role.name}</span>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status_account',
      align: 'center',
      render: status => <span>{status ? 'Đã khóa' : 'Đang hoạt động'}</span>,
    },
    {
      title: 'Hành động',
      render: record => (
        <>
          <Button
            type="link"
            icon="unlock"
            onClick={() => this.showConfirmToggleAccountStatus(record)}
          />
          <Button
            type="link"
            style={{ color: 'red' }}
            icon="delete"
            onClick={() => this.handleRemoveItem(record)}
          />
        </>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountBlockedManagement/fetch',
    });
    dispatch({
      type: 'accountBlockedManagement/fetchRolesList',
    });
  }

  handleListChange = (pagination, filtersArg, sorter) => {
    this.currentPager = { pagination, filtersArg, sorter };
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      if (sorter.order === 'ascend') {
        params.sorter = 'asc';
      }
      if (sorter.order === 'descend') {
        params.sorter = 'desc';
      }
    }

    dispatch({
      type: 'accountBlockedManagement/fetch',
      payload: params,
      callback: () => {
        this.setState({
          isSearch: false,
          isReset: false,
        });
      },
    });
  };

  showConfirmToggleAccountStatus = record => {
    Modal.confirm({
      title: `Bạn có chắc muốn mở khóa tài khoản ${record.username} không?`,
      content: '',
      okText: 'Có',
      cancelText: 'Không',
      onOk: () => {
        this.handleToggle(record);
      },
      onCancel: () => { },
    });
  };

  handleRemoveItem = record => {
    Modal.confirm({
      title: `Bạn có chắc muốn xóa tài khoản ${record.username} không?`,
      content: '',
      okText: 'Có',
      cancelText: 'Không',
      onOk: () => {
        this.handleToggle(record);
      },
      onCancel: () => { },
    });
  };

  handleToggle = row => {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountBlockedManagement/toggleStatus',
      payload: row,
      callback: res => {
        if (res && res.status) {
          message.success('Chuyển đổi trạng thái thành công!');
          if (!this.currentPager) {
            dispatch({
              type: 'accountBlockedManagement/fetch',
            });
          } else {
            const { pagination, filtersArg, sorter } = this.currentPager;
            this.handleStandardTableChange(pagination, filtersArg, sorter);
          }
        }
      },
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      const startDate =
        (fieldsValue.startDate && fieldsValue.startDate.toDate().toISOString()) || undefined;
      const endDate =
        (fieldsValue.endDate && fieldsValue.endDate.toDate().toISOString()) || undefined;
      if (err) return;
      const values = {
        ...fieldsValue,
        startDate,
        endDate,
      }
      this.setState(
        {
          formValues: values,
          searchValue: '',
          isSearch: true,
          isReset: false,
        },
        this.search,
      );
    });
  };

  handleSearchOnList = value => {
    clearTimeout(this.timer);
    const { formValues } = this.state;
    const values = formValues;
    values.searchValue = value;
    this.setState({
      searchValue: value,
      formValues: values,
    });
    this.timer = setTimeout(this.search, WAIT_INTERVAL);
  };

  search = () => {
    const { dispatch } = this.props;
    if (!this.currentPage) {
      dispatch({
        type: 'accountBlockedManagement/fetch',
        payload: this.state.formValues,
        callback: () => {
          this.setState({
            isSearch: false,
            isReset: false,
          });
        },
      });
    } else {
      const { pagination, filtersArg, sorter } = this.currentPage;
      pagination.current = 1;
      this.handleListChange(pagination, filtersArg, sorter);
    }
  };

  handleClearInput = () => {
    this.setState(prevState => {
      const values = prevState.formValues;
      delete values.searchValue;
      return {
        formValues: values,
      };
    });
    this.setState(
      {
        searchValue: '',
      },
      this.search,
    );
  };

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
      loading,
    } = this.props;
    return (
      <Form
        onSubmit={this.handleSearch}
        layout="vertical"
        hideRequiredMark
        className={styles.customPaddingCol}
      >
        <Row gutter={16}>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="Từ ngày">
              {getFieldDecorator('startDate', {
                initialValue: moment().add(-219, 'day'),
              })(
                <DatePicker
                  disabledDate={this.disabledStartDate}
                  placeholder="Chọn ngày bắt đầu"
                  format="DD/MM/YYYY"
                  style={{
                    width: '100%',
                  }}
                  onChange={this.getStartDate}
                />,
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="Đến ngày">
              {getFieldDecorator('endDate', {
                initialValue: moment().add(26, 'day'),
              })(
                <DatePicker
                  format="DD/MM/YYYY"
                  disabledDate={this.disabledEndDate}
                  placeholder="Chọn ngày kết thúc"
                  style={{
                    width: '100%',
                  }}
                  onChange={this.getEndDate}
                />,
              )}
            </FormItem>
          </Col>
        </Row>
        <div
          style={{
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              textAlign: 'center',
            }}
          >
            <Button type="primary" htmlType="submit" loading={this.state.isSearch && loading}>
              Tìm tài khoản
            </Button>
            <Button
              className={styles.customButton}
              loading={this.state.isReset && loading}
              onClick={this.handleFormReset}
            >
              Hủy tìm kiếm
            </Button>
          </div>
        </div>
      </Form>
    );
  }

  renderSearchForm() {
    return (
      <Row type="flex" justify="space-between">
        <Col md={8} sm={24} xs={24}>
          <Input
            value={this.state.searchValue}
            suffix={
              this.state.searchValue ? (
                <Icon
                  style={{ color: '#ca4f4f' }}
                  type="close-circle"
                  onClick={() => this.handleClearInput()}
                />
              ) : (
                  <Icon style={{ color: '#aaaaaa' }} type="search" />
                )
            }
            placeholder="Tìm trên danh sách kết quả"
            onChange={e => this.handleSearchOnList(e.target.value)}
          />
        </Col>
      </Row>
    );
  }

  render() {
    const {
      accountBlockedManagement: { data },
      loading,
      loadingToggle,
    } = this.props;
    return (
      <PageHeaderWrapper>
        <Card className={styles.card} bordered={false}>
          {this.renderAdvancedForm()}
        </Card>
        <Card className={styles.card} bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm} style={{ marginBottom: 20 }}>
              {this.renderSearchForm()}
            </div>
            <StandardTable
              loading={loading || loadingToggle}
              data={data}
              columns={this.columns}
              onChange={this.handleListChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(AccountBlockedList);
