import React, { useContext, useState } from 'react';
import { Modal, Form, Input, Button, Typography } from 'antd';
import { jwtDecode } from 'jwt-decode';
import '../styles/LoginModal.css';
import appsettings from '../appsettings';
import { login } from '../api/auth';
import { UserContext } from '../context/UserContext';

const { Text } = Typography;

function LoginModal({ visible, onClose, switchToRegister }) {
  const { setUser } = useContext(UserContext);
  const [modal, setModal] = useState({ visible: false, type: '', title: '', content: '' });

  const handleModalClose = () => setModal({ visible: false, type: '', title: '', content: '' });

  const onFinish = async (values) => {
    try {
      const data = await login(values);
      const decodedToken = jwtDecode(data.token);
      const userName = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      setUser({ token: data.token, userName, userRole });
      setModal({ visible: true, type: 'success', title: 'Login Successful', content: `Welcome, ${userName}!` });
      onClose();
    } catch (error) {
      setModal({ visible: true, type: 'error', title: 'Login Failed', content: error.message || 'Login failed.' });
    }
  };

  return (
    <>
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
      <Modal
        open={modal.visible}
        title={modal.title}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        footer={[
          <Button key="ok" type="primary" onClick={handleModalClose}>
            OK
          </Button>,
        ]}
      >
        {modal.content}
      </Modal>
    </>
  );
}

export default LoginModal;