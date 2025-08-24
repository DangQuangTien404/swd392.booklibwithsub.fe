import React, { useState, useEffect, useContext } from 'react';
import { Layout, Typography, Button, Menu, Dropdown, Card, message, Modal } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { logout } from '../api/auth';
import LoanBasket from './LoanBasket';
import { ShoppingBasketOutlined } from '@mui/icons-material';
import '../styles/Header.css';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

function Header() {
  const { user, setUser } = useContext(UserContext);
  const [loginVisible, setLoginVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [basketVisible, setBasketVisible] = useState(false);
  const navigate = useNavigate();

  const userName = user?.userName;

  const switchToRegister = () => {
    setLoginVisible(false);
    setRegisterVisible(true);
  };

  const switchToLogin = () => {
    setRegisterVisible(false);
    setLoginVisible(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      message.error('Failed to log out from the server.');
    } finally {
      localStorage.removeItem('user');
      setUser(null);
      message.success('You have been logged out successfully.');
      setLogoutModal(false);
      navigate('/'); 
    }
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

  const basketMenu = (
    <LoanBasket loanId={user?.loanId} />
  );

  return (
    <AntHeader className="App-header">
      <div className="App-header-title">
    <Link to="/" className="header-link">BookLib</Link>
  </div>
      {userName ? (
        <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
          <Dropdown overlay={userMenu} placement="bottomRight" overlayClassName="user-dropdown">
            <Button className="user-button">
              {userName}
            </Button>
          </Dropdown>
          <Dropdown
            overlay={basketMenu}
            visible={basketVisible}
            onVisibleChange={(visible) => setBasketVisible(visible)}
            placement="bottomRight"
          >
            <Button className="basket-button" icon={<ShoppingBasketOutlined />} />
          </Dropdown>
        </div>
      ) : (
        <Button
          className="login-button"
          onClick={() => setLoginVisible(true)}
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
        onOk={handleLogout}
        onCancel={() => setLogoutModal(false)}
        footer={[
          <Button key="ok" type="primary" onClick={handleLogout}>
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