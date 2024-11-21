import React from 'react';
import { Modal, Select, Button } from 'antd';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const RoleUpdate = ({ visible, currentRole, setNewRole, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  return (
    <Modal
      title={t('component.modal.update_role')}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {t('component.modal.cancel')}
        </Button>,
        <Button key="submit" type="primary" onClick={onSubmit}>
          {t('component.modal.update')}
        </Button>,
      ]}
    >
      <div>
        <Select
          defaultValue={currentRole}
          style={{ width: '100%' }}
          onChange={(value) => setNewRole(value)}
          placeholder={t('component.modal.select_new_role')}
        >
          <Option value="User">{t('component.modal.user_role')}</Option>
          <Option value="Admin">{t('component.modal.admin_role')}</Option>
          <Option value="Staff">{t('component.modal.staff_role')}</Option>
          <Option value="Breeder">{t('component.modal.breeder_role')}</Option>
        </Select>
      </div>
    </Modal>
  );
};

export default RoleUpdate;
