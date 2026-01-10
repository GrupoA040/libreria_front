import React, { useState, useEffect } from 'react';
import { bookService } from '../services/api';
import BookCard from './BookCard';
import './BookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getBooks();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los libros');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar libros basados en búsqueda
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando libros...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchBooks} className="retry-btn">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="book-list-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar libros por título, autor o género..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="books-header">
        <h2>Lista de Libros</h2>
        <p>{filteredBooks.length} libros encontrados</p>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="no-books">
          <p>No se encontraron libros</p>
        </div>
      ) : (
        <div className="books-grid">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;