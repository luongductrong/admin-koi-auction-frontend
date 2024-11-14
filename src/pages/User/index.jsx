import React, { useEffect, useState } from 'react';
import { Table, Button, notification } from 'antd';
import { useTranslation } from 'react-i18next';
import api from '../../configs';
import userStore from '../../zustand';
import ConfirmPopup from '../../components/Popup/ConfirmPopup';
import RoleUpdate from '../../components/Modal/RoleUpdate';

const User = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentName, setCurrentName] = useState('');
  const [currStatus, setCurrStatus] = useState('');
  const [currentRole, setCurrentRole] = useState(null);
  const [newRole, setNewRole] = useState(null);

  const { user } = userStore();
  const token = user.token;

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin-manager/users/getAll', {
        requireAuth: true,
      });

      const formattedUsers = response.data.map((user) => {
        let formattedAddress = user.address;

        if (formattedAddress) {
          try {
            const parsedAddress = JSON.parse(formattedAddress);
            formattedAddress = `${parsedAddress.province || ''}, ${parsedAddress.district || ''}, ${
              parsedAddress.ward || ''
            }, ${parsedAddress.address || ''}`;
          } catch (error) {
            console.error('Error parsing address:', error);
          }
        }

        return {
          ...user,
          address: formattedAddress,
        };
      });

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Gọi fetchUsers khi token thay đổi
  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleUpdate = (record) => {
    setCurrentUserId(record.id);
    setCurrentRole(record.role);
    setNewRole(null);
    setIsModalVisible(true);
  };

  const handleCancelUpdate = () => {
    notification.error({
      message: 'Cancelled',
    });
    setIsModalVisible(false);
  };

  const handleSubmitUpdate = async () => {
    try {
      if (newRole) {
        await api.post(`/admin-manager/users/update-role/${currentUserId}?role=${newRole}`);
        notification.success({
          message: 'Success',
          description: `User role updated to ${newRole}`,
        });
        setIsModalVisible(false);
        fetchUsers(); // Fetch lại danh sách users sau khi cập nhật
      } else {
        notification.error({
          message: 'Error',
          description: 'Please select a role to update.',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to update user role.',
      });
    }
  };

  const handleBan = (user) => {
    setCurrentUserId(user.id);
    setCurrStatus(user.status);
    setCurrentName(user.fullName);
    setIsPopupVisible(true);
  };

  const handleConfirmBan = async () => {
    try {
      if (currStatus === 'Active') {
        await api.post(`/admin-manager/users/ban-user/${currentUserId}`, {
          status: 'Unactive',
        });
        notification.success({
          message: 'Success',
          description: `Banned: ${currentName} (ID: ${currentUserId})`,
        });
      } else {
        await api.post(`/admin-manager/users/active-user/${currentUserId}`, {
          status: 'Active',
        });
        notification.success({
          message: 'Success',
          description: `Actived: ${currentName} (ID: ${currentUserId})`,
        });
      }
      fetchUsers();
    } finally {
      setIsPopupVisible(false);
    }
  };

  const handleCancelBan = () => {
    notification.error({
      message: 'Cancelled',
    });
    setIsPopupVisible(false);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('page.users.full_name'),
      key: 'fullName',
      render: (text) => (
        <div>
          <b>{text.fullName.length != 0 ? text.fullName : t('page.users.new_user')}</b>
          <div>{text.email}</div>
        </div>
      ),
    },
    {
      title: t('page.users.phone_number'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: t('page.users.address'),
      key: 'address',
      render: (text) => (
        <div
          style={{
            whiteSpace: 'nowrap', // Giữ text trên cùng 1 dòng
            overflow: 'hidden', // Ẩn phần text dư thừa
            textOverflow: 'ellipsis', // Hiển thị dấu chấm 3 chấm khi text bị ẩn
            maxWidth: '450px',
          }}
        >
          {text.address}
        </div>
      ),
    },
    {
      title: t('page.users.created_at'),
      dataIndex: 'createAt',
      key: 'createAt',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: t('page.users.update_at'),
      dataIndex: 'updateAt',
      key: 'updateAt',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: t('page.users.role'),
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <div
          style={{ fontWeight: role === 'Admin' ? 'bold' : 'normal', color: role === 'Admin' ? '#001529' : 'inherit' }}
        >
          {t(`page.users.role_${role}`)}
        </div>
      ),
    },
    {
      title: t('page.users.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <div style={{ color: status === 'Active' ? 'green' : 'red' }}>{t(`page.users.status_${status}`)}</div>
      ),
    },
    {
      title: t('page.users.action'),
      key: 'action',
      render: (text) => (
        <div>
          <Button onClick={() => handleUpdate(text)} type="primary">
            {t('page.users.update')}
          </Button>
          <Button onClick={() => handleBan(text)} danger>
            {t('page.users.ban_active')}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={users} columns={columns} rowKey="id" />
      <RoleUpdate
        visible={isModalVisible}
        currentRole={currentRole}
        newRole={newRole}
        setNewRole={setNewRole}
        onSubmit={handleSubmitUpdate}
        onCancel={handleCancelUpdate}
      />
      <ConfirmPopup
        open={isPopupVisible}
        onConfirm={handleConfirmBan}
        onCancel={handleCancelBan}
        content={currStatus === 'Active' ? `Ban ${currentName}?` : `Active ${currentName}?`}
      />
    </div>
  );
};

export default User;
