/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-plusplus */
import React from 'react';
import { Button, Col, Form, Input, Row, DatePicker } from 'antd';
import styles from '../../style.less';

const FormItem = Form.Item;

const SearchForm = props => {
  const { handleSearch, form, handleFormReset, loading } = props;

  const onSearch = e => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      const date_export =
        (fieldsValue.date_export && fieldsValue.date_export.toDate().toISOString()) || undefined;
      if (err) return;
      const values = {
        ...fieldsValue,
        date_export,
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
        <Col lg={8} md={12} sm={24}>
          <FormItem label="Mã hợp đồng">
            {getFieldDecorator('contract_code', {
              rules: [
                {
                  whitespace: true,
                  message: 'Giá trị không hợp lệ!',
                },
              ],
            })(<Input placeholder="Nhập mã hợp đồng cần tìm" />)}
          </FormItem>
        </Col>
        <Col lg={8} md={12} sm={24}>
          <FormItem label="Mã hóa đơn">
            {getFieldDecorator('code_bill', {
              rules: [
                {
                  whitespace: true,
                  message: 'Giá trị không hợp lệ!',
                },
              ],
            })(<Input placeholder="Nhập mã hóa đơn cần tìm" />)}
          </FormItem>
        </Col>
        <Col lg={8} md={12} sm={24}>
          <FormItem label="Nội dung yêu cầu thanh toán">
            {getFieldDecorator('content_requires_payment', {
              rules: [
                {
                  whitespace: true,
                  message: 'Giá trị không hợp lệ!',
                },
              ],
            })(<Input placeholder="Nhập dung yêu cầu thanh toán cần tìm" />)}
          </FormItem>
        </Col>
      </Row>
      <Row type="flex" justify="center">
        <Col lg={8} md={12} sm={24}>
          <FormItem label="Người xuất hóa đơn">
            {getFieldDecorator('biller', {
              rules: [
                {
                  whitespace: true,
                  message: 'Giá trị không hợp lệ!',
                },
              ],
            })(<Input placeholder="Nhập người xuất hóa đơn cần tìm" />)}
          </FormItem>
        </Col>
        <Col lg={8} md={12} sm={24}>
          <FormItem label="Ngày xuất hóa đơn">
            {getFieldDecorator('date_export')(
              <DatePicker
                placeholder="Chọn ngày xuất hóa đơn"
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
