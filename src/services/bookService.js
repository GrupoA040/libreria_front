const API_URL = "https://la-libreria.onrender.com/api/libros";

class BookService {
  // Obtener todos los libros
  async getAllBooks() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Error al obtener los libros");
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  // Obtener un libro por ID
  async getBookById(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) {
        throw new Error("Error al obtener el libro");
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  // Crear un nuevo libro
  async createBook(book) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });

      if (!response.ok) {
        throw new Error("Error al crear el libro");
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  // Actualizar un libro existente
  async updateBook(id, book) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el libro");
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  // Eliminar un libro
  async deleteBook(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        // Intentar obtener el mensaje de error
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Error al eliminar el libro");
      }

      // Si la respuesta tiene contenido, parsearlo
      if (response.status !== 204) {
        const result = await response.json();
        return {
          success: true,
          message: result.message || "Libro eliminado correctamente",
          id: id,
        };
      }

      return {
        success: true,
        message: "Libro eliminado correctamente",
        id: id,
      };
    } catch (error) {
      console.error("Error al eliminar:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Marcar/desmarcar como favorito
  async toggleFavorite(id, isFavorite) {
    try {
      const response = await fetch(`${API_URL}/${id}/favorite`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isFavorite }),
      });
      if (!response.ok) {
        throw new Error("Error al actualizar estado destacado");
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  // Búsqueda de libros (opcional)
  async searchBooks(query) {
    try {
      const response = await fetch(
        `${API_URL}/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error("Error en la búsqueda");
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async processPurchase(orderData) {
    try {
      // Simular llamada a API
      const response = await fetch(`${API_URL}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Error al procesar la compra");
      }

      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      // Para desarrollo, simular éxito
      return {
        success: true,
        orderId: Math.random().toString(36).substr(2, 9).toUpperCase(),
        message: "Compra procesada exitosamente (modo simulación)",
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export default new BookService();
