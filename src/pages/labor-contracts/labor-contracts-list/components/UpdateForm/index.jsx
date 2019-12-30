/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-underscore-dangle */
import { Form, Modal, Input, DatePicker, Card, Select } from 'antd';
import React from 'react';
import moment from 'moment';
import InputPhone from '@/components/PhoneInput';
import CMNDInput from '@/components/CMNDInput';

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

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
    md: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 15 },
  },
};

const CreateForm = props => {
  const { modalVisible, form, handleAdd, handleModalVisible, loading, data } = props;
  const okHandle = () => {
    // eslint-disable-next-line no-underscore-dangle
    form.validateFields((err, fieldsValue) => {
      const id = data._id;
      const birthday =
        (fieldsValue.birthday && fieldsValue.birthday.toDate().toISOString()) || undefined;
      const date_of_issue =
        (fieldsValue.date_of_issue && fieldsValue.date_of_issue.toDate().toISOString()) || undefined;
      const startDate =
        (fieldsValue.startDate && fieldsValue.startDate.toDate().toISOString()) || undefined;
      const endDate =
        (fieldsValue.endDate && fieldsValue.endDate.toDate().toISOString()) || undefined;
      if (err) return;
      const values = {
        ...fieldsValue,
        birthday,
        date_of_issue,
        startDate,
        endDate,
        status: true,
      };
      handleAdd({ values, id });
    });
  };

  const disabledEndDate = endValue => {
    const startDate = moment(form.getFieldValue('startDate')).startOf('day');
    const endDate = moment(endValue).startOf('day');
    if (!endDate || !startDate) {
      return false;
    }
    return endDate <= startDate;
  };

  return (
    <Modal
      confirmLoading={loading}
      destroyOnClose
      okText="Lưu"
      cancelText="Hủy"
      title="Chỉnh sửa thông tin hợp đồng"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible(false)}
      width={650}
      style={{ top: 20 }}
      maskClosable={false}
    >
      <Card title="Thông tin cá nhân" bordered>
        <FormItem {...formItemLayout} label="Họ và tên">
          {form.getFieldDecorator('full_name', {
            initialValue: data.full_name,
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập họ và tên!',
              },
              {
                whitespace: true,
                message: 'Giá trị không hợp lệ!',
              },
            ],
          })(
            <Input placeholder="Nhập họ và tên" />,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Ngày sinh">
          {form.getFieldDecorator('birthday', {
            initialValue: moment(data.birthday),
            rules: [
              {
                required: true,
                message: 'Vui lòng chọn ngày sinh!',
              },
            ],
          })(
            <DatePicker
              disabledDate={currentDate => currentDate && currentDate > moment().endOf('day')}
              placeholder="Chọn ngày sinh"
              format="DD/MM/YYYY"
              style={{
                width: '100%',
              }}
            />,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Nơi sinh">
          {form.getFieldDecorator('city_birth', {
            initialValue: data.city_birth,
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập nơi sinh !',
              },
              {
                whitespace: true,
                message: 'Giá trị không hợp lệ!',
              },
            ],
          })(<Input placeholder="Nhập nơi sinh" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Số điện thoại">
          {form.getFieldDecorator('phoneNumber', {
            initialValue: data.phoneNumber,
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập số điện thoại !',
              },
              {
                whitespace: true,
                message: 'Giá trị không hợp lệ!',
              },
              {
                min: 9,
                message: 'Tối thiểu 9 ký tự!',
              },
            ],
          })(<InputPhone style={{ width: '100%' }} placeholder="Nhập số điện thoại" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Địa chỉ thường trú">
          {form.getFieldDecorator('permanent_address', {
            initialValue: data.permanent_address,
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập địa chỉ thường trú !',
              },
              {
                whitespace: true,
                message: 'Giá trị không hợp lệ!',
              },
            ],
          })(<Input placeholder="Nhập địa chỉ thường trú" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Địa chỉ tạm trú">
          {form.getFieldDecorator('temporary_address', {
            initialValue: data.temporary_address,
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập địa chỉ tạm trú !',
              },
              {
                whitespace: true,
                message: 'Giá trị không hợp lệ!',
              },
            ],
          })(<Input placeholder="Nhập địa chỉ tạm trú" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Số CMND">
          {form.getFieldDecorator('identity_card', {
            initialValue: data.identity_card,
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập số CMND !',
              },
            ],
          })(<CMNDInput />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Ngày cấp">
          {form.getFieldDecorator('date_of_issue', {
            initialValue: moment(data.date_of_issue),
            rules: [
              {
                required: true,
                message: 'Vui lòng chọn ngày cấp !',
              },
            ],
          })(<DatePicker
            disabledDate={currentDate => currentDate && currentDate > moment().endOf('day')}
            placeholder="Chọn ngày cấp"
            format="DD/MM/YYYY"
            style={{
              width: '100%',
            }}
          />)}
        </FormItem>
      </Card>
      <Card title="Thông tin hợp đồng" bordered style={{ marginTop: '20px' }}>
        <FormItem {...formItemLayout} label="Mã hợp đồng lao động">
          {form.getFieldDecorator('contract_number', {
            initialValue: data.contract_number,
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập mã hợp động lao động!',
              },
              {
                whitespace: true,
                message: 'Giá trị không hợp lệ!',
              },
            ],
          })(<Input placeholder="Nhập mã hợp đồng lao động" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Ngày bắt đầu hợp đồng">
          {form.getFieldDecorator('startDate', {
            initialValue: moment(data.startDate),
            rules: [
              {
                required: true,
                message: 'Vui lòng chọn ngày bắt đầu hợp đồng !',
              },
            ],
          })(<DatePicker
            placeholder="Chọn ngày bắt đầu hợp đồng"
            format="DD/MM/YYYY"
            style={{
              width: '100%',
            }}
          />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Ngày kết thúc hợp đồng">
          {form.getFieldDecorator('endDate', {
            initialValue: moment(data.endDate),
            rules: [
              {
                required: true,
                message: 'Vui lòng chọn ngày kết thúc hợp đồng !',
              },
            ],
          })(<DatePicker
            placeholder="Chọn ngày kết thúc hợp đồng"
            disabledDate={disabledEndDate}
            format="DD/MM/YYYY"
            style={{
              width: '100%',
            }}
          />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Chức vụ/bộ phận">
          {form.getFieldDecorator('position', {
            initialValue: data.position,
            rules: [
              {
                required: true,
                message: 'Vui lòng chọn chức vụ/bộ phận !',
              },
            ],
          })(
            <Select
              showSearch
              placeholder="Chọn chức vụ/bộ phận"
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
        <FormItem {...formItemLayout} label="Ghi chú">
          {form.getFieldDecorator('notes', {
            initialValue: data.notes,
          })(
            <Input.TextArea placeholder="Nhập ghi chú"
              autoSize={{ minRows: 3, maxRows: 5 }} />)}
        </FormItem>
      </Card>
    </Modal>
  );
};

export default Form.create()(CreateForm);
