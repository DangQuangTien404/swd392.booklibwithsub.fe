import React, { useState } from 'react';
import { Layout, Typography, Button, Drawer, Menu } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import '../styles/Header.css';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

function Header() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]); // Track selected menu item

  const handleMenuClick = (key) => {
    if (key === 'login') {
      setLoginVisible(true);
    } else if (key === 'register') {
      setRegisterVisible(true);
    }

    // Clear the selected menu item
    setSelectedKeys([]);
  };

  const menuItems = [
    { key: 'home', label: 'Home', link: '/' },
    { key: 'features', label: 'Features', link: '/' },
    { key: 'plans', label: 'Plans', link: '/' },
    { key: 'login', label: 'Login' },
    { key: 'register', label: 'Register' },
  ];

  return (
    <>
      <AntHeader className="App-header">
        <div className="header-menu">
          <Button
            type="text"
            icon={<MenuOutlined />}
            className="menu-button"
            onClick={() => setDrawerVisible(true)}
          />
          <Title level={1} style={{ color: 'white', margin: 0 }}>BookLib</Title>
        </div>
      </AntHeader>

      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        <Menu
          mode="vertical"
          selectedKeys={selectedKeys} // Control selected menu item
          onClick={({ key }) => {
            setSelectedKeys([key]); // Temporarily set the selected key
            handleMenuClick(key); // Handle menu item click
          }}
          items={menuItems.map((item) => ({
            key: item.key,
            label: item.link ? (
              <a href={item.link} style={{ display: 'block', width: '100%' }}>
                {item.label}
              </a>
            ) : (
              <div style={{ display: 'block', width: '100%' }}>{item.label}</div>
            ),
          }))}
        />
      </Drawer>

      <LoginModal visible={loginVisible} onClose={() => setLoginVisible(false)} />
      <RegisterModal visible={registerVisible} onClose={() => setRegisterVisible(false)} />
    </>
  );
}

export default Header;