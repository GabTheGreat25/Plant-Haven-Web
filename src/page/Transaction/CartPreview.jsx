import React, { useState } from "react";
import EmptyCartImage from "@assets/empty-cart.png";

export default function CartPreview({
  cartItems,
  onRemoveFromCart,
  onConfirmPurchase,
  onClose,
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleConfirmPurchase = () => {
    onConfirmPurchase();
    setModalOpen(false);
    onClose();
  };

  return (
    <div className="p-4">
      <h3 className="text-center text-lg mt-4">Cart Preview</h3>
      {cartItems && cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div
            key={item?._id}
            className="flex justify-between items-center my-4"
          >
            <div className="mr-4">
              <div className="font-bold">{item.name}</div>
              <div className="text-gray-500">{item.description}</div>
              <div className="text-xl mt-2">{item.price} PHP</div>
              <div className="mt-2">
                <button
                  className="text-red-500 border-none bg-none"
                  onClick={() => onRemoveFromCart(item)}
                >
                  Remove
                </button>
              </div>
            </div>
            <div>
              {item?.image?.map((imageItem, index) => (
                <img
                  key={index}
                  src={imageItem?.url}
                  alt={imageItem?.alt}
                  className="w-20 h-20 m-1"
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="mt-14">
          <img
            src={EmptyCartImage}
            alt="Empty Cart"
            className="w-48 h-48 mx-auto"
          />
        </div>
      )}
      <div className="flex justify-center mt-4">
        {cartItems && cartItems.length > 0 ? (
          <button
            className="bg-blue-500 rounded-full text-white text-lg px-6 py-2"
            onClick={() => setModalOpen(true)}
          >
            Confirm Purchase
          </button>
        ) : null}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md max-w-md">
            <h2 className="text-2xl font-bold mb-2">Confirm Purchase</h2>
            <p className="text-lg mb-4">
              Are you sure you want to purchase the selected items?
            </p>
            <div className="flex justify-end">
              <button
                className="text-red-500 mr-2"
                onClick={() => {
                  setModalOpen(false);
                  onClose();
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white"
                onClick={handleConfirmPurchase}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
