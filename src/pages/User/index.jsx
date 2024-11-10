import React, { useEffect, useState } from 'react';
import { Table, Button, notification } from 'antd';
import api from '../../configs';
import userStore from '../../zustand';
import ConfirmPopup from '../../components/Popup/ConfirmPopup';
import RoleUpdate from '../../components/Modal/RoleUpdate';

const User = () => {
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
      title: 'Full Name',
      key: 'fullName',
      render: (text) => (
        <div>
          <b>{text.fullName}</b>
          <div>{text.email}</div>
        </div>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Address',
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
      title: 'Create At',
      dataIndex: 'createAt',
      key: 'createAt',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Update At',
      dataIndex: 'updateAt',
      key: 'updateAt',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <div
          style={{ fontWeight: role === 'Admin' ? 'bold' : 'normal', color: role === 'Admin' ? '#001529' : 'inherit' }}
        >
          {role}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <div style={{ color: status === 'Active' ? 'green' : 'red' }}>{status}</div>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text) => (
        <div>
          <Button onClick={() => handleUpdate(text)} type="primary">
            Update
          </Button>
          <Button onClick={() => handleBan(text)} danger>
            Ban / Active
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
