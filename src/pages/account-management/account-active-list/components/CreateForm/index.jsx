import { Form, Input, Modal, DatePicker, Select } from 'antd';
import React from 'react';
import moment from 'moment';
import InputPhone from '@/components/PhoneInput';

const FormItem = Form.Item;

const genderList = [
  {
    id: 1,
    value: true,
    name: 'Nam',
  },
  {
    id: 2,
    value: false,
    name: 'Nữ',
  },
];

const CreateForm = props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    loading,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      const birthday = (fieldsValue.birthday && fieldsValue.birthday.toDate().toISOString())
      const startDate = moment().toDate().toISOString()
      if (err) return;
      const value = {
        ...fieldsValue,
        birthday,
        startDate,
      }
      handleAdd(value);
    });
  };
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
  return (
    <Modal
      confirmLoading={loading}
      style={{ top: 20 }}
      destroyOnClose
      okText="Lưu"
      cancelText="Hủy"
      title="Thêm tài khoản quản trị"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible(false)}
      width={550}
      maskClosable={false}
    >
      <FormItem {...formItemLayout} label="Tài khoản">
        {form.getFieldDecorator('username', {
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập tài khoản!',
            },
            {
              min: 4,
              message: 'Tối thiểu 4 ký tự!',
            },
            {
              whitespace: true,
              message: 'Giá trị không hợp lệ!',
            },
          ],
        })(<Input maxLength={20} placeholder="Nhập tài khoản" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="Email">
        {form.getFieldDecorator('email', {
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập email của bạn!',
            },
            {
              type: 'email',
              message: 'Email không đúng định dạng!',
            },
          ],
        })(<Input style={{ width: '100%' }} placeholder="Nhập email @..." />)}
      </FormItem>
      <FormItem {...formItemLayout} label="Mật khẩu">
        {form.getFieldDecorator('password', {
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu!',
            },
            {
              message: 'Mật khẩu phải có chữ và số!',
            },
            {
              min: 8,
              message: 'Tối thiểu 8 ký tự!',
            },
            {
              whitespace: true,
              message: 'Giá trị không hợp lệ!',
            },
          ],
        })(<Input.Password placeholder="Nhập mật khẩu" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="Họ và tên">
        {form.getFieldDecorator('full_name', {
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
        })(<Input placeholder="Nhập họ và tên" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="Ngày sinh">
        {form.getFieldDecorator('birthday', {
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn ngày sinh!',
            },
          ],
        })(
          <DatePicker
            placeholder="Chọn ngày sinh"
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            disabledDate={currentDate => currentDate && currentDate > moment().endOf('day')}
          />,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Giới tính">
        {form.getFieldDecorator('sex_type', {
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn giới tính !',
            },
          ],
        })(
          <Select
            showSearch
            placeholder="Chọn giới tính"
            style={{ width: '100%' }}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {(genderList || []).map(r => (
              <Select.Option key={r.id} value={r.value}>
                {r.name}
              </Select.Option>
            ))}
          </Select>,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Địa chỉ">
        {form.getFieldDecorator('address', {
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập địa chỉ!',
            },
            {
              whitespace: true,
              message: 'Giá trị không hợp lệ!',
            },
          ],
        })(<Input placeholder="Nhập địa chỉ" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="Số điện thoại">
        {form.getFieldDecorator('phoneNumber', {
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập số điện thoại!',
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
    </Modal>
  );
};

export default Form.create()(CreateForm);
