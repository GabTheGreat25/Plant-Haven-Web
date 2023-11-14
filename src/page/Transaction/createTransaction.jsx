import React, { useState } from "react";
import { useAddTransactionMutation } from "@api";
import ProductList from "./ProductList";
import CartPreview from "./CartPreview";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";

export default function CreateTransaction() {
  const [cartItems, setCartItems] = useState([]);
  const [addTransaction] = useAddTransactionMutation();
  const auth = useSelector((state) => state.auth);

  const handleAddToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const handleRemoveFromCart = (itemToRemove) => {
    const updatedCart = cartItems.filter((item) => item !== itemToRemove);
    setCartItems(updatedCart);
  };

  const handleConfirmPurchase = async () => {
    const transactionDate = new Date();
    const formattedDate = transactionDate.toLocaleDateString("en-PH");

    await addTransaction({
      user: auth.user._id,
      product: cartItems.map((item) => item?._id),
      date: transactionDate,
    });

    setCartItems([]);

    const doc = new jsPDF();

    const lineHeight = 10;
    const startX = 10;
    const startY = 20;
    const lineThickness = 0.5;

    doc.setFont("Arial", "bold");
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text(
      "Transaction Receipt",
      doc.internal.pageSize.getWidth() / 2,
      startY,
      { align: "center" }
    );
    doc.setLineWidth(lineThickness);
    doc.line(
      startX,
      startY + lineHeight,
      doc.internal.pageSize.getWidth() - startX,
      startY + lineHeight
    );

    doc.setFont("Arial", "normal");
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text(`Date: ${formattedDate}`, startX, startY + 3 * lineHeight);
    doc.text("Items:", startX, startY + 4 * lineHeight);

    let totalCost = 0;
    cartItems.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.product_name}`,
        startX,
        startY + (5 + index) * lineHeight
      );
      doc.text(
        `${item.price} PHP`,
        doc.internal.pageSize.getWidth() - startX - 10,
        startY + (5 + index) * lineHeight,
        { align: "right" }
      );
      totalCost += item.price;
    });

    const separatorY = startY + (5 + cartItems.length) * lineHeight;
    doc.setLineWidth(0.2);
    doc.setLineDash([3, 3]);
    doc.line(
      startX,
      separatorY,
      doc.internal.pageSize.getWidth() - startX,
      separatorY
    );

    doc.setFont("Arial", "bold");
    doc.setFontSize(16);
    doc.setTextColor(80, 80, 80);
    doc.setLineWidth(lineThickness);
    doc.text("Total Cost:", startX, separatorY + lineHeight);
    doc.text(
      `${totalCost.toFixed(2)} PHP`,
      doc.internal.pageSize.getWidth() - startX - 10,
      separatorY + lineHeight,
      { align: "right" }
    );

    doc.setFont("Arial", "italic");
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Thank you for your purchase ${auth?.user?.name}!`,
      doc.internal.pageSize.getWidth() / 2,
      separatorY + 3 * lineHeight,
      { align: "center" }
    );

    doc.save("transaction-receipt.pdf");

    navigate("/customer/transaction");
  };

  return (
    <>
      <ProductList onAddToCart={handleAddToCart} />
      <CartPreview
        cartItems={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
        onConfirmPurchase={handleConfirmPurchase}
      />
    </>
  );
}
