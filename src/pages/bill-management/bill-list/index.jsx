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
import MoneySpan from '@/components/MoneySpan';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ billManagementList, loading }) => ({
  billManagementList,
  loading: loading.effects['billManagementList/fetch'],
  loadingAdd: loading.effects['billManagementList/add'],
  loadingUpdate: loading.effects['billManagementList/update'],
  loadingDetail: loading.effects['billManagementList/getDetail'],
}))
class BillManagementList extends Component {
  state = {
    formValues: {},
    isSearch: false,
    modalCreateVisible: false,
    modalUpdateVisible: false,
  };

  currentPage = null;

  columns = [
    {
      title: 'Mã hợp đồng',
      align: 'center',
      fixed: 'left',
      sorter: true,
      dataIndex: 'contract_code',
      render: (text, record) => (
        <Button type="link" onClick={() => this.showUpdateForm(record.id)}>
          {text}
        </Button>
      ),
    },
    {
      title: 'Mã hóa đơn',
      align: 'center',
      sorter: true,
      dataIndex: 'code_bill',
    },
    {
      title: 'Nội dung yêu cầu thanh toán',
      align: 'center',
      dataIndex: 'content_requires_payment',
    },
    {
      title: 'Người xuất hóa đơn',
      align: 'center',
      dataIndex: 'biller',
    },
    {
      title: 'Ngày xuất hóa đơn',
      align: 'center',
      sorter: true,
      dataIndex: 'date_export',
      render: date => <span>{moment(date).format('DD/MM/YYYY')}</span>,
    },
    {
      title: 'Số tiền',
      align: 'center',
      sorter: true,
      dataIndex: 'amount',
      render: money => <MoneySpan number={money} />,
    },
    {
      title: 'Tình trạng hóa đơn',
      align: 'center',
      sorter: true,
      dataIndex: 'status_bill',
      render: statusBill => <span>{ statusBill ? <Tag color="green">Đã xuất</Tag> : <Tag color="red">Chưa xuất</Tag> }</span>,
    },
    {
      title: 'Tình trạng hợp đồng',
      align: 'center',
      sorter: true,
      dataIndex: 'contract_status',
      render: statusContract => <span>{ statusContract ? <Tag color="green">Đã ký</Tag> : <Tag color="red">Chưa ký</Tag> }</span>,
    },
    {
      title: 'Ghi chú',
      align: 'center',
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
      type: 'billManagementList/fetch',
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
      type: 'billManagementList/fetch',
      payload: params,
    });
  };

  showConfirmDeleteAccount = record => {
    Modal.confirm({
      title: `Bạn có chắc muốn xóa hóa đơn ${record.contract_code} không?`,
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
      type: 'billManagementList/remove',
      payload: id,
      callback: res => {
        if (res && res.status) {
          message.success('Xóa thành công');
          if (!this.currentPage) {
            dispatch({
              type: 'billManagementList/fetch',
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
        type: 'billManagementList/fetch',
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
      type: 'billManagementList/getDetail',
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
      type: 'billManagementList/add',
      payload: fields,
      callback: res => {
        if (res && res.status) {
          this.handleModalCreateVisible(false);
          message.success('Thêm mới thành công');
          if (!this.currentPage) {
            dispatch({
              type: 'billManagementList/fetch',
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
      type: 'billManagementList/update',
      payload: fields,
      callback: res => {
        if (res && res.status) {
          this.handleModalUpdateVisible(false);
          message.success('Cập nhật thành công');
          if (!this.currentPage) {
            dispatch({
              type: 'billManagementList/fetch',
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
          Thêm hóa đơn
        </Button>
      </Row>
    );
  }

  render() {
    const {
      billManagementList: { data, detail },
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

export default Form.create()(BillManagementList);
