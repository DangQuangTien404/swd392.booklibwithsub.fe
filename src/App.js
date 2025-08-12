import React, { useState } from 'react';
import { Layout, Typography, Button, Card, Row, Col, Space, Drawer, Menu } from 'antd';
import { MenuOutlined, CheckCircleOutlined } from '@ant-design/icons';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

function App() {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const plans = [
    {
      title: 'Basic',
      price: '$5/month',
      description: 'Perfect for casual readers.',
      onClick: () => alert('Subscribed to Basic Plan!'),
    },
    {
      title: 'Premium',
      price: '$10/month',
      description: 'Ideal for avid readers.',
      onClick: () => alert('Subscribed to Premium Plan!'),
    },
    {
      title: 'Elite',
      price: '$20/month',
      description: 'Unlimited access to all features.',
      onClick: () => alert('Subscribed to Elite Plan!'),
    },
  ];
  const features = [
    { text: 'Access thousands of books anytime, anywhere.', icon: <CheckCircleOutlined /> },
    { text: 'Flexible subscription plans to suit your needs.', icon: <CheckCircleOutlined /> },
    { text: 'Curated recommendations just for you.', icon: <CheckCircleOutlined /> },
  ];

  const menuItems = [
    { key: 'home', label: 'Home' },
    { key: 'features', label: 'Features' },
    { key: 'plans', label: 'Plans' },
    { key: 'contact', label: 'Contact' },
  ];

  return (
    <Layout className="App">
      <Header className="App-header">
        <div className="header-menu">
          <Button
            type="text"
            icon={<MenuOutlined />}
            className="menu-button"
            onClick={() => setDrawerVisible(true)}
          />
          <Title level={1} style={{ color: 'white', margin: 0 }}>BookLib</Title>
        </div>
      </Header>

      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        <Menu
          mode="vertical"
          items={menuItems}
          onClick={(item) => alert(`Navigating to ${item.key}`)}
        />
      </Drawer>

      <Content style={{ padding: '2rem' }}>
        <section className="features">
          <Title level={2} className="features-title">Why Choose Us?</Title>
          <Space direction="vertical" size="large" className="features-list">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                {feature.icon}
                <span>{feature.text}</span>
              </div>
            ))}
          </Space>
        </section>

        <section className="subscription" style={{ marginTop: '2rem' }}>
          <Title level={2} className="subscription-title">Subscription Plans</Title>
          <Row gutter={[16, 16]} justify="center">
            {plans.map((plan) => (
              <Col key={plan.title} xs={24} sm={12} md={8}>
                <Card
                  title={plan.title}
                  bordered
                  className="subscription-card"
                >
                  <Paragraph className="subscription-price">{plan.price}</Paragraph>
                  <Paragraph className="subscription-description">{plan.description}</Paragraph>
                  <Button type="primary" onClick={plan.onClick}>
                    Subscribe
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </Content>

      <Footer style={{ textAlign: 'center', backgroundColor: '#333', color: 'white' }}>
        &copy; 2025 BookLib. All rights reserved.
      </Footer>
    </Layout>
  );
}

export default App;
