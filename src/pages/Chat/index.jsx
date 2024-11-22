import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faAnglesDown } from '@fortawesome/free-solid-svg-icons';
import { Input, Spin, Divider, message } from 'antd';
import api from '../../configs';
import { useTranslation } from 'react-i18next';
import SocketService from '../../services/socket';
import styles from './index.module.scss';
import userStore from '../../zustand';
import AutoCompleteComponent from '../../components/AutoComplete';
import avt from '../../assets/avt.jpg';

const { TextArea } = Input;

const Chat = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [currChat, setCurrChat] = useState({ receiverName: null, receiverId: null });
  const [contacts, setContacts] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [isEndMessage, setIsEndMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const messagesEndRef = useRef(null);
  const { user } = userStore();

  const [isNewMessage, setIsNewMessage] = useState(false);

  // Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get('/admin-manager/users/getAll');
        const activeContacts = res.data.filter((user) => user.status === 'Active');
        setContacts(activeContacts);
      } catch (error) {
        message.error('Error fetching contacts');
      }
    };
    fetchContacts();
  }, []);

  // theo dõi receiverId
  useEffect(() => {
    if (currChat.receiverId) {
      setMessages([]);
      setIsEndMessage(false);
    }
  }, [currChat.receiverId]);

  // Fetch last page when the chat changes
  useEffect(() => {
    const fetchLastPage = async () => {
      if (currChat.receiverId) {
        try {
          const res = await api.get('/chat/messages', {
            params: {
              receiverId: currChat.receiverId,
              page: 0,
            },
          });

          const totalPage = res.data.totalPages;

          fetchMessages(totalPage - 1);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchLastPage();
  }, [currChat]);

  // Fetch messages
  const fetchMessages = async (newPage) => {
    setLoading(true);
    try {
      const res = await api.get('/chat/messages', {
        params: {
          receiverId: currChat.receiverId,
          page: newPage,
        },
      });

      const totalPage = res.data.totalPages;
      const content = res.data.content;

      if (newPage === totalPage) {
        setIsEndMessage(true);
      }

      setMessages((prevMessages) => [...content, ...prevMessages]);
      setPage(newPage);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Connect to WebSocket
  useEffect(() => {
    const receiveMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      setIsNewMessage(true);
    };

    if (currChat?.receiverId && user?.token) {
      SocketService.connect(user.token, user.userId, currChat.receiverId, receiveMessage);
    }

    return () => {
      SocketService.disconnect();
    };
  }, [currChat, user]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (isNewMessage) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setIsNewMessage(false); // Reset the flag after scrolling
    }
  }, [isNewMessage]);

  // Send message
  const handleSendMessage = async () => {
    if (messageInput.trim() === '') return;

    try {
      await api.post('/chat', {
        receiverId: currChat.receiverId,
        message: messageInput,
      });
      setMessageInput('');
    } catch (error) {
      message.error('Error sending message');
    }
  };

  // Load previous messages when scrolling up
  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    if (scrollTop === 0 && !isEndMessage) {
      fetchMessages(page - 1);
    }
  };

  // Check date to display date divider
  const isDifferentDay = (currentMessage, previousMessage) => {
    if (!previousMessage) return true;
    const currentDate = new Date(currentMessage.datetime).toDateString();
    const previousDate = new Date(previousMessage.datetime).toDateString();
    return currentDate !== previousDate;
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.contactList}>
        <div className={styles.search}>
          <AutoCompleteComponent
            contacts={contacts}
            currChat={currChat}
            setCurrChat={setCurrChat}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </div>
        <ul>
          {contacts.map((contact) => (
            <li
              key={contact.id}
              className={styles.contactItem}
              onClick={() => setCurrChat({ receiverName: contact.fullName, receiverId: contact.id })}
            >
              <img src={avt} className={styles.contactAvatar} alt="Avatar" />
              <div>
                <h4>{contact.fullName.length == 0 ? t('page.chat.new_user') : contact.fullName}</h4>
                <span>{t(`page.chat.role_${contact.role}`)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.chatSection}>
        <div className={styles.currentChatHeader}>
          {currChat.receiverId && <img src={avt} className={styles.avatar} alt="Avatar" />}

          <h3 className={styles.receiverName}>{currChat.receiverName}</h3>

          <button
            className={styles.scrollIcon}
            onClick={() => messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })}
          >
            <FontAwesomeIcon icon={faAnglesDown} />
          </button>
        </div>

        <ul className={styles.messageList} onScroll={handleScroll}>
          {loading && <Spin className={styles.loadingSpinner} />}
          {messages.map((message, index) => (
            <React.Fragment key={index}>
              {isDifferentDay(message, messages[index - 1]) && (
                <Divider className={styles.dateDivider}>
                  {new Date(message.datetime).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Divider>
              )}
              <li
                key={index}
                className={`${styles.message} ${
                  message.senderId === user.userId ? styles.myMessage : styles.otherMessage
                }`}
              >
                {message.senderId !== user.userId && <img src={avt} className={styles.avatar} alt="Avatar" />}
                <div className={styles.messageContent}>
                  <div className={styles.messageText}>{message.message}</div>
                  <span className={styles.messageTime}>
                    {new Date(message.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {message.senderId === user.userId && <img src={avt} className={styles.avatar} alt="Avatar" />}
              </li>
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </ul>

        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <TextArea
              placeholder={t('page.chat.placeholder')}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && handleSendMessage()}
              rows={3}
              autoSize={{ minRows: 1, maxRows: 5 }}
            />
          </div>
          <FontAwesomeIcon icon={faPaperPlane} onClick={handleSendMessage} className={styles.sendIcon} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
