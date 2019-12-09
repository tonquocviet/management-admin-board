import { Button, Form, Input, Popover, Progress, Select } from 'antd';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import router from 'umi/router';
import InputPhone from '@/components/PhoneInput';
import styles from './style.less';

const FormItem = Form.Item;
const passwordStatusMap = {
  ok: <div className={styles.success}>Độ bảo mật: Cao</div>,
  pass: <div className={styles.warning}>Độ bảo mật: Bình thường</div>,
  poor: <div className={styles.error}>Độ bảo mật: Thấp</div>,
};
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

const genderList = [
  {
    id: 1,
    value: true,
    name: 'Nam',
  },
  {
    id: 2,
    value: false,
    name: 'Nữ',
  },
];

@connect(({ userRegister, loading }) => ({
  userRegister,
  submitting: loading.effects['userRegister/submit'],
}))
class Register extends Component {
  state = {
    confirmDirty: false,
    visible: false,
    help: '',
  };

  interval = undefined;

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');

    if (value && value.length > 9) {
      return 'ok';
    }

    if (value && value.length > 5) {
      return 'pass';
    }

    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const account = form.getFieldValue('email');
    form.validateFields(
      {
        force: true,
      },
      (err, values) => {
        if (!err) {
          const dataRegister = {
            ...values,
          };
          delete dataRegister.confirm;
          dispatch({
            type: 'userRegister/submit',
            payload: { ...dataRegister },
            callback: res => {
              if (res && res.status) {
                router.push({
                  pathname: '/user/register-confirm',
                  state: {
                    account,
                  },
                });
              }
            },
          });
        }
      },
    );
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;

    if (value && value !== form.getFieldValue('password')) {
      callback('Mật khẩu xác nhận không đúng');
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;

    if (!value) {
      this.setState({
        help: 'Vui lòng nhập mật khẩu !!',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });

      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }

      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;

        if (value && confirmDirty) {
          form.validateFields(['confirm'], {
            force: true,
          });
        }

        callback();
      }
    }
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { help, visible } = this.state;
    return (
      <div className={styles.main}>
        <h3>Đăng kí tài khoản</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: 'Tên tài khoản không được để trống',
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
            })(<Input size="large" placeholder="Vui lòng nhập tên tài khoản" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: 'Email không được để trống',
                },
                {
                  type: 'email',
                  message: 'Email không đúng định dạng',
                },
              ],
            })(<Input size="large" placeholder="Vui lòng nhập Email" />)}
          </FormItem>
          <FormItem help={help}>
            <Popover
              getPopupContainer={node => {
                if (node && node.parentNode) {
                  return node.parentNode;
                }

                return node;
              }}
              content={
                <div
                  style={{
                    padding: '4px 0',
                  }}
                >
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div
                    style={{
                      marginTop: 10,
                    }}
                  >
                    Vui lòng nhập ít nhất 6 ký tự và không sử dụng mật khẩu dễ đoán.
                  </div>
                </div>
              }
              overlayStyle={{
                width: 240,
              }}
              placement="right"
              visible={visible}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(<Input size="large" type="password" placeholder="Vui lòng nhập mật khẩu" />)}
            </Popover>
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: 'Xác nhận lại mật khẩu',
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(<Input size="large" type="password" placeholder="Vui lòng xác nhận mật khẩu" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('full_name', {
              rules: [
                {
                  required: true,
                  message: 'Vui lòng nhập họ và tên!',
                },
                {
                  whitespace: true,
                  message: 'Giá trị không hợp lệ!',
                },
              ],
            })(<Input size="large" placeholder="Vui lòng nhập họ và tên" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('sex_type', {
              rules: [
                {
                  required: true,
                  message: 'Vui lòng chọn giới tính !',
                },
              ],
            })(
              <Select
                size="large"
                showSearch
                placeholder="Chọn giới tính"
                style={{ width: '100%' }}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {(genderList || []).map(r => (
                  <Select.Option key={r.id} value={r.value}>
                    {r.name}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('phoneNumber', {
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
            })(
              <InputPhone
                size="large"
                style={{ width: '100%' }}
                placeholder="Nhập số điện thoại"
              />,
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('address', {
              rules: [
                {
                  required: true,
                  message: 'Vui lòng nhập địa chỉ!',
                },
                {
                  whitespace: true,
                  message: 'Giá trị không hợp lệ!',
                },
              ],
            })(<Input size="large" placeholder="Nhập địa chỉ" />)}
          </FormItem>
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              Đăng kí
            </Button>
            <Link className={styles.login} to="/user/login">
              Đăng nhập nếu đã có tài khoản
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Register);
