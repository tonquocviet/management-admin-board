import { Button, Result } from 'antd';
import React from 'react';
import router from 'umi/router';

const NoPermission = () => (
  <Result
    status="403"
    title="403"
    subTitle="Xin lỗi, Bạn không có đủ quyền truy cập đến trang bạn đang yêu cầu."
    extra={
      <Button type="primary" onClick={() => router.push('/')}>
        Về trang chủ
      </Button>
    }
  ></Result>
);

export default NoPermission;
