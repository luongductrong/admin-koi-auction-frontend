import React, { useState, useEffect } from 'react';
import { Table, Button, Pagination, Spin, Radio, message, Modal } from 'antd';
import api from '../../configs';
import { useTranslation } from 'react-i18next';
import FishPopover from '../../components/Popover/FishPopover';
import UserPopover from '../../components/Popover/UserPopover';
import ApproveAuction from '../../components/Modal/ApproveAuction';
import ConfirmModal from '../../components/Modal/ConfirmModal';

const AuctionRequestManagement = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isRefund, setIsRefund] = useState(false);

  // Fetch Auction Requests
  const fetchRequests = async (page = 0) => {
    setLoading(true);
    try {
      const response = await api.get(`/auction/staff/get-auction-request?page=${page}`);
      setRequests(response.data.auctionRequests);
      setTotalElements(response.data.totalElements);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error('Failed to fetch auction requests');
    }
  };

  // Fetch Refund Requests
  const fetchRefunds = async (page = 0) => {
    setLoading(true);
    try {
      const response = await api.get(`/wallet/withdraw/status?status=pending&page=${page}`);
      setRefunds(response.data);
      setTotalElements(response.data.length);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error('Failed to fetch refund requests');
    }
  };

  // Effect to fetch the data based on whether it's a refund or auction request
  useEffect(() => {
    if (isRefund) {
      fetchRefunds(currentPage);
    } else {
      fetchRequests(currentPage);
    }
  }, [currentPage, isRefund]);

  // Handle Action (Approve, Reject, Complete Refund)
  const handleAction = async (action) => {
    if (!selectedRequest) return;

    try {
      const endpoint = isRefund
        ? `/wallet/withdraw/complete/${selectedRequest.id}`
        : `/auction/staff/auction/${selectedRequest.auction.id}?action=${action}`;

      const response = await api.post(endpoint);

      if (response.status === 200) {
        message.success(`${action} successfully`);
        setIsModalVisible(false);
        setIsConfirmVisible(false);
        if (isRefund) {
          fetchRefunds(currentPage);
        } else {
          fetchRequests(currentPage);
        }
      }
    } catch (error) {
      message.error(`Failed to ${action} request`);
    }
  };

  // Handle Page Change
  const handlePageChange = (page) => {
    setCurrentPage(page - 1);
  };

  // Define Columns for Auction and Refund Requests
  const columns = isRefund
    ? [
        {
          title: t('page.requests.transaction_id'),
          dataIndex: 'id',
          key: 'transactionId',
        },
        {
          title: t('page.requests.wallet_id'),
          dataIndex: ['walletID', 'id'],
          key: 'walletID',
        },
        {
          title: t('page.requests.auction_id'),
          dataIndex: 'auctionID',
          key: 'auctionId',
        },
        {
          title: t('page.requests.amount'),
          dataIndex: 'amount',
          key: 'amount',
        },
        {
          title: t('page.requests.time'),
          key: 'time',
          render: (text) => new Date(text.time).toLocaleString(),
        },
        {
          title: t('page.requests.action'),
          key: 'action',
          render: (text) => (
            <Button
              type="primary"
              onClick={() => {
                setSelectedRequest(text);
                setIsConfirmVisible(true); // Show confirm modal for refund
              }}
            >
              {t('page.requests.completed')}
            </Button>
          ),
        },
      ]
    : [
        {
          title: t('page.requests.auction_id'),
          dataIndex: ['auction', 'id'],
          key: 'auctionId',
        },
        {
          title: t('page.requests.koi_details'),
          key: 'koiFish',
          render: (text) => (
            <b>
              {text.koiFish && text.koiFish.length > 0 ? (
                <FishPopover fishIds={text.koiFish}>{t('page.requests.click_here')}</FishPopover>
              ) : (
                t('page.requests.no_data')
              )}
            </b>
          ),
        },
        {
          title: t('page.requests.starting_price'),
          dataIndex: ['auction', 'startingPrice'],
          key: 'startingPrice',
        },
        {
          title: t('page.requests.buyout_price'),
          dataIndex: ['auction', 'buyoutPrice'],
          key: 'buyoutPrice',
        },
        {
          title: t('page.requests.bid_step'),
          dataIndex: ['auction', 'bidStep'],
          key: 'bidStep',
        },
        {
          title: t('page.requests.auction_method'),
          dataIndex: ['auction', 'auctionMethod'],
          key: 'auctionMethod',
        },
        {
          title: t('page.requests.start_time'),
          dataIndex: ['auction', 'startTime'],
          key: 'startTime',
          render: (text) => new Date(text).toLocaleString(),
        },
        {
          title: t('page.requests.end_time'),
          dataIndex: ['auction', 'endTime'],
          key: 'endTime',
          render: (text) => new Date(text).toLocaleString(),
        },
        {
          title: t('page.requests.breeder_details'),
          dataIndex: ['auction', 'breederID'],
          key: 'breederID',
          render: (text) => <UserPopover userId={text} />,
        },
        {
          title: t('page.requests.action'),
          key: 'action',
          render: (text) => (
            <Button
              type="primary"
              onClick={() => {
                setSelectedRequest(text);
                setIsModalVisible(true); // Show approve/reject modal for auction
              }}
            >
              {t('page.requests.approve_reject')}
            </Button>
          ),
        },
      ];

  return (
    <div>
      <Radio.Group onChange={(e) => setIsRefund(e.target.value)} value={isRefund} style={{ marginBottom: '20px' }}>
        <Radio value={false}>{t('page.requests.auction_requests')}</Radio>
        <Radio value={true}>{t('page.requests.refund_requests')}</Radio>
      </Radio.Group>

      {loading ? (
        <Spin />
      ) : (
        <>
          <Table columns={columns} dataSource={isRefund ? refunds : requests} rowKey="id" pagination={false} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <Pagination
              current={currentPage + 1}
              total={totalElements}
              pageSize={10}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      )}

      {/* ApproveAuction Modal */}
      <ApproveAuction
        visible={isModalVisible}
        onApprove={() => handleAction('approve')}
        onReject={() => handleAction('reject')}
        onCancel={() => setIsModalVisible(false)}
        auction={selectedRequest}
      />

      {/* ConfirmModal for Refund */}
      <ConfirmModal
        visible={isConfirmVisible}
        title="Are you sure you want to complete this transaction?"
        onConfirm={() => handleAction('complete')}
        onCancel={() => {
          message.error('Action canceled');
          setIsConfirmVisible(false);
        }}
      />
    </div>
  );
};

export default AuctionRequestManagement;
