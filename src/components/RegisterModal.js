import React, { useState } from 'react';
import { Modal, Form, Input, Button, Typography } from 'antd';
import '../styles/RegisterModal.css';
import appsettings from '../appsettings';
import { register } from '../api/auth';

const { Text } = Typography;

function RegisterModal({ visible, onClose, switchToLogin }) {
  const [modal, setModal] = useState({ visible: false, type: '', title: '', content: '' });

  const handleModalClose = () => setModal({ visible: false, type: '', title: '', content: '' });

  const onFinish = async (values) => {
    try {
      const updatedValues = { ...values, role: 'user' };
      await register(updatedValues);
      setModal({
        visible: true,
        type: 'success',
        title: 'Registration Successful',
        content: 'Registration successful! Please log in.',
        onOk: () => {
          onClose();
          if (typeof switchToLogin === 'function') {
            switchToLogin();
          }
        }
      });
    } catch (error) {
      setModal({
        visible: true,
        type: 'error',
        title: 'Registration Failed',
        content: error.message || 'Registration failed.',
      });
    }
  };

  const handleOk = () => {
    if (modal.type === 'success' && typeof switchToLogin === 'function') {
      onClose();
      switchToLogin();
    }
    handleModalClose();
  };

  return (
    <>
      <Modal
        title={<div className="modal-title">Register</div>}
        visible={visible}
        onCancel={onClose}
        footer={null}
      >
        <div className="modal-top-line"></div>
        <Form
          name="register"
          layout="vertical"
          onFinish={onFinish}
          style={{ maxWidth: '400px', margin: '0 auto' }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input type="username" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Text>Already have an account? </Text>
          <Button type="link" onClick={switchToLogin} style={{ padding: 0 }}>
            Login here
          </Button>
        </div>
      </Modal>
      <Modal
        open={modal.visible}
        title={modal.title}
        onOk={handleOk}
        onCancel={handleModalClose}
        footer={[
          <Button key="ok" type="primary" onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        {modal.content}
      </Modal>
    </>
  );
}

export default RegisterModal;