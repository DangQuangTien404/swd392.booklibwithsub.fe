import React from 'react';
import { Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import '../styles/Features.css';

const { Title, Paragraph } = Typography;

function Features() {
  return (
    <section className="why-choose-us">
      <Title level={2} className="section-title">Why Choose Us?</Title>
      <div className="features">
        <div className="feature">
          <CheckCircleOutlined className="feature-icon" />
          <Paragraph>Access thousands of books anytime, anywhere.</Paragraph>
        </div>
        <div className="feature">
          <CheckCircleOutlined className="feature-icon" />
          <Paragraph>Flexible subscription plans to suit your needs.</Paragraph>
        </div>
        <div className="feature">
          <CheckCircleOutlined className="feature-icon" />
          <Paragraph>Curated recommendations just for you.</Paragraph>
        </div>
      </div>
    </section>
  );
}

export default Features;