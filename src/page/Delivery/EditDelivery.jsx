import React from "react";
import {
  useUpdateDeliveriesMutation,
  useGetDeliveriesByIdQuery,
  useGetProductsQuery,
} from "@api";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RingLoader } from "react-spinners";
import { editDeliveryValidation } from "@/validation";
import { useNavigate, useParams } from "react-router-dom";
import { STATUS } from "@/constants";
import moment from "moment-timezone";

export default function () {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useGetDeliveriesByIdQuery(id);
  const { data: products, isLoading: productsLoading } = useGetProductsQuery();
  const [updateDelivery] = useUpdateDeliveriesMutation();

  moment.tz.setDefault("Asia/Manila");

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      company_name: data?.details?.company_name || "",
      date: moment(data?.details?.date).format("YYYY-MM-DD") || "",
      price: data?.details?.price || "",
      status: data?.details?.status || "",
      quantity: data?.details?.quantity || "",
      product: data?.details?.product?._id || "",
    },
    validationSchema: editDeliveryValidation,
    onSubmit: async (values) => {
      values.date = moment(values.date).format("YYYY-MM-DD");

      updateDelivery({ id: data?.details?._id, payload: values }).then(
        (response) => {
          const toastProps = {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          };
          if (response?.data?.success === true) {
            navigate("/admin/delivery");
            toast.success(`${response?.data?.message}`, toastProps);
          } else {
            toast.error(`${response?.error?.data?.error?.message}`, toastProps);
          }
        }
      );
    },
  });

  return (
    <>
      {isLoading || productsLoading ? (
        <div className="loader">
          <RingLoader color="#4F6C42" loading={true} size={50} />
        </div>
      ) : (
        <>
          <main className="grid justify-center items-center h-screen">
            <form onSubmit={formik.handleSubmit}>
              <section className="grid justify-center items-center text-center">
                <div>
                  <label htmlFor="company_name">Company Name:</label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.company_name}
                  />
                  {formik.touched.company_name &&
                    formik.errors.company_name && (
                      <div className="text-red-600">
                        {formik.errors.company_name}
                      </div>
                    )}
                </div>
                <div>
                  <label htmlFor="date">Date:</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.date}
                  />
                  {formik.touched.date && formik.errors.date && (
                    <div className="text-red-600">{formik.errors.date}</div>
                  )}
                </div>
                <div>
                  <label htmlFor="price">Price:</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.price}
                    min="1"
                    max="10000"
                  />
                  {formik.touched.price && formik.errors.price && (
                    <div className="text-red-600">{formik.errors.price}</div>
                  )}
                </div>
                <div>
                  <label htmlFor="status">Status:</label>
                  <select
                    id="status"
                    name="status"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.status}
                  >
                    {STATUS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  {formik.touched.status && formik.errors.status && (
                    <div className="text-red-600">{formik.errors.status}</div>
                  )}
                </div>
                <div>
                  <label htmlFor="quantity">Quantity:</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.quantity}
                    min="1"
                    max="10000"
                  />
                  {formik.touched.quantity && formik.errors.quantity && (
                    <div className="text-red-600">{formik.errors.quantity}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="product">Select Product:</label>
                  <select
                    id="product"
                    name="product"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.product}
                  >
                    {products?.details?.length > 0 ? (
                      products?.details?.map((product) => {
                        return (
                          <option key={product?._id} value={product?._id}>
                            {product?.product_name}
                          </option>
                        );
                      })
                    ) : (
                      <option disabled>Loading products...</option>
                    )}
                  </select>
                  {formik.touched.product && formik.errors.product && (
                    <div className="text-red-600">{formik.errors.product}</div>
                  )}
                </div>

                <button type="submit" disabled={!formik.isValid}>
                  Submit
                </button>
              </section>
            </form>
          </main>
        </>
      )}
    </>
  );
}
