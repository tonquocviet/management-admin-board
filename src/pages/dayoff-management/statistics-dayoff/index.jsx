import { Card, Form } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import StandardTable from './components/StandardTable';
import SearchForm from './components/SearchForm';

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
      title: (this.checkYear()) ? 'Năm' : 'Ngày',
      align: 'center',
      dataIndex: 'day',
    },
    {
      title: 'Tháng',
      align: 'center',
      dataIndex: 'month',
    },
    {
      title: 'Năm',
      align: 'center',
      dataIndex: 'year',
    },
    {
      title: 'Tổng số ngày nghỉ',
      dataIndex: 'total_date_absence',
      align: 'center',
    },
    {
      title: 'Tổng số request nghỉ',
      dataIndex: 'total_request_absence',
      align: 'center',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dayoffStatistic/fetch',
    });
  }

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
      dispatch({
        type: 'dayoffStatistic/fetch',
        payload: search,
        callback: () => {
          this.setState({
            isReset: false,
          });
        },
      });
    }
  };

  checkYear() {
    const year =
      this.props.dayoffStatistic.data
      && this.props.dayoffStatistic.data.list[0]
      && this.props.dayoffStatistic.data.list[0].year
    if (year) {
      return year;
    }
    return undefined;
  }


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
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(DayOffStatistic);
