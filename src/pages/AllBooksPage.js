import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Layout, Row, Col, Pagination } from 'antd';
import { Link } from 'react-router-dom';
import { getBooksSorted } from '../api/books';
import '../styles/AllBooksPage.css';

const { Content, Footer } = Layout;

function AllBooksPage() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('desc'); // "desc" = Newest First, "asc" = Oldest First
  const [loading, setLoading] = useState(false);
  const pageSize = 6;

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      try {
        const booksData = await getBooksSorted(sortOrder);
        setBooks(booksData);
      } catch (e) {
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, [sortOrder]);

  const paginatedBooks = books.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Layout className="AllBooksPage">
      <Header />
      <Content style={{ padding: '2rem' }}>
        <h1 className="page-title">All Books</h1>
        <div className="sort-group-wrapper">
          <span style={{ marginRight: '1rem', fontWeight: 500 }}>Sort by:</span>
          <div className="sort-btn-group">
            <button
              className={`sort-btn${sortOrder === 'desc' ? ' active' : ''}`}
              aria-pressed={sortOrder === 'desc'}
              onClick={() => setSortOrder('desc')}
              disabled={loading || sortOrder === 'desc'}
            >
              Newest First
            </button>
            <button
              className={`sort-btn${sortOrder === 'asc' ? ' active' : ''}`}
              aria-pressed={sortOrder === 'asc'}
              onClick={() => setSortOrder('asc')}
              disabled={loading || sortOrder === 'asc'}
            >
              Oldest First
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Row gutter={[24, 24]} className="AllBooksPage-row" justify="center">
            {paginatedBooks.length > 0 ? paginatedBooks.map((book) => (
              <Col key={book.id} xs={24} sm={12} md={8} lg={8} xl={8}>
                <Link to={`/books/${book.id}`} className="book-card-link">
                  <div className="book-card">
                    {book.coverImageUrl ? (
                      <img src={book.coverImageUrl} alt={book.title} className="img-center" />
                    ) : (
                      <div className="img-not-found">Image not found</div>
                    )}
                    <h3>{book.title}</h3>
                    <p><strong>Author:</strong> {book.authorName}</p>
                    <p><strong>Published Year:</strong> {book.publishedYear}</p>
                  </div>
                </Link>
              </Col>
            )) : (
              <div style={{ padding: '2rem', color: '#888', fontSize: '1.1rem' }}>
                {loading ? "Loading books..." : "No books found."}
              </div>
            )}
          </Row>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={books.length}
            onChange={setCurrentPage}
            style={{ marginTop: '1rem' }}
            showSizeChanger={false}
          />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', backgroundColor: '#333', color: 'white' }}>
        &copy; 2025 BookLib. All rights reserved.
      </Footer>
    </Layout>
  );
}

export default AllBooksPage;