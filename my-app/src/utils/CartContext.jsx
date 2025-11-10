// src/utils/CartContext.jsx
import { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // ambil ID produk yang valid
  const getProductId = (product) => {
    return product.id ?? product.product_id ?? product.ID ?? product.name; 
    // terakhir fallback ke nama biar tetap unik
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const pid = getProductId(product);
      const existing = prev.find((item) => getProductId(item) === pid);

      if (existing) {
        return prev.map((item) =>
          getProductId(item) === pid
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const decreaseQty = (product) => {
    const pid = getProductId(product);
    setCart((prev) =>
      prev
        .map((item) =>
          getProductId(item) === pid ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (product) => {
    const pid = getProductId(product);
    setCart((prev) => prev.filter((item) => getProductId(item) !== pid));
  };

  const clearCart = () => setCart([]);

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decreaseQty,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
