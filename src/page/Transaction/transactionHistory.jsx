import React from "react";
import { useGetTransactionsQuery, useGetCommentsQuery } from "@api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RingLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { TAGS } from "@/constants";
import { useSelector } from "react-redux";
import moment from "moment";

export default function () {
  const navigate = useNavigate();
  const { data: transactions, isLoading: transactionsLoading } =
    useGetTransactionsQuery({
      populate: [TAGS.USER, TAGS.PRODUCT],
    });

  const auth = useSelector((state) => state.auth);

  const userTransactions = transactions?.details?.filter(
    (item) => item.user?._id === auth?.user?._id
  );

  const isTransactionCompleted = (transaction) =>
    transaction?.status === "Completed";

  const totalPrices = userTransactions?.map((item) =>
    item.product.reduce((acc, product) => acc + product.price, 0)
  );

  const toastProps = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000,
  };

  const { data: comments, isLoading: commentsLoading } = useGetCommentsQuery();

  return (
    <>
      {transactionsLoading || commentsLoading ? (
        <div className="loader">
          <RingLoader color="#4F6C42" loading={true} size={50} />
        </div>
      ) : (
        <main className="grid grid-flow-col gap-x-10 justify-center items-center h-screen">
          {userTransactions?.length ? (
            userTransactions?.map((item, index) => {
              // Find comments for the current transaction
              const transactionComments = comments?.details?.filter(
                (comment) => comment?.transaction?._id === item?._id
              );

              return (
                <div key={item?._id}>
                  <h1>{item?._id}</h1>
                  <h1>{item?.user?.name}</h1>
                  {item.product?.map((product) => (
                    <div key={product?._id}>
                      <h1>{product?.product_name}</h1>
                      <h1>{product?.price}</h1>
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
                  <h1>{item?.status}</h1>
                  <h1>
                    {item?.date ? moment(item?.date).format("YYYY-MM-DD") : ""}
                  </h1>

                  <h1>Total Price: {totalPrices[index]}</h1>

                  {transactionComments?.length > 0 ? (
                    <p>This transaction already has a comment.</p>
                  ) : (
                    <button
                      onClick={() =>
                        isTransactionCompleted(item)
                          ? navigate("/customer/comment/create", {
                              state: { transactionId: item?._id },
                            })
                          : toast.error(
                              "Transaction is pending. Cannot add a comment.",
                              toastProps
                            )
                      }
                    >
                      Add Comment
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <p>No data available.</p>
          )}
        </main>
      )}
    </>
  );
}
