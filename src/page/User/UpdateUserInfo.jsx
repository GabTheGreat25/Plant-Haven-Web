import React from "react";
import { useUpdateUserMutation } from "@api";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RingLoader } from "react-spinners";
import { editUserValidation } from "@/validation";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function () {
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: auth?.user?.name || "",
      email: auth?.user?.email || "",
      image: auth?.user?.image || [],
    },
    validationSchema: editUserValidation,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values?.name);
      formData.append("email", values?.email);
      Array.from(values?.image).forEach((file) => {
        formData.append("image", file);
      });

      updateUser({ id: auth?.user?._id, payload: formData }).then(
        (response) => {
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
        }
      );
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
              <form
                onSubmit={formik.handleSubmit}
                encType="multipart/form-data"
              >
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
                    <label htmlFor="image">Upload Image:</label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      onChange={(event) => {
                        formik.setFieldValue(
                          "image",
                          event.currentTarget.files
                        );
                      }}
                      onBlur={formik.handleBlur}
                      multiple
                    />
                    <span className="grid justify-center items-center grid-flow-col gap-x-2">
                      {auth?.user?.image?.map((image) => (
                        <span key={image?.public_id}>
                          <img
                            height={60}
                            width={75}
                            src={image?.url}
                            alt={image?.originalname}
                          />
                        </span>
                      ))}
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
    </>
  );
}
