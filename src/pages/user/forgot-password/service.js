import request from '@/utils/request';

export async function ForgotPass(params) {
  const res = await request('/api/auth/forgot-password', {
    method: 'POST',
    data: params,
  });
  if (res.status) {
    return { ...res };
  }
}
