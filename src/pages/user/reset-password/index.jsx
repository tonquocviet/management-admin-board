/* eslint-disable max-len */
/* eslint-disable react/jsx-no-target-blank */
import { Button, Result, Form, Input, message } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import router from 'umi/router';
import React, { Component } from 'react';
import styles from './style.less';

const FormItem = Form.Item;

const actions = (
  <div className={styles.actions}>
    <a href="https://mail.google.com/mail/u/0/#inbox" target="_blank" rel="noopener">
      <Button size="large" type="primary">
        Mở hộp thư Email
      </Button>
    </a>
    <Link to="/user/register">
      <Button size="large">Về trang đăng kí</Button>
    </Link>
  </div>
);

@connect(({ newPassword, loading }) => ({
  newPassword,
  submitting: loading.effects['newPassword/submit'],
}))
class ResetPassword extends Component {
  handleReset = e => {
    const { location, form, dispatch } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        const email = (location && location.state && location.state.account) || '';
        const dataReset = {
          ...values,
          email,
        };
        dispatch({
          type: 'newPassword/submit',
          payload: { ...dataReset },
          callback: res => {
            if (res && res.status) {
              router.push({
                pathname: '/user/login',
              });
              message.success('Chúc mừng. Đặt lại mật khẩu thành công !');
            }
          },
        });
      }
    });
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && form.getFieldValue('verifyPassword')) {
      form.validateFields(['verifyPassword'], { force: true });
    }
    callback();
  };

  comparePassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('Mật khẩu không khớp!');
    } else {
      callback();
    }
  };

  render() {
    const { location, form, submitting } = this.props;
    const emailDisplay = (location && location.state && location.state.email) || null;
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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 9,
        },
      },
    };
    return (
      <div>
        <Result
          className={styles.registerResult}
          status="success"
          title={
            <div className={styles.title}>
              Vui lòng kiểm tra hộp thư đến hoặc thư spam email {emailDisplay} và nhập code để đặt
              lại mật khẩu
            </div>
          }
          subTitle="Mã xác thực đã được gửi đến địa chỉ email của bạn và có hiệu lực trong 15 phút. Vui lòng đăng nhập vào email kịp thời và kiểm tra trong hộp thư đến hoặc hộp thư Spam."
          extra={actions}
        />
        <div className={styles.main}>
          <Form {...formItemLayout} onSubmit={this.handleReset}>
            <FormItem label="Mã xác thực">
              {form.getFieldDecorator('verificationCode', {
                rules: [
                  {
                    required: true,
                    message: 'Mã xác thực không được để trống !',
                  },
                  {
                    whitespace: true,
                    message: 'Giá trị không hợp lệ!',
                  },
                ],
              })(<Input maxLength={4} size="large" placeholder="Mã xác thực" />)}
            </FormItem>
            <FormItem label="Mật khẩu mới">
              {form.getFieldDecorator('newPassword', {
                rules: [
                  {
                    required: true,
                    message: 'Vui lòng nhập mật khẩu mới!',
                  },
                  {
                    message: 'Mật khẩu phải có chữ và số!',
                  },
                  {
                    validator: this.validateToNextPassword,
                  },
                  {
                    min: 4,
                    message: 'Mật khẩu tối thiểu 4 ký tự!',
                  },
                  {
                    whitespace: true,
                    message: 'Giá trị không hợp lệ!',
                  },
                ],
              })(<Input.Password size="large" placeholder="Nhập mật khẩu mới tại đây" />)}
            </FormItem>
            <FormItem label="Xác nhận mật khẩu">
              {form.getFieldDecorator('verifyPassword', {
                rules: [
                  {
                    required: true,
                    message: 'Vui lòng nhập lại mật khẩu!',
                  },
                  {
                    validator: this.comparePassword,
                  },
                  {
                    whitespace: true,
                    message: 'Giá trị không hợp lệ!',
                  },
                ],
              })(<Input.Password size="large" placeholder="Xác nhận mật khẩu tại đây" />)}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button size="large" loading={submitting} type="primary" htmlType="submit">
                Xác nhận
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(ResetPassword);
