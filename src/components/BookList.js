import React from 'react';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';
import BookCard from './BookCard';
import '../styles/BookList.css';

function BookList({ books, onBorrow, onAddToBasket }) {
  return (
    <Row gutter={[24, 24]} justify="center">
      {books.map((book) => (
        <Col key={book.id} xs={24} sm={12} md={8} lg={6} xl={6}>
          <BookCard
            book={book}
            onBorrow={onBorrow}
            onAddToBasket={onAddToBasket}
          />
        </Col>
      ))}
    </Row>
  );
}

BookList.propTypes = {
  books: PropTypes.array.isRequired,
  onBorrow: PropTypes.func.isRequired,
  onAddToBasket: PropTypes.func.isRequired,
};

export default BookList;