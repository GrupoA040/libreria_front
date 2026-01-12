import React from 'react';
import './BookCard.css';

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <div className="book-cover">
        {book.img ? (
          <img src={book.img} alt={book.title} />
        ) : (
          <div className="book-cover-placeholder">
            <span>{book.title.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">Autor: {book.author}</p>
        <p className="book-genre">Género: {book.genre}</p>
        <button className="view-details-btn">
          Ver Detalles
        </button>
      </div>
    </div>
  );
};

export default BookCard;