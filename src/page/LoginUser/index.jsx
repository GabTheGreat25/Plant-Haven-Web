import React, { useState } from "react";
import { useLoginMutation } from "@api";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { RingLoader } from "react-spinners";
import { loginUserValidation } from "@/validation";

export default function () {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser, { isLoading }] = useLoginMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginUserValidation,
    onSubmit: (values) => {
      loginUser(values).then((response) => {
        const toastProps = {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        };
        if (response?.data?.success === true) {
          toast.success(`${response?.data?.message}`, toastProps);
        } else
          toast.error(`${response?.error?.data?.error?.message}`, toastProps);
      });
    },
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleForgotPassword = () => navigate(`/Forgotpassword`);

  return (
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
                <div>
                  <label htmlFor="password">Password:</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                  <input
                    type="checkbox"
                    id="showPassword"
                    onChange={handleClickShowPassword}
                  />
                  <label htmlFor="showPassword">Show Password</label>
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-red-600">{formik.errors.password}</div>
                  )}
                </div>
                <button type="submit" disabled={!formik.isValid}>
                  Submit
                </button>
                <button type="button" onClick={handleForgotPassword}>
                  Forgot Password
                </button>
              </section>
            </form>
          </main>
        </>
      )}
    </>
  );
}
