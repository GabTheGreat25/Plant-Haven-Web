import React from "react";
import { useGetDeliveriesQuery, useDeleteDeliveriesMutation } from "@api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RingLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { TAGS } from "@/constants";
import moment from "moment";

export default function () {
  const navigate = useNavigate();
  const { data, isLoading } = useGetDeliveriesQuery({
    populate: TAGS.PRODUCT,
  });

  const [deleteDeliveries, { isLoading: isDeleting }] =
    useDeleteDeliveriesMutation();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this delivery?")) {
      const response = await deleteDeliveries(id);

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
          <button
            onClick={() => {
              navigate("/admin/delivery/create");
            }}
          >
            Create
          </button>
          {data?.details?.length ? (
            data?.details?.map((item) => (
              <div key={item?._id}>
                <a
                  className="cursor-pointer"
                  onClick={() => navigate(`${item?._id}`)}
                >
                  <h1>{item?._id}</h1>
                </a>
                <h1>{item?.company_name}</h1>
                <h1>
                  {item?.date ? moment(item?.date).format("YYYY-MM-DD") : ""}
                </h1>
                <h1>{item?.price}</h1>
                <h1>{item?.status}</h1>
                <h1>{item?.quantity}</h1>
                <h1>{item?.product?.product_name}</h1>
                <span className="grid grid-flow-col gap-x-4 justify-start">
                  <button onClick={() => navigate(`edit/${item?._id}`)}>
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
