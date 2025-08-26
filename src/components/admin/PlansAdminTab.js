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

async function fetchPlans() {
  const response = await axios.get(`${appsettings.apiBaseUrl}/subscriptionplans`);
  return response.data;
}

async function addPlan(planData) {
  const response = await axios.post(
    `${appsettings.apiBaseUrl}/subscriptionplans`,
    planData,
    { headers: authHeaders() }
  );
  return response.data;
}

async function updatePlan(planId, planData) {
  const response = await axios.put(
    `${appsettings.apiBaseUrl}/subscriptionplans/${planId}`,
    planData,
    { headers: authHeaders() }
  );
  return response.data;
}

async function deletePlan(planId) {
  const response = await axios.delete(
    `${appsettings.apiBaseUrl}/subscriptionplans/${planId}`,
    { headers: authHeaders() }
  );
  return response.data;
}

function PlansAdminTab() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const data = await fetchPlans();
      setPlans(data);
    } catch {
      message.error('Failed to load plans.');
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (plan = null) => {
    setEditingPlan(plan);
    setModalVisible(true);
    if (plan) {
      form.setFieldsValue(plan);
    } else {
      form.resetFields();
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingPlan(null);
    form.resetFields();
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingPlan) {
        await updatePlan(editingPlan.subscriptionPlanID, values);
        message.success('Plan updated successfully!');
      } else {
        await addPlan(values);
        message.success('Plan added successfully!');
      }
      closeModal();
      loadPlans();
    } catch {
      message.error('Failed to save plan. Check your input and try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePlan(id);
      message.success('Plan deleted.');
      loadPlans();
    } catch {
      message.error('Failed to delete plan.');
    }
  };

  const columns = [
    { title: 'Plan Name', dataIndex: 'planName', key: 'planName' },
    { title: 'Duration (Days)', dataIndex: 'durationDays', key: 'durationDays' },
    { title: 'Max/Day', dataIndex: 'maxPerDay', key: 'maxPerDay' },
    { title: 'Max/Month', dataIndex: 'maxPerMonth', key: 'maxPerMonth' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => openModal(record)} type="link">Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete this plan?"
            onConfirm={() => handleDelete(record.subscriptionPlanID)}
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
      <h2>Subscription Plans Management</h2>
      <Button type="primary" onClick={() => openModal()} style={{ marginBottom: 16 }}>
        Add New Plan
      </Button>
      <Table
        columns={columns}
        dataSource={plans}
        rowKey="subscriptionPlanID"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />
      <Modal
        open={modalVisible}
        title={editingPlan ? 'Edit Plan' : 'Add Plan'}
        onCancel={closeModal}
        onOk={handleFormSubmit}
        okText={editingPlan ? 'Update' : 'Add'}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Plan Name"
            name="planName"
            rules={[{ required: true, message: 'Please enter the plan name.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Duration (Days)"
            name="durationDays"
            rules={[{ required: true, message: 'Please enter duration (days).' }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item
            label="Max Per Day"
            name="maxPerDay"
            rules={[{ required: true, message: 'Please enter max per day.' }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item
            label="Max Per Month"
            name="maxPerMonth"
            rules={[{ required: true, message: 'Please enter max per month.' }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: 'Please enter price.' }]}
          >
            <Input type="number" min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default PlansAdminTab;