import React, { useState } from "react";
import "./GuestBookCard.css";

const GuestBookCard = ({ book, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (quantity < 1) return;

    setIsAdding(true);
    try {
      await onAddToCart(book, quantity);
      setQuantity(1);
    } finally {
      setIsAdding(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < book.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="guest-book-card">
      <div className="book-image-container">
        <img
          src={
            book.img || "https://via.placeholder.com/400x300?text=Sin+Imagen"
          }
          alt={book.title}
          className="book-image"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/400x300?text=Imagen+No+Disponible";
          }}
        />
        <div className="book-overlay"></div>

        <div className="book-badges">
          {book.isFavorite && (
            <div className="favorite-badge">⭐ Destacado</div>
          )}
          {book.stock < 5 && book.stock > 0 && (
            <div className="low-stock-badge">
              ⚠️ Solo {book.stock} disponibles
            </div>
          )}
          {book.stock >= 5 && (
            <div className="stock-badge">📦 {book.stock} disponibles</div>
          )}
        </div>
      </div>

      <div className="book-content">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">por {book.author}</p>

        <div className="book-meta">
          <span className="book-genre">{book.genre}</span>
          <span className="book-stock">
            {book.stock > 0 ? `📦 ${book.stock} disponibles` : "❌ Agotado"}
          </span>
        </div>

        <div className="book-footer">
          <div className="price-section">
            <span className="price-label">Precio:</span>
            <span className="book-price">${book.price.toFixed(2)}</span>
          </div>
        </div>
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={isAdding || book.stock === 0}
        >
          {isAdding ? (
            <>
              <span className="spinner-mini"></span>
              Agregando...
            </>
          ) : (
            "🛒 Agregar al Carrito"
          )}
        </button>
      </div>
    </div>
  );
};

export default GuestBookCard;
