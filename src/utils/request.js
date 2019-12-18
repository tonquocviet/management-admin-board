/* eslint-disable no-console */
import { extend } from 'umi-request';
import { getAccessToken } from './utils';
import errorMessageHandler from './errorMessageHandler';

const handle401 = () => {
  window.location = '/user/login';
  return null;
};

const handle403 = () => {
  window.location = '/403';
  return null;
};

const handle500 = () => {
  window.location = '/user/login';
  return null;
};

const errorHandler = error => {
  const { response } = error;
  const urlName = window.location.pathname;
  if (response && response.status) {
    if (
      urlName === '/user/reset-password' ||
      urlName === '/user/register' ||
      urlName === '/user/register-confirm'
    ) {
      if (response.status === 500) {
        console.log('500 Internal Server Error');
      }
      if (response.status === 401) {
        console.log('401 Unauthorized');
      }
      if (response.status === 400) {
        console.log('400 Unauthorized');
      }
    } else if (urlName !== '/user/login') {
      if (response.status === 401) {
        return handle401(error);
      }
      if (response.status === 403) {
        return handle403();
      }
      if (response.status === 500) {
        return handle500();
      }
    }

    response.json().then(res => {
      errorMessageHandler(response.status, res.error || 'Xảy ra lỗi không xác định được');
    });
  }
  return { error };
};

const request = extend({
  errorHandler,
});

// request.use(refreshTokenMiddleware);

request.interceptors.request.use((url, options) => {
  const newOptions = {
    ...options,
    headers: {
      ...options.headers,
      ...{
        Authorization: `Bearer ${getAccessToken()}`,
      },
    },
  };
  return { url, options: newOptions };
});

request.interceptors.response.use((res, options) => {
  if (options.statusCallBack) {
    options.statusCallBack(res.status);
  }
  return res;
});

request.use(async (ctx, next) => {
  const realApis = [
    '/api/auth',
    '/api/user',
    '/api/interShip',
    '/api/absence-employee',
    '/api/cv-apply',
    '/api/salary-employee',
  ];
  if (realApis.some(r => ctx.req.url.startsWith(r))) {
    ctx.req.url = `https://admin-abcxyz.herokuapp.com${ctx.req.url}`;
  }
  await next();
});
export default request;
