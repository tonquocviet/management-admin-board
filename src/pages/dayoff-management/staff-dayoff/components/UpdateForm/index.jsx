/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-underscore-dangle */
import { Form, Modal, Input, DatePicker } from 'antd';
import React from 'react';
import moment from 'moment';

const FormItem = Form.Item;

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
      const startDate =
        (fieldsValue.startDate && fieldsValue.startDate.toDate().toISOString()) || undefined;
      const endDate =
        (fieldsValue.endDate && fieldsValue.endDate.toDate().toISOString()) || undefined;
      const startDateConvert = new Date(startDate.substring(0, 10));
      const endDateConvert = new Date(endDate.substring(0, 10));
      const total_absence = (endDateConvert - startDateConvert) / (1000 * 3600 * 24);
      if (err) return;
      const values = {
        ...fieldsValue,
        startDate,
        endDate,
        total_absence,
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
      title="Chỉnh sửa thông tin ngày nghỉ"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible(false)}
      width={650}
      style={{ top: 20 }}
      maskClosable={false}
    >
      <FormItem {...formItemLayout} label="Ngày bắt đầu nghỉ">
        {form.getFieldDecorator('startDate', {
          initialValue: moment(data.startDate),
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn ngày bắt đầu nghỉ !',
            },
          ],
        })(
          <DatePicker
            placeholder="Chọn ngày bắt đầu nghỉ"
            format="DD/MM/YYYY"
            style={{
              width: '100%',
            }}
          />,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Ngày quay lại làm việc">
        {form.getFieldDecorator('endDate', {
          initialValue: moment(data.endDate),
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn ngày quay lại làm việc !',
            },
          ],
        })(
          <DatePicker
            placeholder="Chọn ngày quay lại làm việc"
            disabledDate={disabledEndDate}
            format="DD/MM/YYYY"
            style={{
              width: '100%',
            }}
          />,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Lý do nghỉ">
        {form.getFieldDecorator('reason', {
          initialValue: data.reason,
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập lí do nghỉ!',
            },
            {
              whitespace: true,
              message: 'Giá trị không hợp lệ!',
            },
          ],
        })(<Input.TextArea placeholder="Nhập lí do nghỉ" autoSize={{ minRows: 3, maxRows: 5 }} />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create()(CreateForm);
