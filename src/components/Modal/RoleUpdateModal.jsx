import React from 'react';
import { Modal, Select, Button } from 'antd';

const { Option } = Select;

const RoleUpdateModal = ({ visible, currentRole, newRole, setNewRole, onSubmit, onCancel }) => {
  return (
    <Modal
      title="Update Role"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={onSubmit}>
          Update
        </Button>,
      ]}
    >
      <div>
        <Select
          defaultValue={currentRole}
          style={{ width: '100%' }}
          onChange={(value) => setNewRole(value)}
          placeholder="Select new role"
        >
          <Option value="User">User</Option>
          <Option value="Admin">Admin</Option>
          <Option value="Staff">Staff</Option>
          <Option value="Breeder">Breeder</Option>
        </Select>
      </div>
    </Modal>
  );
};

export default RoleUpdateModal;
