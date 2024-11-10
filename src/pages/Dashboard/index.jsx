import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { Form, Button, Input, Card, Statistic, ConfigProvider } from 'antd';
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

  const chartData = {
    line: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Revenue',
          data: [65, 59, 80, 81, 56, 55, 40],
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
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Auctions',
          data: [65, 59, 80, 81, 56, 55, 40],
        },
      ],
    },
  };

  const fetchSummaryData = async (filters = dateFilters) => {
    try {
      const response = await api.get('/dashboard', { params: filters });
      setSummaryData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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
