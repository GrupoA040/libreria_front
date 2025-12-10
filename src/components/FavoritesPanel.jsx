import React, { useState } from "react";
import BookCard from "./BookCard";

function FavoritesPanel({ favorites, onToggleFavorite, onAddToCart, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar favoritos por búsqueda
  const filteredFavorites = favorites.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="favorites-panel">
      <div className="favorites-header">
        <h2>Mis Favoritos ({favorites.length})</h2>
        <button className="close-favorites-btn" onClick={onClose}>
          Volver a Tienda
        </button>
      </div>

      {/* Barra de búsqueda en favoritos */}
      <div className="search-bar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar en mis favoritos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={clearSearch}
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
          <span className="search-icon">🔍</span>
        </div>
        {searchTerm && (
          <div className="search-results-info">
            <span>
              {filteredFavorites.length === 0
                ? "No se encontraron favoritos"
                : `Encontrados ${filteredFavorites.length} de ${favorites.length} favoritos`}
            </span>
            <button className="clear-search-link" onClick={clearSearch}>
              Limpiar búsqueda
            </button>
          </div>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <div className="empty-favorites-icon">🤍</div>
          <h3>No tienes libros favoritos</h3>
          <p>
            Agrega libros a favoritos haciendo clic en el corazón en cada libro
          </p>
        </div>
      ) : (
        <>
          <div className="favorites-list">
            {filteredFavorites.length > 0 ? (
              filteredFavorites.map((book) => (
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
                <p>
                  No se encontraron favoritos que coincidan con "{searchTerm}"
                </p>
              </div>
            )}
          </div>

          <div className="favorites-actions">
            <button
              className="clear-favorites-btn"
              onClick={() => {
                if (
                  window.confirm(
                    "¿Estás seguro de que quieres eliminar todos tus favoritos?"
                  )
                ) {
                  favorites.forEach((book) => onToggleFavorite(book.id));
                }
              }}
              disabled={favorites.length === 0}
            >
              Eliminar Todos los Favoritos
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default FavoritesPanel;
