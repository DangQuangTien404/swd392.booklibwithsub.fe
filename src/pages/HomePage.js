import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout, Typography, Button, Row, Col, Space, message, Modal } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import { fetchBooks } from '../api/books';
import { fetchSubscriptionPlans } from '../api/subscriptionPlans';
import { fetchSubscriptionStatus, purchaseSubscription } from '../api/subscriptions';
import '../styles/HomePage.css';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

function HomePage() {
  const [books, setBooks] = useState([]);
  const [plans, setPlans] = useState([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks();
        setBooks(data);
      } catch (error) {
        console.error('Error loading books:', error);
      }
    };
    const loadPlans = async () => {
      try {
        const data = await fetchSubscriptionPlans();
        setPlans(data);
      } catch (error) {
        console.error('Error loading subscription plans:', error);
      }
    };
    const loadSubscriptionStatus = async () => {
      try {
        const status = await fetchSubscriptionStatus();
        setSubscriptionStatus(status);
      } catch (error) {
        setSubscriptionStatus(null);
      }
    };
    loadBooks();
    loadPlans();
    loadSubscriptionStatus();
  }, []);

  const features = [
    { text: 'Access thousands of books anytime, anywhere.', icon: <CheckCircleOutlined/> },
    { text: 'Flexible subscription plans to suit your needs.', icon: <CheckCircleOutlined/> },
    { text: 'Curated recommendations just for you.', icon: <CheckCircleOutlined/> },
  ];

  return (
    <Layout className="App">
      <Header />
      <Content style={{ padding: '2rem' }}>
        <section className="features">
          <Title level={2} className="features-title">Why Choose Us?</Title>
          <Space direction="vertical" size="large" className="features-list">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                {feature.icon}
                <span>{feature.text}</span>
              </div>
            ))}
          </Space>
        </section>

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
                    Duration: {plan.durationDays} days<br/>
                    Max/Day: {plan.maxPerDay}<br/>
                    Max/Month: {plan.maxPerMonth}
                  </Paragraph>
                  <Button type="primary" onClick={async () => {
                    if (subscriptionStatus && subscriptionStatus.endDate && new Date(subscriptionStatus.endDate) > new Date()) {
                      Modal.info({
                        title: 'Already Subscribed',
                        content: 'You already have an active subscription. Please wait until it expires before purchasing a new one.',
                      });
                      return;
                    }
                    try {
                      await purchaseSubscription(plan.subscriptionPlanID);
                      Modal.success({
                        title: 'Subscription Successful',
                        content: `You have subscribed to ${plan.planName}!`,
                      });
                    } catch (error) {
                      Modal.error({
                        title: 'Subscription Failed',
                        content: 'There was a problem processing your subscription. Please try again.',
                      });
                    }
                  }}>
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
            {books.slice(0, 3).map((book) => (
              <Col key={book.bookID} xs={24} sm={12} md={8} lg={6} xl={6}>
                <Card className="subscription-card" hoverable>
                  {book.image ? (
                    <img src={book.image} alt={book.title} style={{ width: '100%', height: 'auto', marginBottom: '1rem' }} />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#888', marginBottom: '1rem' }}>Image not found</div>
                  )}
                  <h3>{book.title}</h3>
                  <p><strong>Author:</strong> {book.authorName}</p>
                  <p><strong>Published Year:</strong> {book.publishedYear}</p>
                </Card>
              </Col>
            ))}
          </Row>
          <div style={{ marginTop: '1rem', textAlign: 'right', width: '100%' }}>
            <Link to="/all-books">See more &rarr;</Link>
          </div>
        </section>
      </Content>
      <Footer />
    </Layout>
  );
}

export default HomePage;