import {
  queryList,
  queryRoleList,
  toggleStatus,
} from './service';

const Model = {
  namespace: 'accountManagement',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    roleList: [],
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
    *fetchRolesList(_, { call, put }) {
      const response = yield call(queryRoleList)
      yield put({
        type: 'populateRolesList',
        payload: response,
      });
    },
    *toggleStatus({ payload, callback }, { call }) {
      const response = yield call(toggleStatus, payload);
      if (callback) callback(response);
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, data: action.payload };
    },
    populateRolesList(state, action) {
      return { ...state, roleList: action.payload }
    },
  },
};
export default Model;
