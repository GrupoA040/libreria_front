import { libroFetch } from "./libroFetch";
import React, { useState, useEffect, use } from "react";
import "./App.css";
import Header from "./components/Header";
import BookList from "./components/BookList";
import ShoppingCart from "./components/ShoppingCart";
import GenreFilter from "./components/GenreFilter";
import AdminPanel from "./components/AdminPanel";
import FavoritesPanel from "./components/FavoritesPanel";
import PurchaseHistoryPanel from "./components/PurchaseHistoryPanel";


function App() {
  // const { data, loading, error } = libroFetch("hhttps://la-libreria.onrender.com/api/libros");

  // return (
  // <div className="App">
  //   <h1>Librería</h1>
  //   <div className="card">
  //     <ul>
  //       {error && <li>Error al cargar los libros: {error}</li>}
  //       {loading && <p>Cargando libros...</p>}
  //       {data?.map((libro) => (
  //         <h1 key={libro.id}>{libro.title}-{libro.author}</h1>
  //         ))}
  //     </ul>
  //   </div>
  // </div>
  // );
  // Estado para los libros
  const [books, setBooks] = useState([
    // {
    //   id: 1,
    //   title: "Cien años de soledad",
    //   author: "Gabriel García Márquez",
    //   price: 557.0,
    //   genre: "Realismo mágico",
    //   stock: 10,
    //   isFavorite: false,
    //   img: "https://pdlibrosmex.cdnstatics2.com/usuaris/libros/thumbs/bd9eb6da-9b39-4eb6-8657-2b9fdc6d5fc2/d_360_620/portada_cien-anos-de-soledad-50aniv_gabriel-garcia-marquez_201705191948.webp",
    // },
    {
      id: 2,
      title: "Don Quijote de la Mancha",
      author: "Miguel de Cervantes",
      price: 762.0,
      genre: "Novela clásica",
      stock: 5,
      isFavorite: false,
      img: "https://pdlibrosmex.cdnstatics2.com/usuaris/libros/thumbs/9189a95d-1d73-41ef-9704-bc3be66c60c2/d_360_620/382527_portada_don-quijote-de-la-mancha-comic_miguel-de-cervantes_202310231106.webp",
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      price: 398.0,
      genre: "Ciencia ficción",
      stock: 8,
      isFavorite: false,
      img: "https://pdlibrosmex.cdnstatics2.com/usuaris/libros/thumbs/31073750-4d25-437c-b729-a0b0880bb446/d_360_620/334121_portada_1984_george-orwell_202102151044.webp",
    },
    {
      id: 4,
      title: "Orgullo y prejuicio",
      author: "Jane Austen",
      price: 898.75,
      genre: "Romance",
      stock: 12,
      isFavorite: false,
      img: "https://pdlibrosmex.cdnstatics2.com/usuaris/libros/thumbs/49dac46f-3f35-4de4-b111-a70229f6eb0b/d_360_620/portada_orgullo-y-prejuicio_jane-austen_201604252024.webp",
    },
    {
      id: 5,
      title: "El principito",
      author: "Antoine de Saint-Exupéry",
      price: 261.0,
      genre: "Fábula",
      stock: 15,
      isFavorite: false,
      img: "https://pdlibrosmex.cdnstatics2.com/usuaris/libros/thumbs/342e0b70-bcee-4b54-9ee1-9e8df2ceed88/d_360_620/portada_el-principito-jr-blue_antoine-de-saint-exupery_201606152324.webp",
    },
    {
      id: 6,
      title: "Crónica de una muerte anunciada",
      author: "Gabriel García Márquez",
      price: 358.0,
      genre: "Realismo mágico",
      stock: 7,
      isFavorite: false,
      img: "https://pdlibrosmex.cdnstatics2.com/usuaris/libros/thumbs/5dfcc1f5-22bf-4773-b01a-255ab63044cc/d_360_620/portada_cronica-de-una-muerte-anunciada_gabriel-garcia-marquez_201504151709.webp",
    },
    {
      id: 7,
      title: "Fahrenheit 451",
      author: "Ray Bradbury",
      price: 288.0,
      genre: "Ciencia ficción",
      stock: 9,
      isFavorite: false,
      img: "https://pdlibrosmex.cdnstatics2.com/usuaris/libros/thumbs/2ad661cc-2eb9-46a6-81cf-739b78094e8a/d_360_620/324884_portada_fahrenheit-451-100-aniversario_ray-bradbury_202006041252.webp",
    },
    {
      id: 8,
      title: "El hobbit",
      author: "J.R.R. Tolkien",
      price: 282.24,
      genre: "Fantasía",
      stock: 6,
      isFavorite: false,
      img: "https://pdlibrosmex.cdnstatics2.com/usuaris/libros/thumbs/ab0a51c2-c96d-466d-a92f-1b160ce64ad9/d_360_620/369407_portada_el-hobbit_j-r-r-tolkien_202207271130.webp",
    },
    {
      id: 9,
      title: "Harry Potter y la piedra filosofal",
      author: "J.K. Rowling",
      price: 936.8,
      genre: "Fantasía",
      stock: 10,
      isFavorite: false,
      img: "https://www.gonvill.com.mx/imagenes/9786073/978607319351.JPG",
    },
    {
      id: 10,
      title: "El amor en los tiempos del cólera",
      author: "Gabriel García Márquez",
      price: 478.0,
      genre: "Realismo mágico",
      stock: 4,
      isFavorite: false,
      img: "https://pdlibrosmex.cdnstatics2.com/usuaris/libros/thumbs/3ff7d8a1-2ec2-4464-8fd0-175bcc63c5da/d_360_620/portada_el-amor-en-los-tiempos-del-colera-edicion-ilustrada_gabriel-garcia-marquez_201903042254.webp",
    },
  ]);

  //Estado para el carrito de compras
  const [cart, setCart] = useState([]);

  //Estado para favoritos
  const [favorites, setFavorites] = useState(
    books.filter((book) => book.isFavorite)
  );

  //Estado para historial de compras
  const [purchaseHistory, setPurchaseHistory] = useState(() => {
    // Recuperar historial de localStorage si existe
    const savedHistory = localStorage.getItem("bookStorePurchaseHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  //Estado para el filtro de género
  const [selectedGenre, setSelectedGenre] = useState("Todos");

  //Estado para la búsqueda por nombre
  const [searchTerm, setSearchTerm] = useState("");

  //Estado para mostrar/ocultar paneles
  const [showAdmin, setShowAdmin] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showPurchaseHistory, setShowPurchaseHistory] = useState(false);

  //Guardar historial en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem(
      "bookStorePurchaseHistory",
      JSON.stringify(purchaseHistory)
    );
  }, [purchaseHistory]);

  //Extraer géneros únicos para el filtro
  const genres = ["Todos", ...new Set(books.map((book) => book.genre))];

  //Filtrar libros por género y búsqueda
  const filteredBooks = books.filter((book) => {
    const matchesGenre =
      selectedGenre === "Todos" || book.genre === selectedGenre;
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  // Agregar libro al carrito
  const addToCart = (book) => {
    if (book.stock === 0) {
      alert("¡Este libro está agotado!");
      return;
    }

    const existingItem = cart.find((item) => item.id === book.id);

    if (existingItem) {
      // Si ya está en el carrito, incrementar cantidad
      if (existingItem.quantity < book.stock) {
        setCart(
          cart.map((item) =>
            item.id === book.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        alert("No hay suficiente stock disponible");
      }
    } else {
      // Si no está en el carrito, agregarlo
      setCart([...cart, { ...book, quantity: 1 }]);
    }
  };

  // Agregar/eliminar libro de favoritos
  const toggleFavorite = (bookId) => {
    const book = books.find((b) => b.id === bookId);
    const isCurrentlyFavorite = favorites.some((fav) => fav.id === bookId);

    if (isCurrentlyFavorite) {
      // Remover de favoritos
      setFavorites(favorites.filter((fav) => fav.id !== bookId));
      // Actualizar estado en libros
      setBooks(
        books.map((b) => (b.id === bookId ? { ...b, isFavorite: false } : b))
      );
    } else {
      // Agregar a favoritos
      setFavorites([...favorites, { ...book, isFavorite: true }]);
      // Actualizar estado en libros
      setBooks(
        books.map((b) => (b.id === bookId ? { ...b, isFavorite: true } : b))
      );
    }
  };

  // Eliminar libro del carrito
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Actualizar cantidad de un libro en el carrito
  const updateQuantity = (id, quantity) => {
    const book = books.find((b) => b.id === id);

    if (quantity <= book.stock && quantity > 0) {
      setCart(
        cart.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    } else if (quantity > book.stock) {
      alert(`Solo hay ${book.stock} unidades disponibles`);
    }
  };

  // Vaciar carrito
  const clearCart = () => {
    setCart([]);
  };

  // Calcular total del carrito
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Realizar compra
  const checkout = () => {
    if (cart.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    // Crear registro de compra
    const purchase = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: cart.map((item) => ({
        ...item,
        returnable: true, // Los productos nuevos son devolvibles
        returnDeadline: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(), // 30 días para devolver
        returned: false,
        returnDate: null,
      })),
      total: getCartTotal(),
      status: "completed",
    };

    // Actualizar stock de libros
    const updatedBooks = books.map((book) => {
      const cartItem = cart.find((item) => item.id === book.id);
      if (cartItem) {
        return { ...book, stock: book.stock - cartItem.quantity };
      }
      return book;
    });

    setBooks(updatedBooks);
    setPurchaseHistory([purchase, ...purchaseHistory]);

    alert(
      `¡Compra realizada con éxito! Total: $${getCartTotal().toFixed(
        2
      )}\nNúmero de orden: #${purchase.id}`
    );
    clearCart();
  };

  // Devolver un producto
  const returnProduct = (purchaseId, bookId) => {
    const purchase = purchaseHistory.find((p) => p.id === purchaseId);
    if (!purchase) return;

    const itemToReturn = purchase.items.find((item) => item.id === bookId);
    if (!itemToReturn) return;

    // Verificar si el producto es devolvible
    if (!itemToReturn.returnable) {
      alert("Este producto no es devolvible");
      return;
    }

    // Verificar si ya fue devuelto
    if (itemToReturn.returned) {
      alert("Este producto ya fue devuelto");
      return;
    }

    // Verificar fecha límite de devolución
    const returnDeadline = new Date(itemToReturn.returnDeadline);
    const today = new Date();

    if (today > returnDeadline) {
      alert("La fecha límite para devolver este producto ha expirado");
      return;
    }

    // Confirmar devolución
    if (
      !window.confirm(
        `¿Estás seguro de que deseas devolver "${
          itemToReturn.title
        }"?\nSe reembolsarán $${itemToReturn.price * itemToReturn.quantity}.`
      )
    ) {
      return;
    }

    // Actualizar historial de compras
    const updatedPurchaseHistory = purchaseHistory.map((p) => {
      if (p.id === purchaseId) {
        return {
          ...p,
          items: p.items.map((item) =>
            item.id === bookId
              ? {
                  ...item,
                  returned: true,
                  returnDate: new Date().toISOString(),
                  returnable: false, // Ya no se puede devolver nuevamente
                }
              : item
          ),
        };
      }
      return p;
    });

    // Actualizar stock de libros
    const updatedBooks = books.map((book) => {
      if (book.id === bookId) {
        return { ...book, stock: book.stock + itemToReturn.quantity };
      }
      return book;
    });

    setPurchaseHistory(updatedPurchaseHistory);
    setBooks(updatedBooks);

    alert(
      `¡Devolución exitosa! Se han reembolsado $${
        itemToReturn.price * itemToReturn.quantity
      }\nEl producto "${itemToReturn.title}" ha sido devuelto.`
    );
  };

  // Devolver múltiples productos
  const returnMultipleProducts = (purchaseId, bookIds) => {
    const purchase = purchaseHistory.find((p) => p.id === purchaseId);
    if (!purchase) return;

    const itemsToReturn = purchase.items.filter(
      (item) =>
        bookIds.includes(item.id) &&
        item.returnable &&
        !item.returned &&
        new Date() <= new Date(item.returnDeadline)
    );

    if (itemsToReturn.length === 0) {
      alert("No hay productos válidos para devolver");
      return;
    }

    const totalRefund = itemsToReturn.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const itemNames = itemsToReturn.map((item) => item.title).join(", ");

    if (
      !window.confirm(
        `¿Estás seguro de que deseas devolver los siguientes productos?\n${itemNames}\n\nTotal a reembolsar: $${totalRefund.toFixed(
          2
        )}`
      )
    ) {
      return;
    }

    // Actualizar historial de compras
    const updatedPurchaseHistory = purchaseHistory.map((p) => {
      if (p.id === purchaseId) {
        return {
          ...p,
          items: p.items.map((item) =>
            bookIds.includes(item.id) && item.returnable && !item.returned
              ? {
                  ...item,
                  returned: true,
                  returnDate: new Date().toISOString(),
                  returnable: false,
                }
              : item
          ),
        };
      }
      return p;
    });

    // Actualizar stock de libros
    const updatedBooks = books.map((book) => {
      const itemToReturn = itemsToReturn.find((item) => item.id === book.id);
      if (itemToReturn) {
        return { ...book, stock: book.stock + itemToReturn.quantity };
      }
      return book;
    });

    setPurchaseHistory(updatedPurchaseHistory);
    setBooks(updatedBooks);

    alert(
      `¡Devolución exitosa! Se han reembolsado $${totalRefund.toFixed(2)}\n${
        itemsToReturn.length
      } producto(s) devuelto(s).`
    );
  };

  // Funciones de administración
  const addBook = (newBook) => {
    const id = books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1;
    setBooks([...books, { ...newBook, id, isFavorite: false }]);
  };

  const updateBook = (updatedBook) => {
    setBooks(
      books.map((book) => (book.id === updatedBook.id ? updatedBook : book))
    );

    // Actualizar también en favoritos si está allí
    if (favorites.some((fav) => fav.id === updatedBook.id)) {
      setFavorites(
        favorites.map((fav) => (fav.id === updatedBook.id ? updatedBook : fav))
      );
    }
  };

  const deleteBook = (id) => {
    setBooks(books.filter((book) => book.id !== id));
    setFavorites(favorites.filter((fav) => fav.id !== id));
    setCart(cart.filter((item) => item.id !== id));
  };

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="App">
      <Header
        cartCount={cart.reduce((total, item) => total + item.quantity, 0)}
        favoritesCount={favorites.length}
        purchaseHistoryCount={purchaseHistory.length}
        toggleAdmin={() => {
          setShowAdmin(!showAdmin);
          setShowFavorites(false);
          setShowPurchaseHistory(false);
        }}
        toggleFavorites={() => {
          setShowFavorites(!showFavorites);
          setShowAdmin(false);
          setShowPurchaseHistory(false);
        }}
        togglePurchaseHistory={() => {
          setShowPurchaseHistory(!showPurchaseHistory);
          setShowAdmin(false);
          setShowFavorites(false);
        }}
        showAdmin={showAdmin}
        showFavorites={showFavorites}
        showPurchaseHistory={showPurchaseHistory}
      />

      <div className="container">
        {showAdmin ? (
          <AdminPanel
            books={books}
            onAddBook={addBook}
            onUpdateBook={updateBook}
            onDeleteBook={deleteBook}
            onClose={() => setShowAdmin(false)}
          />
        ) : showFavorites ? (
          <FavoritesPanel
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onAddToCart={addToCart}
            onClose={() => setShowFavorites(false)}
          />
        ) : showPurchaseHistory ? (
          <PurchaseHistoryPanel
            purchaseHistory={purchaseHistory}
            onReturnProduct={returnProduct}
            onReturnMultipleProducts={returnMultipleProducts}
            onClose={() => setShowPurchaseHistory(false)}
          />
        ) : (
          <>
            <div className="main-content">
              {/* Barra de búsqueda */}
              <div className="search-bar">
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Buscar libros por título o autor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  {searchTerm && (
                    <button
                      className="clear-search-btn"
                      onClick={clearSearch}
                      title="Limpiar búsqueda"
                    >
                      ✕
                    </button>
                  )}
                  <span className="search-icon">🔍</span>
                </div>
                {searchTerm && (
                  <div className="search-results-info">
                    <span>
                      {filteredBooks.length === 0
                        ? "No se encontraron libros"
                        : `Encontrados ${filteredBooks.length} libro(s) para "${searchTerm}"`}
                    </span>
                    <button className="clear-search-link" onClick={clearSearch}>
                      Limpiar búsqueda
                    </button>
                  </div>
                )}
              </div>

              <GenreFilter
                genres={genres}
                selectedGenre={selectedGenre}
                onSelectGenre={setSelectedGenre}
                searchTerm={searchTerm}
              />

              <BookList
                books={filteredBooks}
                onAddToCart={addToCart}
                onToggleFavorite={toggleFavorite}
                searchTerm={searchTerm}
              />
            </div>

            <ShoppingCart
              cart={cart}
              onRemoveItem={removeFromCart}
              onUpdateQuantity={updateQuantity}
              onClearCart={clearCart}
              onCheckout={checkout}
              total={getCartTotal()}
            />
          </>
        )}
      </div>

      <footer>
        <p className="footer-links">
          <span>
            Política de devoluciones: 30 días para devolver productos en buen
            estado
          </span>
        </p>
      </footer>
    </div>
  );
}

export default App;
