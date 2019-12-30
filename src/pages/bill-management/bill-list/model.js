import {
  queryList,
  queryDetail,
  addBill,
  removeBill,
  updateBill,
} from './service';

const Model = {
  namespace: 'billManagementList',
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
      const response = yield call(addBill, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(updateBill, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeBill, payload);
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
