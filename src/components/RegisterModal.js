import React from 'react';
import { Modal, Form, Input, Button, Typography } from 'antd';
import '../styles/RegisterModal.css';

const { Text } = Typography;

function RegisterModal({ visible, onClose, switchToLogin }) {
  const onFinish = (values) => {
    console.log('Registration successful:', values);
    onClose();
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
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input />
        </Form.Item>
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
            Register
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
  );
}

export default RegisterModal;