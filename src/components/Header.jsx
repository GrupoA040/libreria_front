import React from "react";

function Header({
  cartCount,
  favoritesCount,
  purchaseHistoryCount = 0,
  toggleAdmin,
  toggleFavorites,
  togglePurchaseHistory,
  showAdmin,
  showFavorites,
  showPurchaseHistory,
}) {
  return (
    <header>
      <div className="logo">📚 La Librería</div>
      <nav>
        <div className="nav-icons">
          <div
            className={`history-icon ${showPurchaseHistory ? "active" : ""}`}
            onClick={togglePurchaseHistory}
            title="Historial de Compras"
          >
            {showPurchaseHistory ? "📋" : "📋"}
            {!showPurchaseHistory && purchaseHistoryCount > 0 && (
              <span className="icon-count history-count">
                {purchaseHistoryCount}
              </span>
            )}
          </div>

          <div
            className={`favorites-icon ${showFavorites ? "active" : ""}`}
            onClick={toggleFavorites}
            title="Favoritos"
          >
            {showFavorites ? "❤️" : "🤍"}
            {!showFavorites && favoritesCount > 0 && (
              <span className="icon-count favorites-count">
                {favoritesCount}
              </span>
            )}
          </div>

          <div className="cart-icon" title="Carrito">
            <button class="action-btn" id="btn-cart">
              <i class="fas fa-shopping-cart"></i>
              <span class="badge hidden" id="badge-cart"></span>
            </button>
            {cartCount > 0 && (
              <span className="icon-count cart-count">{cartCount}</span>
            )}
          </div>
        </div>

        <button
          className={`admin-btn ${showAdmin ? "active" : ""}`}
          onClick={toggleAdmin}
        >
          {showAdmin ? "Volver a Tienda" : "Administración"}
        </button>
      </nav>
    </header>
  );
}

export default Header;
