import React, { useState } from 'react';
import { Layout, Menu, List, Avatar, Badge, Button, Pagination, Input } from 'antd';
import { MailOutlined, InboxOutlined, SendOutlined, DeleteOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './email.css';

const { Sider, Content } = Layout;
const { TextArea } = Input;

const emails = [
  {
    id: 1,
    sender: 'john@example.com',
    subject: 'Meeting tomorrow',
    content: 'Reminder about the meeting at 10 AM tomorrow. Don’t forget to prepare the slides.',
    time: '09:15',
  },
  {
    id: 2,
    sender: 'jane@example.com',
    subject: 'Vacation plans',
    content: 'Let me know your thoughts on our vacation plan for next month.',
    time: '14:45',
  },
  {
    id: 3,
    sender: 'example1@example.com',
    subject: 'Project update',
    content: 'The project is on track. Let’s meet next week.',
    time: '12:00',
  },
  {
    id: 4,
    sender: 'example2@example.com',
    subject: 'Invoice',
    content: 'Please find attached the invoice for the last month.',
    time: '16:00',
  },
  {
    id: 5,
    sender: 'example3@example.com',
    subject: 'Feedback request',
    content: 'We would like your feedback on our services.',
    time: '18:00',
  },
  {
    id: 6,
    sender: 'example4@example.com',
    subject: 'Newsletter',
    content: 'Check out our latest newsletter for updates.',
    time: '19:00',
  },
  {
    id: 7,
    sender: 'example5@example.com',
    subject: 'Job application',
    content: 'Thank you for your application. We will get back to you soon.',
    time: '20:00',
  },
  {
    id: 8,
    sender: 'example6@example.com',
    subject: 'Account update',
    content: 'Your account settings have been updated.',
    time: '21:00',
  },
  {
    id: 9,
    sender: 'example7@example.com',
    subject: 'Meeting notes',
    content: 'Here are the notes from our last meeting.',
    time: '22:00',
  },
  {
    id: 10,
    sender: 'example8@example.com',
    subject: 'Welcome!',
    content: 'Welcome to our service! We are glad to have you.',
    time: '23:00',
  },
  {
    id: 11,
    sender: 'example9@example.com',
    subject: 'Support request',
    content: 'Your support request has been received.',
    time: '00:00',
  },
];

const Email = () => {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isComposing, setIsComposing] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const pageSize = 9;

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedEmail(null);
  };

  const currentEmails = emails.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const renderEmailList = () => (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={currentEmails}
        renderItem={(item) => (
          <List.Item onClick={() => handleEmailClick(item)} style={{ cursor: 'pointer' }}>
            <List.Item.Meta
              avatar={<Avatar style={{ backgroundColor: '#f56a00' }}>{item.sender[0].toUpperCase()}</Avatar>}
              title={<span className="email-subject">{item.subject}</span>}
              description={<span className="email-sender">{item.sender}</span>}
            />
            <div className="email-time">{item.time}</div>
          </List.Item>
        )}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={emails.length}
        onChange={handlePageChange}
        style={{ marginTop: '20px', textAlign: 'center' }}
      />
    </div>
  );

  const renderEmailDetails = () => (
    <div className="email-details">
      <h3 className="email-title">{selectedEmail.subject}</h3>
      <p>
        <strong>From:</strong> {selectedEmail.sender}
      </p>
      <p>
        <strong>Time:</strong> {selectedEmail.time}
      </p>
      <p>{selectedEmail.content}</p>
      <Button type="primary" onClick={() => setSelectedEmail(null)}>
        Back to Inbox
      </Button>
    </div>
  );

  const handleCompose = () => {
    // Here you can add the logic for sending the email
    console.log('Sending email:', { recipient, subject, content });
    // Reset fields after sending
    setRecipient('');
    setSubject('');
    setContent('');
    setIsComposing(false);
  };

  const renderComposeEmail = () => (
    <div className="compose-email">
      <h3>Compose Email</h3>
      <Input
        placeholder="Recipient"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <Input
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <TextArea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <Button type="primary" onClick={handleCompose}>
        Send
      </Button>
      <Button onClick={() => setIsComposing(false)} style={{ marginLeft: '10px' }}>
        Cancel
      </Button>
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} style={{ backgroundColor: '#f1f3f4' }}>
        <Menu mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%' }}>
          <Menu.Item key="1" icon={<MailOutlined />}>
            Inbox
            <Badge count={11} style={{ backgroundColor: 'red', marginLeft: '10px', marginTop: '0' }} />
          </Menu.Item>
          <Menu.Item key="2" icon={<InboxOutlined />}>
            Starred
          </Menu.Item>
          <Menu.Item key="3" icon={<SendOutlined />}>
            Sent
          </Menu.Item>
          <Menu.Item key="4" icon={<DeleteOutlined />}>
            Trash
          </Menu.Item>
          <Menu.Item key="5" onClick={() => setIsComposing(true)} icon={<FontAwesomeIcon icon={faPaperPlane} />}>
            Compose
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ padding: '24px', backgroundColor: '#ffffff' }}>
          {isComposing ? renderComposeEmail() : selectedEmail ? renderEmailDetails() : renderEmailList()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Email;
