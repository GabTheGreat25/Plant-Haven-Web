import React from "react";
import { useGetProductsQuery, useDeleteProductMutation } from "@api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RingLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { TAGS } from "@/constants";

export default function ProductsList() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetProductsQuery({
    populate: TAGS.USER,
  });
  console.log(data);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const response = await deleteProduct(id);

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
              navigate("/admin/product/create");
            }}
          >
            Create
          </button>
          {data?.details?.length ? (
            data?.details?.map((item) => (
              <div key={item?._id}>
                <a
                  className="cursor-pointer"
                  onClick={() => navigate(`/admin/product/${item?._id}`)}
                >
                  <h1>{item?._id}</h1>
                </a>
                <h1>{item?.product_name}</h1>
                <h1>{item?.price}</h1>
                <h1>{item?.status}</h1>
                <h1>{item?.class}</h1>
                <h1>{item?.variant}</h1>
                <h1>{item?.quantity}</h1>
                <h1>{item?.type}</h1>
                {item.image?.map((image) => (
                  <img
                    width={75}
                    height={60}
                    src={image?.url}
                    alt={image?.originalname}
                    key={image?.public_id}
                  />
                ))}
                <h1>{item?.user?.name}</h1>
                <span className="grid grid-flow-col gap-x-4 justify-start">
                  <button
                    onClick={() => navigate(`/admin/product/edit/${item?._id}`)}
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
