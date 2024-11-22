import React, { useEffect, useState } from 'react';
import { Table, Spin, Button, Input, DatePicker, Space, Select, Pagination, Slider, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import api from '../../configs';
import * as XLSX from 'xlsx';
import { useTranslation } from 'react-i18next';

const { RangePicker } = DatePicker;
const { Option } = Select;

const TransactionManagement = () => {
  const { t } = useTranslation();
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
        message.error('Failed to fetch total balance');
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
      message.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page - 1);
  };

  const exportToExcel = () => {
    if (!transactions || transactions.length === 0) {
      message.error('No data to export');
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
    { title: t('page.transactions.transaction_id'), dataIndex: 'id' },
    { title: t('page.transactions.wallet_id'), dataIndex: ['walletID', 'id'] },
    { title: t('page.transactions.transaction_amount'), dataIndex: 'amount' },
    {
      title: t('page.transactions.transaction_time'),
      dataIndex: 'time',
      render: (text) => new Date(text).toLocaleString(),
    },
    { title: t('page.transactions.auction_id'), dataIndex: 'auctionID' },
    {
      title: t('page.transactions.status'),
      dataIndex: 'status',
    },
    {
      title: t('page.transactions.transaction_type'),
      dataIndex: 'transactionType',
    },
  ];

  return (
    <div>
      {totalBalance !== null && (
        <div style={{ marginBottom: 20 }}>
          <h2>
            {t('page.transactions.total_balance')}: {totalBalance.toLocaleString()} VNĐ
          </h2>
        </div>
      )}

      <Space style={{ marginBottom: 20, width: '100%', justifyContent: 'space-between' }}>
        <Space>
          <Input
            placeholder={t('page.transactions.wallet_id')}
            value={walletId}
            onChange={(e) => setWalletId(e.target.value)}
          />
          <Select value={transactionType} onChange={(value) => setTransactionType(value)} style={{ width: 120 }}>
            <Option value="All">{t('page.transactions.type_All')}</Option>
            <Option value="Top-up">{t('page.transactions.type_Top-up')}</Option>
            <Option value="Deposit">{t('page.transactions.type_Deposit')}</Option>
            <Option value="Payment">{t('page.transactions.type_Payment')}</Option>
            <Option value="Withdraw">{t('page.transactions.type_Withdraw')}</Option>
          </Select>
          <Select value={status} onChange={(value) => setStatus(value)} style={{ width: 120 }}>
            <Option value="All">{t('page.transactions.type_All')}</Option>
            <Option value="Completed">{t('page.transactions.type_Completed')}</Option>
            <Option value="Pending">{t('page.transactions.type_Pending')}</Option>
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
            {t('page.transactions.fetch_data')}
          </Button>
        </Space>

        <Button onClick={exportToExcel} type="primary" icon={<DownloadOutlined />}>
          {t('page.transactions.export_to_excel')}
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
