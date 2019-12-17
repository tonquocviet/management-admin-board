import request from '@/utils/request';

export async function accountLogin(params) {
  const res = await request('/api/auth/signIn', {
    method: 'POST',
    data: params,
  });
  if (res && res.status) {
    return {
      ...res,
    };
  }
  return {
    status: false,
    message: res.error,
  };
}
