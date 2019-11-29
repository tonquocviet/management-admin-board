import { Button, Result } from 'antd';
import React from 'react';
import router from 'umi/router';

const ServerError = () => (
  <Result
    status="500"
    title="500"
    subTitle="Lỗi server! Vui lòng làm mới trang và thử lại."
    extra={
      <Button type="primary" onClick={() => router.push('/')}>
        Về trang chủ
      </Button>
    }
  ></Result>
);

export default ServerError;
