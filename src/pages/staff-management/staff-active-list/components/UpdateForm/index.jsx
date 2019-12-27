/* eslint-disable no-underscore-dangle */
import { Form, Modal, Input, Select, DatePicker } from 'antd';
import React from 'react';
import moment from 'moment';
import InputPhone from '@/components/PhoneInput';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
    md: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 18 },
  },
};
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
  const { modalVisible, form, handleAdd, handleModalVisible, loading, data } = props;
  const okHandle = () => {
    // eslint-disable-next-line no-underscore-dangle
    form.validateFields((err, fieldsValue) => {
      const id = data._id;
      // const birthday = (fieldsValue.birthday && fieldsValue.birthday.toDate().toISOString())
      const startDate = '2019-11-23T13:51:48.400Z';
      const endDate = '2019-11-23T13:51:48.400Z';
      if (err) return;
      const value = {
        id,
        ...fieldsValue,
        startDate,
        endDate,
      };
      ['username', 'email'].forEach(key => {
        delete value[key];
      });
      handleAdd({
        ...value,
      });
    });
  };
  return (
    <Modal
      confirmLoading={loading}
      destroyOnClose
      okText="Lưu"
      cancelText="Hủy"
      title="Chỉnh sửa thông tin nhân viên"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible(false)}
      width={560}
      style={{ top: 20 }}
      maskClosable={false}
    >
      <FormItem {...formItemLayout} label="Mã nhân viên">
        {form.getFieldDecorator('username', {
          initialValue: data.username,
          rules: [
            {
              required: true,
              message: 'Không được để trống mã nhân viên!',
            },
          ],
        })(<Input disabled placeholder="Tên tài khoản" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="Email">
        {form.getFieldDecorator('email', {
          initialValue: data.email,
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập Email',
            },
            {
              type: 'email',
              message: 'Vui lòng nhập đúng định dạng email',
            },
          ],
        })(<Input disabled placeholder="Nhập email @..." />)}
      </FormItem>
      <FormItem {...formItemLayout} label="Họ và tên">
        {form.getFieldDecorator('full_name', {
          initialValue: data.full_name,
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
        })(<Input placeholder="Nhập họ và tên" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="Giới tính">
        {form.getFieldDecorator('sex_type', {
          initialValue: data.sex_type,
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
          initialValue: data.address,
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
          initialValue: data.phoneNumber,
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
        })(<InputPhone placeholder="Nhập số điện thoại" />)}
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
            disabledDate={currentDate => currentDate && currentDate > moment().startOf('day')}
            placeholder="Chọn ngày sinh"
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
          />,
        )}
      </FormItem>
    </Modal>
  );
};

export default Form.create()(CreateForm);
