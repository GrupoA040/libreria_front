// src/components/admin/AdminSalesPanel.jsx
import React, { useState, useEffect } from "react";
import ventaService from "../../services/ventaService";
import "./AdminSalesPanel.css";

const AdminSalesPanel = () => {
  const [ventas, setVentas] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVenta, setSelectedVenta] = useState(null);

  useEffect(() => {
    fetchVentas();
    fetchEstadisticas();
  }, []);

  const fetchVentas = async () => {
    try {
      setLoading(true);
      const data = await ventaService.obtenerTodasLasVentas();
      setVentas(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar las ventas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEstadisticas = async () => {
    try {
      const data = await ventaService.obtenerEstadisticas();
      setEstadisticas(data);
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
    }
  };

  const handleViewDetails = async (ventaId) => {
    try {
      const venta = await ventaService.obtenerVentaPorId(ventaId);
      setSelectedVenta(venta);
    } catch (err) {
      console.error("Error al obtener detalles:", err);
    }
  };

  const handleCancelVenta = async (ventaId) => {
    if (
      window.confirm(
        "¿Estás seguro de cancelar esta venta? Esta acción revertirá el stock de los libros."
      )
    ) {
      try {
        await ventaService.cancelarVenta(ventaId);
        alert("Venta cancelada exitosamente");
        fetchVentas();
        fetchEstadisticas();
        if (selectedVenta?.id === ventaId) {
          setSelectedVenta(null);
        }
      } catch (err) {
        alert("Error al cancelar la venta: " + err.message);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando ventas...</p>
      </div>
    );

  return (
    <div className="admin-sales-panel">
      <header className="sales-header">
        <h1>📊 Panel de Ventas</h1>
        <p>Gestión y seguimiento de todas las ventas del sistema</p>
      </header>

      {error && (
        <div className="error-alert">
          <p>{error}</p>
          <button onClick={fetchVentas}>Reintentar</button>
        </div>
      )}

      {/* Estadísticas */}
      {estadisticas && (
        <div className="sales-stats">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>{formatCurrency(estadisticas.totalMes || 0)}</h3>
              <p>Ventas del Mes</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>{estadisticas.cantidadMes || 0}</h3>
              <p>Ventas Totales</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3>{formatCurrency(estadisticas.totalSemana || 0)}</h3>
              <p>Ventas de la Semana</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <h3>{estadisticas.cantidadSemana || 0}</h3>
              <p>Ventas Recientes</p>
            </div>
          </div>
        </div>
      )}

      <div className="sales-content">
        {/* Lista de Ventas */}
        <div className="ventas-list">
          <div className="list-header">
            <h2>Historial de Ventas</h2>
            <button className="refresh-btn" onClick={fetchVentas}>
              🔄 Actualizar
            </button>
          </div>

          <div className="ventas-table-container">
            <table className="ventas-table">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventas.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No hay ventas registradas
                    </td>
                  </tr>
                ) : (
                  ventas.map((venta) => (
                    <tr key={venta.id}>
                      <td className="venta-numero">{venta.numeroVenta}</td>
                      <td>
                        <div className="cliente-info">
                          <strong>{venta.clienteNombre}</strong>
                          <small>{venta.clienteEmail}</small>
                        </div>
                      </td>
                      <td>{formatDate(venta.fechaVenta)}</td>
                      <td className="venta-total">
                        {formatCurrency(venta.montoTotal + venta.impuestos)}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${venta.estado.toLowerCase()}`}
                        >
                          {venta.estado}
                        </span>
                      </td>
                      <td>
                        <div className="venta-actions">
                          <button
                            className="view-btn"
                            onClick={() => handleViewDetails(venta.id)}
                          >
                            👁️ Ver
                          </button>
                          {venta.estado === "COMPLETADA" && (
                            <button
                              className="cancel-btn"
                              onClick={() => handleCancelVenta(venta.id)}
                            >
                              ❌ Cancelar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detalles de Venta Seleccionada */}
        {selectedVenta && (
          <div className="venta-details">
            <div className="details-header">
              <h2>Detalles de Venta</h2>
              <button
                className="close-btn"
                onClick={() => setSelectedVenta(null)}
              >
                ×
              </button>
            </div>

            <div className="details-content">
              <div className="section">
                <h3>Información de la Venta</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Número:</span>
                    <span className="info-value">
                      {selectedVenta.numeroVenta}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Fecha:</span>
                    <span className="info-value">
                      {formatDate(selectedVenta.fechaVenta)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Estado:</span>
                    <span
                      className={`info-value status ${selectedVenta.estado.toLowerCase()}`}
                    >
                      {selectedVenta.estado}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Método de Pago:</span>
                    <span className="info-value">
                      {selectedVenta.metodoPago}
                    </span>
                  </div>
                </div>
              </div>

              <div className="section">
                <h3>Información del Cliente</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Nombre:</span>
                    <span className="info-value">
                      {selectedVenta.clienteNombre}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">
                      {selectedVenta.clienteEmail}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Dirección:</span>
                    <span className="info-value">
                      {selectedVenta.clienteDireccion}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Ciudad:</span>
                    <span className="info-value">
                      {selectedVenta.clienteCiudad}
                    </span>
                  </div>
                </div>
              </div>

              <div className="section">
                <h3>Productos Comprados</h3>
                <div className="productos-list">
                  {selectedVenta.detalles?.map((detalle, index) => (
                    <div key={index} className="producto-item">
                      <div className="producto-info">
                        <span className="producto-title">
                          {detalle.libro?.title || "Libro eliminado"}
                        </span>
                        <span className="producto-meta">
                          {detalle.cantidad} x{" "}
                          {formatCurrency(detalle.precioUnitario)}
                        </span>
                      </div>
                      <span className="producto-subtotal">
                        {formatCurrency(detalle.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section total-section">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(selectedVenta.montoTotal)}</span>
                </div>
                <div className="total-row">
                  <span>Impuestos (10%):</span>
                  <span>{formatCurrency(selectedVenta.impuestos)}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total:</span>
                  <span>
                    {formatCurrency(
                      selectedVenta.montoTotal + selectedVenta.impuestos
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSalesPanel;
