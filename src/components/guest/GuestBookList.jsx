import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import bookService from "../../services/bookService";
import GuestBookCard from "./GuestBookCard";
import "./GuestBookList.css";

const GuestBookList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState("title");

  const { addToCart } = useAuth();

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterAndSortBooks();
  }, [books, searchQuery, selectedGenre, sortBy]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooks();
      // Filtrar solo libros disponibles
      const availableBooks = data.filter((book) => book.available);
      setBooks(availableBooks);
      setError(null);
    } catch (err) {
      setError("Error al cargar el catálogo. Intente nuevamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBooks = () => {
    let result = [...books];

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.genre.toLowerCase().includes(query)
      );
    }

    // Filtrar por género
    if (selectedGenre) {
      result = result.filter((book) => book.genre === selectedGenre);
    }

    // Ordenar
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        default:
          return 0;
      }
    });

    setFilteredBooks(result);
  };

  const handleAddToCart = (book) => {
    addToCart(book);
    alert(`"${book.title}" agregado al carrito!`);
  };

  const genres = [...new Set(books.map((book) => book.genre))].sort();

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando catálogo...</p>
      </div>
    );

  return (
    <div className="guest-book-list">
      {/* Hero Section */}
      <div className="hero-section">
        <h1>📖 Catálogo de Libros</h1>
        <p>Explora nuestra colección y encuentra tu próximo libro favorito</p>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="controls-section">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar libros por título, autor o género..."
            className="search-input"
          />
        </div>

        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="genre-filter">
              <span>📚</span> Género
            </label>
            <select
              id="genre-filter"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="filter-select"
            >
              <option value="">Todos los géneros</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-filter">
              <span>📊</span> Ordenar por
            </label>
            <select
              id="sort-filter"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="title">Título (A-Z)</option>
              <option value="author">Autor (A-Z)</option>
              <option value="price-asc">Precio (Menor a Mayor)</option>
              <option value="price-desc">Precio (Mayor a Menor)</option>
              <option value="stock">Disponibilidad</option>
            </select>
          </div>
        </div>

        <div className="controls-actions">
          <button
            className="clear-filters-btn"
            onClick={() => {
              setSearchQuery("");
              setSelectedGenre("");
              setSortBy("title");
            }}
          >
            🔄 Limpiar Filtros
          </button>

          <button className="refresh-catalog-btn" onClick={fetchBooks}>
            📥 Actualizar Catálogo
          </button>
        </div>
      </div>

      {/* Información de resultados */}
      <div className="results-info">
        <p className="results-text">
          Mostrando <strong>{filteredBooks.length}</strong> de{" "}
          <strong>{books.length}</strong> libros disponibles
          {selectedGenre && ` en ${selectedGenre}`}
        </p>
        <span className="results-count">
          {searchQuery ? `"${searchQuery}"` : "Todos los libros"}
        </span>
      </div>

      {/* Grid de Libros */}
      <div className="books-grid">
        {filteredBooks.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No se encontraron libros</h3>
            <p>Intenta con otros términos de búsqueda o filtros</p>
            <button
              className="reset-btn"
              onClick={() => {
                setSearchQuery("");
                setSelectedGenre("");
              }}
            >
              Mostrar todos los libros
            </button>
          </div>
        ) : (
          filteredBooks.map((book) => (
            <GuestBookCard
              key={book.id}
              book={book}
              onAddToCart={handleAddToCart}
            />
          ))
        )}
      </div>

      {/* Footer de catálogo */}
      {/* <div className="catalog-footer">
        <div className="catalog-stats">
          <div className="stat">
            <span className="stat-number">{books.length}</span>
            <span className="stat-label">Libros disponibles</span>
          </div>
          <div className="stat">
            <span className="stat-number">{genres.length}</span>
            <span className="stat-label">Géneros diferentes</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              ${books.reduce((sum, book) => sum + book.price, 0).toFixed(2)}
            </span>
            <span className="stat-label">Valor total del catálogo</span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default GuestBookList;
