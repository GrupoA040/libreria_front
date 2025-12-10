import React, { useState } from "react";

function PurchaseHistoryPanel({
  purchaseHistory,
  onReturnProduct,
  onReturnMultipleProducts,
  onClose,
}) {
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'detail'

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calcular días restantes para devolución
  const getDaysRemaining = (returnDeadline) => {
    const deadline = new Date(returnDeadline);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Verificar si se puede devolver un producto
  const canReturnProduct = (item) => {
    return (
      item.returnable &&
      !item.returned &&
      getDaysRemaining(item.returnDeadline) > 0
    );
  };

  // Toggle selección de item para devolución múltiple
  const toggleItemSelection = (itemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Ver detalle de una compra
  const viewPurchaseDetail = (purchase) => {
    setSelectedPurchase(purchase);
    setViewMode("detail");
    setSelectedItems([]);
  };

  // Devolver productos seleccionados
  const handleReturnSelected = () => {
    if (selectedItems.length === 0) {
      alert("Selecciona al menos un producto para devolver");
      return;
    }

    onReturnMultipleProducts(selectedPurchase.id, selectedItems);
    setSelectedItems([]);
  };

  // Calcular total de devolución
  const calculateSelectedRefund = () => {
    if (!selectedPurchase || selectedItems.length === 0) return 0;

    return selectedItems.reduce((total, itemId) => {
      const item = selectedPurchase.items.find((i) => i.id === itemId);
      return total + (item ? item.price * item.quantity : 0);
    }, 0);
  };

  return (
    <div className="purchase-history-panel">
      <div className="purchase-history-header">
        <h2>Historial de Compras</h2>
        <button className="close-history-btn" onClick={onClose}>
          Volver a Tienda
        </button>
      </div>

      {viewMode === "list" ? (
        <>
          {purchaseHistory.length === 0 ? (
            <div className="empty-history">
              <div className="empty-history-icon">📋</div>
              <h3>No tienes compras registradas</h3>
              <p>Realiza tu primera compra para ver tu historial aquí</p>
            </div>
          ) : (
            <>
              <div className="purchases-summary">
                <div className="summary-card">
                  <h3>Total de Compras</h3>
                  <p className="summary-value">{purchaseHistory.length}</p>
                </div>
                <div className="summary-card">
                  <h3>Total Gastado</h3>
                  <p className="summary-value">
                    $
                    {purchaseHistory
                      .reduce((total, purchase) => total + purchase.total, 0)
                      .toFixed(2)}
                  </p>
                </div>
                <div className="summary-card">
                  <h3>Productos Devueltos</h3>
                  <p className="summary-value">
                    {purchaseHistory.reduce(
                      (count, purchase) =>
                        count +
                        purchase.items.filter((item) => item.returned).length,
                      0
                    )}
                  </p>
                </div>
              </div>

              <div className="purchases-list">
                {purchaseHistory.map((purchase) => {
                  const returnableItems =
                    purchase.items.filter(canReturnProduct).length;

                  return (
                    <div key={purchase.id} className="purchase-card">
                      <div className="purchase-card-header">
                        <div>
                          <h3>Orden #{purchase.id.toString().slice(-6)}</h3>
                          <p className="purchase-date">
                            {formatDate(purchase.date)}
                          </p>
                        </div>
                        <div className="purchase-total">
                          ${purchase.total.toFixed(2)}
                        </div>
                      </div>

                      <div className="purchase-card-body">
                        <div className="purchase-items-summary">
                          <span>{purchase.items.length} producto(s)</span>
                          {returnableItems > 0 && (
                            <span className="returnable-badge">
                              {returnableItems} devolvable(s)
                            </span>
                          )}
                        </div>

                        <div className="purchase-actions">
                          <button
                            className="view-details-btn"
                            onClick={() => viewPurchaseDetail(purchase)}
                          >
                            Ver Detalles
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="purchase-detail">
          <div className="detail-header">
            <button
              className="back-btn"
              onClick={() => {
                setViewMode("list");
                setSelectedPurchase(null);
                setSelectedItems([]);
              }}
            >
              ← Volver al Historial
            </button>
            <h3>Orden #{selectedPurchase.id.toString().slice(-6)}</h3>
            <p className="detail-date">{formatDate(selectedPurchase.date)}</p>
          </div>

          <div className="detail-total">
            <span>Total de la compra:</span>
            <span className="total-amount">
              ${selectedPurchase.total.toFixed(2)}
            </span>
          </div>

          <div className="detail-items">
            <h4>Productos Comprados</h4>
            {selectedPurchase.items.map((item, index) => {
              const daysRemaining = getDaysRemaining(item.returnDeadline);
              const canReturn = canReturnProduct(item);

              return (
                <div key={`${item.id}-${index}`} className="detail-item">
                  <div className="detail-item-info">
                    <div className="item-header">
                      <h5>{item.title}</h5>
                      {item.returned && (
                        <span className="returned-badge">✅ Devuelto</span>
                      )}
                      {canReturn && (
                        <span className="returnable-badge">
                          ⏱️ {daysRemaining} días para devolver
                        </span>
                      )}
                      {!canReturn && !item.returned && (
                        <span className="non-returnable-badge">
                          ❌ No devolvible
                        </span>
                      )}
                    </div>

                    <p className="item-author">{item.author}</p>

                    <div className="item-details">
                      <span>Cantidad: {item.quantity}</span>
                      <span>Precio unitario: ${item.price.toFixed(2)}</span>
                      <span>
                        Subtotal: ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {item.returned && item.returnDate && (
                      <p className="return-date">
                        Devuelto el: {formatDate(item.returnDate)}
                      </p>
                    )}
                  </div>

                  <div className="detail-item-actions">
                    {canReturn && (
                      <>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                          id={`select-${item.id}`}
                        />
                        <label htmlFor={`select-${item.id}`}>
                          Seleccionar para devolución
                        </label>

                        <button
                          className="return-single-btn"
                          onClick={() =>
                            onReturnProduct(selectedPurchase.id, item.id)
                          }
                        >
                          Devolver Este Producto
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedItems.length > 0 && (
            <div className="bulk-return-section">
              <div className="bulk-return-summary">
                <h4>Devolución Múltiple</h4>
                <p>Productos seleccionados: {selectedItems.length}</p>
                <p>
                  Total a reembolsar:{" "}
                  <strong>${calculateSelectedRefund().toFixed(2)}</strong>
                </p>
              </div>

              <button
                className="bulk-return-btn"
                onClick={handleReturnSelected}
              >
                Devolver Productos Seleccionados
              </button>
            </div>
          )}

          <div className="return-policy">
            <h4>Política de Devoluciones</h4>
            <ul>
              <li>Tienes 30 días para devolver productos en buen estado</li>
              <li>Los productos deben estar en su empaque original</li>
              <li>El reembolso se procesará en 3-5 días hábiles</li>
              <li>Los productos digitales no son devolvibles</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default PurchaseHistoryPanel;
