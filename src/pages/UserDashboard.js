import React, { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import { Layout, message } from 'antd';
import '../styles/UserDashboard.css';
import Card from '../components/Card';
import { fetchSubscriptionStatus } from '../api/subscriptions';
import PayButton from '../components/PayButton';
import { UserContext } from '../context/UserContext';

const { Content, Footer } = Layout;

function UserDashboard() {
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const { refetchUser } = useContext(UserContext);

  const loadSubscriptionStatus = async () => {
    try {
      const data = await fetchSubscriptionStatus();
      setSubscriptionStatus(data);
    } catch (error) {
      console.error('Error loading subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptionStatus();
  }, []);

  const handlePaid = async () => {
    await refetchUser();
    await loadSubscriptionStatus();
    message.success('Thanh toán thành công');
  };

  const showPayButton = !loading && (!subscriptionStatus || new Date(subscriptionStatus.endDate) < new Date());

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
              {loading ? (
                <p>Loading subscription details...</p>
              ) : showPayButton ? (
                <div>
                  <p>No active subscription.</p>
                  <PayButton subscriptionId={1} amount={5} onPaid={handlePaid} />
                </div>
              ) : (
                <ul>
                  <li>Plan Name: {subscriptionStatus.planName}</li>
                  <li>Start Date: {new Date(subscriptionStatus.startDate).toLocaleDateString()}</li>
                  <li>End Date: {new Date(subscriptionStatus.endDate).toLocaleDateString()}</li>
                </ul>
              )}
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
            <Card className="dashboard-card"></Card>
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
