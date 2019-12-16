import { Button, Card, Form, Row, message, Modal, Icon, Tag, Typography } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import styles from './style.less';
import StandardTable from './components/StandardTable';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import SearchForm from './components/SearchForm';

const { Text } = Typography;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ cvPassManagement, loading }) => ({
  cvPassManagement,
  loading: loading.effects['cvPassManagement/fetch'],
  loadingToggle: loading.effects['cvPassManagement/toggleStatus'],
  loadingDetail: loading.effects['cvPassManagement/getDetail'],
}))
class CVPassList extends Component {
  state = {
    formValues: {},
    isReset: false,
    modalCreateVisible: false,
    modalUpdateVisible: false,
  };

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
      title: 'Email',
      sorter: true,
      dataIndex: 'email',
      align: 'center',
    },
    {
      title: 'Chức vụ ứng tuyển',
      dataIndex: 'type_apply',
      align: 'center',
      render: type => <span>{type === 1 ? 'Thử việc/Developer' : 'Thực tập sinh'}</span>,
    },
    {
      title: 'Vị trí ứng tuyển',
      sorter: true,
      dataIndex: 'position_apply',
      align: 'center',
    },
    {
      title: 'Tổng điểm CV',
      dataIndex: 'cv_point',
      align: 'center',
      render: result => <Text strong>{result}</Text>,
    },
    {
      title: 'Tham gia phỏng vấn',
      dataIndex: 'take_interview',
      align: 'center',
      render: result => <span>{result ? <Text type="warning" strong>Có</Text> : <Text type="danger" strong>Không</Text>}</span>,
    },
    {
      title: 'Kết quả',
      dataIndex: 'interview_pass_fail',
      align: 'center',
      render: result => <span>{result ? <Tag color="green">PASS</Tag> : <Tag color="red">FAIL</Tag>}</span>,
    },
    {
      title: 'Ngày nộp CV',
      dataIndex: 'createAt',
      align: 'center',
      render: date => <span>{moment(date).format('DD/MM/YYYY')}</span>,
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
            onClick={() => this.showConfirmDeleteCVPass(record)}
          />
        </>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cvPassManagement/fetch',
    });
    dispatch({
      type: 'cvPassManagement/fetchPositionApply',
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
      type: 'cvPassManagement/fetch',
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
      onCancel: () => { },
    });
  };

  handleToggle = row => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cvPassManagement/toggleStatus',
      payload: row,
      callback: res => {
        if (res && res.status) {
          message.success('Chuyển đổi trạng thái thành công!');
          if (!this.currentPager) {
            dispatch({
              type: 'cvPassManagement/fetch',
            });
          } else {
            const { pagination, filtersArg, sorter } = this.currentPager;
            this.handleListChange(pagination, filtersArg, sorter);
          }
        }
      },
    });
  };

  showConfirmDeleteCVPass = record => {
    Modal.confirm({
      title: `Bạn có chắc muốn xóa cv của ${record.full_name} không?`,
      content: '',
      okText: 'Có',
      cancelText: 'Không',
      onOk: () => {
        this.handleRemoveItem(record.id);
      },
      onCancel: () => { },
    });
  };

  handleRemoveItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cvPassManagement/remove',
      payload: id,
      callback: res => {
        if (res && res.status) {
          message.success('Xóa thành công');
          if (!this.currentPage) {
            dispatch({
              type: 'cvPassManagement/fetch',
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
        type: 'cvPassManagement/fetch',
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
      type: 'cvPassManagement/getDetail',
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
      type: 'cvPassManagement/add',
      payload: fields,
      callback: res => {
        if (res && res.status) {
          this.handleModalCreateVisible(false);
          message.success('Thêm mới thành công');
          if (!this.currentPage) {
            dispatch({
              type: 'cvPassManagement/fetch',
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
      type: 'cvPassManagement/update',
      payload: fields,
      callback: res => {
        if (res && res.status) {
          this.handleModalUpdateVisible(false);
          message.success('Cập nhật thành công');
          if (!this.currentPage) {
            dispatch({
              type: 'cvPassManagement/fetch',
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
          Thêm CV
        </Button>
      </Row>
    );
  }

  render() {
    const {
      cvPassManagement: { data, detail, PositionApplyList },
      loading,
      loadingToggle,
      loadingDetail,
    } = this.props;
    const { modalCreateVisible, modalUpdateVisible } = this.state;
    return (
      <PageHeaderWrapper>
        <Card className={styles.card} bordered={false}>
          <SearchForm
            dataApply={PositionApplyList || []}
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

export default Form.create()(CVPassList);
