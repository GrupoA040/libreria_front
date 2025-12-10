import React from "react";

function BookCard({ book, onAddToCart, onToggleFavorite, searchTerm = "" }) {
  const { id, title, author, price, genre, stock, isFavorite, img } = book;

  // Función para resaltar el término de búsqueda en el texto
  const highlightText = (text, search) => {
    if (!search) return text;

    const regex = new RegExp(`(${search})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="highlighted-text">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Generar un color basado en el género para la portada
  const genreColors = {
    "Realismo mágico": "#FF6B6B",
    "Novela clásica": "#4ECDC4",
    "Ciencia ficción": "#45B7D1",
    Romance: "#96CEB4",
    Fábula: "#FFEAA7",
    Fantasía: "#DDA0DD",
  };

  const bookColor = genreColors[genre] || "#95A5A6";

  return (
    <div className="book-card">
      <div className="book-image">
        <img src={img} alt={name} class="book-image" />
        <button
          className="favorite-btn"
          onClick={() => onToggleFavorite(id)}
          title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>
      <div className="book-info">
        <h3 className="book-title">
          {searchTerm ? highlightText(title, searchTerm) : title}
        </h3>
        <p className="book-author">
          {searchTerm ? highlightText(author, searchTerm) : author}
        </p>
        <span className="book-genre">{genre}</span>
        <div className="book-footer">
          <div>
            <div className="book-price">${price.toFixed(2)}</div>
            <div className="book-stock">{stock} disponibles</div>
          </div>
          <button
            className="add-to-cart-btn"
            onClick={() => onAddToCart(book)}
            disabled={stock === 0}
          >
            {stock === 0 ? "Agotado" : "Añadir al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
