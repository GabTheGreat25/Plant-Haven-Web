import React from "react";
import { useGetCommentsQuery, useDeleteCommentMutation } from "@api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RingLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { TAGS } from "@/constants";

export default function () {
  const navigate = useNavigate();
  const { data, isLoading } = useGetCommentsQuery({
    populate: TAGS.TRANSACTION,
  });

  const auth = useSelector((state) => state.auth);
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();
  const isEmployee = auth?.user?.roles?.includes("Employee");
  const isAdmin = auth?.user?.roles?.includes("Admin");

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      const response = await deleteComment(id);

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
          {data?.details?.length ? (
            data?.details?.map((item, index) => (
              <div key={item?._id}>
                <a
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(
                      `${isEmployee ? "/employee" : "/admin"}/comment/${
                        item?._id
                      }`
                    )
                  }
                >
                  <h1>{item?._id}</h1>
                </a>
                <h1>{item?.ratings}</h1>
                <h1>{item?.text}</h1>
                <h1>{item?.transaction?.status}</h1>
                {item?.image?.map((image) => (
                  <img
                    width={75}
                    height={60}
                    src={image?.url}
                    alt={image?.originalname}
                    key={image?.public_id}
                  />
                ))}
                {isAdmin ? (
                  <button onClick={() => handleDelete(item?._id)}>
                    Delete
                  </button>
                ) : null}
              </div>
            ))
          ) : (
            <p>No data available.</p>
          )}
        </main>
      )}
    </>
  );
}
