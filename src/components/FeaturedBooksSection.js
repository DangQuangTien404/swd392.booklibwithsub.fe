import React from 'react';
import { Row, Col, Button } from 'antd';
import '../styles/FeaturedBooksSection.css';

function FeaturedBooksSection({
  books,
  onBorrow,
  onAddToBasket,
  onBorrowAll,
  basketCount,
  borrowedBookIds = new Set(),
}) {
  return (
    <section className="featured-books">
      <h2 className="section-title">Featured Books</h2>
      <Row gutter={[24, 24]} className="featured-books-row">
        {books && books.length > 0 ? (
          books.map((book) => (
            <Col key={book.id} xs={24} sm={12} md={8} lg={6}>
              <div className="book-card">
                {book.coverImageUrl ? (
                  <img src={book.coverImageUrl} alt={book.title} className="img-center" />
                ) : (
                  <div className="img-not-found">Image not found</div>
                )}
                <h3>{book.title}</h3>
                <p><strong>Author:</strong> {book.authorName}</p>
                <p><strong>Published Year:</strong> {book.publishedYear}</p>
                <Button
                  className="borrow-btn"
                  onClick={() => onBorrow(book)}
                  disabled={borrowedBookIds.has(book.id)}
                  style={borrowedBookIds.has(book.id) ? { backgroundColor: '#ccc', cursor: 'not-allowed' } : {}}
                >
                  {borrowedBookIds.has(book.id) ? 'Already Borrowed' : 'Borrow'}
                </Button>
                <Button
                  className="basket-btn"
                  onClick={() => onAddToBasket(book)}
                  disabled={borrowedBookIds.has(book.id)}
                  style={{ marginLeft: 8 }}
                >
                  Add to Basket
                </Button>
              </div>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <p>No books found.</p>
          </Col>
        )}
      </Row>
      <div style={{ marginTop: 16 }}>
        <Button
          type="primary"
          onClick={onBorrowAll}
          disabled={basketCount === 0}
        >
          Borrow All in Basket ({basketCount})
        </Button>
      </div>
    </section>
  );
}

export default FeaturedBooksSection;