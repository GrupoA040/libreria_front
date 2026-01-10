import { useState, useEffect } from 'react';
import { bookService } from '../services/api';

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await bookService.getBooks();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar libros');
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (newBook) => {
    try {
      const createdBook = await bookService.createBook(newBook);
      setBooks(prev => [...prev, createdBook]);
      return createdBook;
    } catch (err) {
      throw err;
    }
  };

  const updateBook = async (id, updatedData) => {
    try {
      const updatedBook = await bookService.updateBook(id, updatedData);
      setBooks(prev => prev.map(book => 
        book.id === id ? updatedBook : book
      ));
      return updatedBook;
    } catch (err) {
      throw err;
    }
  };

  const deleteBook = async (id) => {
    try {
      await bookService.deleteBook(id);
      setBooks(prev => prev.filter(book => book.id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return {
    books,
    loading,
    error,
    fetchBooks,
    addBook,
    updateBook,
    deleteBook
  };
};