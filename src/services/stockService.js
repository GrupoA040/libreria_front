// src/services/stockService.js
const STOCK_API_URL = "https://la-libreria.onrender.com/api/stock";

class StockService {
  // Verificar disponibilidad de stock
  async verificarDisponibilidad(libroId, cantidad = 1) {
    try {
      const response = await fetch(
        `${STOCK_API_URL}/verificar/${libroId}?cantidad=${cantidad}`
      );
      if (!response.ok) {
        throw new Error("Error al verificar disponibilidad");
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      return { success: false, disponible: false };
    }
  }

  // Actualizar stock manualmente (admin)
  async actualizarStockManual(libroId, stockData) {
    try {
      const response = await fetch(`${STOCK_API_URL}/actualizar/${libroId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stockData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar stock");
      }

      return await response.json();
    } catch (error) {
      console.error("Error al actualizar stock:", error);
      throw error;
    }
  }

  // Obtener libros con bajo stock
  async obtenerLibrosConBajoStock() {
    try {
      const response = await fetch(`${STOCK_API_URL}/bajo-stock`);
      if (!response.ok) {
        throw new Error("Error al obtener libros con bajo stock");
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  // Obtener libros agotados
  async obtenerLibrosAgotados() {
    try {
      const response = await fetch(`${STOCK_API_URL}/agotados`);
      if (!response.ok) {
        throw new Error("Error al obtener libros agotados");
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  // Obtener reporte de inventario
  async obtenerReporteInventario() {
    try {
      const response = await fetch(`${STOCK_API_URL}/reporte`);
      if (!response.ok) {
        throw new Error("Error al obtener reporte de inventario");
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  // Actualizar stock después de venta
  async actualizarStockDespuesVenta(libroId, cantidad) {
    try {
      const response = await fetch(`${STOCK_API_URL}/actualizar-venta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ libroId, cantidad }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar stock");
      }

      return await response.json();
    } catch (error) {
      console.error("Error al actualizar stock después de venta:", error);
      throw error;
    }
  }
}

export default new StockService();
