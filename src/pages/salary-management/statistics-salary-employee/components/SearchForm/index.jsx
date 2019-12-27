/* eslint-disable no-plusplus */
import React from 'react';
import { Button, Col, Form, Row, DatePicker, Divider, Select } from 'antd';
import styles from '../../style.less';

const FormItem = Form.Item;

const yearList = [];
for (let i = 2012; i <= new Date().getFullYear(); i++) {
  const Obj = {
    value: i,
    name: i,
  };
  yearList.push(Obj);
}

const SearchForm = props => {
  const { handleSearch, form, handleFormReset, loading } = props;

  const onSearch = e => {
    e.preventDefault();
    // check lấy cả tháng và năm
    const check = valueMonth => {
      if (valueMonth) {
        const convert = valueMonth.split('/');
        const monthDirective = Number(convert[1]);
        const yearDirective = Number(convert[2]);
        return {
          monthDirective,
          yearDirective,
        };
      }
      return undefined;
    };
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const valueMonth = (fieldsValue.month && fieldsValue.month.format('l')) || undefined;
      const result = check(valueMonth);
      const month = (result && result.monthDirective) || undefined;
      const year = (result && result.yearDirective) || fieldsValue.year;
      const values = {
        ...fieldsValue,
        month,
        year,
      };
      handleSearch(values);
    });
  };

  const onReset = () => {
    form.resetFields();
    handleFormReset();
  };

  const onMonthChange = () => {
    const year = form.getFieldValue('year');
    if (year) {
      form.setFields({
        year: {
          value: undefined,
        },
      });
    }
  };
  const onYearChange = () => {
    const month = form.getFieldValue('month');
    if (month) {
      form.setFields({
        month: {
          value: undefined,
        },
      });
    }
  };

  const { getFieldDecorator } = form;

  return (
    <Form
      onSubmit={onSearch}
      layout="vertical"
      hideRequiredMark
      className={styles.customPaddingCol}
    >
      <Divider orientation="center">Thống kê theo tháng/năm hoặc theo năm</Divider>
      <Row type="flex" justify="center">
        <Col lg={8} md={12} sm={24}>
          <FormItem label="Chọn tháng / năm">
            {getFieldDecorator('month')(
              <DatePicker.MonthPicker
                onChange={onMonthChange}
                format="MM/YYYY"
                placeholder="Chọn tháng / năm muốn tìm"
                style={{
                  width: '100%',
                }}
              />,
            )}
          </FormItem>
        </Col>
        <Col lg={8} md={12} sm={24}>
          <FormItem label="Chọn năm">
            {getFieldDecorator(
              'year',
              {},
            )(
              <Select
                onChange={onYearChange}
                showSearch
                placeholder="Chọn năm muốn tìm"
                style={{ width: '100%' }}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {(yearList || []).map(r => (
                  <Select.Option key={r.value} value={r.name}>
                    {r.name}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </FormItem>
        </Col>
      </Row>
      <div
        style={{
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <Button type="primary" htmlType="submit" loading={loading}>
            Tìm kết quả
          </Button>
          <Button className={styles.customButton} onClick={onReset}>
            Hủy tìm kiếm
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default Form.create()(SearchForm);
