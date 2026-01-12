import React, { useState, useEffect } from "react";
import bookService from "../services/bookService";

const BookForm = ({ book, onSave, onCancel, isCreating = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: 0,
    stock: 0,
    genre: "",
    img: "",
    isFavorite: false,
    available: true,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Inicializar formulario
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        price: book.price || 0,
        stock: book.stock || 0,
        genre: book.genre || "",
        img: book.img || "",
        isFavorite: book.isFavorite || false,
        available: book.available !== undefined ? book.available : true,
      });
    } else if (!isCreating) {
      resetForm();
    }
  }, [book, isCreating]);

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      price: 0,
      stock: 0,
      genre: "",
      img: "",
      isFavorite: false,
      available: true,
    });
    setErrors({});
    setSuccessMessage("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? value === ""
            ? ""
            : parseFloat(value)
          : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido";
    } else if (formData.title.length < 2) {
      newErrors.title = "El título debe tener al menos 2 caracteres";
    }

    if (!formData.author.trim()) {
      newErrors.author = "El autor es requerido";
    } else if (formData.author.length < 2) {
      newErrors.author = "El autor debe tener al menos 2 caracteres";
    }

    if (formData.price === "" || formData.price <= 0) {
      newErrors.price = "El precio debe ser mayor a 0";
    }

    if (formData.stock === "" || formData.stock < 0) {
      newErrors.stock = "El stock no puede ser negativo";
    }

    if (!formData.genre.trim()) {
      newErrors.genre = "El género es requerido";
    }

    if (formData.img.trim() && !isValidUrl(formData.img)) {
      newErrors.img = "Por favor ingrese una URL válida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({ submit: "" });

    try {
      const bookToSave = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      const savedBook = book
        ? await bookService.updateBook(book.id, bookToSave)
        : await bookService.createBook(bookToSave);

      const message = book
        ? "¡Libro actualizado correctamente!"
        : "¡Libro agregado al catálogo correctamente!";

      setSuccessMessage(message);

      if (!book) {
        setTimeout(() => {
          resetForm();
          if (onSave) {
            onSave(savedBook);
          }
        }, 2000);
      } else {
        if (onSave) {
          onSave(savedBook);
        }
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      setErrors({
        submit:
          error.message || "Error al guardar el libro. Inténtalo nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    if (onCancel) {
      onCancel();
    }
  };

  const genres = [
    "Ficción",
    "No Ficción",
    "Ciencia Ficción",
    "Fantasía",
    "Misterio",
    "Romance",
    "Biografía",
    "Historia",
    "Ciencia",
    "Tecnología",
    "Autoayuda",
    "Negocios",
    "Cocina",
    "Viajes",
    "Infantil",
    "Juvenil",
    "Poesía",
    "Teatro",
    "Otro",
  ];

  return (
    <div className="book-form-container">
      <h2>{book ? "✏️ Editar Libro" : "📚 Agregar Nuevo Libro al Catálogo"}</h2>

      {successMessage && (
        <div className="success-message">
          {successMessage}
          {!book && (
            <div className="success-subtitle">
              El formulario se limpiará automáticamente...
            </div>
          )}
        </div>
      )}

      {errors.submit && (
        <div className="form-error-message">{errors.submit}</div>
      )}

      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-section">
          <h3>Información Básica</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Título *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? "error" : ""}
                placeholder="Ingrese el título del libro"
                maxLength={100}
                disabled={isSubmitting}
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="author">Autor *</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={errors.author ? "error" : ""}
                placeholder="Ingrese el autor del libro"
                maxLength={50}
                disabled={isSubmitting}
              />
              {errors.author && (
                <span className="error-message">{errors.author}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Precio ($) *</label>
              <div className="input-with-icon">
                <span className="currency-icon">$</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={errors.price ? "error" : ""}
                  placeholder="0.00"
                  disabled={isSubmitting}
                />
              </div>
              {errors.price && (
                <span className="error-message">{errors.price}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="stock">Inventario *</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className={errors.stock ? "error" : ""}
                placeholder="0"
                disabled={isSubmitting}
              />
              {errors.stock && (
                <span className="error-message">{errors.stock}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="genre">Género *</label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className={errors.genre ? "error" : ""}
              disabled={isSubmitting}
            >
              <option value="">Seleccione un género</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
            {errors.genre && (
              <span className="error-message">{errors.genre}</span>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Imagen y Estado</h3>
          <div className="form-group">
            <label htmlFor="img">URL de la imagen (opcional)</label>
            <input
              type="url"
              id="img"
              name="img"
              value={formData.img}
              onChange={handleChange}
              className={errors.img ? "error" : ""}
              placeholder="https://ejemplo.com/imagen-libro.jpg"
              disabled={isSubmitting}
            />
            {errors.img && <span className="error-message">{errors.img}</span>}
            <small className="form-help">
              Deje vacío para usar una imagen por defecto
            </small>

            {formData.img && (
              <div className="image-preview">
                <div className="preview-label">Vista previa:</div>
                <img
                  src={formData.img}
                  alt="Vista previa"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML =
                      '<div class="image-error">❌ No se puede cargar la imagen</div>';
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-checkboxes">
            <div className="form-check">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isFavorite"
                  checked={formData.isFavorite}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <span className="custom-checkbox"></span>
                <span className="checkbox-text">
                  <span className="checkbox-icon">⭐</span>
                  Marcar como destacado
                </span>
              </label>
            </div>

            <div className="form-check">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <span className="custom-checkbox"></span>
                <span className="checkbox-text">
                  <span className="checkbox-icon">📚</span>
                  Disponible en el catálogo
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-btn"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button type="submit" className="save-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Guardando...
              </>
            ) : book ? (
              "💾 Guardar Cambios"
            ) : (
              "➕ Agregar al Catálogo"
            )}
          </button>
        </div>

        <div className="form-footer">
          <p className="required-notice">* Campos obligatorios</p>
          {book && (
            <p className="edit-notice">
              Editando libro ID: <strong>{book.id}</strong>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default BookForm;
