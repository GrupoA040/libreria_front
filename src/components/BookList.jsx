import React from "react";
import BookCard from "./BookCard";

function BookList({ books, onAddToCart, onToggleFavorite, searchTerm = "" }) {
  return (
    <div className="book-list">
      {books.length > 0 ? (
        books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onAddToCart={onAddToCart}
            onToggleFavorite={onToggleFavorite}
            searchTerm={searchTerm}
          />
        ))
      ) : (
        <div className="no-books-message">
          <p>No se encontraron libros que coincidan con tu búsqueda.</p>
          <p className="suggestions">
            Prueba con otros términos o revisa la ortografía.
          </p>
        </div>
      )}
    </div>
  );
}

export default BookList;
