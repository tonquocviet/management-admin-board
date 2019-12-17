import { Card, Form } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import StandardTable from './components/StandardTable';
import SearchForm from './components/SearchForm';

@connect(({ cvStatistic, loading }) => ({
  cvStatistic,
  loading: loading.effects['cvStatistic/fetch'],
}))
class CVStatistic extends Component {
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
      title: 'Tổng số CV',
      dataIndex: 'total_cv',
      align: 'center',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cvStatistic/fetch',
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
        type: 'cvStatistic/fetch',
        payload: search,
        callback: () => {
          this.setState({
            isReset: false,
          });
        },
      });
    }
  };

  // đang handel
  checkYear() {
    const year =
      this.props.cvStatistic.data
      && this.props.cvStatistic.data.list[0]
      && this.props.cvStatistic.data.list[0].year
    if (year) {
      return year;
    }
    return undefined;
  }


  render() {
    const {
      cvStatistic: { data },
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

export default Form.create()(CVStatistic);
