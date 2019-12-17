/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-underscore-dangle */
import { Form, Input, InputNumber, Modal, DatePicker, Select } from 'antd';
import React from 'react';
import moment from 'moment';
import { PRICE_RULE } from '@/utils/regexValidation';

const FormItem = Form.Item;

const CreateForm = props => {
  const { modalVisible, form, handleAdd, handleModalVisible, loading, dataEmployee } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      const payment_salary_date =
        fieldsValue.payment_salary_date && fieldsValue.payment_salary_date.toDate().toISOString();
      if (err) return;
      const total_salary = fieldsValue.salary_basic + fieldsValue.subsidize || 0;
      const values = {
        ...fieldsValue,
        payment_salary_date,
        total_salary,
      };
      handleAdd(values);
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
      title="Thêm mới phiếu lương"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible(false)}
      width={550}
      maskClosable={false}
    >
      <FormItem {...formItemLayout} label="Nhân viên">
        {form.getFieldDecorator('user', {
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn nhân viên hưởng lương !',
            },
          ],
        })(
          <Select
            showSearch
            placeholder="Chọn nhân viên"
            style={{ width: '100%' }}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {(dataEmployee || []).map(r => (
              <Select.Option key={r._id} value={r._id}>
                {r.full_name}
              </Select.Option>
            ))}
          </Select>,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Mức lương cơ bản">
        {form.getFieldDecorator('salary_basic', {
          initialValue: 0,
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập lương cơ bản',
            },
            {
              pattern: PRICE_RULE,
              message: 'Giá không được để trống!',
            },
          ],
        })(
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            formatter={value => `${value} VNĐ`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\D\s?|(,*)/g, '')}
            step={1000}
          />,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Trợ cấp thêm">
        {form.getFieldDecorator('subsidize', {
          initialValue: 0,
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập tiền trợ cấp thêm',
            },
            {
              pattern: PRICE_RULE,
              message: 'Giá không được để trống!',
            },
          ],
        })(
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            formatter={value => `${value} VNĐ`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\D\s?|(,*)/g, '')}
            step={1000}
          />,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Ngày chuyển lương">
        {form.getFieldDecorator('payment_salary_date', {
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn ngày chuyển lương !',
            },
          ],
        })(
          <DatePicker
            placeholder="Chọn ngày chuyển lương"
            disabledDate={currentDate => currentDate && currentDate <= moment().startOf('day')}
            format="DD/MM/YYYY"
            style={{
              width: '100%',
            }}
          />,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Ghi chú">
        {form.getFieldDecorator('notes', {
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập ghi chú rõ ràng !',
            },
          ],
        })(
          <Input.TextArea
            placeholder="Vui lòng nhập ghi chú rõ ràng !"
            autoSize={{ minRows: 3, maxRows: 5 }}
          ></Input.TextArea>,
        )}
      </FormItem>
    </Modal>
  );
};

export default Form.create()(CreateForm);
