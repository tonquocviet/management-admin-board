import { Button, Card, Form } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import styles from './style.less';
import StandardTable from './components/StandardTable';
import SearchForm from './components/SearchForm';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ dayoffStatistic, loading }) => ({
  dayoffStatistic,
  loading: loading.effects['dayoffStatistic/fetch'],
}))
class DayOffStatistic extends Component {
  state = {
    formValues: {},
    isReset: false,
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
      type: 'dayoffStatistic/fetch',
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
      type: 'dayoffStatistic/fetch',
      payload: params,
      callback: () => {
        this.setState({
          isReset: false,
        });
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
        type: 'dayoffStatistic/fetch',
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

  render() {
    const {
      dayoffStatistic: { data },
      loading,
    } = this.props;
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
              loading={loading}
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

export default Form.create()(DayOffStatistic);
