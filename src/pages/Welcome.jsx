import React from 'react';
import { Card, Typography } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

export default () => (
  <PageHeaderWrapper>
    <Card>
      <Typography.Text strong>
        <a target="_blank" rel="noopener noreferrer" href="https://pro.ant.design/docs/block">
          Chào mừng đến với hệ thống quản trị của HT ACTIVE
        </a>
      </Typography.Text>
    </Card>
    <p
      style={{
        textAlign: 'center',
        marginTop: 24,
      }}
    ></p>
  </PageHeaderWrapper>
);
