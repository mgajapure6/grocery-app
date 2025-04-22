export const addToCart = (product, cart, setCart) => {
  // Additional validation (in case context validation is bypassed)
  if (!product || typeof product !== 'object' || !product.id || !product.name || !product.price || !product.image) {
    console.warn('Invalid product in addToCart:', product);
    return;
  }

  setCart((prev) => {
    const existingItem = prev.find((item) => item.id === product.id);
    if (existingItem) {
      return prev.map((item) =>
        item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      );
    }
    return [...prev, { ...product, quantity: 1 }];
  });
};