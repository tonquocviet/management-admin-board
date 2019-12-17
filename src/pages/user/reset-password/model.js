import { newPassChange } from './service';

const Model = {
  namespace: 'newPassword',
  state: {},
  effects: {
    *submit({ payload, callback }, { call }) {
      const response = yield call(newPassChange, payload);
      if (callback) callback(response);
    },
  },
  reducers: {},
};
export default Model;
