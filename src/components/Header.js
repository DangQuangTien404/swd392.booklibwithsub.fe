import React, { useState, useContext } from 'react';
import { Layout, Button, Menu, Dropdown, Modal, message } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { logout } from '../api/auth';
import LoanBasket from './LoanBasket';
import { ShoppingBasketOutlined, AccountCircle } from '@mui/icons-material';
import '../styles/Header.css';

const { Header: AntHeader } = Layout;

function Header() {
  const { user, setUser, basket } = useContext(UserContext);
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
    <Link to="/" className="header-link logo-link">BookLib</Link>
      </div>
      <nav className="header-nav">
        <Link to="/all-books" className="header-link nav-link all-books-link">
          <BookOutlined style={{ marginRight: 6, fontSize: 16, verticalAlign: '-3px' }} />
          All Books
        </Link>
      </nav>
      <div className="header-actions">
        {userName ? (
          <>
            <Dropdown overlay={userMenu} placement="bottomRight" overlayClassName="user-dropdown">
              <Button className="user-button">
                <span className="user-avatar">
                  <AccountCircle style={{ fontSize: 24 }} />
                </span>
                {userName}
              </Button>
            </Dropdown>
            <Dropdown
              overlay={basketMenu}
              visible={basketVisible}
              onVisibleChange={setBasketVisible}
              placement="bottomRight"
            >
              <span className="basket-btn-wrapper">
                <Button className="basket-button" icon={<ShoppingBasketOutlined style={{ fontSize: 24 }} />} />
                {basket.length > 0 && (
                  <span className="basket-badge">{basket.length}</span>
                )}
              </span>
            </Dropdown>
          </>
        ) : (
          <Button
            className="login-button"
            onClick={() => setLoginVisible(true)}
          >
            Login
          </Button>
        )}
      </div>
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
        You have been logged out.
      </Modal>
    </AntHeader>
  );
}

export default Header;