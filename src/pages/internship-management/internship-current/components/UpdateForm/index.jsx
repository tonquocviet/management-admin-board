/* eslint-disable no-underscore-dangle */
import { Form, Modal, Input, Select, DatePicker } from 'antd';
import React from 'react';
import moment from 'moment';

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

const positionList = [
  {
    id: 1,
    name: 'React Js',
  },
  {
    id: 2,
    name: 'Vue Js',
  },
  {
    id: 3,
    name: 'Dọn vệ sinh',
  },
  {
    id: 5,
    name: 'DevOps',
  },
  {
    id: 7,
    name: 'React Native',
  },
  {
    id: 8,
    name: 'PHP',
  },
  {
    id: 9,
    name: 'Microsoft ASP.Net',
  },
];

const CreateForm = props => {
  const { modalVisible, form, handleAdd, handleModalVisible, loading, data } = props;
  const okHandle = () => {
    // eslint-disable-next-line no-underscore-dangle
    form.validateFields((err, fieldsValue) => {
      const id = data._id;
      const birthday = fieldsValue.birthday && fieldsValue.birthday.toDate().toISOString();
      const startDate =
        (fieldsValue.startDate && fieldsValue.startDate.toDate().toISOString()) || undefined;
      const endDate =
        (fieldsValue.endDate && fieldsValue.endDate.toDate().toISOString()) || undefined;
      if (err) return;
      const value = {
        id,
        ...fieldsValue,
        birthday,
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
      title="Chỉnh sửa thông tin tài khoản"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible(false)}
      width={560}
      style={{ top: 20 }}
      maskClosable={false}
    >
      <FormItem {...formItemLayout} label="Email">
        {form.getFieldDecorator('email', {
          initialValue: data.email,
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập Email',
            },
          ],
        })(<Input disabled placeholder="Nhập Email" />)}
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
          ],
        })(<Input placeholder="Nhập số điện thoại" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="Vị trí thực tập">
        {form.getFieldDecorator('position_apply', {
          initialValue: data.position_apply,
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn vị trí thực tập !',
            },
          ],
        })(
          <Select
            showSearch
            placeholder="Chọn vị trí thực tập"
            style={{ width: '100%' }}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {(positionList || []).map(r => (
              <Select.Option key={r.id} value={r.name}>
                {r.name}
              </Select.Option>
            ))}
          </Select>,
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
            placeholder="Chọn ngày sinh"
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            disabledDate={currentDate => currentDate && currentDate > moment().endOf('day')}
          />,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Thời gian bắt đầu">
        {form.getFieldDecorator('startDate', {
          initialValue: moment(data.startDate),
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn thời gian thực tập !',
            },
          ],
        })(
          <DatePicker
            placeholder="Chọn ngày bắt đầu"
            format="DD/MM/YYYY"
            style={{
              width: '100%',
            }}
          />,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Thời gian kết thúc">
        {form.getFieldDecorator('endDate', {
          initialValue: moment(data.endDate),
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn thời gian kêt thúc thực tập !',
            },
          ],
        })(
          <DatePicker
            placeholder="Chọn ngày kết thúc"
            disabledDate={disabledEndDate}
            format="DD/MM/YYYY"
            style={{
              width: '100%',
            }}
          />,
        )}
      </FormItem>
    </Modal>
  );
};

export default Form.create()(CreateForm);
