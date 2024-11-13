import React, { useState, useEffect } from 'react';
import { Table, Button, Pagination, Spin, Radio, message, Modal } from 'antd';
import api from '../../configs';
import FishPopover from '../../components/Popover/FishPopover';
import UserPopover from '../../components/Popover/UserPopover';
import ApproveAuction from '../../components/Modal/ApproveAuction';

const AuctionRequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isRefund, setIsRefund] = useState(false);

  const fetchRequests = async (page = 0) => {
    setLoading(true);
    try {
      const response = await api.get(`/auction/staff/get-auction-request?page=${page}`);
      setRequests(response.data.content);
      setTotalElements(response.data.totalElements);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error('Failed to fetch auction requests');
    }
  };

  const fetchRefunds = async (page = 0) => {
    setLoading(true);
    try {
      const response = await api.get(`/wallet/withdraw/status?status=pending&page=${page}`);
      setRefunds(response.data.content);
      setTotalElements(response.data.totalElements);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error('Failed to fetch refund requests');
    }
  };

  useEffect(() => {
    if (isRefund) {
      fetchRefunds(currentPage);
    } else {
      fetchRequests(currentPage);
    }
  }, [currentPage, isRefund]);

  const handleAction = async (action) => {
    if (!selectedRequest) return;

    try {
      const endpoint = isRefund
        ? `/wallet/withdraw/complete/${selectedRequest.id}` // For refund action
        : `/auction/staff/auction/${selectedRequest.auctionId}?action=${action}`; // For auction action

      const response = await api.post(endpoint);
      if (response.status === 200) {
        message.success(`${action} successfully`);
        setIsModalVisible(false);
        fetchRefunds(currentPage); // Or fetchRequests if in auction mode
      }
    } catch (error) {
      message.error(`Failed to ${action} request`);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page - 1);
  };

  const columns = isRefund
    ? [
        {
          title: 'Transaction ID',
          dataIndex: 'id',
          key: 'transactionId',
        },
        {
          title: 'Wallet ID',
          dataIndex: ['walletID', 'id'],
          key: 'walletID',
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
        },
        {
          title: 'Time',
          dataIndex: 'time',
          key: 'time',
          render: (text) => new Date(text).toLocaleString(),
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
        },
        {
          title: 'Action',
          key: 'action',
          render: (text) => (
            <Button
              type="primary"
              onClick={() => {
                setSelectedRequest(text);
                Modal.confirm({
                  title: 'Are you sure you want to complete this transaction?',
                  onOk: () => handleAction('complete'),
                });
              }}
            >
              Complete
            </Button>
          ),
        },
      ]
    : [
        {
          title: 'Auction ID',
          dataIndex: ['auction', 'id'],
          key: 'auctionId',
        },
        {
          title: 'Koi',
          key: 'koiFish',
          render: (text) => {
            return (
              <>
                <b>
                  {text.koiFish && text.koiFish.length > 0 ? (
                    <FishPopover fishIds={text.koiFish}>Click here</FishPopover>
                  ) : (
                    'No Fish Data'
                  )}
                </b>
              </>
            );
          },
        },
        {
          title: 'Starting Price',
          dataIndex: ['auction', 'startingPrice'],
          key: 'startingPrice',
        },
        {
          title: 'Buy Now Price',
          dataIndex: ['auction', 'buyoutPrice'],
          key: 'buyoutPrice',
        },
        {
          title: 'Bid Step',
          dataIndex: ['auction', 'bidStep'],
          key: 'bidStep',
        },
        {
          title: 'Auction method',
          dataIndex: ['auction', 'auctionMethod'],
          key: 'auctionMethod',
        },
        {
          title: 'Start Time',
          dataIndex: ['auction', 'startTime'],
          key: 'startTime',
          render: (text) => new Date(text).toLocaleString(),
        },
        {
          title: 'End Time',
          dataIndex: ['auction', 'endTime'],
          key: 'endTime',
          render: (text) => new Date(text).toLocaleString(),
        },
        {
          title: 'Breeder',
          dataIndex: ['auction', 'breederID'],
          key: 'breederID',
          render: (text) => <UserPopover userId={text} />,
        },
        {
          title: 'Action',
          key: 'action',
          render: (text) => (
            <Button
              type="primary"
              onClick={() => {
                setSelectedRequest(text);
                setIsModalVisible(true);
              }}
            >
              Manage Request
            </Button>
          ),
        },
      ];

  return (
    <div>
      <Radio.Group onChange={(e) => setIsRefund(e.target.value)} value={isRefund} style={{ marginBottom: '20px' }}>
        <Radio value={false}>Auction Requests</Radio>
        <Radio value={true}>Refund Requests</Radio>
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

      <ApproveAuction
        visible={isModalVisible}
        onApprove={handleAction}
        onReject={handleAction}
        onCancel={() => setIsModalVisible(false)}
        auction={selectedRequest}
      />
    </div>
  );
};

export default AuctionRequestManagement;
