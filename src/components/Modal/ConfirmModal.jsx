import React from 'react';
import { Modal, Button } from 'antd';
import { useTranslation } from 'react-i18next';

const ConfirmModal = ({ visible, title, onConfirm, onCancel }) => {
  const { t } = useTranslation();
  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="no" onClick={onCancel}>
          {t('component.modal.no')}
        </Button>,
        <Button key="yes" type="primary" onClick={onConfirm}>
          {t('component.modal.yes')}
        </Button>,
      ]}
    >
      <p>{t('component.modal.confirm_message')}</p>
    </Modal>
  );
};

export default ConfirmModal;
