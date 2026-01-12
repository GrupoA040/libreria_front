// src/services/ventaService.js
const API_URL = "http://localhost:8080/api/ventas";

class VentaService {
  // Procesar una nueva venta
  async procesarVenta(ventaData) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ventaData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al procesar la venta");
      }

      return await response.json();
    } catch (error) {
      console.error("Error al procesar venta:", error);
      throw error;
    }
  }

  // Obtener todas las ventas
  async obtenerTodasLasVentas() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Error al obtener las ventas");
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  // Obtener venta por ID
  async obtenerVentaPorId(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) {
        throw new Error("Error al obtener la venta");
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  // Obtener venta por número
  async obtenerVentaPorNumero(numeroVenta) {
    try {
      const response = await fetch(`${API_URL}/numero/${numeroVenta}`);
      if (!response.ok) {
        throw new Error("Error al obtener la venta");
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  // Obtener ventas por cliente
  async obtenerVentasPorCliente(email) {
    try {
      const response = await fetch(`${API_URL}/cliente/${email}`);
      if (!response.ok) {
        throw new Error("Error al obtener las ventas del cliente");
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  // Obtener estadísticas
  async obtenerEstadisticas() {
    try {
      const response = await fetch(`${API_URL}/estadisticas`);
      if (!response.ok) {
        throw new Error("Error al obtener estadísticas");
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  // Cancelar venta
  async cancelarVenta(id) {
    try {
      const response = await fetch(`${API_URL}/${id}/cancelar`, {
        method: "PUT",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al cancelar la venta");
      }

      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async anularVenta(id, motivo) {
    try {
      const response = await api.put(
        `/ventas/${id}/anular`,
        { motivo },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al anular venta:", error);
      throw error;
    }
  }

  async obtenerReporteVentas(fechaInicio, fechaFin) {
    try {
      const response = await api.get("/ventas/reporte", {
        params: { fechaInicio, fechaFin },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener reporte de ventas:", error);
      throw error;
    }
  }

  // Nuevo método con corrección para precios null
  async procesarVentaCorregida(ventaData) {
    try {
      // Crear copia profunda de los datos
      const datosCorregidos = JSON.parse(JSON.stringify(ventaData));

      // Asegurar que todos los productos tengan precio unitario
      if (
        datosCorregidos.productos &&
        Array.isArray(datosCorregidos.productos)
      ) {
        datosCorregidos.productos = datosCorregidos.productos.map(
          (producto) => ({
            ...producto,
            price: producto.price || 0.0,
          })
        );
      }

      console.log("Procesando venta con precios corregidos:", datosCorregidos);
      return await this.procesarVenta(datosCorregidos);
    } catch (error) {
      console.error("Error en procesarVentaCorregida:", error);
      throw error;
    }
  }
}

export default new VentaService();
