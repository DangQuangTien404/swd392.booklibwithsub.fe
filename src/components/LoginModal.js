import React from 'react';
import { Modal, Form, Input, Button, Typography } from 'antd';
import '../styles/LoginModal.css';

const { Text } = Typography;

function LoginModal({ visible, onClose, switchToRegister }) {
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
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Text>Don't have an account yet? </Text>
        <Button type="link" onClick={switchToRegister} style={{ padding: 0 }}>
          Register here
        </Button>
      </div>
    </Modal>
  );
}

export default LoginModal;