/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-underscore-dangle */
import { Form, Modal, Input, DatePicker, InputNumber } from 'antd';
import React from 'react';
import moment from 'moment';
import { PRICE_RULE } from '@/utils/regexValidation';

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
      handleAdd({ values, id });
    });
  };

  return (
    <Modal
      confirmLoading={loading}
      destroyOnClose
      okText="Lưu"
      cancelText="Hủy"
      title="Chỉnh sửa thông tin hợp đồng"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible(false)}
      width={650}
      style={{ top: 20 }}
      maskClosable={false}
    >
        <FormItem {...formItemLayout} label="Mã hợp đồng">
          {form.getFieldDecorator('contract_Code', {
            initialValue: data.contract_Code,
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
        <FormItem {...formItemLayout} label="Tên hợp đồng">
        {form.getFieldDecorator('name_contract', {
          initialValue: data.name_contract,
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập tên hợp đồng!',
            },
            {
              whitespace: true,
              message: 'Giá trị không hợp lệ!',
            },
          ],
        })(
          <Input placeholder="Nhập tên hợp đồng" />,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Tên đối tác">
        {form.getFieldDecorator('partner', {
          initialValue: data.partner,
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập tên đối tác!',
            },
            {
              whitespace: true,
              message: 'Giá trị không hợp lệ!',
            },
          ],
        })(
          <Input placeholder="Nhập tên đối tác" />,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Ngày ký">
        {form.getFieldDecorator('sign_day', {
          initialValue: moment(data.sign_day),
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn ngày ký !',
            },
          ],
        })(<DatePicker
          placeholder="Chọn ngày ký"
          format="DD/MM/YYYY"
          style={{
            width: '100%',
          }}
        />)}
      </FormItem>
      <FormItem {...formItemLayout} label="Ngày nghiệm thu">
        {form.getFieldDecorator('acceptance_day', {
          initialValue: moment(data.acceptance_day),
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn ngày nghiệm thu !',
            },
          ],
        })(<DatePicker
          placeholder="Chọn ngày nghiệm thu"
          format="DD/MM/YYYY"
          style={{
            width: '100%',
          }}
        />)}
      </FormItem>
      <FormItem {...formItemLayout} label="Ngày thanh lý">
        {form.getFieldDecorator('liquidation_day', {
          initialValue: moment(data.liquidation_day),
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn ngày thanh lý !',
            },
          ],
        })(<DatePicker
          placeholder="Chọn ngày thanh lý"
          format="DD/MM/YYYY"
          style={{
            width: '100%',
          }}
        />)}
      </FormItem>
      <FormItem {...formItemLayout} label="Giá trị hợp đồng">
        {form.getFieldDecorator('contract_value', {
          initialValue: data.contract_value,
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập giá trị hợp đồng',
            },
            {
              pattern: PRICE_RULE,
              message: 'Giá trị hợp đồng không được để trống!',
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
      <FormItem {...formItemLayout} label="Thông tin liên hệ trực tiếp">
        {form.getFieldDecorator('info_live_partner', {
          initialValue: data.info_live_partner,
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập thông tin liên hệ trực tiếp!',
            },
            {
              whitespace: true,
              message: 'Giá trị không hợp lệ!',
            },
          ],
        })(
          <Input placeholder="Nhập thông tin liên hệ trực tiếp" />,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Số lượng phụ lục">
        {form.getFieldDecorator('appendix_number', {
          initialValue: data.appendix_number,
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập số lượng phụ lục!',
            },
          ],
        })(
          <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập số lượng phụ lục" />,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Ghi chú">
        {form.getFieldDecorator('notes', {
          initialValue: data.notes,
        })(
          <Input.TextArea placeholder="Nhập ghi chú"
            autoSize={{ minRows: 3, maxRows: 5 }} />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create()(CreateForm);
