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
      pageSize: params.pageSize || 10,
      page: params.currentPage || 1,
    },
  };
  const response = await request('/api/salary-employee/get', {
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
    user: item.user ? item.user.full_name : 'Nhân viên không tồn tại',
    idUser: item.user ? item.user._id : null,
    salary_basic: item.salary_basic,
    subsidize: item.subsidize,
    total_salary: item.total_salary,
    payment_salary_date: item.payment_salary_date,
    notes: item.notes,
  }));
  return result;
}
export async function queryDetail(id) {
  let result = {};
  const res = await request(`/api/salary-employee/detail/${id}`);
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
export async function addSalary(params) {
  let result = {};
  const res = await request('/api/salary-employee/create', {
    method: 'POST',
    data: params,
  });
  if (res.status) {
    result = { ...res };
  }
  return result;
}
export async function removeSalary(params) {
  let result = {};
  const res = await request(`/api/salary-employee/delete/${params}`, {
    method: 'DELETE',
  });
  if (res.status) {
    result = { ...res };
  }
  return result;
}
export async function updateSalary(params) {
  let result = {};
  const res = await request(`/api/salary-employee/update/${params.id}`, {
    method: 'PUT',
    data: { ...params.values },
  });
  if (res.status) {
    result = { ...res };
  }
  return result;
}
