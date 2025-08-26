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
  const pageSize = 6;

  useEffect(() => {
    async function fetchBooks() {
      try {
        const booksData = await getBooksSorted();
        setBooks(booksData);
      } catch (e) {
        setBooks([]);
      }
    }
    fetchBooks();
  }, []);

  const handlePageChange = (page) => setCurrentPage(page);

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
      </Content>
      <Footer style={{ textAlign: 'center', backgroundColor: '#333', color: 'white' }}>
        &copy; 2025 BookLib. All rights reserved.
      </Footer>
    </Layout>
  );
}

export default AllBooksPage;