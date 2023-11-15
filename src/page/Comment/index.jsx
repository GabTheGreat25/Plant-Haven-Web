import React from "react";
import {
  useGetCommentsQuery,
  useGetTransactionsQuery,
  useDeleteCommentMutation,
} from "@api";
import { RingLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { TAGS } from "@/constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addDeletedItemId, getDeletedItemIds } from "../.././utils/DeleteItem";

export default function () {
  const navigate = useNavigate();
  const { data, isLoading } = useGetCommentsQuery({
    populate: TAGS.TRANSACTION,
  });

  const { data: transactionsData, isLoading: transactionIsLoading } =
    useGetTransactionsQuery();

  const auth = useSelector((state) => state.auth);

  const filteredTransactions = transactionsData?.details?.filter(
    (detail) => detail?.user?._id === auth?.user?._id
  );

  const deletedCommentIds = getDeletedItemIds("comment");

  const filteredComments = data?.details
    ?.filter((comment) =>
      filteredTransactions?.some(
        (transaction) => transaction?._id === comment?.transaction?._id
      )
    )
    ?.filter((item) => !deletedCommentIds.includes(item?._id));

  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      const response = await deleteComment(id);

      const toastProps = {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      };

      if (response?.data?.success === true) {
        toast.success(`${response?.data?.message}`, toastProps);
        addDeletedItemId("comment", id);
      } else {
        toast.error(`${response?.error?.data?.error?.message}`, toastProps);
      }
    }
  };
  return (
    <>
      {isLoading || transactionIsLoading || isDeleting ? (
        <div className="loader">
          <RingLoader color="#4F6C42" loading={true} size={50} />
        </div>
      ) : (
        <main className="grid grid-flow-col gap-x-10 justify-center items-center h-screen">
          {filteredComments?.length ? (
            filteredComments?.map((item, index) => (
              <div key={item?._id}>
                <h1>{item?._id}</h1>
                <h1>{item?.ratings}</h1>
                <h1>{item?.text}</h1>
                {item?.image?.map((image) => (
                  <img
                    width={75}
                    height={60}
                    src={image?.url}
                    alt={image?.originalname}
                    key={image?.public_id}
                  />
                ))}
                <span className="grid grid-flow-col gap-x-4 justify-start">
                  <button
                    onClick={() =>
                      navigate(`/customer/comment/edit/${item?._id}`)
                    }
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item?._id)}>
                    Delete
                  </button>
                </span>
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
