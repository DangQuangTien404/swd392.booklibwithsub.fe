import React from 'react';
import Header from '../components/Header';
import { Layout, Card } from 'antd';
import '../styles/UserDashboard.css';

const { Content, Footer, Sider } = Layout;

function UserDashboard() {
  return (
    <Layout className="UserDashboard">
      <Header />
      <Layout>
        <Sider width={200} className="UserDashboard-sider sticky">
          <div className="sider-content">Welcome to your personalized space!</div>
        </Sider>
        <Content style={{ padding: '2rem' }}>
          <div className="UserDashboard-header">
            <h1 className="dashboard-title">User Dashboard</h1>
          </div>
          <section className="UserDashboard-section">
            <h2>Subscription Management</h2>
            <p>Manage your active subscriptions and explore new plans.</p>
            <Card className="dashboard-card">
              <ul>
                <li>Subscription 1: Active</li>
                <li>Subscription 2: Expired</li>
              </ul>
            </Card>
          </section>

          <section className="UserDashboard-section">
            <h2>Reading History</h2>
            <p>View your recently read books and continue where you left off.</p>
            <Card className="dashboard-card">
              <ul>
                <li>Book 1: Completed</li>
                <li>Book 2: In Progress</li>
              </ul>
            </Card>
          </section>

          <section className="UserDashboard-section">
            <h2>Account Details</h2>
            <p>Update your personal information and preferences.</p>
            <Card className="dashboard-card">
            </Card>
          </section>
        </Content>
        <Sider width={200} className="UserDashboard-sider sticky">
          <div className="sider-content">Enjoy exploring your dashboard!</div>
        </Sider>
      </Layout>
      <Footer style={{ textAlign: 'center', backgroundColor: '#333', color: 'white' }}>
        &copy; 2025 BookLib. All rights reserved.
      </Footer>
    </Layout>
  );
}

export default UserDashboard;
