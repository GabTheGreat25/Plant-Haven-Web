import React from "react";
import { useForgotPasswordMutation } from "@api";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RingLoader } from "react-spinners";
import { forgotPasswordValidation } from "@/validation";

export default function () {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordValidation,
    onSubmit: (values) => {
      forgotPassword(values?.email).then((response) => {
        const toastProps = {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        };
        if (response?.data?.success) {
          window.open(`https://mailtrap.io/inboxes`, "_blank");
          toast.success(`${response?.data?.message}`, toastProps);
        } else
          toast.error(`${response?.error?.data?.error?.message}`, toastProps);
      });
    },
  });
  return (
    <>
      <>
        {isLoading ? (
          <div className="loader">
            <RingLoader color="#4F6C42" loading={true} size={50} />
          </div>
        ) : (
          <>
            <main className="grid justify-center items-center h-screen">
              <form onSubmit={formik.handleSubmit}>
                <section className="grid justify-center items-center text-center">
                  <div>
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-red-600">{formik.errors.email}</div>
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
    </>
  );
}
