import React from "react";
import { useGetUserByIdQuery } from "@api";
import { RingLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";

export default function UserDetails() {
  const { id } = useParams();
  const { data, isLoading } = useGetUserByIdQuery(id);
  const navigate = useNavigate();

  const { _id, name, email, roles, image } = data?.details ?? {};

  const goBack = () => {
    navigate("/admin/user");
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
            <h1>{name}</h1>
            <h1>{email}</h1>
            <h1>{roles}</h1>
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
