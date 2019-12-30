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
      const sign_day =
        (fieldsValue.sign_day && fieldsValue.sign_day.toDate().toISOString()) || undefined;
      const acceptance_day =
        (fieldsValue.acceptance_day && fieldsValue.acceptance_day.toDate().toISOString()) || undefined;
      const liquidation_day =
        (fieldsValue.liquidation_day && fieldsValue.liquidation_day.toDate().toISOString()) || undefined;
      if (err) return;
      const values = {
        ...fieldsValue,
        sign_day,
        acceptance_day,
        liquidation_day,
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
            {getFieldDecorator('contract_Code', {
              rules: [
                {
                  whitespace: true,
                  message: 'Giá trị không hợp lệ!',
                },
              ],
            })(<Input placeholder="Nhập mã hợp đồng cần tìm" />)}
          </FormItem>
          <FormItem label="Ngày ký hợp đồng">
            {getFieldDecorator(
              'sign_day',
            )(
              <DatePicker
                placeholder="Chọn ngày ký hợp đồng"
                format="DD/MM/YYYY"
                style={{
                  width: '100%',
                }}
              />,
            )}
          </FormItem>
        </Col>
        <Col lg={8} md={12} sm={24}>
          <FormItem label="Tên hợp đồng">
            {getFieldDecorator('name_contract', {
              rules: [
                {
                  whitespace: true,
                  message: 'Giá trị không hợp lệ!',
                },
              ],
            })(<Input placeholder="Nhập tên hợp đồng cần tìm" />)}
          </FormItem>
          <FormItem label="Ngày nghiệm thu hợp đồng">
            {getFieldDecorator(
              'acceptance_day',
            )(
              <DatePicker
                placeholder="Chọn ngày nghiệm thu hợp đồng"
                format="DD/MM/YYYY"
                style={{
                  width: '100%',
                }}
              />,
            )}
          </FormItem>
        </Col>
        <Col lg={8} md={12} sm={24}>
          <FormItem label="Tên đối tác">
            {getFieldDecorator('partner', {
              rules: [
                {
                  whitespace: true,
                  message: 'Giá trị không hợp lệ!',
                },
              ],
            })(<Input placeholder="Nhập tên đối tác cần tìm" />)}
          </FormItem>
          <FormItem label="Ngày thanh lý hợp đồng">
            {getFieldDecorator(
              'liquidation_day',
            )(
              <DatePicker
                placeholder="Chọn ngày thanh lý hợp đồng"
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
