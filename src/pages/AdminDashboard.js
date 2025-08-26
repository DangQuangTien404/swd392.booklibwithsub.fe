import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Layout } from 'antd';
import BooksAdminTab from '../components/admin/BooksAdminTab';
import UsersAdminTab from '../components/admin/UsersAdminTab';
import PlansAdminTab from '../components/admin/PlansAdminTab';
import { UserContext } from '../context/UserContext';

const { Content } = Layout;

function AdminDashboard() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.userRole !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <Layout>
      <Content style={{ padding: '2rem' }}>
        <h1>Admin Dashboard</h1>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Books" key="1">
            <BooksAdminTab />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Subscription Plans" key="3">
            <PlansAdminTab />
          </Tabs.TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
}

export default AdminDashboard;