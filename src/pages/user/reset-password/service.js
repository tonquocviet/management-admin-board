import request from '@/utils/request';

export async function newPassChange(params) {
  let result = {};
  const res = request('/api/auth/reset-password', {
    method: 'POST',
    data: params,
  });
  if (res.status) {
    result = { ...res };
  }
  return result;
}
