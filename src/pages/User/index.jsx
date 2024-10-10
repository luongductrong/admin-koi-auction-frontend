import React, { useEffect, useState } from 'react';
import { Table, Button, notification, Select } from 'antd';
import axios from 'axios';
import ConfirmPopup from '../../components/Popup/ConfirmPopup';
import RoleUpdateModal from '../../components/Modal/RoleUpdateModal';
import { format } from 'date-fns';

const { Option } = Select;

const User = () => {
  const [users, setUsers] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentName, setCurrentName] = useState('');
  const [currentRole, setCurrentRole] = useState(null);
  const [newRole, setNewRole] = useState(null);

  // Lấy token từ local storage
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          'https://koi-auction-backend-dwe7hvbuhsdtgafe.southeastasia-01.azurewebsites.net/api/admin-manager/users/getAll',
          {
            headers: {
              Authorization: `Bearer ${token}`, // Sử dụng token từ local storage
              accept: '*/*',
            },
          },
        );
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [token]);

  const handleUpdate = (record) => {
    setCurrentUserId(record.id);
    setCurrentRole(record.role);
    setNewRole(null);
    setIsModalVisible(true);
  };

  const handleCancelUpdate = () => {};

  const handleSubmitUpdate = async () => {
    try {
      if (newRole) {
        await axios.put(
          `https://koi-auction-backend-dwe7hvbuhsdtgafe.southeastasia-01.azurewebsites.net/api/admin-manager/users/update-role/${currentUserId}`,
          { role: newRole },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Sử dụng token từ local storage
            },
          },
        );
        notification.success({
          message: 'Success',
          description: `User role updated to ${newRole}`,
        });
        setIsModalVisible(false); // Đóng modal sau khi thành công
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

  const handleRemove = (user) => {
    setCurrentUserId(user.id);
    setCurrentName(user.fullName);
    setIsPopupVisible(true);
  };

  const handleConfirmRemove = async () => {
    try {
      await axios.patch(
        `https://koi-auction-backend-dwe7hvbuhsdtgafe.southeastasia-01.azurewebsites.net/api/admin-manager/users/ban-user/${currentUserId}`,
        {
          status: 'Banned',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Sử dụng token từ local storage
          },
        },
      );
      notification.success({
        message: 'Success',
        description: `User ${currentName} has been banned.`,
        placement: 'topRight',
      });
    } catch (error) {
      notification.error({
        message: 'Failed',
        description: `Failed to remove ${currentName} (Id: ${currentUserId}).`,
        placement: 'topRight',
      });
    } finally {
      setIsPopupVisible(false);
    }
  };

  const handleCancelRemove = () => {
    notification.error({
      message: 'Failed',
      description: `Cancelled the removal of: ${currentName} (Id: ${currentUserId})`,
      placement: 'topRight',
    });

    setIsPopupVisible(false);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: 'Full Name',
      key: 'fullName',
      render: (text, record) => (
        <div>
          <div className="user-name">
            <b>{record.fullName}</b>
          </div>
          <div className="user-email">{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      align: 'center',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
    },
    {
      title: 'Create At',
      dataIndex: 'createAt',
      key: 'createAt',
      align: 'center',
      render: (text, record) => format(new Date(record.createAt), 'dd/MM/yyyy HH:mm:ss'),
    },
    {
      title: 'Update At',
      dataIndex: 'updateAt',
      key: 'updateAt',
      align: 'center',
      render: (text, record) => format(new Date(record.updateAt), 'dd/MM/yyyy HH:mm:ss'),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      align: 'center',
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
      align: 'center',
      render: (status) => <div style={{ color: status === 'Active' ? 'green' : 'red' }}>{status}</div>,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (text, record) => (
        <div>
          <Button onClick={() => handleUpdate(record)} type="primary" size="small">
            Update
          </Button>
          <Button onClick={() => handleRemove(record)} type="primary" size="small" danger>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2>User Manager</h2>
      <Table dataSource={users} columns={columns} rowKey="id" />
      <RoleUpdateModal
        open={isModalVisible}
        currentRole={currentRole}
        newRole={newRole}
        setNewRole={setNewRole}
        onSubmit={handleSubmitUpdate}
        onCancel={handleCancelUpdate}
      />
      <ConfirmPopup
        x
        open={isPopupVisible}
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
        title="Please confirm"
        content="Are you sure you want to remove this user?"
      />
    </div>
  );
};

export default User;
