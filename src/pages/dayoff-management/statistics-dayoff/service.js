/* eslint-disable no-underscore-dangle */
import request from '@/utils/request';

export async function queryList(params = {}) {
  const requestParams = params && {
    month: (params.search && params.search.month) || null,
    year: (params.search && params.search.year) || null,
  };
  const response = await request('/api/absence-employee/statistics-absence', {
    method: 'GET',
    params: requestParams,
  });
  const result = {
    list: [],
  };
  result.list = (response.results || []).map(item => ({
    // eslint-disable-next-line no-underscore-dangle
    id: item._id,
    full_name: item.user.full_name,
    idUser: item.user._id,
    ...item,
  }));
  return result;
}
