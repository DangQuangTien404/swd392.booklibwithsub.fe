import React from 'react';
import { Typography, Space } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Features = () => {
  const features = [
    { text: 'Access thousands of books anytime, anywhere.', icon: <CheckCircleOutlined /> },
    { text: 'Flexible subscription plans to suit your needs.', icon: <CheckCircleOutlined /> },
    { text: 'Curated recommendations just for you.', icon: <CheckCircleOutlined /> },
  ];

  return (
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
  );
};

export default Features;
