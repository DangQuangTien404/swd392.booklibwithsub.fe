import React from 'react';
import { Modal, Form, Input, Button, Typography, message } from 'antd';
import { jwtDecode } from 'jwt-decode';
import '../styles/LoginModal.css';
import appsettings from '../appsettings';
import { login } from '../api/auth';

const { Text } = Typography;

function LoginModal({ visible, onClose, switchToRegister }) {
  const onFinish = async (values) => {
    try {
      const data = await login(values);
      const decodedToken = jwtDecode(data.token);

      console.log('Decoded Token:', decodedToken);
      const userName = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const sessionExpiry = new Date(decodedToken.exp * 1000);

      console.log('User Name:', userName);
      console.log('User Role:', userRole);
      console.log('Session Expiry:', sessionExpiry);

      message.success(`Welcome, ${userName}!`);
      onClose();
    } catch (error) {
      message.error(error.message);
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