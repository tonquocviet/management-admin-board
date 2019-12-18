import { newPassChange } from './service';

const Model = {
  namespace: 'newPassword',
  state: {
    status: undefined,
  },
  effects: {
    *submit({ payload, callback }, { call, put }) {
      const response = yield call(newPassChange, payload);
      yield put({
        type: 'changeNewPassStatus',
        payload: response,
      });
      if (callback) callback(response);
    },
  },
  reducers: {
    changeNewPassStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status };
    },
  },
};
export default Model;
