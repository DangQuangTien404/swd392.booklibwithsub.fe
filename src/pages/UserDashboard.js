import React from 'react';
import Header from '../components/Header';
import { Layout } from 'antd';
import '../styles/UserDashboard.css';
import Card from '../components/Card';

const { Content, Footer } = Layout;

function UserDashboard() {
  return (
    <Layout className="UserDashboard">
      <Header />
      <Layout>
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
      </Layout>
      <Footer style={{ textAlign: 'center', backgroundColor: '#333', color: 'white' }}>
        &copy; 2025 BookLib. All rights reserved.
      </Footer>
    </Layout>
  );
}

export default UserDashboard;
