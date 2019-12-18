import request from '@/utils/request';

export async function verifyCode(params) {
  const res = await request('/api/auth/signUp-confirm', {
    method: 'POST',
    data: params,
  });
  return res;
}
