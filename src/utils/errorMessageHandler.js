import { notification } from 'antd';

const customMessage = {
  password: 'Mật khẩu',
  username: 'Tài khoản',
};

const serverErrorMessage = {
  402: 'Yêu cầu phương thức thành toán',
  403: 'Không có quyên truy cập dữ liệu.',
  404: 'Không tìm thấy dữ liệu.',
  405: 'Phương thức không được phép.',
  406: 'Yêu cầu không được chấp nhận.',
  409: 'Xung đột dữ liệu',
  410: 'Tài nguyên không toàn vẹn.',
  422: 'Không xử lí dữ liệu. Một số trường dữ liệu đã trùng trong cơ sở dữ liệu',
  500: 'Lỗi máy chủ.',
  502: 'Không thể kết nối máy chủ.',
  503: 'Yêu cầu quá hạn.',
};

export default function errorMessageHandler(statusCode, message) {
  const urlName = window.location.pathname;
  if (statusCode === 400) {
    notification.error({
      message: 'Lỗi!',
      description: getCustomMessage(message),
    });
  }
  // if (statusCode === 500) {
  //   notification.error({
  //     message: 'Lỗi!',
  //     description: getCustomMessage(error),
  //   });
  // }
  if (urlName === '/user/register') {
    if (statusCode === 401) {
      notification.error({
        message: 'Lỗi!',
        description: getCustomMessage(message),
      });
    }
  } else if (urlName === '/user/login') {
    if (statusCode === 401) {
      notification.error({
        message: 'Lỗi!',
        description: getCustomMessage(message),
      });
    }
  } else {
    notification.error({
      message: 'Lỗi!',
      description: getServerErrorMessage(statusCode),
    });
  }
}

function getServerErrorMessage(status) {
  return serverErrorMessage[status];
}
function getCustomMessage(message) {
  let result = 'Lỗi trường ';
  const errorField = message.split(':')[0];
  const text = customMessage[errorField];
  if (text) {
    result = result.concat(text);
  } else {
    result = message; // return server message
  }
  return result;
}
