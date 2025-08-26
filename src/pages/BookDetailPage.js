import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Spin, Alert, Button, message } from 'antd';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getBookById } from '../api/books';
import { borrowBook, getActiveLoans } from '../api/loans';
import { UserContext } from '../context/UserContext';
import '../styles/BookDetailPage.css';

function BookDetailPage() {
  const { id } = useParams();
  const { user, subscriptionStatus, basket, setBasket } = useContext(UserContext);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [borrowedBookIds, setBorrowedBookIds] = useState(new Set());
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [bookData, activeLoans] = await Promise.all([
          getBookById(id),
          user ? getActiveLoans() : Promise.resolve([])
        ]);
        setBook(bookData);
        setBorrowedBookIds(new Set(activeLoans.map(item => item.bookId)));
        setError('');
      } catch (err) {
        setError('Failed to fetch book details.');
        setBook(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, user]);

  const alreadyBorrowed = borrowedBookIds.has(Number(id));
  const inBasket = basket.some(b => b.id === Number(id));

  const handleBorrow = async () => {
    if (!user || !subscriptionStatus?.subscriptionId) {
      message.warning('You need to be logged in and subscribed to borrow books.');
      return;
    }
    setActionLoading(true);
    try {
      await borrowBook(subscriptionStatus.subscriptionId, [Number(id)]);
      message.success(`You have borrowed "${book.title}"!`);
      const activeLoans = await getActiveLoans();
      setBorrowedBookIds(new Set(activeLoans.map(item => item.bookId)));
    } catch {
      message.error('Borrow failed. Please try again.');
    }
    setActionLoading(false);
  };

  const handleAddToBasket = () => {
    if (inBasket) {
      message.info('This book is already in your basket.');
      return;
    }
    setBasket([...basket, book]);
    message.success('Book added to basket!');
  };

  return (
    <div className="App">
      <Header />
      <div className="book-detail-content">
        {loading ? (
          <Spin tip="Loading book..." />
        ) : error ? (
          <Alert type="error" message={error} />
        ) : book ? (
          <div className="book-detail-card-wrapper">
            <Card
              className="book-detail-card"
              bodyStyle={{ padding: '2rem 2rem 1.5rem 2rem' }}
            >
              <div className="book-detail-image-wrapper">
                {book.coverImageUrl && (
                  <img
                    alt={book.title}
                    src={book.coverImageUrl}
                    className="book-detail-image"
                  />
                )}
              </div>
              <div className="book-detail-info">
                <h2 className="book-detail-title">{book.title}</h2>
                <ul className="book-detail-meta">
                  <li><span>Author:</span> {book.authorName}</li>
                  <li><span>ISBN:</span> {book.isbn}</li>
                  <li><span>Publisher:</span> {book.publisher}</li>
                  <li><span>Published Year:</span> {book.publishedYear}</li>
                  <li><span>Total Copies:</span> {book.totalCopies}</li>
                  <li><span>Available Copies:</span> {book.availableCopies}</li>
                </ul>
                <div className="book-detail-actions">
                  <Button
                    type="primary"
                    onClick={handleBorrow}
                    disabled={alreadyBorrowed || actionLoading}
                    loading={actionLoading}
                  >
                    {alreadyBorrowed ? 'Already Borrowed' : 'Borrow'}
                  </Button>
                  <Button
                    onClick={handleAddToBasket}
                    disabled={inBasket}
                  >
                    {inBasket ? 'In Basket' : 'Add to Basket'}
                  </Button>
                </div>
              </div>
            </Card>
            <div className="book-detail-back">
              <Link to="/all-books">
                <Button type="primary">Back to all books</Button>
              </Link>
            </div>
          </div>
        ) : null}
      </div>
      <Footer />
    </div>
  );
}

export default BookDetailPage;