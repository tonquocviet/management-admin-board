import React from 'react';
import { Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TableBasic from './TableBasic';

export default () => (
  <PageHeaderWrapper>
    <Card></Card>
    <TableBasic />
    <p
      style={{
        textAlign: 'center',
        marginTop: 24,
      }}
    >
    </p>
  </PageHeaderWrapper>
);
