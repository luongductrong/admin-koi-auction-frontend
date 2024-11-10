import React, { useState, useEffect } from 'react';
import { List, Avatar, Pagination, Input, Carousel } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import api from '../../configs';
import styles from './index.module.scss';
import PostModal from '../../components/Modal/PostModal';
import userStore from '../../zustand';
import UserPopover from '../../components/Popover/UserPopover';

const initialPosts = [
  {
    id: 1,
    userId: 1,
    author: 'John Doe',
    title: 'Understanding React Hooks',
    content:
      'React Hooks are a new addition in React 16.8 that let you use state and other React features without writing a class.',
    time: '2024-10-01',
  },
  {
    id: 2,
    userId: 1,
    author: 'Jane Smith',
    title: 'A Guide to CSS Grid',
    content:
      'CSS Grid is a two-dimensional layout system for the web, allowing you to design web pages using rows and columns.',
    time: '2024-10-02',
  },
  {
    id: 3,
    userId: 1,
    author: 'Alice Johnson',
    title: 'JavaScript ES6 Features',
    content:
      'ES6 introduced several new features, including let and const, arrow functions, and classes, that improve the way we write JavaScript.',
    time: '2024-10-03',
  },
  {
    id: 4,
    userId: 1,
    author: 'Bob Brown',
    title: 'Building a RESTful API with Node.js',
    content:
      'Learn how to build a RESTful API using Node.js and Express, enabling seamless communication between client and server.',
    time: '2024-10-04',
  },
];

const Blog = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState(initialPosts);
  // const [posts, setPosts] = useState([]);
  const pageSize = 2;
  const { user } = userStore();

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('blogs');
      if (res?.data) {
        setPosts(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch blog posts', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch blog posts
  // useEffect(() => {
  //   fetchBlogs();
  // }, []);

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedPost(null);
  };

  const handlePostSubmit = () => {
    if (text || images.length) {
      const newPost = {
        userId: user.userId,
        content: text,
        images: images.map((file) => ({
          url: URL.createObjectURL(file.originFileObj),
        })),
      };
      setPosts([newPost, ...posts]);
      setText('');
      setImages([]);
      setIsModalVisible(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const currentPosts = posts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const renderPostList = () => (
    <div>
      <List
        dataSource={currentPosts}
        renderItem={(item) => (
          <List.Item onClick={() => handlePostClick(item)} style={{ cursor: 'pointer' }}>
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={<span className="post-title">{item.title}</span>}
              description={<span>{item.author}</span>}
            />
            <div>{item.time}</div>
          </List.Item>
        )}
      />
      <Pagination current={currentPage} pageSize={pageSize} total={posts.length} onChange={handlePageChange} />
    </div>
  );

  const renderPostDetails = (selectedPost) => (
    <>
      <UserPopover userId={selectedPost.userId}>
        <Avatar size={'large'} className={styles.avtPopover} />
        <b className={styles.name}>Nguyen Van A</b>
      </UserPopover>

      <div className={styles.content}>
        <p className={styles.text}>
          {selectedPost.content.length > 100 ? `${selectedPost.content.substring(0, 100)}...` : selectedPost.content}
        </p>
        <Carousel>
          {selectedPost.images.map((img, idx) => (
            <img key={idx} src={img.url} alt={`Post ${idx}`} className={styles.image} />
          ))}
        </Carousel>
      </div>
    </>
  );

  const renderInput = () => (
    <>
      <div className={styles.input}>
        <Input placeholder="Post anything . . ." onClick={showModal} readOnly />
      </div>

      <PostModal
        visible={isModalVisible}
        onClose={handleModalClose}
        onSubmit={handlePostSubmit}
        text={text}
        setText={setText}
        images={images}
        setImages={setImages}
      />
    </>
  );

  return (
    <div style={{ padding: '24px' }}>
      {/* input */}
      {renderInput()}

      {/* content */}
      {selectedPost ? renderPostDetails() : renderPostList()}

      {/* pagination */}
    </div>
  );
};

export default Blog;
