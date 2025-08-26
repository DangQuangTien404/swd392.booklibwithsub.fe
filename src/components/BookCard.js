import React from 'react';
import { Card } from 'antd';
import { Link } from 'react-router-dom';

function BookCard({ book }) {
  return (
    <Link to={`/books/${book.id}`} className="book-card-link">
      <Card
        className="subscription-card book-card"
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
  );
}

export default BookCard;