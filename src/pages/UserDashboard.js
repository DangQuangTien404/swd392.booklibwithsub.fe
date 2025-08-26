import React, { useEffect, useState } from 'react';
import { Layout, Form, Input, Button, message, Spin, Modal } from 'antd';
import Header from '../components/Header';
import Card from '../components/Card';
import { fetchSubscriptionStatus } from '../api/subscriptions';
import { updateCurrentUserProfile, getCurrentUserProfile } from '../api/users';
import { getLoanHistory, getActiveLoans, returnLoanedBook } from '../api/loans';
import '../styles/UserDashboard.css';

const { Content } = Layout;

function UserDashboard() {
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loanHistory, setLoanHistory] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [activeLoansLoading, setActiveLoansLoading] = useState(false);
  const [returnModal, setReturnModal] = useState({ visible: false, loanItemId: null });
  const [profileForm] = Form.useForm();

  useEffect(() => {
    const loadSubscriptionStatus = async () => {
      try {
        const data = await fetchSubscriptionStatus();
        setSubscriptionStatus(data);
      } catch (error) {
        setSubscriptionStatus(null);
      }
    };
    const loadLoanHistory = async () => {
      try {
        const history = await getLoanHistory();
        setLoanHistory(history);
      } catch (error) {
        setLoanHistory([]);
      }
    };
    const loadActiveLoans = async () => {
      setActiveLoansLoading(true);
      try {
        const activeLoans = await getActiveLoans();
        setActiveLoans(activeLoans);
      } catch (error) {
        setActiveLoans([]);
      }
      setActiveLoansLoading(false);
    };
    const loadProfile = async () => {
      setProfileLoading(true);
      try {
        const profileData = await getCurrentUserProfile();
        setProfile(profileData);
        profileForm.setFieldsValue(profileData);
      } catch (error) {
        setProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };

    loadSubscriptionStatus();
    loadLoanHistory();
    loadActiveLoans();
    loadProfile();
  }, []);

  // Show confirmation modal before returning book
  const handleReturnBook = (loanItemId) => {
    setReturnModal({ visible: true, loanItemId });
  };

  // When user confirms on modal
  const confirmReturnBook = async () => {
    setActiveLoansLoading(true);
    try {
      await returnLoanedBook(returnModal.loanItemId);
      message.success('Book returned successfully!');
      // Refresh loan data
      const [history, activeLoans] = await Promise.all([
        getLoanHistory(),
        getActiveLoans(),
      ]);
      setLoanHistory(history);
      setActiveLoans(activeLoans);
    } catch (error) {
      message.error('Failed to return book. Please try again.');
    }
    setActiveLoansLoading(false);
    setReturnModal({ visible: false, loanItemId: null });
  };

  // Cancel modal
  const cancelReturnBook = () => {
    setReturnModal({ visible: false, loanItemId: null });
  };

  const handleProfileEdit = () => {
    setEditingProfile(true);
    profileForm.setFieldsValue(profile);
  };

  const handleProfileCancel = () => {
    setEditingProfile(false);
    profileForm.setFieldsValue(profile);
  };

  const handleProfileSave = async (values) => {
    try {
      await updateCurrentUserProfile(values);
      message.success('Profile updated!');
      setEditingProfile(false);
      setProfile(values);
    } catch (error) {
      message.error('Failed to update profile.');
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
            <div className="UserDashboard-card">
              {subscriptionStatus ? (
                <ul>
                  <li><strong>Plan Name:</strong> {subscriptionStatus.planName}</li>
                  <li><strong>Start Date:</strong> {subscriptionStatus.startDate ? new Date(subscriptionStatus.startDate).toLocaleDateString() : '-'}</li>
                  <li><strong>End Date:</strong> {subscriptionStatus.endDate ? new Date(subscriptionStatus.endDate).toLocaleDateString() : '-'}</li>
                </ul>
              ) : (
                <Spin tip="Loading subscription details..." />
              )}
            </div>
          </section>

          <section className="UserDashboard-section">
            <h2>Active Loans</h2>
            <p>Manage your currently borrowed books.</p>
            <div className="UserDashboard-card">
              {activeLoansLoading ? (
                <Spin tip="Loading active loans..." />
              ) : activeLoans && activeLoans.length > 0 ? (
                <ul>
                  {activeLoans.map((loan) =>
                    loan.items.map((item) => (
                      <li key={item.loanItemID} style={{ marginBottom: 10 }}>
                        <strong>Book ID: {item.bookID}</strong>
                        <span style={{ marginLeft: 12, color: '#888' }}>
                          {item.dueDate
                            ? `Due: ${new Date(item.dueDate).toLocaleDateString()}`
                            : '- No due date'}
                        </span>
                        <Button
                          type="link"
                          style={{ marginLeft: 20, padding: 0 }}
                          onClick={() => handleReturnBook(item.loanItemID)}
                          danger
                        >
                          Return Book
                        </Button>
                      </li>
                    ))
                  )}
                </ul>
              ) : (
                <div style={{ color: '#888' }}>No active loans.</div>
              )}
            </div>

            <Modal
              open={returnModal.visible}
              title="Return Book Confirmation"
              onOk={confirmReturnBook}
              onCancel={cancelReturnBook}
              okText="Return"
              cancelText="Cancel"
            >
              Are you sure you want to return this book?
            </Modal>
          </section>

          <section className="UserDashboard-section">
            <h2>Account Details</h2>
            <p>Update your personal information and preferences.</p>
            <div className="UserDashboard-card">
              {profileLoading ? (
                <Spin tip="Loading profile..." />
              ) : (
                <Form
                  form={profileForm}
                  layout="vertical"
                  initialValues={profile}
                  onFinish={handleProfileSave}
                  disabled={!editingProfile}
                  style={{ width: '100%', maxWidth: 400 }}
                >
                  <Form.Item label="Full Name" name="fullName">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Email" name="email">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item label="Phone Number" name="phone">
                    <Input />
                  </Form.Item>
                  <Form.Item>
                    {editingProfile ? (
                      <>
                        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                          Save
                        </Button>
                        <Button onClick={handleProfileCancel}>Cancel</Button>
                      </>
                    ) : (
                      <Button onClick={handleProfileEdit}>Edit Profile</Button>
                    )}
                  </Form.Item>
                </Form>
              )}
            </div>
          </section>
        </Content>
      </Layout>
    </Layout>
  );
}

export default UserDashboard;