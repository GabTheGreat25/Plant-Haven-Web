import React from "react";
import { useGetTransactionsQuery, useDeleteTransactionMutation } from "@api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RingLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { TAGS } from "@/constants";
import { useSelector } from "react-redux";
import moment from "moment";
import { addDeletedItemId, getDeletedItemIds } from "../.././utils/DeleteItem";

export default function () {
  const navigate = useNavigate();
  const { data, isLoading } = useGetTransactionsQuery({
    populate: [TAGS.USER, TAGS.PRODUCT],
  });

  const auth = useSelector((state) => state.auth);
  const [deleteTransaction, { isLoading: isDeleting }] =
    useDeleteTransactionMutation();
  const isEmployee = auth?.user?.roles?.includes("Employee");
  const isAdmin = auth?.user?.roles?.includes("Admin");

  const totalPrices = data?.details?.map((item) =>
    item.product.reduce((acc, product) => acc + product.price, 0)
  );

  const deletedTransactionIds = getDeletedItemIds("transaction");

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      const response = await deleteTransaction(id);

      const toastProps = {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      };

      if (response?.data?.success === true) {
        toast.success(`${response?.data?.message}`, toastProps);
        addDeletedItemId("transaction", id);
      } else {
        toast.error(`${response?.error?.data?.error?.message}`, toastProps);
      }
    }
  };

  const filteredTransactions = data?.details?.filter(
    (item) => !deletedTransactionIds.includes(item?._id)
  );

  return (
    <>
      {isLoading || isDeleting ? (
        <div className="loader">
          <RingLoader color="#4F6C42" loading={true} size={50} />
        </div>
      ) : (
        <main className="grid grid-flow-col gap-x-10 justify-center items-center h-screen">
          {filteredTransactions?.length ? (
            filteredTransactions?.map((item, index) => (
              <div key={item?._id}>
                <a
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(
                      `${isEmployee ? "/employee" : "/admin"}/transaction/${
                        item?._id
                      }`
                    )
                  }
                >
                  <h1>{item?._id}</h1>
                </a>
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

                <span className="grid grid-flow-col gap-x-4 justify-start">
                  <button
                    onClick={() =>
                      navigate(
                        `${
                          isEmployee ? "/employee" : "/admin"
                        }/transaction/edit/${item?._id}`
                      )
                    }
                  >
                    Edit
                  </button>
                  {isAdmin ? (
                    <button onClick={() => handleDelete(item?._id)}>
                      Delete
                    </button>
                  ) : null}
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
