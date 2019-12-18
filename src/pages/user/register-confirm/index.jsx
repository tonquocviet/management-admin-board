/* eslint-disable max-len */
/* eslint-disable react/jsx-no-target-blank */
import { Button, Result, Form, Input, Icon, message } from 'antd';
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

@connect(({ verifyRegister, loading }) => ({
  verifyRegister,
  submitting: loading.effects['verifyRegister/submit'],
}))
class RegisterConfirm extends Component {
  handleVerify = e => {
    const { location, form, dispatch } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        const email = (location && location.state && location.state.account) || 'test@gmail.com';
        const dataVerify = {
          ...values,
          email,
        };
        dispatch({
          type: 'verifyRegister/submit',
          payload: { ...dataVerify },
          callback: res => {
            if (res && res.status) {
              router.push({
                pathname: '/user/login',
              });
              message.success('Đăng kí tài khoản thành công !');
            }
          },
        });
      }
    });
  };

  render() {
    const { location, form, submitting } = this.props;
    const emailDisplay = (location && location.state && location.state.email) || null;
    return (
      <div>
        <Result
          className={styles.registerResult}
          status="success"
          title={
            <div className={styles.title}>
              Để đăng nhập vào hệ thống, vui lòng kiểm tra email {emailDisplay} và nhập code kích
              hoạt tài khoản
            </div>
          }
          subTitle="Mã xác thực đã được gửi đến địa chỉ email của bạn và có hiệu lực trong 15 phút. Vui lòng đăng nhập vào email kịp thời và kiểm tra trong hộp thư đến hoặc hộp thư Spam."
          extra={actions}
        />
        <div className={styles.main}>
          <Form layout="inline" onSubmit={this.handleVerify}>
            <FormItem>
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
              })(
                <Input
                  maxLength={4}
                  prefix={<Icon type="key" />}
                  size="large"
                  placeholder="Mã xác thực"
                />,
              )}
            </FormItem>
            <Button size="large" loading={submitting} type="primary" htmlType="submit">
              Xác nhận
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(RegisterConfirm);
