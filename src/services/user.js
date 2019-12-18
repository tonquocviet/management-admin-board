import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}
// eslint-disable-next-line consistent-return
export async function queryCurrent() {
  const response = await request('/api/user/get-me');

  if (response && response.status === true) {
    const dataResult = response.result;
    return {
      name: dataResult.full_name,
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      // eslint-disable-next-line no-underscore-dangle
      userid: dataResult._id,
      email: dataResult.email,
      signature: 'no signature',
      title: 'no title',
      group: 'no group',
      role: dataResult.role,
      sex: dataResult.sex_type,
      tags: [],
      notifyCount: 12,
      unreadCount: 11,
      country: 'Việt Nam',
      geographic: {
        province: {
          label: 'None',
          key: 'None',
        },
        city: {
          label: 'None',
          key: 'None',
        },
      },
      address: dataResult.address,
      phone: dataResult.phoneNumber,
      authority: 'admin',
    };
  }
  // return {
  //   authority: 'guess',
  // };
}
export async function queryNotices() {
  return request('/api/notices');
}
