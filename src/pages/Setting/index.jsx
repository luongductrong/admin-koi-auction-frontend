import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import api from '../../configs';

const Setting = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [currentValues, setCurrentValues] = useState({
    breederDeposit: 0,
    auctionFee: 0,
    withdrawFee: 0,
    withdrawFeeMin: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchCurrentValues = async () => {
    try {
      const [depositResponse, feeResponse, withdrawFeeResponse, withdrawFeeMinResponse] = await Promise.all([
        api.get('/system-config/breeder-deposit'),
        api.get('/system-config/auction-fee'),
        api.get('/system-config/withdraw-free'),
        api.get('/system-config/withdraw-fee-min'),
      ]);

      setCurrentValues({
        breederDeposit: depositResponse.data ?? 0,
        auctionFee: feeResponse.data ?? 0,
        withdrawFee: withdrawFeeResponse.data ?? 0,
        withdrawFeeMin: withdrawFeeMinResponse.data ?? 0,
      });

      form.setFieldsValue({
        breederDeposit: depositResponse.data * 100,
        withdrawFee: withdrawFeeResponse.data * 100,
        auctionFee: feeResponse.data,
        withdrawFeeMin: withdrawFeeMinResponse.data,
      });
    } catch (error) {
      console.error('Error fetching current values:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentValues();
  }, []);

  const handleSaveChanges = async (values) => {
    try {
      const { breederDeposit, auctionFee, withdrawFee, withdrawFeeMin } = values;
      const depositValue = breederDeposit !== undefined ? breederDeposit : currentValues.breederDeposit;
      const feeValue = auctionFee !== undefined ? auctionFee : currentValues.auctionFee;
      const withdrawFeeValue = withdrawFee !== undefined ? withdrawFee : currentValues.withdrawFee;
      const withdrawFeeMinValue = withdrawFeeMin !== undefined ? withdrawFeeMin : currentValues.withdrawFeeMin;

      if (depositValue !== currentValues.breederDeposit) {
        await api.put(`/system-config/breeder-deposit?value=${depositValue / 100}`);
      }

      if (feeValue !== currentValues.auctionFee) {
        await api.put(`/system-config/auction-fee?value=${feeValue}`);
      }

      if (withdrawFeeValue !== currentValues.withdrawFee) {
        await api.put(`/system-config/withdraw-free?value=${withdrawFeeValue / 100}`);
      }

      if (withdrawFeeMinValue !== currentValues.withdrawFeeMin) {
        await api.put(`/system-config/withdraw-fee-min?value=${withdrawFeeMinValue}`);
      }

      notification.success({
        message: 'Update Successful',
      });
    } catch (error) {
      notification.error({
        message: 'Update Failed',
        description: 'There was an error while updating the system configuration.',
      });
    }
  };

  if (loading) {
    return <Spin size="default" />;
  }

  return (
    <Form form={form} onFinish={handleSaveChanges} layout="vertical">
      <Form.Item
        label={t('page.setting.breeder_deposit') + ' ( % )'}
        name="breederDeposit"
        rules={[{ required: true, message: 'Please input breeder deposit!' }]}
      >
        <Input type="number" min={0} max={100} placeholder={currentValues.breederDeposit} />
      </Form.Item>

      <Form.Item
        label={t('page.setting.auction_fee') + ' ( VNĐ )'}
        name="auctionFee"
        rules={[{ required: true, message: 'Please input auction fee!' }]}
      >
        <Input type="number" min={0} placeholder={currentValues.auctionFee} />
      </Form.Item>

      <Form.Item
        label={t('page.setting.withdraw_fee') + ' ( % )'}
        name="withdrawFee"
        rules={[{ required: true, message: 'Please input withdraw fee!' }]}
      >
        <Input type="number" min={0} max={100} placeholder={currentValues.withdrawFee} />
      </Form.Item>

      <Form.Item
        label={t('page.setting.withdraw_fee_min') + ' ( VNĐ )'}
        name="auctionFee"
        rules={[{ required: true, message: 'Please input auction fee!' }]}
      >
        <Input type="number" min={0} placeholder={currentValues.withdrawFeeMin} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {t('page.setting.save_changes')}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Setting;
