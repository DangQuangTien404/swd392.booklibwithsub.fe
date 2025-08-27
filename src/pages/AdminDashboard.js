import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Layout, Button } from 'antd';
import BooksAdminTab from '../components/admin/BooksAdminTab';
import UsersAdminTab from '../components/admin/UsersAdminTab';
import PlansAdminTab from '../components/admin/PlansAdminTab';
import LoansAdminTab from '../components/admin/LoansAdminTab';
import { UserContext } from '../context/UserContext';
import { logout } from '../api/auth';

const { Content } = Layout;

function AdminDashboard() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.userRole !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {}
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <Layout>
      <Content style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Admin Dashboard</h1>
          <Button onClick={handleLogout} danger type="primary">
            Log out
          </Button>
        </div>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Books" key="1">
            <BooksAdminTab />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Subscription Plans" key="3">
            <PlansAdminTab />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Users" key="2">
            <UsersAdminTab />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Loans" key="4">
            <LoansAdminTab />
          </Tabs.TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
}

export default AdminDashboard;