import axios from "axios";

const api = axios.create({
  //baseURL: "http://localhost:8080/api", // URL de tu API
  baseURL: "https://la-libreria.onrender.com/api", // URL de tu API
  timeout: 10000,
});

// Servicio para libros
export const bookService = {
  // Obtener todos los libros
  getBooks: async () => {
    try {
      const response = await api.get("/libros");
      return response.data;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  },

  // Obtener un libro por ID
  getBookById: async (id) => {
    try {
      const response = await api.get(`/libros/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching book ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo libro
  createBook: async (bookData) => {
    try {
      const response = await api.post("/libros", bookData);
      return response.data;
    } catch (error) {
      console.error("Error creating book:", error);
      throw error;
    }
  },

  // Actualizar libro
  updateBook: async (id, bookData) => {
    try {
      const response = await api.put(`/libros/${id}`, bookData);
      return response.data;
    } catch (error) {
      console.error(`Error updating book ${id}:`, error);
      throw error;
    }
  },

  // Eliminar libro
  deleteBook: async (id) => {
    try {
      const response = await api.delete(`/libros/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting book ${id}:`, error);
      throw error;
    }
  },
};
