import React, { useContext, useState } from 'react';
import { Modal, Form, Input, Button, Typography } from 'antd';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import '../styles/LoginModal.css';
import { login } from '../api/auth';
import { UserContext } from '../context/UserContext';

const { Text } = Typography;

function LoginModal({ visible, onClose, switchToRegister }) {
  const { setUser } = useContext(UserContext);
  const [notice, setNotice] = useState({ visible: false, type: '', title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleNoticeClose = () => setNotice({ visible: false, type: '', title: '', content: '' });

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

      // Persist
      const userObj = { token: data.token, userName, userRole };
      localStorage.setItem('user', JSON.stringify(userObj));
      setUser(userObj);

      setNotice({ visible: true, type: 'success', title: 'Login Successful', content: `Welcome, ${userName || 'user'}!` });
      onClose();
      form.resetFields();
    } catch (err) {
      // Default message
      let title = 'Login Failed';
      let content = 'Login failed. Please try again.';

      // Handle axios errors specifically
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const data = err.response?.data;

        // Try to get a meaningful server message
        const serverMsg =
          (typeof data === 'string' && data) ||
          data?.message ||
          data?.error ||
          null;

        // User-caused errors (bad credentials / validation)
        if (status === 400 || status === 401) {
          content = serverMsg || 'Invalid username or password.';
          // Mark fields as errored so user sees it inline
          form.setFields([
            { name: 'username', errors: [' '] }, // space to show red state without extra text
            { name: 'password', errors: [content] },
          ]);
        }
        // Rate limit
        else if (status === 429) {
          content = serverMsg || 'Too many attempts. Please wait a moment and try again.';
        }
        // Other server responses
        else if (status) {
          content = serverMsg || `Server returned ${status}. Please try again.`;
        }
        // Network / CORS / timeout
        else if (!err.response) {
          content = 'Network error. Check your connection and try again.';
        }
      } else if (err && err.message) {
        content = err.message;
      }

      setNotice({ visible: true, type: 'error', title, content });
    } finally {
      setLoading(false);
    }
  };

  // Clear per-field error as user types again
  const onValuesChange = (changed, all) => {
    const changedField = Object.keys(changed)[0];
    if (!changedField) return;
    form.setFields([{ name: changedField, errors: [] }]);
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
          onValuesChange={onValuesChange}
          style={{ maxWidth: '400px', margin: '0 auto' }}
          initialValues={{ username: '', password: '' }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: 'Please input your username!' },
              { max: 100, message: 'Username is too long.' },
            ]}
          >
            <Input autoComplete="username" disabled={loading} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 4, message: 'Password is too short.' },
            ]}
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
