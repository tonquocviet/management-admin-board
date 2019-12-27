/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import InputPhone from '@/components/PhoneInput';
import styles from '../../style.less';

const FormItem = Form.Item;

const typeApplyList = [
  {
    id: 1,
    value: 1,
    name: 'Thử việc/Developer',
  },
  {
    id: 2,
    value: 2,
    name: 'Thực tập sinh',
  },
];

const SearchForm = props => {
  const { handleSearch, form, handleFormReset, isReset, loading, dataApply } = props;

  const onSearch = e => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
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
          <FormItem label="Họ và tên">
            {getFieldDecorator('full_name', {
              rules: [
                {
                  whitespace: true,
                  message: 'Giá trị không hợp lệ!',
                },
              ],
            })(<Input maxLength={20} placeholder="Nhập họ và tên cần tìm" />)}
          </FormItem>
          <FormItem label="Chức vụ ứng tuyển">
            {form.getFieldDecorator(
              'position_apply',
              {},
            )(
              <Select
                showSearch
                placeholder="Chọn chức vụ ứng tuyển"
                style={{ width: '100%' }}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {(dataApply || []).map(r => (
                  <Select.Option key={r.id} value={r.value}>
                    {r.name}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col lg={8} md={12} sm={24}>
          <FormItem label="Số điện thoại">
            {getFieldDecorator('phoneNumber', {
              rules: [
                {
                  whitespace: true,
                  message: 'Giá trị không hợp lệ!',
                },
              ],
            })(<InputPhone placeholder="Nhập số điện thoại cần tìm" />)}
          </FormItem>
          <FormItem label="Vị trí ứng tuyển">
            {form.getFieldDecorator(
              'type_apply',
              {},
            )(
              <Select
                showSearch
                placeholder="Chọn vị trí ứng tuyển"
                style={{ width: '100%' }}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {(typeApplyList || []).map(r => (
                  <Select.Option key={r.id} value={r.value}>
                    {r.name}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col lg={8} md={12} sm={24}>
          <FormItem label="Email">
            {getFieldDecorator('email', {
              rules: [
                {
                  whitespace: true,
                  message: 'Giá trị không hợp lệ!',
                },
              ],
            })(<Input placeholder="Nhập email cần tìm" />)}
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
