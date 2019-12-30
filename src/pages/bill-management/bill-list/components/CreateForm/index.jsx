/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
import { Form, Input, Modal, DatePicker, InputNumber, Radio, Tag } from 'antd';
import React from 'react';
import { PRICE_RULE } from '@/utils/regexValidation';

const FormItem = Form.Item;

const CreateForm = props => {
  const { modalVisible, form, handleAdd, handleModalVisible, loading } = props;
  const handleVisible = () => {
    handleModalVisible(false);
  };

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      const sign_day =
        (fieldsValue.sign_day && fieldsValue.sign_day.toDate().toISOString()) || undefined;
      const acceptance_day =
        (fieldsValue.acceptance_day && fieldsValue.acceptance_day.toDate().toISOString()) || undefined;
      const liquidation_day =
        (fieldsValue.liquidation_day && fieldsValue.liquidation_day.toDate().toISOString()) || undefined;
      if (err) return;
      const values = {
        ...fieldsValue,
        sign_day,
        acceptance_day,
        liquidation_day,
        status: true,
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
      title="Thêm mới hóa đơn"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={handleVisible}
      width={650}
      maskClosable={false}
    >
      <FormItem {...formItemLayout} label="Mã hợp đồng">
        {form.getFieldDecorator('contract_code', {
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập mã hợp đồng!',
            },
            {
              whitespace: true,
              message: 'Giá trị không hợp lệ!',
            },
          ],
        })(
          <Input placeholder="Nhập mã hợp đồng" />,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Mã hóa đơn">
        {form.getFieldDecorator('code_bill', {
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập mã hóa đơn!',
            },
            {
              whitespace: true,
              message: 'Giá trị không hợp lệ!',
            },
          ],
        })(
          <Input placeholder="Nhập mã hóa đơn" />,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Nội dung yêu cầu thanh toán">
        {form.getFieldDecorator('content_requires_payment', {
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập nội dung thanh toán!',
            },
            {
              whitespace: true,
              message: 'Giá trị không hợp lệ!',
            },
          ],
        })(
          <Input placeholder="Nhập nội dung yêu cầu thanh toán" />,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Người xuất hóa đơn">
        {form.getFieldDecorator('biller', {
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập người xuất hóa đơn!',
            },
            {
              whitespace: true,
              message: 'Giá trị không hợp lệ!',
            },
          ],
        })(
          <Input placeholder="Nhập người xuất hóa đơn" />,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Ngày xuất hóa đơn">
        {form.getFieldDecorator('date_export', {
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn ngày xuất hóa đơn !',
            },
          ],
        })(<DatePicker
          placeholder="Chọn ngày xuất hóa đơn"
          format="DD/MM/YYYY"
          style={{
            width: '100%',
          }}
        />)}
      </FormItem>
      <FormItem {...formItemLayout} label="Số tiền">
        {form.getFieldDecorator('amount', {
          initialValue: 0,
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập số tiền',
            },
            {
              pattern: PRICE_RULE,
              message: 'Số tiền không được để trống!',
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
      <FormItem {...formItemLayout} label="Tình trạng hóa đơn">
        {form.getFieldDecorator('status_bill', {
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn tình trạng hóa đơn',
            },
          ],
        })(
          <Radio.Group>
            <Radio value>
              <Tag color="green">Đã xuất</Tag>
            </Radio>
            <Radio value={false}>
              <Tag color="red">Chưa xuất</Tag>
            </Radio>
          </Radio.Group>,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Tình trạng hợp đồng">
        {form.getFieldDecorator('contract_status', {
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn tình trạng hợp đồng',
            },
          ],
        })(
          <Radio.Group>
            <Radio value>
              <Tag color="green">Đã ký</Tag>
            </Radio>
            <Radio value={false}>
              <Tag color="red">Chưa ký</Tag>
            </Radio>
          </Radio.Group>,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Ghi chú">
        {form.getFieldDecorator('notes')(
          <Input.TextArea placeholder="Nhập ghi chú"
            autoSize={{ minRows: 3, maxRows: 5 }} />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create()(CreateForm);
