import request from '@/utils/request';

export async function Register(params) {
  return request('/api/auth/signUp', {
    method: 'POST',
    data: params,
  });
}
