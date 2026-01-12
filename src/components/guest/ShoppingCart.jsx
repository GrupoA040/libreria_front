import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./ShoppingCart.css";

const ShoppingCart = () => {
  const {
    shoppingCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  } = useAuth();

  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  if (shoppingCart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>
        <h2>Tu carrito está vacío</h2>
        <p>Agrega algunos libros para comenzar tu compra</p>
        <button
          className="continue-shopping-btn"
          onClick={handleContinueShopping}
        >
          ← Volver al Catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="shopping-cart">
      <div className="cart-header">
        <h1>🛒 Tu Carrito de Compras</h1>
        <p className="cart-subtitle">
          Revisa los productos que has seleccionado
        </p>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {shoppingCart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <img
                  src={
                    item.img || "https://via.placeholder.com/100x150?text=Libro"
                  }
                  alt={item.title}
                />
              </div>

              <div className="item-details">
                <h3 className="item-title">{item.title}</h3>
                <p className="item-author">{item.author}</p>
                <p className="item-genre">{item.genre}</p>
              </div>

              <div className="item-quantity">
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
              </div>

              <div className="item-price">
                <span className="unit-price">${item.price.toFixed(2)} c/u</span>
                <span className="total-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>

              <button
                className="remove-item-btn"
                onClick={() => removeFromCart(item.id)}
                title="Eliminar del carrito"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Resumen de Compra</h3>

          <div className="summary-row">
            <span>Productos ({getCartItemCount()})</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Envío</span>
            <span className="free-shipping">Gratis</span>
          </div>

          <div className="summary-row tax-row">
            <span>Impuestos (10%)</span>
            <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
          </div>

          <div className="summary-row total-row">
            <span>Total</span>
            <span className="total-amount">
              ${(getCartTotal() * 1.1).toFixed(2)}
            </span>
          </div>

          <div className="cart-actions">
            <button className="clear-cart-btn" onClick={clearCart}>
              🗑️ Vaciar Carrito
            </button>

            <button
              className="continue-shopping-btn"
              onClick={handleContinueShopping}
            >
              ← Seguir Comprando
            </button>

            <button className="checkout-btn" onClick={handleCheckout}>
              Proceder al Pago →
            </button>
          </div>

          <div className="payment-methods">
            <p className="payment-title">Métodos de pago aceptados:</p>
            <div className="payment-icons">
              <span>💳</span>
              <span>🏦</span>
              <span>📱</span>
              <span>💰</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
