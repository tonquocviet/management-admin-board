import { Modal, Tag, Typography, Descriptions } from 'antd';
import React from 'react';

const { Text } = Typography;
const UpdateForm = props => {
  const { modalVisible, handleModalVisible, data } = props;
  return (
    <Modal
      destroyOnClose
      visible={modalVisible}
      onCancel={() => handleModalVisible(false)}
      width={900}
      style={{ top: 20 }}
      maskClosable={false}
      footer={null}
    >
      <Descriptions title="Thông tin CV không trúng tuyển">
        <Descriptions.Item label="Họ và tên">
          <Text strong>{data.full_name}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          <Text strong>{data.email}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">
          <Text strong>{data.phoneNumber}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Vị trí ứng tuyển">
          <Text strong>{data.type_apply === 1 ? 'Thử việc/Developer' : 'Thực tập sinh'}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Chức vụ ứng tuyển">
          <Text strong>{data.position_apply}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Link CV">
          <a
            href={data.url_preview_cv}
            target="_blank"
            rel="noopener noreferrer"
            className="ant-form-text"
          >
            {data.url_preview_cv}
          </a>
        </Descriptions.Item>
        <Descriptions.Item label="Cho điểm CV">
          <Text strong>{data.cv_point}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái CV">
          {data.cv_pass_fail ? (
            <Tag color="green">Đạt yêu cầu</Tag>
          ) : (
            <Tag color="red">Không đạt yêu cầu</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Tham gia phỏng vấn">
          {data.take_interview ? (
            <Text type="warning" strong>
              Có
            </Text>
          ) : (
            <Text type="danger" strong>
              Không
            </Text>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Kết quả phỏng vấn">
          {data.interview_pass_fail ? <Tag color="green">PASS</Tag> : <Tag color="red">FAIL</Tag>}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default UpdateForm;
