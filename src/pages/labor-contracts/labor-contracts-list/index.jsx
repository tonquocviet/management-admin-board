import { Button, Card, Form, Row, message, Modal, Icon, Tag } from 'antd';
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

@connect(({ laborContractListManagement, loading }) => ({
  laborContractListManagement,
  loading: loading.effects['laborContractListManagement/fetch'],
  loadingAdd: loading.effects['laborContractListManagement/add'],
  loadingUpdate: loading.effects['laborContractListManagement/update'],
  loadingDetail: loading.effects['laborContractListManagement/getDetail'],
}))
class LaborContractsList extends Component {
  state = {
    formValues: {},
    isSearch: false,
    modalCreateVisible: false,
    modalUpdateVisible: false,
  };

  currentPage = null;

  columns = [
    {
      title: 'Họ và tên',
      align: 'center',
      sorter: true,
      fixed: 'left',
      dataIndex: 'full_name',
      render: (text, record) => (
        <Button type="link" onClick={() => this.showUpdateForm(record.id)}>
          {text}
        </Button>
      ),
    },
    {
      title: <span style={{ color: 'red' }}>Thông tin cá nhân</span>,
      children: [
        {
          title: 'Ngày sinh',
          align: 'center',
          key: 'birthday',
          dataIndex: 'birthday',
          render: date => <span>{moment(date).format('DD/MM/YYYY')}</span>,
        },
        {
          title: 'Nơi sinh',
          align: 'center',
          key: 'city_birth',
          dataIndex: 'city_birth',
        },
        {
          title: 'Số điện thoại',
          align: 'center',
          sorter: true,
          key: 'phoneNumber',
          dataIndex: 'phoneNumber',
        },
        {
          title: 'Địa chỉ thường trú',
          align: 'center',
          width: 400,
          key: 'permanent_address',
          dataIndex: 'permanent_address',
        },
        {
          title: 'Địa chỉ tạm trú',
          align: 'center',
          width: 400,
          key: 'temporary_address',
          dataIndex: 'temporary_address',
        },
        {
          title: 'Số CMND',
          align: 'center',
          key: 'identity_card',
          dataIndex: 'identity_card',
        },
        {
          title: 'Ngày cấp',
          align: 'center',
          key: 'date_of_issue',
          dataIndex: 'date_of_issue',
          render: date => <span>{moment(date).format('DD/MM/YYYY')}</span>,
        },
        {
          title: 'Nơi cấp',
          align: 'center',
          key: 'place_of_issue',
          dataIndex: 'place_of_issue',
        },
      ],
    },
    {
      title: <span style={{ color: 'darkblue' }}>Thông tin hợp đồng</span>,
      children: [
        {
          title: 'Từ ngày',
          dataIndex: 'startDate',
          key: 'startDate',
          align: 'center',
          render: date => <span>{moment(date).format('DD/MM/YYYY')}</span>,
        },
        {
          title: 'Đến ngày',
          dataIndex: 'endDate',
          key: 'endDate',
          align: 'center',
          render: date => <span>{moment(date).format('DD/MM/YYYY')}</span>,
        },
        {
          title: 'Mã hợp đồng',
          align: 'center',
          key: 'contract_number',
          dataIndex: 'contract_number',
        },
        {
          title: 'Chức vụ/bộ phận',
          align: 'center',
          key: 'position',
          dataIndex: 'position',
        },
      ],
    },
    {
      title: 'Trạng thái',
      align: 'center',
      key: 'status',
      dataIndex: 'status',
      render: status => <span>{status ? <Tag color="green">Đang làm việc</Tag> : <Tag color="red">Đã nghỉ</Tag>}</span>,
    },
    {
      title: 'Ghi Chú',
      align: 'center',
      key: 'notes',
      dataIndex: 'notes',
    },
    {
      title: 'Hành động',
      align: 'center',
      fixed: 'right',
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
      type: 'laborContractListManagement/fetch',
    });
  }

  handleListChange = (pagination, filtersArg, sorter) => {
    this.currentPage = { pagination, filtersArg, sorter };
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
      type: 'laborContractListManagement/fetch',
      payload: params,
    });
  };

  showConfirmDeleteAccount = record => {
    Modal.confirm({
      title: `Bạn có chắc muốn xóa hợp đồng của nhân viên ${record.full_name} không?`,
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
      type: 'laborContractListManagement/remove',
      payload: id,
      callback: res => {
        if (res && res.status) {
          message.success('Xóa thành công');
          if (!this.currentPage) {
            dispatch({
              type: 'laborContractListManagement/fetch',
            });
          } else {
            const { pagination, filtersArg, sorter } = this.currentPage;
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
        isSearch: true,
      },
      this.search,
    );
  };

  handleFormReset = () => {
    this.setState(
      {
        formValues: {},
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
        type: 'laborContractListManagement/fetch',
        payload: dataValues,
        callback: () => {
          this.setState({
            isSearch: false,
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
      type: 'laborContractListManagement/getDetail',
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
      type: 'laborContractListManagement/add',
      payload: fields,
      callback: res => {
        if (res && res.status) {
          this.handleModalCreateVisible(false);
          message.success('Thêm mới thành công');
          if (!this.currentPage) {
            dispatch({
              type: 'laborContractListManagement/fetch',
            });
          } else {
            const { pagination, filtersArg, sorter } = this.currentPage;
            this.handleListChange(pagination, filtersArg, sorter);
          }
        }
      },
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'laborContractListManagement/update',
      payload: fields,
      callback: res => {
        if (res && res.status) {
          this.handleModalUpdateVisible(false);
          message.success('Cập nhật thành công');
          if (!this.currentPage) {
            dispatch({
              type: 'laborContractListManagement/fetch',
            });
          } else {
            const { pagination, filtersArg, sorter } = this.currentPage;
            this.handleListChange(pagination, filtersArg, sorter);
          }
        }
      },
    });
  };

  renderCreateComp() {
    return (
      <Row type="flex" justify="space-between">
        <Button type="primary" className={styles.customExportBtn} onClick={this.showCreateForm}>
          <Icon type="plus" />
          Thêm hợp đồng
        </Button>
      </Row>
    );
  }

  render() {
    const {
      laborContractListManagement: { data, detail },
      loading,
      loadingAdd,
      loadingUpdate,
      loadingDetail,
    } = this.props;
    const { modalCreateVisible, modalUpdateVisible } = this.state;
    return (
      <PageHeaderWrapper>
        <Card className={styles.card} bordered={false}>
          <SearchForm
            handleSearch={this.handleSearch}
            handleFormReset={this.handleFormReset}
            loading={this.state.isSearch && loading}
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
          handleModalVisible={this.handleModalCreateVisible}
          modalVisible={modalCreateVisible}
          handleAdd={this.handleCreate}
          loading={loadingAdd}
        />
        {!loadingDetail && (
          <UpdateForm
            handleModalVisible={this.handleModalUpdateVisible}
            handleAdd={this.handleUpdate}
            modalVisible={modalUpdateVisible}
            data={detail || {}}
            loading={loadingUpdate}
          />
        )}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(LaborContractsList);
