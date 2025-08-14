import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { register } from '../api/auth';
import '../styles/RegisterModal.css';

function RegisterModal({ visible, onClose }) {
  const onFinish = async (values) => {
    try {
      const result = await register(values);
      // You may want to show a success message or auto-login
      console.log('Registration successful:', result);
      onClose();
    } catch (error) {
      // Handle error (show message to user)
      console.error('Registration failed:', error);
    }
  };

  return (
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
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default RegisterModal;