/* eslint-disable no-underscore-dangle */
import request from '@/utils/request';

export async function queryList(params = {}) {
  const requestParams = params && {
    blocked: false,
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
  const response = await request('/api/interShip/get?', {
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
    ...item,
  }));
  return result;
}
export async function toggleStatus(params) {
  const dataParams = {
    blocked: true,
  };
  let result = {};
  const res = await request(`/api/interShip/blocked/${params.id}`, {
    method: 'PUT',
    data: dataParams,
  });
  if (res.status) {
    result = { ...res };
  }
  return result;
}
export async function queryDetail(params) {
  let result = {};
  const res = await request(`/api/interShip/${params}`);
  if (res.status) {
    result = { ...res.result };
  }
  return result;
}
export async function addInternShip(params) {
  let result = {};
  const res = await request('/api/interShip/create', {
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
  const res = await request(`/api/interShip/remove/${params}`, {
    method: 'DELETE',
  });
  if (res.status) {
    result = { ...res };
  }
  return result;
}
export async function updateAccount(params) {
  let result = {};
  const res = await request(`/api/interShip/update/${params.id}`, {
    method: 'PUT',
    data: { ...params },
  });
  if (res.status) {
    result = { ...res };
  }
  return result;
}
