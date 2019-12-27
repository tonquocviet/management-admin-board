/* eslint-disable no-mixed-operators */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-underscore-dangle */
import { Form, Input, Modal, DatePicker, Select, Radio, Tag } from 'antd';
import React, { useState } from 'react';
import moment from 'moment';

const FormItem = Form.Item;
const CreateForm = props => {
  const [isChangeRadio, setChangeRadio] = useState(true);
  const [isDisableMorning, setDisableMorning] = useState(true);
  const [isDisableAfternoon, setDisableAfternoon] = useState(true);
  const { modalVisible, form, handleAdd, handleModalVisible, loading, dataEmployee } = props;
  const handleVisible = () => {
    setDisableMorning(true);
    setDisableAfternoon(true);
    handleModalVisible(false);
  };

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      const startDate =
        (fieldsValue.startDate && fieldsValue.startDate.toDate().toISOString()) || undefined;
      const endDate =
        (fieldsValue.endDate && fieldsValue.endDate.toDate().toISOString()) || undefined;
      const startDateConvert = new Date(startDate.substring(0, 10));
      const endDateConvert = new Date(endDate.substring(0, 10));
      // sdsdsd
      const haftTimeStart = fieldsValue.timeStart;
      const haftTimeReturn = fieldsValue.timeReturn;
      const checkDetail = () => {
        if (
          haftTimeStart &&
          !haftTimeReturn &&
          startDateConvert.getDate() === endDateConvert.getDate()
        ) {
          return (endDateConvert - startDateConvert) / (1000 * 3600 * 24) + 0.5;
        }
        if (haftTimeStart && !haftTimeReturn) {
          return (endDateConvert - startDateConvert) / (1000 * 3600 * 24) + 0.5;
        }
        if (!haftTimeStart && haftTimeReturn) {
          return (endDateConvert - startDateConvert) / (1000 * 3600 * 24) - 0.5;
        }
        if (haftTimeStart && haftTimeReturn) {
          return (endDateConvert - startDateConvert) / (1000 * 3600 * 24);
        }
        if (!haftTimeStart && !haftTimeReturn) {
          return (endDateConvert - startDateConvert) / (1000 * 3600 * 24);
        }
        return null;
      };
      const total_absence = checkDetail();
      if (err) return;
      const values = {
        ...fieldsValue,
        startDate,
        endDate,
        total_absence,
      };
      ['timeStart', 'timeReturn'].forEach(key => {
        delete values[key];
      });
      handleAdd(values);
    });
  };

  const handleChangeDateReturn = endDate => {
    const dateStart = moment(form.getFieldValue('startDate')).format('l');
    const dateEnd = moment(endDate).format('l');
    const haftTimeStart = form.getFieldValue('timeStart');
    if (dateStart === dateEnd && haftTimeStart) {
      setDisableAfternoon(false);
    } else if (dateStart !== dateEnd) {
      setDisableMorning(false);
      setDisableAfternoon(false);
    }
  };

  const disabledStartDate = startValue => {
    const endValue = form.getFieldValue('endDate');
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  const disabledEndDate = endValue => {
    const startValue = form.getFieldValue('startDate');
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
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
      onCancel={handleVisible}
      width={650}
      maskClosable={false}
    >
      <FormItem {...formItemLayout} label="Nhân viên nghỉ">
        {form.getFieldDecorator('user', {
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn người nghỉ',
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
      <FormItem {...formItemLayout} label="Ngày bắt đầu nghỉ">
        {form.getFieldDecorator('startDate', {
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn ngày bắt đầu nghỉ !',
            },
          ],
        })(
          <DatePicker
            disabledDate={disabledStartDate}
            placeholder="Chọn ngày bắt đầu nghỉ"
            format="DD/MM/YYYY"
            style={{
              width: '100%',
            }}
          />,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Thời gian cụ thể">
        {form.getFieldDecorator('timeStart', {
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn thời gian cụ thể !',
            },
          ],
        })(
          <Radio.Group onChange={() => setChangeRadio(false)}>
            <Radio value>
              <Tag color="#f50">Buổi sáng</Tag>
            </Radio>
            <Radio value={false}>
              <Tag color="#87d068">Buổi chiều</Tag>
            </Radio>
          </Radio.Group>,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Ngày trở lại làm việc">
        {form.getFieldDecorator('endDate', {
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn ngày trở lại làm việc !',
            },
          ],
        })(
          <DatePicker
            disabled={isChangeRadio}
            onChange={handleChangeDateReturn}
            placeholder="Chọn ngày trở lại làm việc"
            disabledDate={disabledEndDate}
            format="DD/MM/YYYY"
            style={{
              width: '100%',
            }}
          />,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Thời gian cụ thể">
        {form.getFieldDecorator('timeReturn', {
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn thời gian cụ thể !',
            },
          ],
        })(
          <Radio.Group>
            <Radio disabled={isDisableMorning} value>
              <Tag color="#f50">Buổi sáng</Tag>
            </Radio>
            <Radio disabled={isDisableAfternoon} value={false}>
              <Tag color="#87d068">Buổi chiều</Tag>
            </Radio>
          </Radio.Group>,
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
        })(<Input.TextArea placeholder="Nhập lí do nghỉ" autoSize={{ minRows: 3, maxRows: 5 }} />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create()(CreateForm);
