/* eslint-disable @typescript-eslint/camelcase */
import { Form, Input, Modal, DatePicker, Select } from 'antd';
import React from 'react';
import moment from 'moment';
import InputPhone from '@/components/PhoneInput';

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

const CreateForm = props => {
  const { modalVisible, form, handleAdd, handleModalVisible, loading, dataApply } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const time_interview =
        (fieldsValue.time_interview && fieldsValue.time_interview.toDate().toISOString()) ||
        undefined;
      const createAt =
        (fieldsValue.createAt && fieldsValue.createAt.toDate().toISOString()) || undefined;
      const value = {
        ...fieldsValue,
        time_interview,
        createAt,
        cv_point: 0,
        cv_pass_fail: false,
        interview_pass_fail: false,
        take_interview: false,
      };
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
      title="Thêm mới CV"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible(false)}
      width={650}
      maskClosable={false}
    >
      <FormItem {...formItemLayout} label="Họ và tên">
        {form.getFieldDecorator('full_name', {
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập họ và tên!',
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
        })(<Input maxLength={20} placeholder="Nhập họ và tên" />)}
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
        })(<InputPhone style={{ width: '100%' }} placeholder="Nhập số điện thoại" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="Vị trí ứng tuyển">
        {form.getFieldDecorator('type_apply', {
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn vị trí ứng tuyển!',
            },
          ],
        })(
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
      <FormItem {...formItemLayout} label="Chức vụ ứng tuyển">
        {form.getFieldDecorator('position_apply', {
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn chức vụ ứng tuyển!',
            },
          ],
        })(
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
      <FormItem {...formItemLayout} label="Link CV">
        {form.getFieldDecorator('url_preview_cv', {
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập link CV!',
            },
            {
              whitespace: true,
              message: 'Giá trị không hợp lệ!',
            },
          ],
        })(<Input placeholder="Nhập link CV" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="Ngày phỏng vấn dự kiến">
        {form.getFieldDecorator('time_interview', {
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn ngày phỏng vấn dự kiến !',
            },
          ],
        })(
          <DatePicker
            disabledDate={currentDate => currentDate && currentDate <= moment().startOf('day')}
            placeholder="Chọn ngày phỏng vấn dự kiến"
            format="DD/MM/YYYY"
            style={{
              width: '100%',
            }}
          />,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Ngày nộp CV">
        {form.getFieldDecorator('createAt', {
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn ngày nộp CV !',
            },
          ],
        })(
          <DatePicker
            placeholder="Chọn ngày nộp CV"
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
