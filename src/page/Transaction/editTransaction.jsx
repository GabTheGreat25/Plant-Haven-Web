import React from "react";
import { useUpdateTransactionMutation, useGetTransactionByIdQuery } from "@api";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RingLoader } from "react-spinners";
import { editTransactionValidation } from "@/validation";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment-timezone";
import { STATUS } from "@/constants";

export default function () {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useGetTransactionByIdQuery(id);
  const [updateTransaction] = useUpdateTransactionMutation();
  const auth = useSelector((state) => state.auth);

  moment.tz.setDefault("Asia/Manila");

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      date: moment(data?.details?.date).format("YYYY-MM-DD") || "",
      status: data?.details?.status || "",
    },
    validationSchema: editTransactionValidation,
    onSubmit: async (values) => {
      values.date = moment(values.date).format("YYYY-MM-DD");

      updateTransaction({ id: data?.details?._id, payload: values }).then(
        (response) => {
          const toastProps = {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          };
          if (response?.data?.success === true) {
            const userRoles = auth?.user?.roles;
            if (userRoles.includes("Admin")) {
              navigate("/admin/transactionAll");
            } else if (userRoles.includes("Employee")) {
              navigate("/employee/transactionAll");
            }
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
      {isLoading  ? (
        <div className="loader">
          <RingLoader color="#4F6C42" loading={true} size={50} />
        </div>
      ) : (
        <>
          <main className="grid justify-center items-center h-screen">
            <form onSubmit={formik.handleSubmit}>
              <section className="grid justify-center items-center text-center">
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
