import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from 'antd';
import axios from 'axios';
import appsettings from '../../appsettings';

function getToken() {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token;
}

function authHeaders() {
  const token = getToken();
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

async function fetchUsers() {
  const response = await axios.get(`${appsettings.apiBaseUrl}/users`, { headers: authHeaders() });
  return response.data;
}

async function updateUser(userId, userData) {
  const response = await axios.put(
    `${appsettings.apiBaseUrl}/users/${userId}`,
    userData,
    { headers: authHeaders() }
  );
  return response.data;
}

async function deleteUser(userId) {
  const response = await axios.delete(
    `${appsettings.apiBaseUrl}/users/${userId}`,
    { headers: authHeaders() }
  );
  return response.data;
}

function UsersAdminTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch {
      message.error('Failed to load users.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user = null) => {
    setEditingUser(user);
    setModalVisible(true);
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      await updateUser(editingUser.id, values);
      message.success('User updated successfully!');
      closeModal();
      loadUsers();
    } catch {
      message.error('Failed to update user. Check your input and try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      message.success('User deleted.');
      loadUsers();
    } catch {
      message.error('Failed to delete user.');
    }
  };

  const columns = [
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Full Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => openModal(record)} type="link">Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Users Management</h2>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />
      <Modal
        open={modalVisible}
        title={editingUser ? 'Edit User' : ''}
        onCancel={closeModal}
        onOk={handleFormSubmit}
        okText="Update"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please enter the username.' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: 'Please enter the full name.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please enter the email.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please enter the role.' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UsersAdminTab;