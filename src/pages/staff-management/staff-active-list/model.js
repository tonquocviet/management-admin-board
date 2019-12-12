import {
  queryList,
  toggleStatus,
  queryDetail,
  addAccount,
  removeAccount,
  updateAccount,
} from './service';

const Model = {
  namespace: 'accountActiveManagement',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addAccount, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(updateAccount, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeAccount, payload);
      if (callback) callback(response);
    },
    *toggleStatus({ payload, callback }, { call }) {
      const response = yield call(toggleStatus, payload);
      if (callback) callback(response);
    },
    *getDetail({ payload }, { call, put }) {
      const response = yield call(queryDetail, payload);
      yield put({
        type: 'saveDetail',
        payload: response,
      });
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, data: action.payload };
    },
    saveDetail(state, action) {
      return { ...state, detail: action.payload };
    },
  },
};
export default Model;
