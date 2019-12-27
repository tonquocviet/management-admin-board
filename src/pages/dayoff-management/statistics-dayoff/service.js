/* eslint-disable no-underscore-dangle */
import request from '@/utils/request';

export async function queryList(params) {
  const requestParams = {
    month: (params && params.month) || undefined,
    year: (params && params.year) || undefined,
  };
  const response = await request('/api/absence-employee/statistics-absence', {
    method: 'GET',
    params: requestParams,
  });
  const result = {
    list: [],
  };
  result.list = ((response && response.results) || []).map((item, index) => {
    if (item._id.year) {
      return {
        id: index,
        time_sheet: `Tháng ${item._id.month} năm ${item._id.year}`,
        total_date_absence: item.total_date_absence,
        total_request_absence: item.total_request_absence,
      };
    }
    return {
      id: index,
      time_sheet: `Ngày ${item._id.day} tháng ${item._id.month}`,
      total_date_absence: item.total_date_absence,
      total_request_absence: item.total_request_absence,
    };
  });
  return result;
}
