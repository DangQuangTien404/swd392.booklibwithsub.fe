import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { login } from '../api/auth';
import '../styles/LoginModal.css';

function LoginModal({ visible, onClose }) {
  const onFinish = async (values) => {
    try {
      const result = await login(values);
      // You may want to store the token in localStorage or context here
      console.log('Login successful:', result);
      onClose();
    } catch (error) {
      // Handle error (show message to user)
      console.error('Login failed:', error);
    }
  };

  return (
    <Modal
      title={<div className="modal-title">Login</div>}
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <div className="modal-top-line"></div>
      <Form
        name="login"
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
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default LoginModal;