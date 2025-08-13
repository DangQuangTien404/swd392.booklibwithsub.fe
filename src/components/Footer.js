import React from 'react';
import { Layout } from 'antd';
import '../styles/Footer.css';

const { Footer: AntFooter } = Layout;

function Footer() {
  return (
    <AntFooter style={{ textAlign: 'center', backgroundColor: '#333', color: 'white' }}>
      &copy; 2025 BookLib. All rights reserved.
    </AntFooter>
  );
}

export default Footer;