import React, { useState } from "react";

function AdminPanel({ books, onAddBook, onUpdateBook, onDeleteBook, onClose }) {
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    author: "",
    price: "",
    genre: "",
    stock: "",
    img: "",
    isFavorite: false,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : name === "price" || name === "stock"
          ? parseFloat(value) || ""
          : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      onUpdateBook(formData);
    } else {
      onAddBook(formData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: null,
      title: "",
      author: "",
      price: "",
      genre: "",
      stock: "",
      img: "",
      isFavorite: false,
    });
    setIsEditing(false);
  };

  const handleEdit = (book) => {
    setFormData(book);
    setIsEditing(true);
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Panel de Administración</h2>
        <button className="close-admin-btn" onClick={onClose}>
          Cerrar Panel
        </button>
      </div>

      <form className="book-form" onSubmit={handleSubmit}>
        <h3>{isEditing ? "Editar Libro" : "Agregar Nuevo Libro"}</h3>

        <div className="form-group">
          <label>Título:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Autor:</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Precio ($):</label>
          <input
            type="number"
            name="price"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Género:</label>
          <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Stock:</label>
          <input
            type="number"
            name="stock"
            min="0"
            value={formData.stock}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Portada:</label>
          <input
            type="text"
            name="img"
            value={formData.img}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isFavorite"
              checked={formData.isFavorite}
              onChange={handleInputChange}
            />
            Marcar como favorito
          </label>
        </div>

        <div className="form-buttons">
          <button type="submit" className="save-btn">
            {isEditing ? "Actualizar" : "Agregar"}
          </button>
          <button type="button" className="cancel-btn" onClick={resetForm}>
            Cancelar
          </button>
        </div>
      </form>

      <div className="admin-books-list">
        <h3>Libros en Inventario ({books.length})</h3>
        {books.map((book) => (
          <div key={book.id} className="admin-book-item">
            <div>
              <h4>
                {book.title} {book.isFavorite && "❤️"}
              </h4>
              <p>
                {book.author} | {book.genre} | ${book.price} | Stock:{" "}
                {book.stock}
              </p>
            </div>
            <div className="admin-book-actions">
              <button className="edit-btn" onClick={() => handleEdit(book)}>
                Editar
              </button>
              <button
                className="delete-btn"
                onClick={() => onDeleteBook(book.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;
