import React from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

const ConfirmPopup = ({ open, onConfirm, onCancel, title, content }) => {
  const { t } = useTranslation();
  return (
    <Modal
      title={title}
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={t('component.popup.confirm')}
      cancelText={t('component.popup.cancel')}
    >
      <p>{content}</p>
    </Modal>
  );
};

export default ConfirmPopup;
