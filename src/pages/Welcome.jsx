import React from 'react';
import { Card, Typography, Alert } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

export default () => (
  <PageHeaderWrapper>
    <Card>
      <Alert
        message="umi ui 现已发布，欢迎使用 npm run ui 启动体验。"
        type="success"
        showIcon
        banner
        style={{
          margin: -12,
          marginBottom: 24,
        }}
      />
      <Typography.Text strong>
        <a target="_blank" rel="noopener noreferrer" href="https://pro.ant.design/docs/block">
          基于 block 开发，快速构建标准页面
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
