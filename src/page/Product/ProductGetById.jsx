import React from "react";
import { useGetProductByIdQuery } from "@api";
import { RingLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";
import { TAGS } from "@/constants";
import { useSelector } from "react-redux";

export default function UserDetails() {
  const { id } = useParams();
  const { data, isLoading } = useGetProductByIdQuery(id, {
    populate: TAGS.USER,
  });
  const navigate = useNavigate();

  const { _id, product_name, type, variant, price, image, user } =
    data?.details || {};

  const productClass = data?.details?.class;

  const auth = useSelector((state) => state.auth);
  const isEmployee = auth?.user?.roles?.includes("Employee");

  const goBack = () =>
    navigate(isEmployee ? "/employee/product" : "/admin/product");

  return (
    <>
      {isLoading ? (
        <div className="loader">
          <RingLoader color="#4F6C42" loading={true} size={50} />
        </div>
      ) : (
        <main className="grid grid-flow-col gap-x-10 justify-center items-center h-screen">
          <div key={_id}>
            <h1>{_id}</h1>
            <h1>{product_name}</h1>
            <h1>{type}</h1>
            <h1>{productClass}</h1>
            <h1>{variant}</h1>
            <h1>{price}</h1>
            <h1>{user?.name}</h1>
            {image?.map((image) => (
              <img
                width={75}
                height={60}
                src={image?.url}
                alt={image?.originalname}
                key={image?.public_id}
              />
            ))}
            <button onClick={goBack}>Go Back</button>
          </div>
        </main>
      )}
    </>
  );
}
