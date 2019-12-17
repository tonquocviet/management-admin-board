import { Button, Form, Input } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './style.less';

const FormItem = Form.Item;

@connect(({ userForgot, loading }) => ({
  userForgot,
  submitting: loading.effects['userForgot/submit'],
}))
class Register extends Component {
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const account = form.getFieldValue('email');
    form.validateFields((err, values) => {
      if (!err) {
        const dataForgot = {
          ...values,
        };
        dispatch({
          type: 'userForgot/submit',
          payload: { ...dataForgot },
          callback: res => {
            if (res && res.status) {
              router.push({
                pathname: '/user/reset-password',
                state: {
                  account,
                },
              });
            }
          },
        });
      }
    });
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.main}>
        <h3>Quên mật khẩu</h3>
        <Form layout="inline" onSubmit={this.handleSubmit}>
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
            })(<Input size="large" placeholder="Nhập email dạng @" />)}
          </FormItem>
          <Button size="large" loading={submitting} type="primary" htmlType="submit">
            Xác nhận
          </Button>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Register);
