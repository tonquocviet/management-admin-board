/* eslint-disable no-plusplus */
import React from 'react';
import { Button, Col, Form, Input, Row, DatePicker, Divider, Select } from 'antd';
import moment from 'moment';
import styles from '../../style.less';
import InputPhone from '@/components/PhoneInput';

const FormItem = Form.Item;
const positionLaborList = [
  {
    id: 1,
    name: 'Co-Founder',
  },
  {
    id: 3,
    name: 'Developer',
  },
  {
    id: 3,
    name: 'Tester',
  },
];

const SearchForm = props => {
  const { handleSearch, form, handleFormReset, loading } = props;

  const onSearch = e => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      const startDate =
        (fieldsValue.startDate && fieldsValue.startDate.toDate().toISOString()) || undefined;
      const endDate =
        (fieldsValue.endDate && fieldsValue.endDate.toDate().toISOString()) || undefined;
      if (err) return;
      const values = {
        ...fieldsValue,
        startDate,
        endDate,
      };
      handleSearch(values);
    });
  };

  const disabledStartDate = startValue => {
    const endDate = moment(form.getFieldValue('endDate')).startOf('day');
    const startDate = moment(startValue).startOf('day');
    if (!endDate || !startDate) {
      return false;
    }
    return endDate <= startDate;
  };

  const disabledEndDate = endValue => {
    const startDate = moment(form.getFieldValue('startDate')).startOf('day');
    const endDate = moment(endValue).startOf('day');
    if (!endDate || !startDate) {
      return false;
    }
    return endDate <= startDate;
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
            })(<Input placeholder="Nhập họ và tên cần tìm" />)}
          </FormItem>
          <FormItem label="Mã hợp đồng lao động">
            {getFieldDecorator('contract_number', {
              rules: [
                {
                  whitespace: true,
                  message: 'Giá trị không hợp lệ!',
                },
              ],
            })(<Input placeholder="Nhập mã hợp đồng cấn tìm" />)}
          </FormItem>
        </Col>
        <Col lg={8} md={12} sm={24}>
          <FormItem label="Số điện thoại">
            {form.getFieldDecorator('phoneNumber', {
              rules: [
                {
                  whitespace: true,
                  message: 'Giá trị không hợp lệ!',
                },
                {
                  min: 9,
                  message: 'Tối thiểu 9 ký tự!',
                },
              ],
            })(<InputPhone style={{ width: '100%' }} placeholder="Nhập số điện thoại cần tìm" />)}
          </FormItem>
          <FormItem label="Từ ngày">
            {getFieldDecorator(
              'startDate',
              {},
            )(
              <DatePicker
                disabledDate={disabledStartDate}
                placeholder="Chọn ngày bắt đầu"
                format="DD/MM/YYYY"
                style={{
                  width: '100%',
                }}
              />,
            )}
          </FormItem>
        </Col>
        <Col lg={8} md={12} sm={24}>
          <FormItem label="Chức vụ/bộ phận">
            {form.getFieldDecorator('position')(
              <Select
                showSearch
                placeholder="Chọn chức vụ/bộ phận cần tìm"
                style={{ width: '100%' }}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {(positionLaborList || []).map(r => (
                  <Select.Option key={r.id} value={r.name}>
                    {r.name}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </FormItem>
          <FormItem label="Đến ngày">
            {getFieldDecorator(
              'endDate',
              {},
            )(
              <DatePicker
                disabledDate={disabledEndDate}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày kết thúc"
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
