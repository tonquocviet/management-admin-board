import { Register } from './service';

const Model = {
  namespace: 'userRegister',
  state: {
    status: undefined,
  },
  effects: {
    *submit({ payload, callback }, { call }) {
      const response = yield call(Register, payload);
      if (callback) callback(response);
    },
  },
  reducers: {},
};
export default Model;
