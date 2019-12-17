import {
  queryList,
  queryDetail,
  addSalary,
  updateSalary,
  removeSalary,
  queryEmployee,
} from './service';

const Model = {
  namespace: 'salaryManagement',
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
      const response = yield call(addSalary, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(updateSalary, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeSalary, payload);
      if (callback) callback(response);
    },
    *getDetail({ payload }, { call, put }) {
      const response = yield call(queryDetail, payload);
      yield put({
        type: 'saveDetail',
        payload: response,
      });
    },
    *getEmployee({ payload }, { call, put }) {
      const response = yield call(queryEmployee, payload);
      yield put({
        type: 'saveEmployee',
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
    saveEmployee(state, action) {
      return { ...state, employeeList: action.payload };
    },
  },
};
export default Model;
