import React, { useState, useEffect } from 'react';
import { Tag, Table, Button, Pagination, Flex } from 'antd';
import FishPopover from '../../components/Popover/FishPopover';
import UserPopover from '../../components/Popover/UserPopover';
import { DownloadOutlined } from '@ant-design/icons';
import api from '../../configs';
import * as XLSX from 'xlsx';

const Auction = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = async (page) => {
    setLoading(true);
    try {
      const response = await api.get('/auction/admin', {
        params: {
          page,
          size: 9,
        },
      });

      console.log('fetch page: ', page + 1);

      if (response?.data) {
        setAuctions(response.data.auctions);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch auction data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page - 1);
  };

  const toUpperCase2 = (value) => {
    return value ? value.toUpperCase() : 'N/A';
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: ['auction', 'id'],
    },
    {
      title: 'Fish Details',
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
      title: 'Start Time',
      dataIndex: ['auction', 'startTime'],
      render: (text) => {
        return text ? new Date(text).toLocaleString() : 'N/A';
      },
    },
    {
      title: 'Estimated End Time',
      dataIndex: ['auction', 'endTime'],
      render: (text) => {
        return text ? new Date(text).toLocaleString() : 'N/A';
      },
    },
    {
      title: 'Method',
      dataIndex: ['auction', 'auctionMethod'],
    },
    {
      title: 'Start Price',
      dataIndex: ['auction', 'startingPrice'],
      render: (text) => <span>{text ? `${text}` : 'N/A'}</span>,
    },
    {
      title: 'Bid Step',
      dataIndex: ['auction', 'bidStep'],
    },
    {
      title: 'Buyout Price',
      dataIndex: ['auction', 'buyoutPrice'],
    },
    {
      title: 'Final Price',
      dataIndex: ['auction', 'finalPrice'],
      render: (text) => <span>{text ? `${text}` : 'N/A'}</span>,
    },
    {
      title: 'Winner',
      dataIndex: ['auction', 'winnerID'],
      render: (text) => <span>{text || 'N/A'}</span>,
    },
    {
      title: 'Breeder',
      dataIndex: ['auction', 'breederID'],
      render: (text) => <UserPopover userId={text} />,
    },
    {
      title: 'Approved By',
      dataIndex: ['auction', 'staffID'],
      render: (text) => <UserPopover userId={text} />,
    },
    {
      title: 'Status',
      dataIndex: ['auction', 'status'],
      key: 'status',
      render: (status) => {
        let color;
        switch (status) {
          case 'Ongoing':
            color = 'blue';
            break;
          case 'Closed':
            color = 'green';
            break;
          case 'Pending':
            color = 'orange';
            break;
          case 'Reject':
            color = 'red';
            break;
          default:
            color = 'gray';
        }
        return <Tag color={color}>{toUpperCase2(status)}</Tag>;
      },
    },
  ];

  const exportToExcel = () => {
    if (!auctions || auctions.length === 0) {
      console.error('No auction data available to export');
      return;
    }

    const exportData = auctions.map((auctionItem) => ({
      id: auctionItem.auction.id || 'N/A',
      breederID: auctionItem.auction.breederID || 'N/A',
      staffID: auctionItem.auction.staffID || 'N/A',
      winnerID: auctionItem.auction.winnerID || 'N/A',
      auctionMethod: auctionItem.auction.auctionMethod || 'N/A',
      startTime: auctionItem.auction.startTime ? new Date(auctionItem.auction.startTime).toLocaleString() : 'N/A',
      endTime: auctionItem.auction.endTime ? new Date(auctionItem.auction.endTime).toLocaleString() : 'N/A',
      breederDeposit: auctionItem.auction.breederDeposit !== undefined ? auctionItem.auction.breederDeposit : 'N/A',
      bidderDeposit: auctionItem.auction.bidderDeposit !== undefined ? auctionItem.auction.bidderDeposit : 'N/A',
      startingPrice: auctionItem.auction.startingPrice !== undefined ? auctionItem.auction.startingPrice : 'N/A',
      buyoutPrice: auctionItem.auction.buyoutPrice !== undefined ? auctionItem.auction.buyoutPrice : 'N/A',
      finalPrice: auctionItem.auction.finalPrice !== undefined ? auctionItem.auction.finalPrice : 'N/A',
      bidStep: auctionItem.auction.bidStep !== undefined ? auctionItem.auction.bidStep : 'N/A',
      auctionFee: auctionItem.auction.auctionFee !== undefined ? auctionItem.auction.auctionFee : 'N/A',
      createAt: auctionItem.auction.createAt ? new Date(auctionItem.auction.createAt).toLocaleString() : 'N/A',
      status: auctionItem.auction.status || 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData); // Tạo sheet từ dữ liệu
    const workbook = XLSX.utils.book_new(); // Tạo workbook mới
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Auctions'); // Thêm sheet vào workbook
    XLSX.writeFile(workbook, 'AuctionsData.xlsx'); // Xuất file Excel
  };

  return (
    <>
      <Flex align="flex-end" vertical style={{ marginBottom: '20px' }}>
        <Flex>
          <Button onClick={exportToExcel} type="primary" icon={<DownloadOutlined />}>
            Export to Excel
          </Button>
        </Flex>
      </Flex>

      <Table
        columns={columns}
        dataSource={auctions}
        loading={loading}
        rowKey={(record) => record.auction.id}
        pagination={false}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <Pagination current={currentPage + 1} total={totalPages * 9} pageSize={9} onChange={handlePageChange} />
      </div>
    </>
  );
};

export default Auction;
