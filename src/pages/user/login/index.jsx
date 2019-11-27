import { Alert, Checkbox, Icon } from 'antd';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import LoginComponents from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginComponents;

@connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))
class Login extends Component {
  loginForm = undefined;

  state = {
    type: 'account',
    autoLogin: true,
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;

    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: { ...values, type },
      });
    }
  };

  onTabChange = type => {
    this.setState({
      type,
    });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      if (!this.loginForm) {
        return;
      }

      this.loginForm.validateFields(['mobile'], {}, async (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;

          try {
            const success = await dispatch({
              type: 'login/getCaptcha',
              payload: values.mobile,
            });
            resolve(!!success);
          } catch (error) {
            reject(error);
          }
        }
      });
    });

  renderMessage = content => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  render() {
    const { userLogin, submitting } = this.props;
    const { status, type: loginType } = userLogin;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          onCreate={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab="Đăng nhập bằng tài khoản">
            {status === 'error' &&
              loginType === 'account' &&
              !submitting &&
              this.renderMessage('Lỗi tài khoản hoặc mật khẩu sai（admin/ant.design）')}
            <UserName
              name="userName"
              placeholder="Tên đăng nhập"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên tài khoản',
                },
              ]}
            />
            <Password
              name="password"
              placeholder="Mật khẩu"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu',
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();

                if (this.loginForm) {
                  this.loginForm.validateFields(this.handleSubmit);
                }
              }}
            />
          </Tab>
          <Tab key="mobile" tab="Đăng nhập bằng số điện thoại">
            {status === 'error' &&
              loginType === 'mobile' &&
              !submitting &&
              this.renderMessage('Lỗi mã xác minh')}
            <Mobile
              name="mobile"
              placeholder="Số điện thoại"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số điện thoại của bạn !',
                },
                {
                  pattern: /^1\d{10}$/,
                  message: 'Lỗi định dạng số điện thoại !',
                },
              ]}
            />
            <Captcha
              name="captcha"
              placeholder="Mã xác minh"
              countDown={120}
              onGetCaptcha={this.onGetCaptcha}
              getCaptchaButtonText="Nhận mã"
              getCaptchaSecondText="秒"
              rules={[
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ]}
            />
          </Tab>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              Ghi nhớ đăng nhập
            </Checkbox>
            <a
              style={{
                float: 'right',
              }}
              href=""
            >
              Quên mật khẩu
            </a>
          </div>
          <Submit loading={submitting}>Đăng nhập</Submit>
          <div className={styles.other}>
            Phương thức đăng nhập khác
            <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
            <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
            <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
            <Link className={styles.register} to="/user/register">
              Đăng kí tài khoản
            </Link>
          </div>
        </LoginComponents>
      </div>
    );
  }
}

export default Login;
