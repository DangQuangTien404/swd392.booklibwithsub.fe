import React, { useState, useEffect, useContext } from 'react';
import { Layout, Typography, Button, Menu, Dropdown, Card } from 'antd';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import '../styles/Header.css';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

function Header() {
  const { user, setUser } = useContext(UserContext);
  const [loginVisible, setLoginVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);

  const userName = user?.userName;

  const switchToRegister = () => {
    setLoginVisible(false);
    setRegisterVisible(true);
  };

  const switchToLogin = () => {
    setRegisterVisible(false);
    setLoginVisible(true);
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/dashboard">Profile</Link>
      </Menu.Item>
      <Menu.Item key="2" onClick={() => {
        setUser(null);
      }}>
        Logout
      </Menu.Item>
    </Menu>
  );

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
          margin: 0,
          fontFamily: 'Pacifico, cursive',
          fontSize: '2.5rem',
        }}
      >
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          BookLib
        </Link>
      </Title>
      {userName ? (
        <Dropdown overlay={userMenu} placement="bottomRight" overlayClassName="user-dropdown">
          <Button className="user-button">
            {userName}
          </Button>
        </Dropdown>
      ) : (
        <Button
          type="link"
          onClick={() => setLoginVisible(true)}
          className="user-button"
        >
          Login
        </Button>
      )}

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