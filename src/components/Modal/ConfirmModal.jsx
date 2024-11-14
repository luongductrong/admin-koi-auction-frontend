import React from 'react';
import { Modal, Button } from 'antd';

const ConfirmModal = ({ visible, title, onConfirm, onCancel }) => {
  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="no" onClick={onCancel}>
          No
        </Button>,
        <Button key="yes" type="primary" onClick={onConfirm}>
          Yes
        </Button>,
      ]}
    >
      <p>Are you sure you want to proceed?</p>
    </Modal>
  );
};

export default ConfirmModal;
