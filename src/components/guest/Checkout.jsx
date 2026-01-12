import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ventaService from "../../services/ventaService";
import "./Checkout.css";

const Checkout = () => {
  const { shoppingCart, getCartTotal, clearCart } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    clienteNombre: "",
    clienteEmail: "",
    clienteDireccion: "",
    clienteCiudad: "",
    clienteCodigoPostal: "",
    metodoPago: "credit-card",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.clienteNombre.trim()) {
      newErrors.clienteNombre = "El nombre es requerido";
    }

    if (!formData.clienteEmail.trim()) {
      newErrors.clienteEmail = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.clienteEmail)) {
      newErrors.clienteEmail = "Email inválido";
    }

    if (!formData.clienteDireccion.trim()) {
      newErrors.clienteDireccion = "La dirección es requerida";
    }

    if (!formData.clienteCiudad.trim()) {
      newErrors.clienteCiudad = "La ciudad es requerida";
    }

    if (!formData.clienteCodigoPostal.trim()) {
      newErrors.clienteCodigoPostal = "El código postal es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (shoppingCart.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    setIsProcessing(true);
    setErrors({});

    try {
      // Preparar datos para la venta - Asegúrate de usar los nombres correctos
      const ventaRequest = {
        clienteNombre: formData.clienteNombre,
        clienteEmail: formData.clienteEmail,
        clienteDireccion: formData.clienteDireccion,
        clienteCiudad: formData.clienteCiudad,
        clienteCodigoPostal: formData.clienteCodigoPostal,
        metodoPago: formData.metodoPago,
        montoTotal: getCartTotal(),
        impuestos: getCartTotal() * 0.1,
        detalles: shoppingCart.map((item) => ({
          libroId: item.id,
          cantidad: item.quantity,
          price: item.price,
        })),
      };

      // Procesar la venta
      const result = await ventaService.procesarVenta(ventaRequest);

      if (result.success) {
        setOrderData(result);
        setOrderSuccess(true);
        clearCart();
      } else {
        throw new Error(result.message || "Error al procesar la venta");
      }
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      setErrors({
        submit:
          error.message || "Error al procesar la compra. Inténtalo nuevamente.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const totalConImpuestos = getCartTotal() * 1.1;

  if (orderSuccess && orderData) {
    return (
      <div className="checkout-success">
        <div className="success-icon">🎉</div>
        <h2>¡Compra Exitosa!</h2>

        <div className="order-details">
          <div className="detail-row">
            <span className="detail-label">Número de Venta:</span>
            <span className="detail-value highlight">
              {orderData.numeroVenta}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Cliente:</span>
            <span className="detail-value">{formData.clienteNombre}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{formData.clienteEmail}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Total:</span>
            <span className="detail-value total-price">
              ${totalConImpuestos.toFixed(2)}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Fecha:</span>
            <span className="detail-value">
              {new Date().toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <p className="success-message">
          Hemos enviado un correo de confirmación a {formData.clienteEmail}
        </p>

        <div className="success-actions">
          <button
            className="continue-shopping-btn"
            onClick={() => navigate("/catalog")}
          >
            ← Seguir Comprando
          </button>

          <button className="print-receipt-btn" onClick={() => window.print()}>
            🖨️ Imprimir Recibo
          </button>

          <button
            className="view-order-btn"
            onClick={() => {
              // Aquí podrías navegar a una vista de detalles de orden
              alert(`Número de orden: ${orderData.numeroVenta}`);
            }}
          >
            📋 Ver Detalles
          </button>
        </div>

        <div className="post-purchase-info">
          <p>📦 Tu pedido será procesado y enviado en 24-48 horas.</p>
          <p>📞 Para cualquier consulta, contáctanos con tu número de venta.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>💰 Finalizar Compra</h1>
        <p>Completa tus datos para completar la compra</p>
      </div>

      {errors.submit && <div className="error-message">{errors.submit}</div>}

      <div className="checkout-content">
        <div className="order-summary">
          <h3>Resumen del Pedido</h3>

          <div className="order-items">
            {shoppingCart.map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-info">
                  <span className="item-title">{item.title}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
                <span className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Impuestos (10%):</span>
              <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total a Pagar:</span>
              <span>${totalConImpuestos.toFixed(2)}</span>
            </div>
          </div>

          <div className="item-count">
            <span>{shoppingCart.length} productos en el carrito</span>
          </div>
        </div>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>Información del Cliente</h3>

          <div className="form-group">
            <label htmlFor="clienteNombre">
              Nombre Completo *
              {errors.clienteNombre && (
                <span className="field-error"> - {errors.clienteNombre}</span>
              )}
            </label>
            <input
              type="text"
              id="clienteNombre"
              name="clienteNombre"
              value={formData.clienteNombre}
              onChange={handleInputChange}
              className={errors.clienteNombre ? "error" : ""}
              placeholder="Juan Pérez"
              disabled={isProcessing}
            />
          </div>

          <div className="form-group">
            <label htmlFor="clienteEmail">
              Correo Electrónico *
              {errors.clienteEmail && (
                <span className="field-error"> - {errors.clienteEmail}</span>
              )}
            </label>
            <input
              type="email"
              id="clienteEmail"
              name="clienteEmail"
              value={formData.clienteEmail}
              onChange={handleInputChange}
              className={errors.clienteEmail ? "error" : ""}
              placeholder="juan@ejemplo.com"
              disabled={isProcessing}
            />
          </div>

          <div className="form-group">
            <label htmlFor="clienteDireccion">
              Dirección de Envío *
              {errors.clienteDireccion && (
                <span className="field-error">
                  {" "}
                  - {errors.clienteDireccion}
                </span>
              )}
            </label>
            <input
              type="text"
              id="clienteDireccion"
              name="clienteDireccion"
              value={formData.clienteDireccion}
              onChange={handleInputChange}
              className={errors.clienteDireccion ? "error" : ""}
              placeholder="Calle Principal #123, Colonia"
              disabled={isProcessing}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="clienteCiudad">
                Ciudad *
                {errors.clienteCiudad && (
                  <span className="field-error"> - {errors.clienteCiudad}</span>
                )}
              </label>
              <input
                type="text"
                id="clienteCiudad"
                name="clienteCiudad"
                value={formData.clienteCiudad}
                onChange={handleInputChange}
                className={errors.clienteCiudad ? "error" : ""}
                placeholder="Ciudad"
                disabled={isProcessing}
              />
            </div>
            <div className="form-group">
              <label htmlFor="clienteCodigoPostal">
                Código Postal *
                {errors.clienteCodigoPostal && (
                  <span className="field-error">
                    {" "}
                    - {errors.clienteCodigoPostal}
                  </span>
                )}
              </label>
              <input
                type="text"
                id="clienteCodigoPostal"
                name="clienteCodigoPostal"
                value={formData.clienteCodigoPostal}
                onChange={handleInputChange}
                className={errors.clienteCodigoPostal ? "error" : ""}
                placeholder="12345"
                disabled={isProcessing}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="metodoPago">Método de Pago *</label>
            <select
              id="metodoPago"
              name="metodoPago"
              value={formData.metodoPago}
              onChange={handleInputChange}
              disabled={isProcessing}
            >
              <option value="credit-card">💳 Tarjeta de Crédito</option>
              <option value="debit-card">💳 Tarjeta de Débito</option>
              <option value="paypal">📱 PayPal</option>
              <option value="bank-transfer">🏦 Transferencia Bancaria</option>
              <option value="cash">💰 Efectivo</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="back-to-cart-btn"
              onClick={() => navigate("/cart")}
              disabled={isProcessing}
            >
              ← Volver al Carrito
            </button>

            <button
              type="submit"
              className="confirm-purchase-btn"
              disabled={isProcessing || shoppingCart.length === 0}
            >
              {isProcessing ? (
                <>
                  <span className="spinner-mini"></span>
                  Procesando Compra...
                </>
              ) : (
                `Confirmar Compra $${totalConImpuestos.toFixed(2)}`
              )}
            </button>
          </div>

          <div className="security-notice">
            <p>
              🔒 Tu información está protegida. Los datos de pago se procesan de
              forma segura.
            </p>
            <p className="terms-notice">
              Al completar la compra, aceptas nuestros
              <a href="/terminos" target="_blank" rel="noopener noreferrer">
                {" "}
                Términos y Condiciones
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
