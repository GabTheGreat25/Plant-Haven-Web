import React, { useState } from "react";
import { useGetUsersQuery, useDeleteUserMutation } from "@api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RingLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function () {
  const navigate = useNavigate();
  const { data, isLoading } = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const auth = useSelector((state) => state.auth);

  const filteredData = data?.details?.filter(
    (user) => user?._id !== auth?.user?._id
  );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const response = await deleteUser(id);

      const toastProps = {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      };

      if (response?.data?.success === true) {
        toast.success(`${response?.data?.message}`, toastProps);
      } else {
        toast.error(`${response?.error?.data?.error?.message}`, toastProps);
      }
    }
  };

  return (
    <>
      {isLoading || isDeleting ? (
        <div className="loader">
          <RingLoader color="#4F6C42" loading={true} size={50} />
        </div>
      ) : (
        <main className="grid grid-flow-col gap-x-10 justify-center items-center h-screen">
          {filteredData.map((item) => (
            <div key={item?._id}>
              <a
                className="cursor-pointer"
                onClick={() => navigate(`${item?._id}`)}
              >
                <h1>{item?._id}</h1>
              </a>
              <h1>{item?.name}</h1>
              <h1>{item?.email}</h1>
              <h1>{item?.roles}</h1>
              {item.image?.map((image) => (
                <img
                  width={75}
                  height={60}
                  src={image?.url}
                  alt={image?.originalname}
                  key={image?.public_id}
                />
              ))}
              <span className="grid grid-flow-col gap-x-4 justify-start">
                <button onClick={() => navigate(`edit/${item?._id}`)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(item?._id)}>Delete</button>
              </span>
            </div>
          ))}
        </main>
      )}
    </>
  );
}
