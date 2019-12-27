import {
  queryList,
  queryDetail,
  removeCV,
  queryPositionApply,
} from './service';

const Model = {
  namespace: 'cvPassManagement',
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
    *fetchPositionApply({ payload }, { call, put }) {
      const response = yield call(queryPositionApply, payload);
      yield put({
        type: 'savePosition',
        payload: response,
      });
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeCV, payload);
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
    savePosition(state, action) {
      return { ...state, PositionApplyList: action.payload };
    },
  },
};
export default Model;
