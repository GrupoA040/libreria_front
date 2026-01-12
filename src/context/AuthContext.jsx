import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(() => {
    // Recuperar rol del localStorage si existe
    return localStorage.getItem("userRole") || null;
  });

  const [shoppingCart, setShoppingCart] = useState(() => {
    // Recuperar carrito del localStorage si existe
    const savedCart = localStorage.getItem("shoppingCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  }, [shoppingCart]);

  const loginAsAdmin = () => {
    setUserRole("admin");
    localStorage.setItem("userRole", "admin");
  };

  const loginAsGuest = () => {
    setUserRole("guest");
    localStorage.setItem("userRole", "guest");
  };

  const logout = () => {
    setUserRole(null);
    localStorage.removeItem("userRole");
    // Opcional: limpiar carrito al salir
    // setShoppingCart([]);
  };

  // Carrito de compras
  const addToCart = (book, quantity = 1) => {
    setShoppingCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === book.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            ...book,
            quantity: quantity,
            addedAt: new Date().toISOString(),
          },
        ];
      }
    });
  };

  const removeFromCart = (bookId) => {
    setShoppingCart((prevCart) =>
      prevCart.filter((item) => item.id !== bookId)
    );
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity < 1) {
      removeFromCart(bookId);
      return;
    }

    setShoppingCart((prevCart) =>
      prevCart.map((item) =>
        item.id === bookId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setShoppingCart([]);
  };

  const getCartTotal = () => {
    return shoppingCart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return shoppingCart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    userRole,
    shoppingCart,
    loginAsAdmin,
    loginAsGuest,
    logout,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
