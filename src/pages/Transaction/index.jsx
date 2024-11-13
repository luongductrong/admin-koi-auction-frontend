import React, { useEffect, useState } from 'react';
import { Table, Spin, Button, Input, DatePicker, Space, Select, Pagination, Slider, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import api from '../../configs';
import * as XLSX from 'xlsx';

const { RangePicker } = DatePicker;
const { Option } = Select;

const TransactionManagement = () => {
  const [walletId, setWalletId] = useState('');
  const [transactionType, setTransactionType] = useState('All');
  const [amountRange, setAmountRange] = useState([0, 1000000000000]);
  const [dateRange, setDateRange] = useState([]);
  const [status, setStatus] = useState('All');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalBalance, setTotalBalance] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    handleFetchData();
  }, [currentPage]);

  useEffect(() => {
    const fetchTotalBalance = async () => {
      try {
        const response = await api.get('/admin/total-balance');
        setTotalBalance(response.data);
      } catch (error) {
        console.error('Failed to fetch total balance:', error);
      }
    };
    fetchTotalBalance();
  }, []);

  const handleFetchData = async () => {
    setLoading(true);

    const params = new URLSearchParams();
    if (transactionType !== 'All') params.append('transactionType', transactionType);
    if (status !== 'All') params.append('status', status);
    if (walletId) params.append('walletID', walletId);
    if (amountRange[0] > 0 || amountRange[1] < 1000000000000) {
      params.append('amountStart', amountRange[0]);
      params.append('amountEnd', amountRange[1]);
    }
    if (dateRange.length === 2) {
      params.append('startTime', dateRange[0].format('YYYY-MM-DD'));
      params.append('endTime', dateRange[1].format('YYYY-MM-DD'));
    }
    params.append('page', currentPage);
    params.append('size', 10);

    try {
      const response = await api.get(`/admin/search?${params.toString()}`);
      setTransactions(response.data.transactions);
      setTotalElements(response.data.totalElements);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page - 1);
  };

  const exportToExcel = () => {
    if (!transactions || transactions.length === 0) {
      console.error('No transaction data available to export');
      return;
    }

    const exportData = transactions.map((transaction) => ({
      transactionID: transaction.id || 'N/A',
      walletID: transaction.walletID ? transaction.walletID.id || 'N/A' : 'N/A',
      amount: transaction.amount !== undefined ? transaction.amount : 'N/A',
      auctionID: transaction.auctionID || 'N/A',
      time: transaction.time ? new Date(transaction.time).toLocaleString() : 'N/A',
      type: transaction.transactionType || 'N/A',
      status: transaction.status || 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData); // Create sheet from data
    const workbook = XLSX.utils.book_new(); // Create new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions'); // Append sheet to workbook
    XLSX.writeFile(workbook, 'TransactionsData.xlsx'); // Export to Excel file
  };

  const columns = [
    { title: 'Transaction ID', dataIndex: 'id' },
    { title: 'Wallet ID', dataIndex: ['walletID', 'id'] },
    { title: 'Transaction Amount', dataIndex: 'amount' },
    { title: 'Transaction Time', dataIndex: 'time', render: (text) => new Date(text).toLocaleString() },
    { title: 'Auction ID', dataIndex: 'auctionID' },
    { title: 'Status', dataIndex: 'status' },
    { title: 'Transaction Type', dataIndex: 'transactionType', render: (text) => text || 'N/A' },
  ];

  return (
    <div>
      {totalBalance !== null && (
        <div style={{ marginBottom: 20 }}>
          <h2>Total Balance: {totalBalance.toLocaleString()} VNĐ</h2>
        </div>
      )}

      <Space style={{ marginBottom: 20, width: '100%', justifyContent: 'space-between' }}>
        <Space>
          <Input placeholder="Wallet ID" value={walletId} onChange={(e) => setWalletId(e.target.value)} />
          <Select value={transactionType} onChange={(value) => setTransactionType(value)} style={{ width: 120 }}>
            <Option value="All">All</Option>
            <Option value="Top-up">Top-up</Option>
            <Option value="Deposit">Deposit</Option>
            <Option value="Payment">Payment</Option>
            <Option value="Withdraw">Withdraw</Option>
          </Select>
          <Select value={status} onChange={(value) => setStatus(value)} style={{ width: 120 }}>
            <Option value="All">All</Option>
            <Option value="Completed">Completed</Option>
            <Option value="Pending">Pending</Option>
          </Select>
          <Slider
            range
            defaultValue={amountRange}
            min={0}
            max={1000000000}
            step={1000}
            onChange={(value) => setAmountRange(value)}
            style={{ width: 200 }}
          />
          <RangePicker onChange={(dates) => setDateRange(dates)} style={{ width: 250 }} />
          <Button
            type="primary"
            onClick={() => {
              setCurrentPage(0);
              handleFetchData();
            }}
          >
            Fetch Data
          </Button>
        </Space>

        <Button onClick={exportToExcel} type="primary" icon={<DownloadOutlined />}>
          Export Transactions
        </Button>
      </Space>

      {loading ? (
        <Spin />
      ) : (
        <>
          <Table columns={columns} dataSource={transactions} rowKey={(record) => record.id} pagination={false} />
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
    </div>
  );
};

export default TransactionManagement;
