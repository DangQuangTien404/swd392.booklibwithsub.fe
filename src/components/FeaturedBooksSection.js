import React from 'react';
import { Typography, Button } from 'antd';
import { Link } from 'react-router-dom';
import BookList from './BookList';
import '../styles/BookList.css';

const { Title } = Typography;

function FeaturedBooksSection({
  books = [],
  onBorrow,
  onAddToBasket,
  onBorrowAll,
  basketCount,
}) {
  return (
    <section className="featured-books-section">
      <Title level={2} className="book-list-title">Available Books</Title>
      <BookList
        books={books}
        onBorrow={onBorrow}
        onAddToBasket={onAddToBasket}
      />
      <div className="featured-books-footer">
        <Link to="/all-books" className="see-more-link">See more &rarr;</Link>
        <Button
          type="primary"
          onClick={onBorrowAll}
          disabled={basketCount === 0}
          className="borrow-all-btn"
        >
          Borrow All from Basket
        </Button>
      </div>
    </section>
  );
}

export default FeaturedBooksSection;