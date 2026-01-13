import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import RoleSelector from "./components/common/RoleSelector";
import Header from "./components/common/Header";
import GuestBookList from "./components/guest/GuestBookList";
import ShoppingCart from "./components/guest/ShoppingCart";
import Checkout from "./components/guest/Checkout";
import AdminBookList from "./components/admin/AdminBookList";
import "./App.css";

// Componente protegido por rol
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userRole } = useAuth();

  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
};

// Componente principal de la app
const AppContent = () => {
  const { userRole } = useAuth();

  return (
    <div className="App">
      <Routes>
        {/* Página principal - Selector de rol */}
        <Route
          path="/"
          element={
            !userRole ? (
              <RoleSelector />
            ) : (
              <Navigate
                to={userRole === "admin" ? "/admin" : "/catalog"}
                replace
              />
            )
          }
        />

        {/* Rutas para invitados */}
        <Route
          path="/catalog"
          element={
            <ProtectedRoute allowedRoles={["guest"]}>
              <GuestBookList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={["guest"]}>
              <ShoppingCart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={["guest"]}>
              <Checkout />
            </ProtectedRoute>
          }
        />

        {/* Ruta para administradores */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminBookList />
            </ProtectedRoute>
          }
        />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

// App principal envuelta en providers
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
