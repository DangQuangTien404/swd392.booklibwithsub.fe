import React, { useState } from 'react';
import { Layout, Typography, Button } from 'antd';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import '../styles/Header.css';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

function Header() {
  const [loginVisible, setLoginVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);

  const switchToRegister = () => {
    setLoginVisible(false);
    setRegisterVisible(true);
  };

  const switchToLogin = () => {
    setRegisterVisible(false);
    setLoginVisible(true);
  };

  return (
    <AntHeader
      className="App-header"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        backgroundColor: '#4CAF50',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Title
        level={1}
        style={{
          color: 'white',
          margin: 0,
          fontFamily: 'Pacifico, cursive',
          fontSize: '2.5rem',
        }}
      >
        BookLib
      </Title>
      <Button
        type="link"
        onClick={() => setLoginVisible(true)}
        style={{
          color: 'white',
          fontSize: '1rem',
          fontWeight: 'bold',
          fontFamily: 'Pacifico, cursive',
          backgroundColor: 'transparent',
          border: '1px solid white',
          borderRadius: '4px',
          padding: '0.5rem 1rem',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#45a049';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
        }}
      >
        Login
      </Button>

      <LoginModal
        visible={loginVisible}
        onClose={() => setLoginVisible(false)}
        switchToRegister={switchToRegister}
      />
      <RegisterModal
        visible={registerVisible}
        onClose={() => setRegisterVisible(false)}
        switchToLogin={switchToLogin}
      />
    </AntHeader>
  );
}

export default Header;