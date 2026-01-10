import React from "react";

function GenreFilter({
  genres,
  selectedGenre,
  onSelectGenre,
  searchTerm = "",
}) {
  return (
    <div className="genre-filter">
      <h3>Filtrar por género:</h3>

      {/* Mostrar filtros activos */}
      {(selectedGenre !== "Todos" || searchTerm) && (
        <div className="active-filters">
          {selectedGenre !== "Todos" && (
            <div className="filter-tag">
              <span>Género: {selectedGenre}</span>
              <button
                onClick={() => onSelectGenre("Todos")}
                title="Quitar filtro de género"
              >
                ✕
              </button>
            </div>
          )}

          {searchTerm && (
            <div className="filter-tag">
              <span>Búsqueda: "{searchTerm}"</span>
            </div>
          )}
        </div>
      )}

      <div className="genre-buttons">
        {genres.map((genre) => (
          <button
            key={genre}
            className={`genre-btn ${selectedGenre === genre ? "active" : ""}`}
            onClick={() => onSelectGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}

export default GenreFilter;
