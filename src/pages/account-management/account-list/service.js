import request from '@/utils/request';

export async function queryList(params) {
  return request('/api/account-management', {
    params,
  });
}
export async function queryRoleList() {
  return request('/api/account-management/role');
}
export async function toggleStatus(params) {
  let success = false;
  const toggle = params.status_account ? 'deactive' : 'active';
  await request(`/api/account-management/${params.id}/${toggle}`, {
    method: 'PATCH',
    statusCallBack: status => {
      if (status >= 200 && status < 300) {
        success = true;
      } else {
        success = false;
      }
    },
  });
  return success;
}
