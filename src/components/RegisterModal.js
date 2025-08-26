import React, { useState } from 'react';
import { Modal, Form, Input, Button, Typography } from 'antd';
import axios from 'axios';
import '../styles/RegisterModal.css';
import { register } from '../api/auth';

const { Text } = Typography;

function RegisterModal({ visible, onClose, switchToLogin }) {
  const [notice, setNotice] = useState({ visible: false, title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const closeNotice = () => setNotice({ visible: false, title: '', content: '' });

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = { ...values, role: 'user' };
      delete payload.confirmPassword;

      await register(payload);

      setNotice({
        visible: true,
        title: 'Registration Successful',
        content: 'Your account has been created. Please log in.',
      });

      // Auto-close & switch to login
      onClose?.();
      switchToLogin?.();
      form.resetFields();
    } catch (err) {
      let title = 'Registration Failed';
      let content = 'Registration failed. Please check your details and try again.';

      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const data = err.response?.data;
        const serverMsg =
          (typeof data === 'string' && data) ||
          data?.message ||
          data?.error ||
          null;

        // Common user-caused cases
        if (status === 400) {
          content = serverMsg || 'Some fields are invalid. Please fix them and try again.';
          // If BE returns field-level validation, map it here.
          // Example shape: { errors: { username: 'taken' } }
          const fieldErrors = data?.errors || {};
          const fields = Object.keys(fieldErrors).map((name) => ({
            name,
            errors: [String(fieldErrors[name])],
          }));
          if (fields.length) form.setFields(fields);
        } else if (status === 409) {
          // Conflict: username or email already exists
          content = serverMsg || 'Username or email already exists.';
          // Try to highlight likely fields
          form.setFields([
            { name: 'username', errors: [' '] },
            { name: 'email', errors: [content] },
          ]);
        } else if (status === 429) {
          content = serverMsg || 'Too many attempts. Please wait a moment and try again.';
        } else if (status) {
          content = serverMsg || `Server returned ${status}. Please try again.`;
        } else if (!err.response) {
          content = 'Network error. Please check your connection and try again.';
        }
      } else if (err?.message) {
        content = err.message;
      }

      setNotice({ visible: true, title, content });
    } finally {
      setLoading(false);
    }
  };

  // Clear field error as user edits
  const onValuesChange = (changed) => {
    const name = Object.keys(changed)[0];
    if (name) form.setFields([{ name, errors: [] }]);
  };

  return (
    <>
      <Modal
        title={<div className="modal-title">Register</div>}
        open={visible}            // if you're on AntD v4, change to `visible={visible}`
        onCancel={onClose}
        footer={null}
        destroyOnClose
      >
        <div className="modal-top-line"></div>
        <Form
          form={form}
          name="register"
          layout="vertical"
          onFinish={onFinish}
          onValuesChange={onValuesChange}
          style={{ maxWidth: 400, margin: '0 auto' }}
          initialValues={{ username: '', email: '', phoneNumber: '' }}
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
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please input a valid email!' },
            ]}
          >
            <Input autoComplete="email" disabled={loading} />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: 'Please input your phone number!' },
              { max: 20, message: 'Phone number is too long.' },
            ]}
          >
            <Input autoComplete="tel" disabled={loading} />
          </Form.Item>

          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input disabled={loading} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters.' },
            ]}
            hasFeedback
          >
            <Input.Password autoComplete="new-password" disabled={loading} />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve();
                  return Promise.reject(new Error('Passwords do not match.'));
                },
              }),
            ]}
          >
            <Input.Password autoComplete="new-password" disabled={loading} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {loading ? 'Registering…' : 'Register'}
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
        open={notice.visible}
        title={notice.title}
        onOk={closeNotice}
        onCancel={closeNotice}
        footer={[
          <Button key="ok" type="primary" onClick={closeNotice}>
            OK
          </Button>,
        ]}
      >
        {notice.content}
      </Modal>
    </>
  );
}

export default RegisterModal;