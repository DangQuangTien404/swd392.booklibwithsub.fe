import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Layout } from 'antd';
import '../styles/UserDashboard.css';
import Card from '../components/Card';
import { fetchSubscriptionStatus } from '../api/subscriptions';
import { updateCurrentUserProfile } from '../api/users';
import { getLoanHistory, getActiveLoans, returnLoanedBook } from '../api/loans';
import { Form, Input, Button, message } from 'antd';

const { Content, Footer } = Layout;

function UserDashboard() {
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loanHistory, setLoanHistory] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);

  const loadLoanHistory = async () => {
    try {
      const history = await getLoanHistory();
      setLoanHistory(history);
    } catch (error) {
      console.error('Error loading loan history:', error);
    }
  };

  const loadActiveLoans = async () => {
    try {
      const activeLoans = await getActiveLoans();
      setActiveLoans(activeLoans);
    } catch (error) {
      console.error('Error loading active loans:', error);
    }
  };

  useEffect(() => {
    const loadSubscriptionStatus = async () => {
      try {
        const data = await fetchSubscriptionStatus();
        setSubscriptionStatus(data);
      } catch (error) {
        console.error('Error loading subscription status:', error);
      }
    };

    loadSubscriptionStatus();
    loadLoanHistory();
    loadActiveLoans();
  }, []);

  const handleUpdateProfile = async (values) => {
    try {
      await updateCurrentUserProfile(values);
      message.success('Profile updated successfully!');
    } catch (error) {
      message.error('Failed to update profile. Please try again.');
    }
  };

  const handleReturnBook = async (loanItemId) => {
    try {
      await returnLoanedBook(loanItemId);
      message.success('Book returned successfully!');
      loadLoanHistory();
      loadActiveLoans();
    } catch (error) {
      message.error('Failed to return book. Please try again.');
    }
  };

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
              {subscriptionStatus ? (
                <ul>
                  <li>Plan Name: {subscriptionStatus.planName}</li>
                  <li>Start Date: {new Date(subscriptionStatus.startDate).toLocaleDateString()}</li>
                  <li>End Date: {new Date(subscriptionStatus.endDate).toLocaleDateString()}</li>
                  {/* <li>Status: {subscriptionStatus.status}</li>
                  <li>Max Borrow Per Day: {subscriptionStatus.maxPerDay}</li>
                  <li>Max Borrow Per Month: {subscriptionStatus.maxPerMonth}</li>
                  <li>Borrowed Today: {subscriptionStatus.borrowedToday}</li>
                  <li>Borrowed This Month: {subscriptionStatus.borrowedThisMonth}</li>
                  <li>Remaining Today: {subscriptionStatus.remainingToday}</li>
                  <li>Remaining This Month: {subscriptionStatus.remainingThisMonth}</li> 
                  DO NOT TOUCH*/}
                </ul>
              ) : (
                <p>Loading subscription details...</p>
              )}
            </Card>
          </section>
          <section className="UserDashboard-section">
            <h2>Active Loans</h2>
            <p>Manage your currently borrowed books.</p>
            <Card className="dashboard-card">
              {activeLoans.length > 0 ? (
                <ul>
                  {activeLoans.map((loan) => (
                    <li key={loan.loanItemId}>
                      {loan.bookTitle} - {loan.dueDate ? `Due: ${new Date(loan.dueDate).toLocaleDateString()}` : 'No due date'}
                      <Button type="link" onClick={() => handleReturnBook(loan.loanItemId)}>Return Book</Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No active loans.</p>
              )}
            </Card>
          </section>

          <section className="UserDashboard-section">
            <h2>Account Details</h2>
            <p>Update your personal information and preferences.</p>
            <Card className="dashboard-card">
              <Form layout="vertical" onFinish={handleUpdateProfile}>
                <Form.Item label="Full Name" name="fullName" rules={[{ required: true, message: 'Please enter your full name!' }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Phone Number" name="phoneNumber">
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">Update Profile</Button>
                </Form.Item>
              </Form>
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
