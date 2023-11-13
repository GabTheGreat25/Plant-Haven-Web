import React from "react";
import { useAddDeliveriesMutation, useGetProductsQuery } from "@api";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RingLoader } from "react-spinners";
import { createDeliveryValidation } from "@/validation";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";

const formatDate = (date) =>
  moment(date).tz("Asia/Manila").format("YYYY-MM-DD");

export default function () {
  const navigate = useNavigate();
  const [addDelivery, { isLoading }] = useAddDeliveriesMutation();
  const { data: products, isLoading: productsLoading } = useGetProductsQuery();
  moment.tz.setDefault("Asia/Manila");

  const formik = useFormik({
    initialValues: {
      company_name: "",
      date: formatDate(moment()),
      price: "",
      quantity: "",
      product: "",
    },
    validationSchema: createDeliveryValidation,
    onSubmit: async (values) => {
      values.date = formatDate(values.date);

      const response = await addDelivery(values);
      const toastProps = {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      };

      if (response?.data?.success) {
        navigate("/admin/delivery");
        toast.success(response?.data?.message, toastProps);
      } else {
        toast.error(response?.error?.data?.error?.message, toastProps);
      }
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
                    <option value="" label="Select a product" />
                    {products?.details?.length ? (
                      products?.details?.map((product) => (
                        <option key={product?._id} value={product?._id}>
                          {product?.product_name}
                        </option>
                      ))
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
