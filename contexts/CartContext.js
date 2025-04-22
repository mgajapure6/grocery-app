import React, { createContext, useState } from 'react';
import { addToCart } from '../utils/cartUtils';
import { initialCart } from '../data/staticData';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Sanitize initialCart to include only valid items
  const sanitizedInitialCart = initialCart.filter(
    (item) => item && typeof item === 'object' && item.id && item.name && item.price && item.image
  );
  if (initialCart.length !== sanitizedInitialCart.length) {
    console.warn('Invalid items in initialCart:', initialCart.filter((item) => !sanitizedInitialCart.includes(item)));
  }

  const [cart, setCart] = useState(sanitizedInitialCart);

  // Wrap addToCart to use context's cart and setCart with validation
  const handleAddToCart = (product) => {
    // Validate product
    if (!product || typeof product !== 'object' || !product.id || !product.name || !product.price || !product.image) {
      console.warn('Invalid product attempted to add to cart:', product);
      return;
    }
    addToCart(product, cart, setCart);
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart: handleAddToCart }}>
      {children}
    </CartContext.Provider>
  );
};