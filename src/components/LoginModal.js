import React, { useContext, useState } from 'react';
import { Modal, Form, Input, Button, Typography } from 'antd';
import { jwtDecode } from 'jwt-decode';
import '../styles/LoginModal.css';
import { login } from '../api/auth';
import { UserContext } from '../context/UserContext';

const { Text } = Typography;

function LoginModal({ visible, onClose, switchToRegister }) {
  const { setUser } = useContext(UserContext);
  const [notice, setNotice] = useState({ visible: false, title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleNoticeClose = () => setNotice({ visible: false, title: '', content: '' });

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = await login(values);
      const decodedToken = jwtDecode(data.token);
      const userName =
        decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
        decodedToken['unique_name'] ||
        decodedToken['name'];
      const userRole =
        decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        decodedToken['role'];

      const userObj = { token: data.token, userName, userRole };
      localStorage.setItem('user', JSON.stringify(userObj));
      setUser(userObj);

      setNotice({
        visible: true,
        title: 'Login Successful',
        content: `Welcome, ${userName || 'user'}!`
      });
      onClose();
      form.resetFields();
    } catch (err) {
      setNotice({
        visible: true,
        title: 'Login Failed',
        content: 'Invalid username or password.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        title={<div className="modal-title">Login</div>}
        open={visible}
        onCancel={onClose}
        footer={null}
        destroyOnClose
      >
        <div className="modal-top-line"></div>
        <Form
          form={form}
          name="login"
          layout="vertical"
          onFinish={onFinish}
          style={{ maxWidth: '400px', margin: '0 auto' }}
          initialValues={{ username: '', password: '' }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input autoComplete="username" disabled={loading} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password autoComplete="current-password" disabled={loading} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {loading ? 'Logging in…' : 'Login'}
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
        open={notice.visible}
        title={notice.title}
        onOk={handleNoticeClose}
        onCancel={handleNoticeClose}
        footer={[
          <Button key="ok" type="primary" onClick={handleNoticeClose}>
            OK
          </Button>,
        ]}
      >
        {notice.content}
      </Modal>
    </>
  );
}

export default LoginModal;
