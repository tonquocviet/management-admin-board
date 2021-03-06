import { routerRedux } from 'dva/router';
import { parse, stringify } from 'qs';
import { setAuthority } from '@/utils/authority';
import { removeTokenToLocalStorage } from '@/utils/utils';

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *logout(_, { put }) {
      removeTokenToLocalStorage();
      const { redirect } = getPageQuery(); // redirect

      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
