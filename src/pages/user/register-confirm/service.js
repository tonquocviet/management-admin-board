import request from '@/utils/request';

export async function verifyCode(params) {
  let result = {};
  const res = request('/api/auth/signUp-confirm', {
    method: 'POST',
    data: params,
  });
  if (res.status) {
    result = { ...res };
  }
  return result;
}
