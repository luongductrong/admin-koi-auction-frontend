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

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        'https://koi-auction-backend-dwe7hvbuhsdtgafe.southeastasia-01.azurewebsites.net/api/admin-manager/users/getAll',
      );
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
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
      placement: 'topRight',
    });
    setIsModalVisible(false);
  };

  const handleSubmitUpdate = async () => {
    try {
      if (newRole) {
        console.log('newRole', newRole);
        console.log('before put');
        console.log('currentUserId: ', currentUserId);

        await axios.put(
          `https://koi-auction-backend-dwe7hvbuhsdtgafe.southeastasia-01.azurewebsites.net/api/admin-manager/users/update-role/${currentUserId}`,
          { role: newRole },
        );

        notification.success({
          message: 'Success',
          // description: `${record.fullName} role updated to ${newRole}`,
        });
        setIsModalVisible(false);
      } else {
        notification.error({
          message: 'Error',
          description: 'Please select a role to update.',
        });
      }
    } catch (error) {
      console.error('Error response:', error.response);
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
      await axios.post(
        `https://koi-auction-backend-dwe7hvbuhsdtgafe.southeastasia-01.azurewebsites.net/api/admin-manager/users/ban-user/${currentUserId}`,
        {
          status: 'Unactive',
        },
      );
      notification.success({
        message: 'Success',
        description: `Removed user: ${currentName} (Id: ${currentUserId})`,
        placement: 'topRight',
      });
    } finally {
      setIsPopupVisible(false);
      fetchUsers();
    }
  };

  const handleCancelRemove = () => {
    notification.error({
      message: 'Cancelled',
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
          style={{
            fontWeight: role === 'Admin' ? 'bold' : 'normal',
            color: role === 'Admin' ? '#001529' : 'inherit',
          }}
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
        visible={isModalVisible}
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
        content={`Are you sure you want to remove user ${currentName}?`}
      />
    </div>
  );
};
export default User;
