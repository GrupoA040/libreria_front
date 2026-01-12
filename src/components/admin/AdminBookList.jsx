import React, { useState, useEffect } from "react";
import bookService from "../../services/bookService";
import BookForm from "../BookForm";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Estados para formulario
  const [editingBook, setEditingBook] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("list");

  useEffect(() => {
    fetchBooks();
  }, []);

  // Efecto para filtrar libros cuando cambia la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  }, [searchQuery, books]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooks();
      setBooks(data);
      setFilteredBooks(data);
      setError(null);
    } catch (err) {
      setError(
        "Error al cargar los libros. Verifique la conexión con el servidor."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      fetchBooks();
      return;
    }

    try {
      setLoading(true);
      const results = await bookService.searchBooks(searchQuery);
      setFilteredBooks(results);
      setError(null);
    } catch (err) {
      console.error("Error en búsqueda:", err);
      // Si falla la búsqueda en el backend, filtrar localmente
      const filtered = books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBooks(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Búsqueda en tiempo real con debounce
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      if (value.trim() !== "") {
        handleSearch();
      } else {
        setFilteredBooks(books);
      }
    }, 300);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredBooks(books);
  };

  const handleDelete = async (id) => {
    const bookTitle = books.find((b) => b.id === id)?.title;
    if (window.confirm(`¿Estás seguro de eliminar el libro "${bookTitle}"?`)) {
      try {
        await bookService.deleteBook(id);
        // Actualizar listas localmente
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
        setFilteredBooks((prev) => prev.filter((book) => book.id !== id));

        // Si estábamos editando este libro, cerrar el formulario
        if (editingBook?.id === id) {
          setShowForm(false);
          setEditingBook(null);
          setFormMode("list");
        }
      } catch (err) {
        console.error("Error al eliminar:", err);
        alert("Error al eliminar el libro. Inténtelo nuevamente.");
      }
    }
  };

  const handleToggleFavorite = async (id, currentStatus) => {
    try {
      const updatedBook = await bookService.toggleFavorite(id, !currentStatus);

      // Actualizar ambas listas localmente
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === id
            ? { ...book, isFavorite: updatedBook.isFavorite }
            : book
        )
      );

      setFilteredBooks((prev) =>
        prev.map((book) =>
          book.id === id
            ? { ...book, isFavorite: updatedBook.isFavorite }
            : book
        )
      );
    } catch (err) {
      console.error("Error al actualizar favorito:", err);
      alert("Error al actualizar destacado");
    }
  };

  // Función para iniciar la edición
  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const book = await bookService.getBookById(id);
      setEditingBook(book);
      setFormMode("edit");
      setShowForm(true);
    } catch (err) {
      console.error("Error al cargar libro para editar:", err);
      alert("Error al cargar los datos del libro");
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar la creación
  const handleCreate = () => {
    setEditingBook(null);
    setFormMode("create");
    setShowForm(true);
  };

  // Función para guardar cambios
  const handleSaveBook = async (savedBook) => {
    try {
      if (formMode === "edit" && editingBook) {
        // Actualizar libro existente en las listas
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === editingBook.id ? savedBook : book
          )
        );

        setFilteredBooks((prev) =>
          prev.map((book) => (book.id === editingBook.id ? savedBook : book))
        );

        // Cerrar formulario después de actualizar
        setTimeout(() => {
          setShowForm(false);
          setFormMode("list");
          setEditingBook(null);
        }, 500);
      } else if (formMode === "create") {
        // Agregar nuevo libro a las listas
        setBooks((prevBooks) => [savedBook, ...prevBooks]);
        setFilteredBooks((prev) => [savedBook, ...prev]);

        // Cerrar formulario después de crear
        setTimeout(() => {
          setShowForm(false);
          setFormMode("list");
        }, 500);
      }
    } catch (err) {
      console.error("Error al procesar libro guardado:", err);
    }
  };

  // Función para cancelar
  const handleCancel = () => {
    setShowForm(false);
    setFormMode("list");
    setEditingBook(null);
  };

  // Calcular estadísticas
  const calculateStats = () => {
    const totalBooks = books.length;
    const totalStock = books.reduce((sum, book) => sum + (book.stock || 0), 0);
    const totalValue = books.reduce(
      (sum, book) => sum + (book.price || 0) * (book.stock || 0),
      0
    );
    const favorites = books.filter((book) => book.isFavorite).length;
    const available = books.filter((book) => book.available).length;

    return { totalBooks, totalStock, totalValue, favorites, available };
  };

  const stats = calculateStats();

  if (loading && !showForm)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando libros...</p>
      </div>
    );

  return (
    <div className="book-list-container">
      <div className="book-list">
        <header className="page-header">
          <h2>📚 Administrador de Librería</h2>
        </header>

        {showForm ? (
          <BookForm
            book={editingBook}
            onSave={handleSaveBook}
            onCancel={handleCancel}
            isCreating={formMode === "create"}
          />
        ) : (
          <>
            {/* Panel de estadísticas */}
            <div className="stats-panel">
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-content">
                  <h3>{stats.totalBooks}</h3>
                  <p>Libros en catálogo</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-content">
                  <h3>{stats.totalStock}</h3>
                  <p>Total en inventario</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <h3>${stats.totalValue.toFixed(2)}</h3>
                  <p>Valor del inventario</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <h3>{stats.favorites}</h3>
                  <p>Destacados</p>
                </div>
              </div>
            </div>

            {/* Barra de búsqueda */}
            <div className="search-container">
              <div className="search-input-group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                  placeholder="🔍 Buscar por título, autor o género..."
                  className="search-input"
                />
                {searchQuery && (
                  <button
                    className="clear-search-btn"
                    onClick={clearSearch}
                    title="Limpiar búsqueda"
                  >
                    ×
                  </button>
                )}
              </div>
              <button onClick={handleSearch} className="search-btn">
                Buscar
              </button>
              {searchQuery && (
                <p>
                  {filteredBooks.length === 0 ? (
                    <span className="no-results">
                      No se encontraron resultados para "
                      <strong>{searchQuery}</strong>"
                    </span>
                  ) : (
                    <span className="results-count">
                      Mostrando <strong>{filteredBooks.length}</strong> de{" "}
                      <strong>{books.length}</strong> libros
                      {searchQuery && ` para "${searchQuery}"`}
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Barra de acciones */}
            <div className="action-bar">
              <div className="action-buttons">
                <button
                  onClick={fetchBooks}
                  className="refresh-btn"
                  title="Actualizar lista completa"
                >
                  🔄 Actualizar Todo
                </button>
                <button onClick={handleCreate} className="create-btn">
                  ➕ Agregar Libro
                </button>
              </div>
            </div>

            {/* Lista de libros */}
            {error && !showForm && (
              <div className="error-alert">
                <p>{error}</p>
                <button onClick={fetchBooks}>Reintentar</button>
              </div>
            )}

            <div className="books-container">
              {filteredBooks.length === 0 ? (
                <div className="empty-state">
                  {searchQuery ? (
                    <>
                      <div className="empty-icon">🔍</div>
                      <h3>No se encontraron libros</h3>
                      <p>No hay resultados para "{searchQuery}"</p>
                      <button
                        onClick={clearSearch}
                        className="clear-search-main-btn"
                      >
                        Ver todos los libros
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="empty-icon">📚</div>
                      <h3>El catálogo está vacío</h3>
                      <p>Comienza agregando tu primer libro al catálogo</p>
                      <button
                        onClick={handleCreate}
                        className="create-first-btn"
                      >
                        Agregar primer libro
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <div className="books-grid">
                    {filteredBooks.map((book) => (
                      <div key={book.id} className="book-card">
                        <div className="book-card-header">
                          <h3 className="book-title">{book.title}</h3>
                          <div className="book-actions-header">
                            <button
                              className={`favorite-btn ${
                                book.isFavorite ? "active" : ""
                              }`}
                              onClick={() =>
                                handleToggleFavorite(book.id, book.isFavorite)
                              }
                              title={
                                book.isFavorite
                                  ? "Quitar de destacados"
                                  : "Marcar como destacado"
                              }
                            >
                              {book.isFavorite ? "★" : "☆"}
                            </button>
                          </div>
                        </div>

                        <div className="book-image-section">
                          <img
                            src={
                              book.img ||
                              "https://via.placeholder.com/300x200?text=Sin+Imagen"
                            }
                            alt={book.title}
                            className="book-image"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/300x200?text=Error+Imagen";
                            }}
                          />
                          {!book.available && (
                            <div className="unavailable-overlay">
                              <span>NO DISPONIBLE</span>
                            </div>
                          )}
                        </div>

                        <div className="book-details">
                          <p className="book-author">✍️ {book.author}</p>
                          <p className="book-genre">🏷️ {book.genre}</p>

                          <div className="book-metrics">
                            <div className="metric">
                              <span className="metric-label">Precio:</span>
                              <span className="metric-value price">
                                ${book.price.toFixed(2)}
                              </span>
                            </div>
                            <div className="metric">
                              <span className="metric-label">Inventario:</span>
                              <span
                                className={`metric-value ${
                                  book.stock === 0 ? "low-stock" : ""
                                }`}
                              >
                                {book.stock} unidades
                              </span>
                            </div>
                          </div>

                          <div className="book-status">
                            <span
                              className={`status-badge ${
                                book.available ? "available" : "unavailable"
                              }`}
                            >
                              {book.available
                                ? "✅ Disponible"
                                : "❌ No Disponible"}
                            </span>
                            <span className="book-id">ID: {book.id}</span>
                          </div>
                        </div>

                        <div className="book-card-footer">
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(book.id)}
                            title="Editar libro"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(book.id)}
                            title="Eliminar libro"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Información del catálogo */}
                  <div className="catalog-info">
                    <p>
                      {searchQuery ? (
                        <>
                          Mostrando <strong>{filteredBooks.length}</strong> de{" "}
                          <strong>{books.length}</strong> libros
                          {searchQuery && ` para "${searchQuery}"`}
                        </>
                      ) : (
                        <>
                          Total de <strong>{books.length}</strong> libros en el
                          catálogo
                        </>
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookList;
