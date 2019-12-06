import request from '@/utils/request';

export async function queryList(params = {}) {
  // eslint-disable-next-line no-mixed-operators
  const sorter = params && params.sorter && params.sorter.split('=') || ['', ''];
  const requestParams = params && {
    page: params.currentPage || 1,
    pageSize: params.pageSize || 10,
    blocked: false,
    // SORT
    [sorter[0]]: sorter[1],
    // SEARCH
    // username: params.username || undefined,
    // email: params.email || undefined,
    // full_name: params.full_name || undefined,
    // phoneNumber: params.phoneNumber || undefined,
    // startDate: params.startDate || undefined,
    // endDate: params.endDate || undefined,
  };
  const response = await request('/api/user', {
    params: requestParams,
  });
  const result = {
    pagination: {
      total: response.count,
      pageSize: (params || {}).pageSize || 10,
      current: (params || {}).currentPage || 1,
    },
    list: [],
  }
  result.list = (response.results || []).map(item => ({
    // eslint-disable-next-line no-underscore-dangle
    id: item._id,
    username: item.username,
    full_name: item.full_name,
    sex_type: item.sex_type,
    email: item.email,
    phoneNumber: item.phoneNumber,
    role: item.role,
    status_account: item.blocked,
  }));

  return result;
}
export async function queryRoleList() {
  return request('/api/account-management/role');
}
export async function toggleStatus(params) {
  const dataParams = {
    blocked: true,
  }
  let result = {};
  const res = await request(`/api/user/block-account/${params.id}`, {
    method: 'PUT',
    data: dataParams,
  });
  if (res.status) {
    result = { ...res }
  }
  return result;
}
export async function queryDetail(params) {
  let result = {}
  const res = await request(`/api/user/${params}`);
  if (res.status) {
    result = { ...res.result }
  }
  return result;
}
export async function addAccount(params) {
  let result = {}
  const res = await request('/api/user/create-account', {
    method: 'POST',
    data: params,
  });
  if (res.status) {
    result = { ...res }
  }
  return result;
}
export async function removeAccount(params) {
  let result = {}
  const res = await request(`/api/user/remove-account/${params}`, {
    method: 'DELETE',
  });
  if (res.status) {
    result = { ...res }
  }
  return result;
}
export async function updateAccount(params) {
  const data = params && {
    full_name: params.full_name,
    phoneNumber: params.phoneNumber,
    sex_type: params.sex_type,
    address: params.address,
    startDate: params.startDate,
    endDate: params.endDate,
  }
  let result = {}
  const res = await request(`/api/user/update-profile/${params.id}`, {
    method: 'PUT',
    data: { ...data },
  });
  if (res.status) {
    result = { ...res }
  }
  return result;
}