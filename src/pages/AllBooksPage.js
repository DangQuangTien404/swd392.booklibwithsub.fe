import React, { useState } from 'react';
import Header from '../components/Header';
import { Layout, Row, Col, Pagination } from 'antd';
import Card from '../components/Card';
import '../styles/AllBooksPage.css';

const { Content, Footer } = Layout;

const books = [
  { id: 1, title: '3 Shades of Blue', author: 'James Kaplan', price: '845,000 ₫' },
  { id: 2, title: 'A Bigger Message', author: 'Martin Gayford', price: '545,000 ₫' },
  { id: 3, title: 'A First Time For Everything', author: 'Dan Santat', price: '415,000 ₫' },
  { id: 4, title: 'A Heart That Works', author: 'Rob Delaney', price: '585,000 ₫' },
  { id: 5, title: 'A Little Life', author: 'Hanya Yanagihara', price: '415,000 ₫' },
  { id: 6, title: 'A Man Called Ove', author: 'Fredrik Backman', price: '465,000 ₫' },
  { id: 7, title: 'A Roof!', author: 'Stephanie Ellen', price: '495,000 ₫' },
  { id: 8, title: 'Akira, Vol.1', author: 'Katsuhiro Otomo', price: '585,000 ₫' },
  { id: 9, title: 'Akira, Vol.2', author: 'Katsuhiro Otomo', price: '585,000 ₫' },
  { id: 10, title: 'All of the Marvels', author: 'Douglas Wolk', price: '415,000 ₫' },
];

function AllBooksPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedBooks = books.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Layout className="AllBooksPage">
      <Header />
      <Content style={{ padding: '2rem' }}>
        <h1 className="page-title">All Books</h1>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Row gutter={[16, 16]}>
            {paginatedBooks.map((book) => (
              <Col key={book.id} xs={24} sm={12} md={8} lg={8} xl={8}>
                <Card className="book-card" hoverable>
                  <h3>{book.title}</h3>
                  <p><strong>Author:</strong> {book.author}</p>
                  <p><strong>Price:</strong> {book.price}</p>
                </Card>
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
