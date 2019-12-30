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
  const response = await request('/api/labor-contracts/get', {
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
  const res = await request(`/api/labor-contracts/detail/${id}`);
  if (res.status) {
    result = { ...res.result };
  }
  return result;
}
export async function addLaborContract(params) {
  let result = {};
  const res = await request('/api/labor-contracts/create', {
    method: 'POST',
    data: params,
  });
  if (res.status) {
    result = { ...res };
  }
  return result;
}
export async function removeLaborContract(params) {
  let result = {};
  const res = await request(`/api/labor-contracts/delete/${params}`, {
    method: 'DELETE',
  });
  if (res.status) {
    result = { ...res };
  }
  return result;
}
export async function updateLaborContract(params) {
  let result = {};
  const res = await request(`/api/labor-contracts/update/${params.id}`, {
    method: 'PUT',
    data: { ...params.values },
  });
  if (res.status) {
    result = { ...res };
  }
  return result;
}
