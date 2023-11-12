import React, { useState } from "react";
import { useUpdatePasswordMutation } from "@api";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RingLoader } from "react-spinners";
import { updatePasswordValidation } from "@/validation";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function () {
  const navigate = useNavigate();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const auth = useSelector((state) => state.auth);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: updatePasswordValidation,
    onSubmit: (values) => {
      const { oldPassword, newPassword, confirmPassword } = values;
      updatePassword({
        id: auth?.user?._id,
        oldPassword,
        newPassword,
        confirmPassword,
      }).then((response) => {
        const toastProps = {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        };
        if (response?.data?.success === true) {
          const userRoles = response?.data?.details?.roles;
          if (userRoles.includes("Admin")) {
            navigate("/admin");
          } else if (userRoles.includes("Employee")) {
            navigate("/employee");
          } else if (userRoles.includes("Customer")) {
            navigate("/customer");
          }
          toast.success(`${response?.data?.message}`, toastProps);
        } else
          toast.error(`${response?.error?.data?.error?.message}`, toastProps);
      });
    },
  });

  const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);

  const handleClickShowOldPassword = () => setShowOldPassword(!showOldPassword);

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
                  <label htmlFor="oldPassword"> Old Password: </label>
                  <input
                    type={showOldPassword ? "text" : "password"}
                    id="oldPassword"
                    name="oldPassword"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.oldPassword}
                  />
                  <input
                    type="checkbox"
                    id="showOldPassword"
                    onChange={handleClickShowOldPassword}
                  />
                  <label htmlFor="showOldPassword">Show Old Password</label>
                  {formik.touched.oldPassword && formik.errors.oldPassword && (
                    <div className="text-red-600">
                      {formik.errors.oldPassword}
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="newPassword"> New Password: </label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.newPassword}
                  />
                  <input
                    type="checkbox"
                    id="showNewPassword"
                    onChange={handleClickShowNewPassword}
                  />
                  <label htmlFor="showNewPassword">Show New Password</label>
                  {formik.touched.newPassword && formik.errors.newPassword && (
                    <div className="text-red-600">
                      {formik.errors.newPassword}
                    </div>
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
