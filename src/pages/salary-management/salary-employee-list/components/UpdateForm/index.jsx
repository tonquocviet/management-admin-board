/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-underscore-dangle */
import { Form, Modal, Input, InputNumber, DatePicker } from 'antd';
import React from 'react';
import moment from 'moment';
import { PRICE_RULE } from '@/utils/regexValidation';

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

const CreateForm = props => {
  const { modalVisible, form, handleAdd, handleModalVisible, loading, data } = props;
  const dataPassing = {
    employeeName: (data && data.user && data.user.full_name) || null,
    employeeId: (data && data.user && data.user._id) || null,
    ...data,
  };
  const okHandle = () => {
    // eslint-disable-next-line no-underscore-dangle
    form.validateFields((err, fieldsValue) => {
      const id = data._id;
      const payment_salary_date =
        fieldsValue.payment_salary_date && fieldsValue.payment_salary_date.toDate().toISOString();
      const total_salary = fieldsValue.salary_basic + fieldsValue.subsidize || 0;
      if (err) return;
      const values = {
        ...fieldsValue,
        payment_salary_date,
        total_salary,
      };
      handleAdd({ values, id });
    });
  };

  return (
    <Modal
      confirmLoading={loading}
      destroyOnClose
      okText="Lưu"
      cancelText="Hủy"
      title="Chỉnh sửa phiếu lương"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible(false)}
      width={700}
      style={{ top: 20 }}
      maskClosable={false}
    >
      <FormItem {...formItemLayout} label="Tên nhân viên">
        {form.getFieldDecorator('user', {
          initialValue: dataPassing.employeeId,
        })(<span style={{ fontWeight: '600' }}>{dataPassing.employeeName}</span>)}
      </FormItem>
      <FormItem {...formItemLayout} label="Mức lương cơ bản">
        {form.getFieldDecorator('salary_basic', {
          initialValue: dataPassing.salary_basic || 0,
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
          initialValue: dataPassing.subsidize || 0,
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
          initialValue: moment(data.payment_salary_date),
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn ngày chuyển lương!',
            },
          ],
        })(
          <DatePicker
            disabledDate={someDate =>
              someDate && someDate < moment(data.payment_salary_date).startOf('day')
            }
            placeholder="Chọn ngày chuyển lương"
            format="DD/MM/YYYY"
            style={{
              width: '100%',
            }}
          />,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Ghi chú">
        {form.getFieldDecorator('notes', {
          initialValue: dataPassing.notes,
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
