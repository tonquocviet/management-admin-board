import request from '@/utils/request';

export async function Register(params) {
  const res = await request('/api/auth/signUp', {
    method: 'POST',
    data: params,
  });
  return res;
}
