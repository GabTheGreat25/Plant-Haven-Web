import React from "react";
import { useGetProductsQuery } from "@api";

export default function ({ onAddToCart, isProductInCart }) {
  const { data } = useGetProductsQuery();

  return (
    <>
      <div className="container mx-auto my-8 p-8 max-w-screen-xl bg-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Product List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {data?.details &&
            data?.details?.map((product) => (
              <div
                key={product?._id}
                className="border p-4 rounded-md shadow-md hover:shadow-lg transition duration-300"
              >
                <div className="mb-4">
                  {product?.image?.map((image, index) => (
                    <img
                      key={index}
                      src={image?.url}
                      alt={image?.originalname}
                      className="w-full h-32 object-cover mb-2"
                    />
                  ))}
                </div>
                <p className="text-lg font-semibold mb-2">
                  {product?.product_name}
                </p>
                <button
                  onClick={() => onAddToCart(product)}
                  disabled={isProductInCart(product._id)}
                  className={`${
                    isProductInCart(product._id)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  } py-2 px-4 rounded-full transition duration-300`}
                >
                  {isProductInCart(product._id) ? "In Cart" : "Add to Cart"}
                </button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
