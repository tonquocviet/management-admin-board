import { ForgotPass } from './service';

const Model = {
  namespace: 'userForgot',
  state: {},
  effects: {
    *submit({ payload, callback }, { call }) {
      const response = yield call(ForgotPass, payload);
      if (callback) callback(response);
    },
  },
  reducers: {},
};
export default Model;
