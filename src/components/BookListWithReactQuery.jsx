import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { bookService } from '../services/api';
import BookCard from './BookCard';

const BookListWithReactQuery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Usar React Query para fetch de libros
  const { 
    data: books = [], 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery('books', bookService.getBooks, {
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    retry: 3,
    refetchOnWindowFocus: false,
  });

  // Mutación para eliminar libro
  const deleteBookMutation = useMutation(
    (id) => bookService.deleteBook(id),
    {
      onSuccess: () => {
        // Invalidar cache de libros para refetch
        queryClient.invalidateQueries('books');
      },
    }
  );

  const handleDeleteBook = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este libro?')) {
      await deleteBookMutation.mutateAsync(id);
    }
  };

  // Filtrar libros
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar libros..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <div className="books-grid">
        {filteredBooks.map((book) => (
          <div key={book.id} className="book-item">
            <BookCard book={book} />
            <button 
              onClick={() => handleDeleteBook(book.id)}
              className="delete-btn"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookListWithReactQuery;