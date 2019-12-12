import { queryRoleList } from './service';

const Model = {
  namespace: 'roleListManagement',
  state: {
    dataRole: [],
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryRoleList);
      yield put({
        type: 'systemRoleList',
        payload: response,
      });
    },
  },
  reducers: {
    systemRoleList(state, action) {
      return { ...state, dataRole: action.payload };
    },
  },
};
export default Model;
