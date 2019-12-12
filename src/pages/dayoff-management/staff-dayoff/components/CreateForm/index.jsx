/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-underscore-dangle */
import { Form, Input, Modal, DatePicker, Select } from 'antd';
import React from 'react';
import moment from 'moment';

const FormItem = Form.Item;

const CreateForm = props => {
  const { modalVisible, form, handleAdd, handleModalVisible, loading, dataEmployee } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      const startDate =
        moment(fieldsValue.startDate && fieldsValue.startDate).format() || undefined;
      const endDate = moment(fieldsValue.endDate && fieldsValue.endDate).format() || undefined;
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
      handleAdd(values);
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
      title="Thêm mới ngày nghỉ"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible(false)}
      width={550}
      maskClosable={false}
    >
      <FormItem {...formItemLayout} label="Nhân viên nghỉ">
        {form.getFieldDecorator('user', {
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn người nghỉ !',
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
      <FormItem {...formItemLayout} label="Lý do nghỉ">
        {form.getFieldDecorator('reason', {
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
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn thời gian bắt đầu !',
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
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn thời gian kêt thúc !',
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
