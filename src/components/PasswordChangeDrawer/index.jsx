import React, { useState } from 'react';
import { Drawer, Form, Input, Button, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import api from '../../configs';

function PasswordChangeDrawer({ open = false, onClose = () => {} }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error(t('component.password_change_drawer.new_password_match_error'));
      return;
    }
    setLoading(true);
    try {
      await api.put('/security/password', values);
      message.success(t('component.password_change_drawer.success_message'));
      form.resetFields();
      onClose();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        message.error(t('component.password_change_drawer.current_password_error'));
      } else if (error.response && error.response.status === 401) {
        message.error(t('component.password_change_drawer.unauthorized_error'));
      } else {
        message.error(t('component.password_change_drawer.error_message'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      title={t('component.password_change_drawer.title')}
      placement="right"
      onClose={handleClose}
      open={open}
      width={500}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="oldPassword"
          label={t('component.password_change_drawer.current_password')}
          rules={[{ required: true, message: t('component.password_change_drawer.current_password_required') }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('component.password_change_drawer.enter_current_password')}
          />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label={t('component.password_change_drawer.new_password')}
          rules={[
            { required: true, message: t('component.password_change_drawer.new_password_required') },
            { min: 8, message: t('component.password_change_drawer.password_length_error') },
            { max: 100, message: t('component.password_change_drawer.password_max_length_error') },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
              message: t('component.password_change_drawer.password_pattern_error'),
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('component.password_change_drawer.enter_new_password')}
          />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label={t('component.password_change_drawer.confirm_new_password')}
          dependencies={['newPassword']}
          rules={[
            { required: true, message: t('component.password_change_drawer.confirm_password_required') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('component.password_change_drawer.password_mismatch')));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('component.password_change_drawer.enter_confirm_password')}
            onChange={() => form.validateFields(['confirmPassword'])}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {t('component.password_change_drawer.change_password')}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default PasswordChangeDrawer;
