/* eslint-disable no-underscore-dangle */
import request from '@/utils/request';

export async function queryList(params = {}) {
  const requestParams = params && {
    sort: {
      ...params.sorter,
    },
    filter: {
      ...params.search,
    },
    pagination: {
      pageSize: params.pageSize || 5,
      page: params.currentPage || 1,
    },
  };
  const response = await request('/api/bill/get', {
    method: 'POST',
    data: requestParams,
  });
  const result = {
    pagination: {
      total: response.count,
      pageSize: (params || {}).pageSize || 5,
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
export async function queryDetail(id) {
  let result = {};
  const res = await request(`/api/bill/detail/${id}`);
  if (res.status) {
    result = { ...res.result };
  }
  return result;
}
export async function addBill(params) {
  let result = {};
  const res = await request('/api/bill/create', {
    method: 'POST',
    data: params,
  });
  if (res.status) {
    result = { ...res };
  }
  return result;
}
export async function removeBill(params) {
  let result = {};
  const res = await request(`/api/bill/delete/${params}`, {
    method: 'DELETE',
  });
  if (res.status) {
    result = { ...res };
  }
  return result;
}
export async function updateBill(params) {
  let result = {};
  const res = await request(`/api/bill/update/${params.id}`, {
    method: 'PUT',
    data: { ...params.values },
  });
  if (res.status) {
    result = { ...res };
  }
  return result;
}
