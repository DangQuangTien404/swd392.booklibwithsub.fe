import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Spin, Alert, Button, Row, Col } from 'antd';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getBookById } from '../api/books';
import '../styles/BookDetailPage.css';

const { Content } = Card;

function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBook() {
      try {
        setLoading(true);
        const data = await getBookById(id);
        setBook(data);
        setError('');
      } catch (err) {
        setError('Failed to fetch book details.');
        setBook(null);
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [id]);

  return (
    <div className="App">
      <Header />
      <div className="book-detail-content">
        <Content>
          {loading ? (
            <Spin tip="Loading book..." style={{ marginTop: 50 }} />
          ) : error ? (
            <Alert type="error" message={error} style={{ marginTop: 50 }} />
          ) : book ? (
            <Row justify="center">
              <Col xs={24} sm={18} md={14} lg={10}>
                <Card
                  className="book-detail-card"
                  cover={
                    book.coverImageUrl ?
                      <img
                        alt={book.title}
                        src={book.coverImageUrl}
                        className="book-detail-image"
                      /> : null
                  }
                  actions={[
                    <Button type="primary" key="back">
                      <Link to="/books">Back to all books</Link>
                    </Button>
                  ]}
                >
                  <div className="book-detail-info">
                    <h2>{book.title}</h2>
                    <p><strong>Author:</strong> {book.authorName}</p>
                    <p><strong>ISBN:</strong> {book.isbn}</p>
                    <p><strong>Publisher:</strong> {book.publisher}</p>
                    <p><strong>Published Year:</strong> {book.publishedYear}</p>
                    <p><strong>Total Copies:</strong> {book.totalCopies}</p>
                    <p><strong>Available Copies:</strong> {book.availableCopies}</p>
                  </div>
                </Card>
              </Col>
            </Row>
          ) : null}
        </Content>
      </div>
      <Footer />
    </div>
  );
}

export default BookDetailPage;