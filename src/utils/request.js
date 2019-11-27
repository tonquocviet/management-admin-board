/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';

const codeMessage = {
  200: 'Yêu cầu xử lí thành công.',
  201: 'Tạo yêu cầu thành công.',
  202: 'Yêu cầu đã nhập hàng đợi.',
  204: 'Không có dữ liệu.',
  400: 'Yêu cầu gửi sai định dạng.',
  401: 'Yêu cầu không được phép truy cập.',
  403: 'Không có quyên truy cập dữ liệu.',
  404: 'Không tìm thấy dữ liệu.',
  406: 'Yêu cầu không được chấp nhận.',
  410: 'Tài nguyên không toàn vẹn.',
  422: 'Không xử lí dữ liệu.',
  500: 'Lỗi máy chủ.',
  502: 'Không thể kết nối máy chủ.',
  503: 'Yêu cầu quá hạn.',
};
/**
 * 异常处理程序
 */

const errorHandler = error => {
  const { response } = error;

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `Lỗi lấy dữ liệu ${status}: ${url}`,
      description: errorText,
    });
  }
};
/**
 * 配置request请求时的默认参数
 */

const request = extend({
  errorHandler,
  // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});
request.use(async (ctx, next) => {
  if (ctx.req.url.startsWith('/api/devices')) {
    ctx.req.url = `https://gas-device-service.herokuapp.com${ctx.req.url}`;
  }
  await next();
});
export default request;
