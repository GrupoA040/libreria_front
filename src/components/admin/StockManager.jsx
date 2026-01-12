import React, { useState, useEffect } from "react";
import stockService from "../../services/stockService";
import bookService from "../../services/bookService";
import "./StockManager.css";

const StockManager = () => {
  const [libros, setLibros] = useState([]);
  const [bajoStock, setBajoStock] = useState([]);
  const [agotados, setAgotados] = useState([]);
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para edición de stock
  const [editandoLibro, setEditandoLibro] = useState(null);
  const [nuevoStock, setNuevoStock] = useState("");
  const [disponible, setDisponible] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    fetchDatosStock();
  }, []);

  const fetchDatosStock = async () => {
    try {
      setLoading(true);

      // Obtener todos los libros
      const librosData = await bookService.getAllBooks();
      setLibros(librosData);

      // Obtener libros con bajo stock
      const bajoStockData = await stockService.obtenerLibrosConBajoStock();
      if (bajoStockData.success) {
        setBajoStock(bajoStockData.libros || []);
      }

      // Obtener libros agotados
      const agotadosData = await stockService.obtenerLibrosAgotados();
      if (agotadosData.success) {
        setAgotados(agotadosData.libros || []);
      }

      // Obtener reporte
      const reporteData = await stockService.obtenerReporteInventario();
      if (reporteData.success) {
        setReporte(reporteData.reporte);
      }

      setError(null);
    } catch (err) {
      setError("Error al cargar datos de stock");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleIniciarEdicion = (libro) => {
    setEditandoLibro(libro);
    setNuevoStock(libro.stock.toString());
    setDisponible(libro.available);
  };

  const handleGuardarStock = async () => {
    if (!editandoLibro || !nuevoStock) return;

    const stockValue = parseInt(nuevoStock);
    if (isNaN(stockValue) || stockValue < 0) {
      alert("El stock debe ser un número válido mayor o igual a 0");
      return;
    }

    setGuardando(true);
    try {
      await stockService.actualizarStockManual(editandoLibro.id, {
        stock: stockValue,
        disponible: disponible,
      });

      alert("Stock actualizado exitosamente");

      // Actualizar la lista localmente
      setLibros((prevLibros) =>
        prevLibros.map((libro) =>
          libro.id === editandoLibro.id
            ? { ...libro, stock: stockValue, available: disponible }
            : libro
        )
      );

      // Actualizar listas de bajo stock y agotados
      fetchDatosStock();

      // Limpiar formulario
      setEditandoLibro(null);
      setNuevoStock("");
    } catch (err) {
      alert("Error al actualizar stock: " + err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleCancelarEdicion = () => {
    setEditandoLibro(null);
    setNuevoStock("");
    setDisponible(true);
  };

  const handleRecargarInventario = () => {
    fetchDatosStock();
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando inventario...</p>
      </div>
    );

  return (
    <div className="stock-manager">
      <header className="stock-header">
        <h1>📦 Gestión de Inventario</h1>
        <p>Administra el stock de libros en tiempo real</p>
      </header>

      {error && (
        <div className="error-alert">
          <p>{error}</p>
          <button onClick={fetchDatosStock}>Reintentar</button>
        </div>
      )}

      {/* Panel de Resumen */}
      {reporte && (
        <div className="summary-panel">
          <div className="summary-card">
            <div className="summary-icon">📚</div>
            <div className="summary-content">
              <h3>{reporte.totalLibros}</h3>
              <p>Libros en inventario</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">📦</div>
            <div className="summary-content">
              <h3>{reporte.totalStock}</h3>
              <p>Unidades totales</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">💰</div>
            <div className="summary-content">
              <h3>${reporte.valorTotal?.toFixed(2) || "0.00"}</h3>
              <p>Valor del inventario</p>
            </div>
          </div>

          <div className="summary-card warning">
            <div className="summary-icon">⚠️</div>
            <div className="summary-content">
              <h3>{reporte.librosBajoStock}</h3>
              <p>Bajo stock</p>
            </div>
          </div>

          <div className="summary-card danger">
            <div className="summary-icon">❌</div>
            <div className="summary-content">
              <h3>{reporte.librosAgotados}</h3>
              <p>Agotados</p>
            </div>
          </div>
        </div>
      )}

      {/* Sección de Edición */}
      {editandoLibro && (
        <div className="edition-panel">
          <h3>✏️ Editando: {editandoLibro.title}</h3>

          <div className="edition-form">
            <div className="form-group">
              <label>Stock Actual:</label>
              <span className="current-stock">
                {editandoLibro.stock} unidades
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="nuevoStock">Nuevo Stock:</label>
              <input
                type="number"
                id="nuevoStock"
                value={nuevoStock}
                onChange={(e) => setNuevoStock(e.target.value)}
                min="0"
                placeholder="Ingrese el nuevo stock"
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={disponible}
                  onChange={(e) => setDisponible(e.target.checked)}
                />
                <span>Disponible para venta</span>
              </label>
            </div>

            <div className="edition-actions">
              <button
                className="cancel-btn"
                onClick={handleCancelarEdicion}
                disabled={guardando}
              >
                Cancelar
              </button>
              <button
                className="save-btn"
                onClick={handleGuardarStock}
                disabled={guardando}
              >
                {guardando ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de Libros */}
      <div className="inventory-table">
        <div className="table-header">
          <h2>📋 Inventario Completo</h2>
          <button className="refresh-btn" onClick={handleRecargarInventario}>
            🔄 Actualizar
          </button>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Autor</th>
                <th>Género</th>
                <th>Stock</th>
                <th>Disponible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {libros.map((libro) => (
                <tr
                  key={libro.id}
                  className={
                    libro.stock === 0
                      ? "out-of-stock"
                      : libro.stock < 10
                      ? "low-stock"
                      : ""
                  }
                >
                  <td>{libro.id}</td>
                  <td className="book-title">{libro.title}</td>
                  <td>{libro.author}</td>
                  <td>{libro.genre}</td>
                  <td>
                    <span
                      className={`stock-badge ${
                        libro.stock === 0
                          ? "danger"
                          : libro.stock < 10
                          ? "warning"
                          : "success"
                      }`}
                    >
                      {libro.stock} unidades
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        libro.available ? "available" : "unavailable"
                      }`}
                    >
                      {libro.available ? "✅ Sí" : "❌ No"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="edit-stock-btn"
                      onClick={() => handleIniciarEdicion(libro)}
                    >
                      ✏️ Editar Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección de Alertas */}
      <div className="alerts-section">
        <div className="alert-panel warning-alert">
          <h3>⚠️ Libros con Bajo Stock</h3>
          {bajoStock.length === 0 ? (
            <p className="no-alerts">No hay libros con bajo stock</p>
          ) : (
            <ul>
              {bajoStock.map((libro) => (
                <li key={libro.id}>
                  <span className="alert-title">{libro.title}</span>
                  <span className="alert-stock">
                    {libro.stock} unidades restantes
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="alert-panel danger-alert">
          <h3>❌ Libros Agotados</h3>
          {agotados.length === 0 ? (
            <p className="no-alerts">No hay libros agotados</p>
          ) : (
            <ul>
              {agotados.map((libro) => (
                <li key={libro.id}>
                  <span className="alert-title">{libro.title}</span>
                  <span className="alert-status">AGOTADO</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockManager;
