import { verifyCode } from './service';

const Model = {
  namespace: 'verifyRegister',
  state: {},
  effects: {
    *submit({ payload, callback }, { call }) {
      const response = yield call(verifyCode, payload);
      if (callback) callback(response);
    },
  },
  reducers: {},
};
export default Model;
