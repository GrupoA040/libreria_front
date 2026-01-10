import React from "react";
import CartItem from "./CartItem";

function ShoppingCart({
  cart,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
  onCheckout,
  total,
}) {
  return (
    <div className="cart-sidebar">
      <h2 className="cart-title">Carrito de Compras</h2>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>El carrito está vacío</p>
          <p>Agrega algunos libros para continuar</p>
        </div>
      ) : (
        <>
          {cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={onRemoveItem}
              onUpdateQuantity={onUpdateQuantity}
            />
          ))}

          <div className="cart-total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="cart-actions">
            <button className="clear-cart-btn" onClick={onClearCart}>
              Vaciar Carrito
            </button>
            <button className="checkout-btn" onClick={onCheckout}>
              Finalizar Compra
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ShoppingCart;
