import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { Form, Button, Input, Card, Statistic, ConfigProvider, message } from 'antd';
import { UsergroupAddOutlined, DollarOutlined, ShoppingCartOutlined, LinuxOutlined } from '@ant-design/icons';
import api from '../../configs';
import styles from './index.module.scss';

Chart.register(...registerables);

const SummaryCard = React.memo(({ label, value, icon }) => (
  <Card bordered={true} className={styles.summaryCard}>
    <Statistic title={label} value={value} prefix={icon} />
  </Card>
));

const BarChart = React.memo(({ data }) => (
  <Bar data={data} options={{ maintainAspectRatio: false, responsive: true }} />
));

// Component cho biểu đồ Pie
const PieChart = React.memo(({ data }) => (
  <Pie data={data} options={{ maintainAspectRatio: false, responsive: true }} />
));

const LineChart = React.memo(({ data }) => (
  <Line data={data} options={{ maintainAspectRatio: false, responsive: true }} />
));

const Dashboard = () => {
  const [summaryData, setSummaryData] = useState(null);

  const currDate = new Date();
  const currYear = currDate.getFullYear();

  const [dateFilters, setDateFilters] = useState({
    day: null,
    month: null,
    year: currYear,
  });

  const [auctionData, setAuctionData] = useState(Array(12).fill(0)); // Khởi tạo giá trị mặc định cho các tháng
  const [transactionData, setTransactionData] = useState(Array(12).fill(0)); // Khởi tạo dữ liệu giao dịch

  const fillData = async () => {
    const year = 2024;

    try {
      // Fetch auction data và transaction data cho tất cả các tháng
      const [auctionResponses, transactionResponses] = await Promise.all([
        // Fetch auction data
        Promise.all(
          Array.from({ length: 12 }, (_, month) =>
            api.get('/dashboard/auction', {
              params: { month: month + 1, year },
            }),
          ),
        ),
        // Fetch transaction data
        Promise.all(
          Array.from({ length: 12 }, (_, month) =>
            api.get('/dashboard/transaction', {
              params: { month: month + 1, year },
            }),
          ),
        ),
      ]);

      // Extract auctionCount và transactionCount_total từ mỗi response
      const auctionCounts = auctionResponses.map((response) => response.data.auctionCount);
      const transactionCounts = transactionResponses.map((response) => response.data.transactionCount_total);

      // Cập nhật dữ liệu vào state
      setAuctionData(auctionCounts);
      setTransactionData(transactionCounts);

      console.log('Final auction data for the year:', auctionCounts);
      console.log('Final transaction data for the year:', transactionCounts);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback nếu có lỗi, điền 0 vào tất cả các tháng
      setAuctionData(Array(12).fill(0));
      setTransactionData(Array(12).fill(0));
    }
  };

  useEffect(() => {
    fillData();
  }, []);

  // Cập nhật chartData với dữ liệu từ state
  const chartData = {
    line: {
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      datasets: [
        {
          label: 'Transactions',
          data: transactionData, // Sử dụng dữ liệu từ state transactionData
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
      ],
    },
    pie: {
      labels: ['Bình', 'Vẫn là bình', 'Bình nữa'],
      datasets: [
        {
          data: [300, 50, 100],
        },
      ],
    },
    col: {
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      datasets: [
        {
          label: 'Auctions',
          data: auctionData, // Sử dụng dữ liệu từ state auctionData
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    },
  };

  const fetchSummaryData = async (filters = dateFilters) => {
    try {
      const response = await api.get('/dashboard', { params: filters });
      setSummaryData(response.data);
    } catch (error) {
      message.error('Failed to fetch summary data');
    }
  };
  useEffect(() => {
    fetchSummaryData();
  }, []);

  const onFinish = (values) => {
    const { day, month, year } = values;
    const filters = {
      ...(day && { day: parseInt(day) }),
      ...(month && { month: parseInt(month) }),
      ...(year && { year: parseInt(year) }),
    };
    fetchSummaryData(filters);
  };

  return (
    <div className={styles.dashboard}>
      <Form layout="inline" className={styles.filterForm} onFinish={onFinish} initialValues={dateFilters}>
        <Form.Item name="day" label="Day">
          <Input type="number" min={1} max={31} />
        </Form.Item>
        <Form.Item name="month" label="Month">
          <Input type="number" min={1} max={12} />
        </Form.Item>
        <Form.Item name="year" label="Year">
          <Input type="number" min={2000} max={currYear} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>

      <div className={styles.summaryWrapper}>
        {summaryData && (
          <ConfigProvider
            theme={{
              components: {
                Statistic: {
                  titleFontSize: 17,
                  contentFontSize: 20,
                },
              },
              token: { colorText: 'var(--primary-color)' },
            }}
          >
            <SummaryCard label="New Users" value={summaryData.newUserCount} icon={<UsergroupAddOutlined />} />
            <SummaryCard
              label="Revenue"
              value={summaryData.revenue !== null ? summaryData.revenue : 'No Data Available'}
              icon={<DollarOutlined />}
            />
            <SummaryCard label="Auctions" value={summaryData.auctionCount} icon={<LinuxOutlined />} />
            <SummaryCard
              label="Finished Auctions"
              value={summaryData.finishedAuctionCount}
              icon={<ShoppingCartOutlined />}
            />
          </ConfigProvider>
        )}
      </div>

      <div className={styles.chartWrapper}>
        <div className={styles.chartBorder}>
          <BarChart data={chartData.col} />
        </div>
        <div className={styles.chartBorderPie}>
          <PieChart data={chartData.pie} />
        </div>
      </div>
      <div className={styles.chartBorder}>
        <LineChart data={chartData.line} />
      </div>
    </div>
  );
};

export default Dashboard;
