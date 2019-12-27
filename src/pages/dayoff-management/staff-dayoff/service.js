/* eslint-disable no-underscore-dangle */
import request from '@/utils/request';

export async function queryList(params = {}) {
  const requestParams = params && {
    month: (params.search && params.search.month) || null,
    year: (params.search && params.search.year) || null,
    sort: {
      ...params.sorter,
    },
    filter: {
      ...params.search,
    },
    pagination: {
      pageSize: params.pageSize || 10,
      page: params.currentPage || 1,
    },
  };
  const response = await request('/api/absence-employee/get', {
    method: 'POST',
    data: requestParams,
  });
  const result = {
    pagination: {
      total: response.count,
      pageSize: (params || {}).pageSize || 10,
      current: (params || {}).currentPage || 1,
    },
    list: [],
  };
  result.list = (response.results || []).map(item => ({
    id: item._id,
    full_name: item.user ? item.user.full_name : 'Nhân viên không tồn tại',
    idUser: item.user ? item.user._id : null,
    ...item,
  }));
  return result;
}
export async function queryDetail(id) {
  let result = {};
  const res = await request(`/api/absence-employee/detail/${id}`);
  if (res.status) {
    result = { ...res.result };
  }
  return result;
}
export async function queryEmployee() {
  const requestParams = {
    blocked: false,
    sort: {},
    filter: {},
    pagination: {
      pageSize: 100,
      page: 1,
    },
  };

  const res = await request('/api/user', {
    method: 'POST',
    data: requestParams,
  });
  let result = [];
  if (res.results) {
    result = [...res.results];
  }
  return result;
}
export async function addDayOff(params) {
  let result = {};
  const res = await request('/api/absence-employee/create', {
    method: 'POST',
    data: params,
  });
  if (res.status) {
    result = { ...res };
  }
  return result;
}
export async function removeAccount(params) {
  let result = {};
  const res = await request(`/api/absence-employee/${params}`, {
    method: 'DELETE',
  });
  if (res.status) {
    result = { ...res };
  }
  return result;
}
export async function updateDayOff(params) {
  let result = {};
  const res = await request(`/api/absence-employee/${params.id}`, {
    method: 'PUT',
    data: { ...params.values },
  });
  if (res.status) {
    result = { ...res };
  }
  return result;
}
