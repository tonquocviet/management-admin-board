import request from '@/utils/request';

export async function newPassChange(params) {
  const res = await request('/api/auth/reset-password', {
    method: 'POST',
    data: params,
  });
  return res;
}
