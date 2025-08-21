import React, { useEffect, useState, useContext } from 'react';
import { Layout, Typography, Row, Col, Space, message } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import { fetchBooks } from '../api/books';
import PayButton from '../components/PayButton';
import { UserContext } from '../context/UserContext';
import '../styles/HomePage.css';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

function HomePage() {
  const [books, setBooks] = useState([]);
  const { refetchUser } = useContext(UserContext);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks();
        setBooks(data);
      } catch (error) {
        console.error('Error loading books:', error);
      }
    };

    loadBooks();
  }, []);

  const handlePaid = async () => {
    await refetchUser();
    message.success('Thanh toán thành công');
  };

  const plans = [
    {
      title: 'Basic',
      price: '$5/month',
      description: 'Perfect for casual readers.',
      subscriptionId: 1,
      amount: 5,
    },
    {
      title: 'Premium',
      price: '$10/month',
      description: 'Ideal for avid readers.',
      subscriptionId: 2,
      amount: 10,
    },
    {
      title: 'Elite',
      price: '$20/month',
      description: 'Unlimited access to all features.',
      subscriptionId: 3,
      amount: 20,
    },
  ];

  const features = [
    { text: 'Access thousands of books anytime, anywhere.', icon: <CheckCircleOutlined /> },
    { text: 'Flexible subscription plans to suit your needs.', icon: <CheckCircleOutlined /> },
    { text: 'Curated recommendations just for you.', icon: <CheckCircleOutlined /> },
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
              <Col key={plan.title} xs={24} sm={12} md={8}>
                <Card
                  title={plan.title}
                  bordered
                  className="subscription-card"
                >
                  <Paragraph className="subscription-price">{plan.price}</Paragraph>
                  <Paragraph className="subscription-description">{plan.description}</Paragraph>
                  <PayButton
                    subscriptionId={plan.subscriptionId}
                    amount={plan.amount}
                    onPaid={handlePaid}
                  />
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
        </section>
      </Content>
      <Footer />
    </Layout>
  );
}

export default HomePage;
