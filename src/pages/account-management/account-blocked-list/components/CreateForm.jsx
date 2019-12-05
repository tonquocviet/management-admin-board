import { Form, Input, Modal } from 'antd';
import React from 'react';

const FormItem = Form.Item;

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
      if (err) return;
      handleAdd(fieldsValue);
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
        {form.getFieldDecorator('account', {
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
              message:
                'Tài khoản phải bắt đầu bằng chữ thường và chỉ được bao gồm chữ thường, số và gạch chân!',
            },
          ],
        })(<Input maxLength={40} autoComplete="new-account" placeholder="Nhập tài khoản" />)}
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
        })(<Input.Password autoComplete="new-password" placeholder="Nhập mật khẩu" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="Họ tên">
        {form.getFieldDecorator('fullName', {
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập họ tên!',
            },
            {
              whitespace: true,
              message: 'Giá trị không hợp lệ!',
            },
          ],
        })(<Input placeholder="Nhập họ tên" />)}
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
        })(<Input style={{ width: '100%' }} placeholder="Nhập số điện thoại" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create()(CreateForm);
