import React from 'react';
import { Typography } from 'antd';
import '../styles/HeroSection.css';

const { Title, Paragraph } = Typography;

function HeroSection() {
  return (
    <section
      className="hero-section"
      style={{ backgroundImage: `url(${require('../library.jpg')})` }}
    >
      <div className="hero-content">
        <Title level={1} className="hero-title">Welcome to BookLib</Title>
        <Paragraph className="hero-subtitle">
          Your gateway to thousands of books anytime, anywhere.
        </Paragraph>
        <button className="hero-button">Get Started</button>
      </div>
    </section>
  );
}

export default HeroSection;