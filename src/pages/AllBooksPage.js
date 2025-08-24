import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Layout, Row, Col, Pagination, Modal, Button } from 'antd';
import { getBooksSorted } from '../api/books';
import { fetchSubscriptionStatus } from '../api/subscriptions';
import { borrowBook } from '../api/loans';
import '../styles/AllBooksPage.css';

const { Content, Footer } = Layout;

function AllBooksPage() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [borrowModal, setBorrowModal] = useState({ visible: false, book: null });
  const [modalInfo, setModalInfo] = useState({ visible: false, title: '', content: '' });
  const pageSize = 6;

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await getBooksSorted();
        setBooks(data);
      } catch (error) {
        console.error('Error loading books:', error);
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
    loadSubscriptionStatus();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleBorrowClick = (book) => {
    if (!subscriptionStatus || !subscriptionStatus.subscriptionId) {
      setModalInfo({ visible: true, title: 'No Active Subscription', content: 'You need an active subscription to borrow books.' });
      return;
    }
    setBorrowModal({ visible: true, book });
  };

  const handleBorrowConfirm = async () => {
    const book = borrowModal.book;
    setBorrowModal({ visible: false, book: null });
    try {
      await borrowBook(subscriptionStatus.subscriptionId, book.id);
      setModalInfo({ visible: true, title: 'Borrow Successful', content: `You have borrowed "${book.title}"!` });
    } catch (error) {
      setModalInfo({ visible: true, title: 'Borrow Failed', content: 'There was a problem borrowing this book. Please try again.' });
    }
  };

  const handleModalClose = () => setModalInfo({ visible: false, title: '', content: '' });

  const paginatedBooks = books.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Layout className="AllBooksPage">
      <Header />
      <Content style={{ padding: '2rem' }}>
        <h1 className="page-title">All Books</h1>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Row gutter={[24, 24]} className="AllBooksPage-row" justify="center">
            {paginatedBooks.map((book) => (
              <Col key={book.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                <div className="book-card">
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
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={books.length}
            onChange={handlePageChange}
            style={{ marginTop: '1rem' }}
          />
        </div>
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
          onOk={handleModalClose}
          onCancel={handleModalClose}
          footer={[
            <Button key="ok" type="primary" onClick={handleModalClose}>
              OK
            </Button>,
          ]}
        >
          {modalInfo.content}
        </Modal>
      </Content>
      <Footer style={{ textAlign: 'center', backgroundColor: '#333', color: 'white' }}>
        &copy; 2025 BookLib. All rights reserved.
      </Footer>
    </Layout>
  );
}

export default AllBooksPage;
