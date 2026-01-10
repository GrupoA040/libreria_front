import React from "react";

function CartItem({ item, onRemove, onUpdateQuantity }) {
  const { id, title, price, quantity } = item;

  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <h4>{title}</h4>
        <p className="cart-item-price">${price.toFixed(2)} c/u</p>
      </div>
      <div className="cart-item-quantity">
        <button
          className="quantity-btn"
          onClick={() => onUpdateQuantity(id, quantity - 1)}
        >
          -
        </button>
        <span>{quantity}</span>
        <button
          className="quantity-btn"
          onClick={() => onUpdateQuantity(id, quantity + 1)}
        >
          +
        </button>
        <button className="remove-btn" onClick={() => onRemove(id)}>
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default CartItem;
