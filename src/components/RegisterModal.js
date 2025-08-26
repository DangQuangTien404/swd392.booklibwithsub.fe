import React, { useState } from 'react';
import { Modal, Form, Input, Button, Typography } from 'antd';
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

      onClose?.();
      switchToLogin?.();
      form.resetFields();
    } catch (err) {
      setNotice({
        visible: true,
        title: 'Registration Failed',
        content: 'Registration failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        title={<div className="modal-title">Register</div>}
        open={visible}
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
          style={{ maxWidth: 400, margin: '0 auto' }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input disabled={loading} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please input a valid email!' },
            ]}
          >
            <Input disabled={loading} />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input disabled={loading} />
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
            rules={[{ required: true, message: 'Please input your password!' }]}
            hasFeedback
          >
            <Input.Password disabled={loading} />
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
            <Input.Password disabled={loading} />
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
