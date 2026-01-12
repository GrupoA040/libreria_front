import React from "react";
import { useAuth } from "../../context/AuthContext";
import "./RoleSelector.css";

const RoleSelector = () => {
  const { loginAsAdmin, loginAsGuest } = useAuth();

  return (
    <div className="role-selector-container">
      <div className="role-selector-card">
        <div className="role-selector-header">
          <h1>📚 Bienvenido a la Librería Virtual</h1>
          <p className="subtitle">Selecciona cómo deseas ingresar</p>
        </div>

        <div className="role-options">
          <div className="role-card guest-role">
            <div className="role-icon">🛒</div>
            <h2>Invitado</h2>
            <p className="role-description">
              Explora nuestro catálogo de libros y realiza compras
            </p>
            <ul className="role-features">
              <li>✔️ Ver catálogo completo</li>
              <li>✔️ Agregar libros al carrito</li>
              <li>✔️ Realizar compras</li>
              <li>✔️ Filtrar y buscar libros</li>
            </ul>
            <button className="role-btn guest-btn" onClick={loginAsGuest}>
              Entrar como Invitado
            </button>
          </div>

          <div className="separator">
            <span>O</span>
          </div>

          <div className="role-card admin-role">
            <div className="role-icon">🔧</div>
            <h2>Administrador</h2>
            <p className="role-description">
              Gestiona el catálogo y administra el inventario
            </p>
            <ul className="role-features">
              <li>⚙️ Agregar nuevos libros</li>
              <li>⚙️ Editar información existente</li>
              <li>⚙️ Eliminar libros del catálogo</li>
              <li>⚙️ Gestionar inventario y precios</li>
            </ul>
            <button className="role-btn admin-btn" onClick={loginAsAdmin}>
              Entrar como Administrador
            </button>
          </div>
        </div>

        <div className="role-footer">
          <p className="note">
            <strong>Nota:</strong> Esta es una aplicación de demostración. No se
            requiere autenticación real.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
