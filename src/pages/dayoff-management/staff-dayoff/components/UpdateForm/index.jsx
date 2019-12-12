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
      title="Chỉnh sửa thông tin tài khoản"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible(false)}
      width={560}
      style={{ top: 20 }}
      maskClosable={false}
    >
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
        })(<Input placeholder="Nhập lí do nghỉ" />)}
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
