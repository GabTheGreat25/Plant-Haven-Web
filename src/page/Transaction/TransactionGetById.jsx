import React from "react";
import { useGetTransactionByIdQuery } from "@api";
import { RingLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";
import { TAGS } from "@/constants";
import { useSelector } from "react-redux";
import moment from "moment";

export default function UserDetails() {
  const { id } = useParams();
  const { data, isLoading } = useGetTransactionByIdQuery(id, {
    populate: [TAGS.USER, TAGS.PRODUCT],
  });
  const navigate = useNavigate();

  const { _id, product, status, date, user } = data?.details || {};

  const totalPrices = product?.map((item) =>
    item.product.reduce((acc, product) => acc + product.price, 0)
  );

  const formattedDate = date ? moment(date).format("YYYY-MM-DD") : "";

  const auth = useSelector((state) => state.auth);
  const isEmployee = auth?.user?.roles?.includes("Employee");

  const goBack = () =>
    navigate(isEmployee ? "/employee/transaction" : "/admin/transaction");

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
            <h1>{user?.name}</h1>
            {product?.map((product) => (
              <div key={product?._id}>
                <h1>{product?.product_name}</h1>
                <h1>{product?.price}</h1>{" "}
                {product?.image?.map((image) => (
                  <img
                    width={75}
                    height={60}
                    src={image?.url}
                    alt={image?.originalname}
                    key={image?.public_id}
                  />
                ))}
              </div>
            ))}
            <h1>{status}</h1>
            <h1>{formattedDate}</h1>
            <h1>Total Price: {totalPrices[index]}</h1>

            <button onClick={goBack}>Go Back</button>
          </div>
        </main>
      )}
    </>
  );
}
