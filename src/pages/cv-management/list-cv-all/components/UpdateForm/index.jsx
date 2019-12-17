/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import {
  Form,
  Modal,
  Input,
  Select,
  Slider,
  Button,
  Popconfirm,
  Radio,
  Tag,
  Typography,
} from 'antd';
import React, { useState } from 'react';

const { Text } = Typography;

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
  const [isAllowCV, setIsAllowCV] = useState(false);
  const [isValueCV, setValueCV] = useState('');
  const { modalVisible, form, handleAdd, handleModalVisible, loading, data, dataApply } = props;
  const okHandle = () => {
    // eslint-disable-next-line no-underscore-dangle
    form.validateFields((err, fieldsValue) => {
      const id = data._id;
      const cv_point = form.getFieldValue('cv_point');
      const cv_pass_fail = form.getFieldValue('cv_pass_fail');
      const take_interview = form.getFieldValue('take_interview');
      const interview_pass_fail = form.getFieldValue('interview_pass_fail');
      const url_preview_cv = isValueCV || form.getFieldValue('url_preview_cv');
      if (err) return;
      const value = {
        ...fieldsValue,
        cv_point,
        cv_pass_fail,
        take_interview,
        interview_pass_fail,
        url_preview_cv,
      };
      handleAdd({ value, id });
    });
  };

  const handleChangeCV = event => {
    event.preventDefault();
    const checkInput = event.target.value;
    setValueCV(checkInput);
  };

  return (
    <Modal
      confirmLoading={loading}
      destroyOnClose
      okText="Lưu"
      cancelText="Hủy"
      title="Chỉnh sửa thông tin CV"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible(false)}
      width={800}
      style={{ top: 20 }}
      maskClosable={false}
    >
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
      <FormItem {...formItemLayout} label="Email">
        {form.getFieldDecorator('email', {
          initialValue: data.email,
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
        })(<Input placeholder="Nhập email @..." />)}
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
      <FormItem {...formItemLayout} label="Vị trí ứng tuyển">
        {form.getFieldDecorator('type_apply', {
          initialValue: data.type_apply,
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
          initialValue: data.position_apply,
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
          initialValue: data.url_preview_cv,
          rules: [
            {
              required: true,
              message: 'Vui lòng nhập link CV!',
            },
          ],
        })(
          <>
            {isAllowCV ? (
              <>
                <Input
                  placeholder="Nhập CV"
                  defaultValue={isValueCV || data.url_preview_cv}
                  onChange={event => handleChangeCV(event)}
                />
                <a style={{ marginRight: 8 }} onClick={() => setIsAllowCV(!isAllowCV)}>
                  Lưu
                </a>
                <Popconfirm
                  title="Bạn có chắc muốn hủy?"
                  okText="Đồng ý"
                  cancelText="Không"
                  onConfirm={() => setIsAllowCV(!isAllowCV)}
                >
                  <a href="#">Hủy</a>
                </Popconfirm>
              </>
            ) : isValueCV ? (
              <>
                <a
                  href={isValueCV}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ant-form-text"
                >
                  {isValueCV}
                </a>
                <Button type="link" icon="edit" onClick={() => setIsAllowCV(!isAllowCV)}></Button>
              </>
            ) : (
              <>
                <a
                  href={data.url_preview_cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ant-form-text"
                >
                  {data.url_preview_cv}
                </a>
                <Button type="link" icon="edit" onClick={() => setIsAllowCV(!isAllowCV)}></Button>
              </>
            )}
          </>,
        )}
      </FormItem>
      <Form.Item {...formItemLayout} label="Cho điểm CV">
        {form.getFieldDecorator('cv_point', {
          initialValue: data.cv_point,
        })(
          <Slider
            min={0}
            max={10}
            marks={{
              0: '0',
              2: '2',
              4: '4',
              6: '6',
              8: '8',
              10: '10',
            }}
          />,
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="Trạng thái CV">
        {form.getFieldDecorator('cv_pass_fail', {
          initialValue: data.cv_pass_fail,
        })(
          <Radio.Group>
            <Radio value>
              <Tag color="green">Đạt yêu cầu</Tag>
            </Radio>
            <Radio value={false}>
              <Tag color="red">Không đạt yêu cầu</Tag>
            </Radio>
          </Radio.Group>,
        )}
      </Form.Item>
      {/* <FormItem {...formItemLayout} label="Ngày phỏng vấn dự kiến">
        {form.getFieldDecorator('time_interview', {
          initialValue: data.time_interview,
          rules: [
            {
              required: true,
              message: 'Vui lòng chọn ngày phỏng vấn dự kiến !',
            },
          ],
        })(
          <DatePicker
            // disabledDate={currentDate => currentDate && currentDate <= moment().startOf('day')}
            placeholder="Chọn ngày phỏng vấn dự kiến"
            format="DD/MM/YYYY"
            style={{
              width: '100%',
            }}
          />,
        )}
      </FormItem> */}
      <Form.Item {...formItemLayout} label="Tham gia phỏng vấn">
        {form.getFieldDecorator('take_interview', {
          initialValue: data.take_interview,
        })(
          <Radio.Group>
            <Radio value>
              <Text type="warning" strong>
                Có
              </Text>
            </Radio>
            <Radio value={false}>
              <Text type="danger" strong>
                Không
              </Text>
            </Radio>
          </Radio.Group>,
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="Kết quả phỏng vấn">
        {form.getFieldDecorator('interview_pass_fail', {
          initialValue: data.interview_pass_fail,
        })(
          <Radio.Group>
            <Radio value>
              <Tag color="green">PASS</Tag>
            </Radio>
            <Radio value={false}>
              <Tag color="red">FAIL</Tag>
            </Radio>
          </Radio.Group>,
        )}
      </Form.Item>
    </Modal>
  );
};

export default Form.create()(CreateForm);
