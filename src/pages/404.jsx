import { Button, Result } from 'antd';
import React from 'react';
import router from 'umi/router'; // 这里应该使用 antd 的 404 result 组件，
// 但是还没发布，先来个简单的。

const NoFoundPage = () => (
  <Result
    status="404"
    title="404"
    subTitle="Xin lỗi, trang bạn truy cập không tồn tại"
    extra={
      <Button type="primary" onClick={() => router.push('/')}>
        Về trang chủ
      </Button>
    }
  ></Result>
);

export default NoFoundPage;
