import React, { useState, useEffect } from 'react';
import { List, Avatar, Pagination, Input, Carousel, message, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import api from '../../configs';
import styles from './index.module.scss';
import PostModal from '../../components/Modal/PostModal';
import userStore from '../../zustand';
import UserPopover from '../../components/Popover/UserPopover';
import TruncatedContent from '../../components/TruncatedContent';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

const Blog = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [images, setImages] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPosts, setTotalPosts] = useState(0);
  const [posts, setPosts] = useState([]);
  const { user } = userStore();

  const fetchBlogs = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get('/blogs', {
        params: {
          page: page - 1,
          size: pageSize,
        },
      });

      if (res?.data?.blogs) {
        setPosts(res.data.blogs);
        setTotalPosts(res.data.totalElements);
      }
    } catch (error) {
      message.error(t('page.blogs.fetch_blog_failed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage, pageSize]);

  const handlePostClick = async (post) => {
    setSelectedPost(post);
    try {
      const res = await api.get(`/blogs/${post.id}`);
      setSelectedPost(res.data);
    } catch (error) {
      message.error(t('page.blogs.fetch_blog_detail_failed'));
    }
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const renderPostList = () => (
    <div>
      <List
        dataSource={posts}
        loading={loading}
        renderItem={(item) => (
          <List.Item onClick={() => handlePostClick(item)} style={{ cursor: 'pointer' }}>
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{item.title}</span>
                  <span style={{ fontSize: '0.8em', fontWeight: '400' }}>{formattedDate(item.createdAt)}</span>
                </div>
              }
              description={<span>{item.authorName}</span>}
            />
          </List.Item>
        )}
      />
      <Pagination current={currentPage} pageSize={pageSize} total={totalPosts} onChange={handlePageChange} />
    </div>
  );

  const formattedDate = (createdAt) => {
    if (!createdAt) return 'Invalid date';
    const date = new Date(createdAt);
    if (isNaN(date)) return 'Invalid date';
    return format(date, 'dd-MM-yyyy HH:mm a');
  };

  const renderPostDetails = (selectedPost) => (
    <>
      <UserPopover userId={selectedPost.userId}>
        <Avatar size={'large'} className={styles.userAvatar} />
        <b className={styles.userName}>{selectedPost.authorName}</b>
        <span className={styles.createAt}>{formattedDate(selectedPost.createdAt)}</span>
      </UserPopover>
      <div className={styles.blogDetail}>
        <div>
          <TruncatedContent text={selectedPost.content} maxLength={246} />
        </div>
        <Carousel draggable="true">
          {selectedPost?.images?.map((img, idx) => (
            <img key={idx} src={img.imageUrl} alt={`Post ${idx}`} className={styles.image} />
          ))}
        </Carousel>
      </div>

      <Button type="primary" onClick={() => setSelectedPost(null)}>
        {t('page.blogs.back_to_list')}
      </Button>
    </>
  );

  const handlePostSubmit = () => {
    if ((title && text) || images.length) {
      const newPost = {
        title,
        content: text,
        authorName: user.fullname,
        userId: user.userId,
        images: images.map((file) => ({
          url: URL.createObjectURL(file.originFileObj),
        })),
        createdAt: new Date().toISOString(),
      };

      setPosts([newPost, ...posts]);
      setTitle('');
      setText('');
      setImages([]);
      setIsModalVisible(false);
    }
  };

  // const handlePostSubmit = async () => {
  //   if ((title && text) || images.length) {
  //     const formData = new FormData();
  //     formData.append('title', title);
  //     formData.append('content', text);
  //     images.forEach((file) => {
  //       formData.append('images', file.originFileObj);
  //     });

  //     setLoading(true);

  //     console.log('FormData content:');
  //     formData.forEach((value, key) => {
  //       console.log(key, value);
  //     });

  //     try {
  //       const res = await api.post('/blogs', formData);

  //       if (res.data) {
  //         setPosts([res.data, ...posts]);
  //         setTitle('');
  //         setText('');
  //         setImages([]);
  //         setIsModalVisible(false);
  //         message.success('Post successfully created!');
  //       }
  //     } catch (error) {
  //       message.error('Failed to create the post');
  //     } finally {
  //       setLoading(false);
  //     }
  //   } else {
  //     message.warning('Please fill in the title or content');
  //   }
  // };

  return (
    <div style={{ padding: '24px' }}>
      {selectedPost ? (
        ''
      ) : (
        <div className={styles.input}>
          <Input placeholder={t('page.blogs.placeholder')} onClick={() => setIsModalVisible(true)} readOnly />
        </div>
      )}

      {selectedPost ? renderPostDetails(selectedPost) : renderPostList()}

      <PostModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handlePostSubmit}
        title={title}
        setTitle={setTitle}
        text={text}
        setText={setText}
        images={images}
        setImages={setImages}
      />
    </div>
  );
};

export default Blog;
