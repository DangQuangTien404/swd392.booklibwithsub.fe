import React, { useContext, useState } from 'react';
import { Layout, Typography, Button, Row, Col, Modal } from 'antd';
import { Link } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import Features from '../components/Features';
import useHomePageData from '../hooks/useHomePageData';
import useSubscriptionHandler from '../hooks/useSubscriptionHandler';
import { UserContext } from '../context/UserContext';

import '../styles/HomePage.css';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

function HomePage() {
  const { user } = useContext(UserContext);
  const { books, plans } = useHomePageData();
  const {
    subscriptionPrompt,
    modalInfo,
    handleSubscription,
    handleSubscriptionConfirm,
    handleSubscriptionCancel,
    setModalInfo,
  } = useSubscriptionHandler();

  const [borrowModal, setBorrowModal] = useState({ visible: false, book: null });
  const [loginPrompt, setLoginPrompt] = useState({ visible: false });

  const handleBorrowClick = (book) => {
    if (!user) {
      setLoginPrompt({ visible: true });
      return;
    }
    setBorrowModal({ visible: true, book });
  };

  const handleBorrowConfirm = () => {
    setBorrowModal({ visible: false, book: null });
    setModalInfo({
      visible: true,
      title: 'Borrow Successful',
      content: `You have borrowed "${borrowModal.book.title}"!`,
    });
  };

  return (
    <Layout className="App">
      <Header />
      <Content style={{ padding: '2rem' }}>
        <Features />

        <section className="subscription" style={{ marginTop: '2rem' }}>
          <Title level={2} className="subscription-title">Subscription Plans</Title>
          <Row gutter={[16, 16]} justify="center">
            {plans.map((plan) => (
              <Col key={plan.subscriptionPlanID} xs={24} sm={12} md={8}>
                <Card
                  title={plan.planName}
                  bordered
                  className="subscription-card"
                >
                  <Paragraph className="subscription-price">${plan.price}/plan</Paragraph>
                  <Paragraph className="subscription-description">
                    Duration: {plan.durationDays} days<br />
                    Max/Day: {plan.maxPerDay}<br />
                    Max/Month: {plan.maxPerMonth}
                  </Paragraph>
                  <Button
                    type="primary"
                    onClick={() => handleSubscription(plan)}
                  >
                    Subscribe
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        <section className="book-list" style={{ textAlign: 'center' }}>
          <Title level={2} className="book-list-title">Available Books</Title>
          <Row gutter={[24, 24]} justify="center">
            {books.map((book) => (
              <Col key={book.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                <div className="subscription-card">
                  {book.coverImageUrl ? (
                    <img src={book.coverImageUrl} alt={book.title} className="img-center" />
                  ) : (
                    <div className="img-not-found">Image not found</div>
                  )}
                  <h3>{book.title}</h3>
                  <p><strong>Author:</strong> {book.authorName}</p>
                  <p><strong>Published Year:</strong> {book.publishedYear}</p>
                  <button
                    className="borrow-btn"
                    onClick={() => handleBorrowClick(book)}
                  >
                    Borrow
                  </button>
                </div>
              </Col>
            ))}
          </Row>
          <div style={{ marginTop: '1rem', textAlign: 'right', width: '100%' }}>
            <Link to="/all-books">See more &rarr;</Link>
          </div>
        </section>

        <Modal
          open={borrowModal.visible}
          title="Do you want to borrow this book?"
          onOk={handleBorrowConfirm}
          onCancel={() => setBorrowModal({ visible: false, book: null })}
          okText="Yes"
          cancelText="No"
        >
          {borrowModal.book && (
            <div>
              <strong>{borrowModal.book.title}</strong>
            </div>
          )}
        </Modal>

        <Modal
          open={modalInfo.visible}
          title={modalInfo.title}
          onOk={() => setModalInfo({ visible: false, title: '', content: '' })}
          onCancel={() => setModalInfo({ visible: false, title: '', content: '' })}
          footer={[
            <Button key="ok" type="primary" onClick={() => setModalInfo({ visible: false, title: '', content: '' })}>
              OK
            </Button>,
          ]}
        >
          {modalInfo.content}
        </Modal>

        <Modal
          open={loginPrompt.visible}
          title="Login Required"
          onOk={() => {
            setLoginPrompt({ visible: false });
            const loginBtn = document.querySelector('.user-button');
            if (loginBtn) loginBtn.click();
          }}
          onCancel={() => setLoginPrompt({ visible: false })}
          okText="Login"
          cancelText="Cancel"
        >
          You must be logged in to borrow books. Would you like to log in now?
        </Modal>

        <Modal
          open={subscriptionPrompt.visible}
          title="Confirm Subscription"
          onOk={handleSubscriptionConfirm}
          onCancel={handleSubscriptionCancel}
          okText="Yes"
          cancelText="No"
        >
          {subscriptionPrompt.plan && (
            <div>
              <strong>Plan:</strong> {subscriptionPrompt.plan.planName}
            </div>
          )}
        </Modal>
      </Content>
      <Footer />
    </Layout>
  );
}

export default HomePage;