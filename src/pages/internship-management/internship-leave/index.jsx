import { Button, Card, Form, Row, message, Modal, Icon } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import styles from './style.less';
import StandardTable from './components/StandardTable';
import UpdateForm from './components/UpdateForm';
import SearchForm from './components/SearchForm';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ internshipLeaveManagement, loading }) => ({
  internshipLeaveManagement,
  loading: loading.effects['internshipLeaveManagement/fetch'],
  loadingToggle: loading.effects['internshipLeaveManagement/toggleStatus'],
  loadingDetail: loading.effects['internshipLeaveManagement/getDetail'],
}))
class InternCurrentList extends Component {
  state = {
    formValues: {},
    isReset: false,
    modalUpdateVisible: false,
  };

  timer = null;

  currentPager = null;

  columns = [
    {
      title: 'Họ và tên',
      sorter: true,
      align: 'center',
      dataIndex: 'full_name',
      render: (text, record) => (
        <Button type="link" onClick={() => this.showUpdateForm(record.id)}>
          {text}
        </Button>
      ),
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
      title: 'Vị trí thực tập',
      dataIndex: 'position_apply',
      align: 'center',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      align: 'center',
      render: date => <span>{moment(date).format('DD/MM/YYYY')}</span>,
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      align: 'center',
      render: dateEnd => <span>{moment(dateEnd).format('DD/MM/YYYY')}</span>,
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
      type: 'internshipLeaveManagement/fetch',
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
        params.sorter = {
          [sorter.field]: 0,
        }
      }
      if (sorter.order === 'descend') {
        params.sorter = {
          [sorter.field]: -1,
        }
      }
    }

    dispatch({
      type: 'internshipLeaveManagement/fetch',
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
      title: `Bạn có chắc muốn khóa thực tập sinh ${record.username} không?`,
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
      type: 'internshipLeaveManagement/toggleStatus',
      payload: row,
      callback: res => {
        if (res && res.status) {
          message.success('Chuyển đổi trạng thái thành công!');
          if (!this.currentPager) {
            dispatch({
              type: 'internshipLeaveManagement/fetch',
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
      type: 'internshipLeaveManagement/remove',
      payload: id,
      callback: res => {
        if (res && res.status) {
          message.success('Xóa thực tập sinh');
          if (!this.currentPage) {
            dispatch({
              type: 'internshipLeaveManagement/fetch',
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
      this.search,
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
      const search = this.state.formValues
      const dataValues = {
        search,
      }
      dispatch({
        type: 'internshipLeaveManagement/fetch',
        payload: dataValues,
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

  showUpdateForm = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'internshipLeaveManagement/getDetail',
      payload: id,
    });
    this.handleModalUpdateVisible(true);
  };

  handleModalUpdateVisible = value => {
    this.setState({
      modalUpdateVisible: value,
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'internshipLeaveManagement/update',
      payload: fields,
      callback: res => {
        if (res && res.status) {
          this.handleModalUpdateVisible(false);
          message.success('Cập nhật thành công');
          if (!this.currentPage) {
            dispatch({
              type: 'internshipLeaveManagement/fetch',
            });
          } else {
            const { pagination, filtersArg, sorter } = this.currentPager;
            this.handleListChange(pagination, filtersArg, sorter);
          }
        } else {
          message.error('Cập nhật thất bại, vui lòng thử lại sau');
        }
      },
    });
  };

  render() {
    const {
      internshipLeaveManagement: { data, detail },
      loading,
      loadingToggle,
      loadingDetail,
    } = this.props;
    const { modalUpdateVisible } = this.state;
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
            <StandardTable
              loading={loading || loadingDetail || loadingToggle}
              data={data}
              columns={this.columns}
              onChange={this.handleListChange}
            />
          </div>
        </Card>
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

export default Form.create()(InternCurrentList);
