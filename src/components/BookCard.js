import React from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import '../styles/BookCard.css';

function BookCard({ book, onBorrow, onAddToBasket }) {
  return (
    <div className="subscription-card book-card">
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
        onClick={() => onBorrow(book)}
      >
        Borrow
      </button>
      <Button
        type="default"
        onClick={() => onAddToBasket(book)}
        style={{ marginTop: '0.5rem' }}
      >
        Add to Basket
      </Button>
    </div>
  );
}

BookCard.propTypes = {
  book: PropTypes.object.isRequired,
  onBorrow: PropTypes.func.isRequired,
  onAddToBasket: PropTypes.func.isRequired,
};

export default BookCard;