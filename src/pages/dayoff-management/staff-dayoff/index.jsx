import { Button, Card, Form, Row, message, Modal, Icon } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import styles from './style.less';
import StandardTable from './components/StandardTable';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import SearchForm from './components/SearchForm';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ dayoffListManagement, loading }) => ({
  dayoffListManagement,
  loading: loading.effects['dayoffListManagement/fetch'],
  loadingDetail: loading.effects['dayoffListManagement/getDetail'],
  loadingEmployee: loading.effects['dayoffListManagement/getEmployee'],
}))
class DayOffList extends Component {
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
      title: 'Họ và tên',
      align: 'center',
      dataIndex: 'full_name',
      render: (text, record) => (
        <Button type="link" onClick={() => this.showUpdateForm(record.id)}>
          {text}
        </Button>
      ),
    },
    {
      title: 'Số ngày nghỉ',
      dataIndex: 'total_absence',
      align: 'center',
    },
    {
      title: 'Ngày bắt đầu nghỉ',
      dataIndex: 'startDate',
      sorter: true,
      align: 'center',
      render: date => <span>{moment(date).format('DD/MM/YYYY')}</span>,
    },
    {
      title: 'Ngày trở lại làm việc',
      dataIndex: 'endDate',
      sorter: true,
      align: 'center',
      render: dateEnd => <span>{moment(dateEnd).format('DD/MM/YYYY')}</span>,
    },
    {
      title: 'Hành động',
      align: 'center',
      render: record => (
        <>
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
      type: 'dayoffListManagement/fetch',
    });
    dispatch({
      type: 'dayoffListManagement/getEmployee',
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
        };
      }
      if (sorter.order === 'descend') {
        params.sorter = {
          [sorter.field]: -1,
        };
      }
    }

    dispatch({
      type: 'dayoffListManagement/fetch',
      payload: params,
      callback: () => {
        this.setState({
          isReset: false,
        });
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
      type: 'dayoffListManagement/remove',
      payload: id,
      callback: res => {
        if (res && res.status) {
          message.success('Xóa ngày nghỉ thành công');
          if (!this.currentPage) {
            dispatch({
              type: 'dayoffListManagement/fetch',
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
      const search = this.state.formValues;
      const dataValues = {
        search,
      };
      dispatch({
        type: 'dayoffListManagement/fetch',
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
      type: 'dayoffListManagement/getDetail',
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
      type: 'dayoffListManagement/add',
      payload: fields,
      callback: res => {
        if (res && res.status) {
          this.handleModalCreateVisible(false);
          message.success('Thêm mới thành công');
          if (!this.currentPage) {
            dispatch({
              type: 'dayoffListManagement/fetch',
            });
          } else {
            const { pagination, filtersArg, sorter } = this.currentPager;
            this.handleListChange(pagination, filtersArg, sorter);
          }
        } else {
          message.error('Thêm mới thất bại, vui lòng thử lại sau');
        }
      },
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dayoffListManagement/update',
      payload: fields,
      callback: res => {
        if (res && res.status) {
          this.handleModalUpdateVisible(false);
          message.success('Cập nhật thành công');
          if (!this.currentPage) {
            dispatch({
              type: 'dayoffListManagement/fetch',
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

  renderCreateComp() {
    return (
      <Row type="flex" justify="space-between">
        <Button type="primary" className={styles.customExportBtn} onClick={this.showCreateForm}>
          <Icon type="plus" />
          Thêm ngày nghỉ
        </Button>
      </Row>
    );
  }

  render() {
    const {
      dayoffListManagement: { data, detail, employeeList },
      loading,
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
              loading={loading || loadingDetail}
              data={data}
              columns={this.columns}
              onChange={this.handleListChange}
            />
          </div>
        </Card>
        <CreateForm
          dataEmployee={employeeList || []}
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

export default Form.create()(DayOffList);
