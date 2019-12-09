import { Button, Card, Form, Row, message, Modal, Icon } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import StandardTable from './components/StandardTable';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import SearchForm from './components/SearchForm';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ accountActiveManagement, loading }) => ({
  accountActiveManagement,
  loading: loading.effects['accountActiveManagement/fetch'],
  loadingToggle: loading.effects['accountActiveManagement/toggleStatus'],
  loadingDetail: loading.effects['accountActiveManagement/getDetail'],
}))
class AccountActiveList extends Component {
  state = {
    formValues: {},
    isReset: false,
    modalCreateVisible: false,
    modalUpdateVisible: false,
  };

  timer = null;

  currentPager = null;

  columns = [
    {
      title: 'Tên tài khoản',
      dataIndex: 'username',
      sorter: true,
      align: 'center',
      render: (text, record) => (
        <Button type="link" onClick={() => this.showUpdateForm(record.id)}>
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
      sorter: true,
      dataIndex: 'email',
      align: 'center',
    },
    {
      title: 'Số điện thoại',
      sorter: true,
      dataIndex: 'phoneNumber',
      align: 'center',
    },
    {
      title: 'Quyền',
      dataIndex: 'role',
      render: a => {
        const role = this.props.accountActiveManagement.roleList.find(r => r.id === a) || {};
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
            icon="lock"
            onClick={() => this.showConfirmToggleAccountStatus(record)}
          />
          <Button
            type="link"
            style={{ color: 'red' }}
            icon="delete"
            onClick={() => this.showConfirmDeleteAccount(record)}
          />
        </>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountActiveManagement/fetch',
    });
    dispatch({
      type: 'accountActiveManagement/fetchRolesList',
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
        params.sorter = `${sorter.field}=asc`;
      }
      if (sorter.order === 'descend') {
        params.sorter = `${sorter.field}=desc`;
      }
    }

    dispatch({
      type: 'accountActiveManagement/fetch',
      payload: params,
      callback: () => {
        this.setState({
          isReset: false,
        });
      },
    });
  };

  showConfirmToggleAccountStatus = record => {
    Modal.confirm({
      title: `Bạn có chắc muốn khóa tài khoản ${record.username} không?`,
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
      type: 'accountActiveManagement/toggleStatus',
      payload: row,
      callback: res => {
        if (res && res.status) {
          message.success('Chuyển đổi trạng thái thành công!');
          if (!this.currentPager) {
            dispatch({
              type: 'accountActiveManagement/fetch',
            });
          } else {
            const { pagination, filtersArg, sorter } = this.currentPager;
            this.handleListChange(pagination, filtersArg, sorter);
          }
        }
      },
    });
  };

  showConfirmDeleteAccount = record => {
    Modal.confirm({
      title: `Bạn có chắc muốn xóa tài khoản ${record.username} không?`,
      content: '',
      okText: 'Có',
      cancelText: 'Không',
      onOk: () => {
        this.handleRemoveItem(record.id);
      },
      onCancel: () => {},
    });
  };

  handleRemoveItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountActiveManagement/remove',
      payload: id,
      callback: res => {
        if (res && res.status) {
          message.success('Xóa tài khoản quản trị thành công');
          if (!this.currentPage) {
            dispatch({
              type: 'accountActiveManagement/fetch',
            });
          } else {
            const { pagination, filtersArg, sorter } = this.currentPager;
            this.handleListChange(pagination, filtersArg, sorter);
          }
        }
      },
    });
  };

  handleSearch = values => {
    this.setState(
      {
        formValues: values,
        isReset: false,
      },
      // đang handel
      // this.search,
    );
  };

  handleFormReset = () => {
    this.setState(
      {
        formValues: {},
        isReset: true,
      },
      this.search,
    );
  };

  search = () => {
    const { dispatch } = this.props;
    if (!this.currentPage) {
      dispatch({
        type: 'accountActiveManagement/fetch',
        payload: this.state.formValues,
        callback: () => {
          this.setState({
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

  showCreateForm = () => {
    this.handleModalCreateVisible(true);
  };

  handleModalCreateVisible = value => {
    this.setState({
      modalCreateVisible: value,
    });
  };

  showUpdateForm = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountActiveManagement/getDetail',
      payload: id,
    });
    this.handleModalUpdateVisible(true);
  };

  handleModalUpdateVisible = value => {
    this.setState({
      modalUpdateVisible: value,
    });
  };

  handleCreate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountActiveManagement/add',
      payload: fields,
      callback: res => {
        if (res && res.status) {
          this.handleModalCreateVisible(false);
          message.success('Thêm mới thành công');
          if (!this.currentPage) {
            dispatch({
              type: 'accountActiveManagement/fetch',
            });
          } else {
            const { pagination, filtersArg, sorter } = this.currentPager;
            this.handleListChange(pagination, filtersArg, sorter);
          }
        } else {
          message.success('Thêm mới thất bại, vui lòng thử lại sau');
        }
      },
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountActiveManagement/update',
      payload: fields,
      callback: res => {
        if (res && res.status) {
          this.handleModalUpdateVisible(false);
          message.success('Cập nhật thành công');
          if (!this.currentPage) {
            dispatch({
              type: 'accountActiveManagement/fetch',
            });
          } else {
            const { pagination, filtersArg, sorter } = this.currentPager;
            this.handleListChange(pagination, filtersArg, sorter);
          }
        } else {
          message.success('Cập nhật thất bại, vui lòng thử lại sau');
        }
      },
    });
  };

  renderCreateComp() {
    return (
      <Row type="flex" justify="space-between">
        <Button type="primary" className={styles.customExportBtn} onClick={this.showCreateForm}>
          <Icon type="plus" />
          Thêm tài khoản quản trị
        </Button>
      </Row>
    );
  }

  render() {
    const {
      accountActiveManagement: { data, detail },
      loading,
      loadingToggle,
      loadingDetail,
    } = this.props;
    const { modalCreateVisible, modalUpdateVisible } = this.state;
    return (
      <PageHeaderWrapper>
        <Card className={styles.card} bordered={false}>
          <SearchForm
            handleSearch={this.handleSearch}
            handleFormReset={this.handleFormReset}
            isReset={this.state.isReset}
            loading={loading}
          />
        </Card>
        <Card className={styles.card} bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm} style={{ marginBottom: 20 }}>
              {this.renderCreateComp()}
            </div>
            <StandardTable
              loading={loading || loadingDetail || loadingToggle}
              data={data}
              columns={this.columns}
              onChange={this.handleListChange}
            />
          </div>
        </Card>
        <CreateForm
          handleModalVisible={this.handleModalCreateVisible}
          modalVisible={modalCreateVisible}
          handleAdd={this.handleCreate}
        />
        {!loadingDetail && (
          <UpdateForm
            handleModalVisible={this.handleModalUpdateVisible}
            handleAdd={this.handleUpdate}
            modalVisible={modalUpdateVisible}
            data={detail || {}}
          />
        )}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(AccountActiveList);
