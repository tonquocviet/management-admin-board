import { Card, Form } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import StandardTable from './components/StandardTable';
import SearchForm from './components/SearchForm';
import MoneySpan from '@/components/MoneySpan';

@connect(({ salaryStatistic, loading }) => ({
  salaryStatistic,
  loading: loading.effects['salaryStatistic/fetch'],
}))
class SalaryEmployeeStatistic extends Component {
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
      title: 'Tổng tiền đã trả lương',
      dataIndex: 'total_salary',
      align: 'center',
      render: money => <MoneySpan number={money} />,
    },
    {
      title: 'Tổng số lần chuyển',
      dataIndex: 'total_send_salary',
      align: 'center',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salaryStatistic/fetch',
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
        type: 'salaryStatistic/fetch',
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
      salaryStatistic: { data },
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

export default Form.create()(SalaryEmployeeStatistic);
