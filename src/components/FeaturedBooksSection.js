import React from 'react';
import { Row, Col, Card } from 'antd';
import { Link } from 'react-router-dom';

function FeaturedBooksSection({ books }) {
  return (
    <section className="featured-books">
      <h2 className="section-title">Featured Books</h2>
      <Row gutter={[24, 24]} className="featured-books-row">
        {books && books.length > 0 ? (
          books.map((book) => (
            <Col key={book.id} xs={24} sm={12} md={8} lg={6}>
              <Link to={`/books/${book.id}`} className="book-card-link">
                <Card
                  className="book-card"
                  hoverable
                  cover={
                    book.coverImageUrl
                      ? <img src={book.coverImageUrl} alt={book.title} className="img-center" />
                      : <div className="img-not-found">Image not found</div>
                  }
                >
                  <h3>{book.title}</h3>
                  <p><strong>Author:</strong> {book.authorName}</p>
                  <p><strong>Published Year:</strong> {book.publishedYear}</p>
                  <p><strong>Available:</strong> {book.availableCopies}</p>
                </Card>
              </Link>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <p>No books found.</p>
          </Col>
        )}
      </Row>
    </section>
  );
}

export default FeaturedBooksSection;