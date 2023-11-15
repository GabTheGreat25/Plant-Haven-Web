import React from "react";
import { useGetProductsQuery } from "@api";

export default function ProductList({ onAddToCart, isProductInCart }) {
  const { data } = useGetProductsQuery();

  return (
    <>
      <div className="grid grid-flow-col gap-x-4 justify-center items-center h-screen">
        {data?.details &&
          data?.details?.map((product) => (
            <div key={product?._id}>
              <p>{product?.product_name}</p>
              {product?.image?.map((image) => (
                <img
                  width={75}
                  height={60}
                  src={image?.url}
                  alt={image?.originalname}
                  key={image?.public_id}
                />
              ))}
              <button
                onClick={() => onAddToCart(product)}
                disabled={isProductInCart(product._id)}
              >
                {isProductInCart(product._id)
                  ? "Already in Cart"
                  : "Add to Cart"}
              </button>
            </div>
          ))}
      </div>
    </>
  );
}
