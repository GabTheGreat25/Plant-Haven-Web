import React from "react";
import { useGetDeliveriesByIdQuery } from "@api";
import { RingLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";
import { TAGS } from "@/constants";
import moment from "moment";

export default function UserDetails() {
  const { id } = useParams();
  const { data, isLoading } = useGetDeliveriesByIdQuery(id, {
    populate: TAGS.PRODUCT,
  });
  const navigate = useNavigate();

  const { _id, company_name, date, price, status, quantity, product } =
    data?.details || {};

  const formattedDate = date ? moment(date).format("YYYY-MM-DD") : "";

  const goBack = () => {
    navigate("/admin/delivery");
  };

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
            <h1>{company_name}</h1>
            <h1>{formattedDate}</h1>
            <h1>{price}</h1>
            <h1>{status}</h1>
            <h1>{quantity}</h1>
            <h1>{product?.product_name}</h1>
            <button onClick={goBack}>Go Back</button>
          </div>
        </main>
      )}
    </>
  );
}
