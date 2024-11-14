import React, { useState, useEffect } from 'react';
import { Table, Button, Drawer, Modal, notification, Spin, message } from 'antd';
import api from '../../configs';
import { useTranslation } from 'react-i18next';

const OrderManagement = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [disputeModalVisible, setDisputeModalVisible] = useState(false);
  const [loadingDispute, setLoadingDispute] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/order');
        console.log(response.data);

        setOrders(response.data);
      } catch (error) {
        message.error('Error fetching orders data');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await api.get(`/order/${orderId}`);
      setSelectedOrder(response.data);
      setDrawerVisible(true);
    } catch (error) {
      message.error('Error fetching order details');
    }
  };

  const handleDisputeAction = async (action) => {
    try {
      setLoadingDispute(true);
      const response = await api.post('/dispute-action', {
        auctionId: selectedOrder.auctionId,
        action,
      });
      notification.success({
        message: 'Action Successful',
        description: `Dispute action (${action}) has been successfully processed.`,
      });
      setDisputeModalVisible(false);
      setDrawerVisible(false); // Close the drawer after action
    } catch (error) {
      notification.error({
        message: 'Action Failed',
        description: 'There was an error processing the dispute action.',
      });
    } finally {
      setLoadingDispute(false);
    }
  };

  const columns = [
    {
      title: t('page.orders.order_id'),
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: t('page.orders.bidder_id'),
      dataIndex: 'bidderId',
      key: 'bidderId',
    },
    {
      title: t('page.orders.status'),
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: t('page.orders.action'),
      key: 'action',
      render: (_, record) => (
        <Button onClick={() => fetchOrderDetails(record.orderId)}>{t('page.orders.view_details')}</Button>
      ),
    },
  ];

  if (loading) {
    return <Spin />;
  }

  return (
    <div>
      <Table columns={columns} dataSource={orders} rowKey="orderId" pagination={{ pageSize: 10 }} />

      <Drawer
        title={t('page.orders.order_details')}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={600}
      >
        {selectedOrder ? (
          <div>
            <p>
              <strong>{t('page.orders.order_id')}: </strong>
              {selectedOrder.orderId}
            </p>
            <p>
              <strong>{t('page.orders.bidder_id')}: </strong>
              {selectedOrder.bidderId}
            </p>
            <p>
              <strong>{t('page.orders.address')}: </strong>
              {selectedOrder.address}
            </p>
            <p>
              <strong>{t('page.orders.price')}: </strong>
              {selectedOrder.price} VNĐ
            </p>
            <p>
              <strong>{t('page.orders.phone_number')}: </strong>
              {selectedOrder.phoneNumber}
            </p>
            <p>
              <strong>{t('page.orders.note')}: </strong>
              {selectedOrder.note}
            </p>

            {selectedOrder.status === 'Dispute' && (
              <Button type="danger" onClick={() => setDisputeModalVisible(true)}>
                {t('page.orders.resolve_dispute')}
              </Button>
            )}
          </div>
        ) : (
          <p>{t('page.orders.no_order_details')}</p>
        )}
      </Drawer>

      <Modal
        title={t('page.orders.resolve_dispute')}
        open={disputeModalVisible}
        onCancel={() => setDisputeModalVisible(false)}
        footer={[
          <Button key="reject" onClick={() => handleDisputeAction('reject')} disabled={loadingDispute}>
            {t('page.orders.reject')}
          </Button>,
          <Button key="approve" type="primary" onClick={() => handleDisputeAction('approve')} loading={loadingDispute}>
            {t('page.orders.approve')}
          </Button>,
        ]}
      >
        <p>{t('page.orders.confirm_dispute_action')}</p>
      </Modal>
    </div>
  );
};

export default OrderManagement;
