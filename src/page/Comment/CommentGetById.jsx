import React from "react";
import { useGetCommentByIdQuery } from "@api";
import { RingLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";
import { TAGS } from "@/constants";
import { useSelector } from "react-redux";

export default function () {
  const { id } = useParams();
  const { data, isLoading } = useGetCommentByIdQuery(id, {
    populate: TAGS.TRANSACTION,
  });
  const navigate = useNavigate();

  const { _id, ratings, text, image, transaction } = data?.details || {};

  const auth = useSelector((state) => state.auth);
  const isEmployee = auth?.user?.roles?.includes("Employee");

  const goBack = () =>
    navigate(isEmployee ? "/employee/commentAll" : "/admin/commentAll");

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
            <h1>{ratings}</h1>
            <h1>{text}</h1>
            <h1>{transaction?.status}</h1>
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
