import React, { useState } from "react";
import { useAddUserMutation } from "@api";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { RingLoader } from "react-spinners";
import { createUserValidation } from "@/validation";
import { ImagePreview } from "@/components";

export default function () {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [addUser, { isLoading }] = useAddUserMutation();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      roles: "Employee",
      password: "",
      image: [],
    },
    validationSchema: createUserValidation,
    onSubmit: (values) => {
      const formData = new FormData();

      formData.append("name", values?.name);
      formData.append("email", values?.email);
      formData.append("roles", values?.roles);
      formData.append("password", values?.password);
      Array.from(values?.image).forEach((file) => {
        formData.append("image", file);
      });
      addUser(formData).then((response) => {
        const toastProps = {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        };
        if (response?.data?.success === true) {
          navigate("/login");
          toast.success(`${response?.data?.message}`, toastProps);
        } else
          toast.error(`${response?.error?.data?.error?.message}`, toastProps);
      });
    },
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

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
                  <label htmlFor="name">Name:</label>
                  <input
                    type="name"
                    id="name"
                    name="name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="text-red-600">{formik.errors.name}</div>
                  )}
                </div>
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
                <div>
                  <label htmlFor="image">Upload Image:</label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={(event) => {
                      formik.setFieldValue("image", event.currentTarget.files);
                    }}
                    onBlur={formik.handleBlur}
                    multiple
                  />
                  <span className="grid justify-center items-center grid-flow-col gap-x-2">
                    {formik.values.image && (
                      <ImagePreview images={Array.from(formik.values.image)} />
                    )}
                  </span>
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
