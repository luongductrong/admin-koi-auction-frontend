import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification, Spin } from 'antd';
import api from '../../configs';

const Setting = () => {
  const [form] = Form.useForm();
  const [currentValues, setCurrentValues] = useState({
    breederDeposit: 0,
    auctionFee: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchCurrentValues = async () => {
    try {
      const [depositResponse, feeResponse] = await Promise.all([
        api.get('/system-config/breeder-deposit'),
        api.get('/system-config/auction-fee'),
      ]);

      setCurrentValues({
        breederDeposit: depositResponse.data ?? 0,
        auctionFee: feeResponse.data ?? 0,
      });

      form.setFieldsValue({
        breederDeposit: depositResponse.data * 100,
        auctionFee: feeResponse.data,
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
      const { breederDeposit, auctionFee } = values;
      const depositValue = breederDeposit !== undefined ? breederDeposit : currentValues.breederDeposit;
      const feeValue = auctionFee !== undefined ? auctionFee : currentValues.auctionFee;

      if (depositValue !== currentValues.breederDeposit) {
        await api.put(`/system-config/breeder-deposit?value=${depositValue / 100}`);
      }

      if (feeValue !== currentValues.auctionFee) {
        await api.put(`/system-config/auction-fee?value=${feeValue}`);
      }

      notification.success({
        message: 'Update Successful',
      });
      fetchCurrentValues();
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
        label="Breeder Deposit ( % )"
        name="breederDeposit"
        rules={[{ required: true, message: 'Please input breeder deposit!' }]}
      >
        <Input type="number" min={0} max={100} placeholder={currentValues.breederDeposit} />
      </Form.Item>

      <Form.Item
        label="Auction Fee ( VNĐ)"
        name="auctionFee"
        rules={[{ required: true, message: 'Please input auction fee!' }]}
      >
        <Input type="number" min={0} placeholder={currentValues.auctionFee} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save Changes
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Setting;
