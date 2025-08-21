import React, { useState, useEffect, useContext } from 'react';
import { Layout, Typography, Button, Menu, Dropdown, Card, message, Modal } from 'antd';
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
  const [logoutModal, setLogoutModal] = useState(false);

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
      <Menu.Item key="2" onClick={() => setLogoutModal(true)}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader className="App-header">
      <Title
        level={1}
        className="App-header-title"
      >
        <Link to="/" className="header-link">
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
      <Modal
        open={logoutModal}
        title="Logged Out"
        onOk={() => {
          setUser(null);
          setLogoutModal(false);
        }}
        onCancel={() => setLogoutModal(false)}
        footer={[
          <Button key="ok" type="primary" onClick={() => {
            setUser(null);
            setLogoutModal(false);
          }}>
            OK
          </Button>,
        ]}
      >
        You have been logged out successfully.
      </Modal>
    </AntHeader>
  );
}

export default Header;