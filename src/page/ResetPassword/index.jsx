import React, { useState } from "react";
import { useResetPasswordMutation } from "@api";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RingLoader } from "react-spinners";
import { resetPasswordValidation } from "@/validation";

export default function () {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordValidation,
    onSubmit: (values) => {
      const { newPassword, confirmPassword } = values;
      const email = new URLSearchParams(window.location.search).get("email");
      resetPassword({
        newPassword,
        confirmPassword,
        email,
      }).then((response) => {
        const toastProps = {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        };
        if (response?.data?.success === true) {
          window.open(`https://mailtrap.io/inboxes`, "_blank");
          toast.success(`${response?.data?.message}`, toastProps);
        } else
          toast.error(`${response?.error?.data?.error?.message}`, toastProps);
      });
    },
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <>
      {isLoading ? (
        <div className="loader">
          <RingLoader color="#4F6C42" loading={true} size={50} />
        </div>
      ) : (
        <>
          <main className="grid justify-center items-center h-screen">
            <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
              <section className="grid justify-center items-center text-center">
                <div>
                  <label htmlFor="newPassword"> New Password: </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.newPassword}
                  />
                  <input
                    type="checkbox"
                    id="showpassword"
                    onChange={handleClickShowPassword}
                  />
                  <label htmlFor="showPassword">Show New Password</label>
                  {formik.touched.newPassword && formik.errors.newPassword && (
                    <div className="text-red-600">{formik.errors.newPassword}</div>
                  )}
                </div>
                <div>
                  <label htmlFor="confirmPassword"> Confirm Password: </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                  />
                  <input
                    type="checkbox"
                    id="showConfirmPassword"
                    onChange={handleClickShowConfirmPassword}
                  />
                  <label htmlFor="showConfirmPassword">Show New Password</label>
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <div className="text-red-600">
                        {formik.errors.confirmPassword}
                      </div>
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
