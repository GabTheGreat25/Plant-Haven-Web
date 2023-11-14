import React, { useState } from "react";
import ProductList from "./ProductList";
import Transaction from "../Transaction";

export default function CreateTransaction() {
  const [cartItems, setCartItems] = useState([]);

  const isProductInCart = (productId) => {
    return cartItems.some((item) => item._id === productId);
  };

  const handleAddToCart = (product) => {
    if (!isProductInCart(product._id)) {
      setCartItems([...cartItems, product]);
    }
  };

  const handleRemoveFromCart = (itemToRemove) => {
    const updatedCart = cartItems.filter((item) => item !== itemToRemove);
    setCartItems(updatedCart);
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <>
      <div className="grid grid-flow-col">
        <ProductList
          onAddToCart={handleAddToCart}
          isProductInCart={isProductInCart}
        />
        <Transaction
          cartItems={cartItems}
          onRemoveFromCart={handleRemoveFromCart}
          onClearCart={handleClearCart}
        />
      </div>
    </>
  );
}
