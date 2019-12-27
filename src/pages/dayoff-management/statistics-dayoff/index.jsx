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
    isSearch: false,
  };

  currentPage = null;

  columns = [
    {
      title: 'Thời gian cụ thể',
      align: 'center',
      dataIndex: 'time_sheet',
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
      dispatch({
        type: 'dayoffStatistic/fetch',
        payload: search,
        callback: () => {
          this.setState({
            isSearch: false,
          });
        },
      });
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
            loading={this.state.isSearch && loading}
          />
        </Card>
        <Card className={styles.card} bordered={false}>
          <div className={styles.tableList}>
            <StandardTable loading={loading} data={data} columns={this.columns} />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(DayOffStatistic);
