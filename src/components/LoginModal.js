import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import '../styles/LoginModal.css';

function LoginModal({ visible, onClose }) {
  const onFinish = (values) => {
    console.log('Login successful:', values);
    onClose();
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
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input type="email" />
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