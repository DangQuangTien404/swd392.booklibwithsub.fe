import React, { useEffect, useState, useContext } from 'react';
import { Layout, Button, Spin, Modal, Form, Input, message } from 'antd';
import Header from '../components/Header';
import { fetchSubscriptionStatus } from '../api/subscriptions';
import { updateCurrentUserProfile, getCurrentUserProfile } from '../api/users';
import { getLoanHistory, getActiveLoans, returnLoanedBook } from '../api/loans';
import { getBookById } from '../api/books';
import { UserContext } from '../context/UserContext';
import '../styles/UserDashboard.css';

const { Content } = Layout;

function UserDashboard() {
  const { user, setUser } = useContext(UserContext);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loanHistory, setLoanHistory] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [activeLoansLoading, setActiveLoansLoading] = useState(false);
  const [returnModal, setReturnModal] = useState({ visible: false, loanItemId: null });
  const [bookNames, setBookNames] = useState({});
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileModalEditing, setProfileModalEditing] = useState(false);
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
        const bookIDs = [];
        activeLoans.forEach(loan =>
          loan.items.forEach(item => {
            if (!bookIDs.includes(item.bookID)) {
              bookIDs.push(item.bookID);
            }
          })
        );
        const bookNameMap = {};
        await Promise.all(
          bookIDs.map(async bookID => {
            try {
              const book = await getBookById(bookID);
              bookNameMap[bookID] = book.title;
            } catch {
              bookNameMap[bookID] = 'Unknown Book';
            }
          })
        );
        setBookNames(bookNameMap);
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

  const handleReturnBook = (loanItemId) => {
    setReturnModal({ visible: true, loanItemId });
  };

  const confirmReturnBook = async () => {
    setActiveLoansLoading(true);
    try {
      await returnLoanedBook(returnModal.loanItemId);
      message.success('Book returned successfully!');
      const [history, activeLoans] = await Promise.all([
        getLoanHistory(),
        getActiveLoans(),
      ]);
      setLoanHistory(history);
      const bookIDs = [];
      activeLoans.forEach(loan =>
        loan.items.forEach(item => {
          if (!bookIDs.includes(item.bookID)) {
            bookIDs.push(item.bookID);
          }
        })
      );
      const bookNameMap = {};
      await Promise.all(
        bookIDs.map(async bookID => {
          try {
            const book = await getBookById(bookID);
            bookNameMap[bookID] = book.title;
          } catch {
            bookNameMap[bookID] = 'Unknown Book';
          }
        })
      );
      setBookNames(bookNameMap);
      setActiveLoans(activeLoans);
    } catch (error) {
      message.error('Failed to return book. Please try again.');
    }
    setActiveLoansLoading(false);
    setReturnModal({ visible: false, loanItemId: null });
  };

  const cancelReturnBook = () => {
    setReturnModal({ visible: false, loanItemId: null });
  };

  const openProfileModal = () => {
    setProfileModalOpen(true);
    setProfileModalEditing(true);
    profileForm.setFieldsValue(profile);
  };

  const closeProfileModal = () => {
    setProfileModalOpen(false);
    setProfileModalEditing(false);
    profileForm.resetFields();
    profileForm.setFieldsValue(profile);
  };

  const handleProfileModalSave = async () => {
    try {
      const values = await profileForm.validateFields();
      await updateCurrentUserProfile(values);
      const newProfile = await getCurrentUserProfile();
      setProfile(newProfile);
      message.success('Profile updated!');
      setUser && setUser({ ...user, ...newProfile });
      setProfileModalEditing(false);
      closeProfileModal();
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
                      <li key={item.loanItemId || item.loanItemID} style={{ marginBottom: 10 }}>
                        <strong>
                          {bookNames[item.bookID] || `Book ID: ${item.bookID}`}
                        </strong>
                        <span style={{ marginLeft: 15, color: '#888' }}>
                          {item.dueDate
                            ? `Due: ${new Date(item.dueDate).toLocaleDateString()}`
                            : '- No due date'}
                        </span>
                        <Button
                          type="link"
                          style={{ marginLeft: 20, padding: 0 }}
                          onClick={() => handleReturnBook(item.loanItemId || item.loanItemID)}
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
                <>
                  <table style={{ width: '100%', marginBottom: 16 }}>
                    <tbody>
                      <tr>
                        <td><b>Full Name</b></td>
                        <td>{profile?.fullName}</td>
                      </tr>
                      <tr>
                        <td><b>Email</b></td>
                        <td>{profile?.email}</td>
                      </tr>
                      <tr>
                        <td><b>Phone Number</b></td>
                        <td>{profile?.phone}</td>
                      </tr>
                    </tbody>
                  </table>
                  <Button type="primary" onClick={openProfileModal}>Edit Profile</Button>
                </>
              )}
              <Modal
                open={profileModalOpen}
                title="Profile"
                onCancel={closeProfileModal}
                footer={
                  <>
                    <Button type="primary" onClick={handleProfileModalSave} style={{ marginRight: 8 }}>
                      Save
                    </Button>
                    <Button onClick={closeProfileModal}>Cancel</Button>
                  </>
                }
              >
                <Form form={profileForm} layout="vertical">
                  <Form.Item label="Full Name" name="fullName" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Email" name="email">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item label="Phone Number" name="phone">
                    <Input />
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </section>
        </Content>
      </Layout>
    </Layout>
  );
}

export default UserDashboard;