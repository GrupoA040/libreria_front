import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const { userRole, logout, getCartItemCount } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleRoleSwitch = () => {
    logout();
  };

  const goToCart = () => {
    navigate("/cart");
  };

  const goToAdmin = () => {
    navigate("/admin");
  };

  const goToHome = () => {
    navigate("/");
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">
          <h1 className="logo" onClick={goToHome}>
            📚 Librería Virtual
          </h1>
          <div className="user-role-badge">
            {userRole === "admin" ? "🔧 Administrador" : "👤 Invitado"}
          </div>
        </div>

        <div className="header-right">
          {userRole === "guest" && (
            <button className="cart-btn" onClick={goToCart}>
              🛒 Carrito
              {getCartItemCount() > 0 && (
                <span className="cart-count">{getCartItemCount()}</span>
              )}
            </button>
          )}

          {userRole === "admin" && (
            <button className="admin-btn" onClick={goToAdmin}>
              📊 Panel Admin
            </button>
          )}

          <button className="switch-role-btn" onClick={handleRoleSwitch}>
            🔄 Cambiar Rol
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            🚪 Salir
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
