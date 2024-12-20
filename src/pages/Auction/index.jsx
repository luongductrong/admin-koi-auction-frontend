import React, { useState, useEffect } from 'react';
import { Tag, Table, Button, Pagination, Flex, message } from 'antd';
import FishPopover from '../../components/Popover/FishPopover';
import UserPopover from '../../components/Popover/UserPopover';
import { DownloadOutlined } from '@ant-design/icons';
import api from '../../configs';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';

const Auction = () => {
  const { t } = useTranslation();
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
      message.error('Failed to fetch auction data');
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
      title: t('page.auctions.fish_details'),
      key: 'koiFish',
      render: (text) => {
        return (
          <>
            <b>
              {text.koiFish && text.koiFish.length > 0 ? (
                <FishPopover fishIds={text.koiFish}>{t('page.auctions.click_here')}</FishPopover>
              ) : (
                t('page.auctions.no_data')
              )}
            </b>
          </>
        );
      },
    },
    {
      title: t('page.auctions.start_time'),
      dataIndex: ['auction', 'startTime'],
      render: (text) => {
        return text ? new Date(text).toLocaleString() : 'N/A';
      },
    },
    {
      title: t('page.auctions.end_time'),
      dataIndex: ['auction', 'endTime'],
      render: (text) => {
        return text ? new Date(text).toLocaleString() : 'N/A';
      },
    },
    {
      title: t('page.auctions.auction_method'),
      dataIndex: ['auction', 'auctionMethod'],
      render: (text) => <>{t(`page.auctions.method_${text}`)}</>,
    },
    {
      title: t('page.auctions.starting_price'),
      dataIndex: ['auction', 'startingPrice'],
      render: (text) => <span>{text ? `${text}` : 'N/A'}</span>,
    },
    {
      title: t('page.auctions.bid_step'),
      dataIndex: ['auction', 'bidStep'],
    },
    {
      title: t('page.auctions.buyout_price'),
      dataIndex: ['auction', 'buyoutPrice'],
    },
    {
      title: t('page.auctions.final_price'),
      dataIndex: ['auction', 'finalPrice'],
      render: (text) => <span>{text ? `${text}` : 'N/A'}</span>,
    },
    {
      title: t('page.auctions.winner'),
      dataIndex: ['auction', 'winnerID'],
      render: (text) => <span>{text || 'N/A'}</span>,
    },
    {
      title: t('page.auctions.breeder'),
      dataIndex: ['auction', 'breederID'],
      render: (text) => <UserPopover userId={text} />,
    },
    {
      title: t('page.auctions.staff'),
      dataIndex: ['auction', 'staffID'],
      render: (text) => <UserPopover userId={text} />,
    },
    {
      title: t('page.auctions.status'),
      dataIndex: ['auction', 'status'],
      key: 'status',
      render: (status) => {
        let color;
        switch (status) {
          case 'Ongoing':
            color = 'blue';
            break;
          case 'Scheduled':
            color = 'green';
            break;
          case 'Paid':
            color = 'cyan';
            break;
          case 'Finished':
            color = 'purple';
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
        return <Tag color={color}>{toUpperCase2(t(`page.auctions.status_${status}`))}</Tag>;
      },
    },
  ];

  const exportToExcel = () => {
    if (!auctions || auctions.length === 0) {
      message.error('No data to export');
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
            {t('page.auctions.export_file')}
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
