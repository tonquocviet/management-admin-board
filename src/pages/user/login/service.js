import request from '@/utils/request';

export async function accountLogin(params) {
  return request('/api/auth/signIn', {
    method: 'POST',
    data: params,
  });
}
