/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-plusplus */
import React from 'react';
import { Button, Col, Form, Input, Row, DatePicker } from 'antd';
import styles from '../../style.less';

const FormItem = Form.Item;

const yearList = [];
for (let i = 2012; i <= new Date().getFullYear(); i++) {
  const Obj = { name: i };
  yearList.push(Obj);
}

const SearchForm = props => {
  const { handleSearch, form, handleFormReset, isReset, loading } = props;

  const onSearch = e => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      const payment_salary_date =
        (fieldsValue.payment_salary_date &&
          fieldsValue.payment_salary_date.toDate().toISOString()) ||
        undefined;
      if (err) return;
      const values = {
        ...fieldsValue,
        payment_salary_date,
      };
      handleSearch(values);
    });
  };

  const onReset = () => {
    form.resetFields();
    handleFormReset();
  };

  const { getFieldDecorator } = form;

  return (
    <Form
      onSubmit={onSearch}
      layout="vertical"
      hideRequiredMark
      className={styles.customPaddingCol}
    >
      <Row gutter={16}>
        <Col lg={12} md={12} sm={24}>
          <FormItem label="Họ và tên">
            {getFieldDecorator('user', {
              rules: [
                {
                  whitespace: true,
                  message: 'Giá trị không hợp lệ!',
                },
              ],
            })(<Input placeholder="Nhập họ và tên cần tìm" />)}
          </FormItem>
        </Col>
        <Col lg={12} md={12} sm={24}>
          <FormItem label="Ngày chuyển lương">
            {getFieldDecorator(
              'payment_salary_date',
              {},
            )(
              <DatePicker
                placeholder="Chọn ngày chuyển lương"
                format="DD/MM/YYYY"
                style={{
                  width: '100%',
                }}
              />,
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
