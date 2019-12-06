import request from '@/utils/request';

export async function queryList(params = {}) {
  const requestParams = params && {
    page: params.currentPage || 1,
    pageSize: params.pageSize || 10,
    blocked: true,
    // full_name: params.sorter || 'asc',
    // SEARCH
    // eslint-disable-next-line no-dupe-keys
    full_name: params.searchValue,
    startDate: '2019-05-27T08:42:25.397Z',
    endDate: '2019-12-28T08:42:25.397Z',
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
    blocked: false,
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
export async function queryDetail(params) {
  let result = {}
  const res = await request(`/api/user/${params}`);
  if (res.status) {
    result = { ...res.result }
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
