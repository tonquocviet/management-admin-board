import request from '@/utils/request';

export async function queryRoleList() {
  return request('/api/role-management/role');
}
