import React from "react";
import { useAddCommentMutation } from "@api";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RingLoader } from "react-spinners";
import { createCommentValidation } from "@/validation";
import { useNavigate, useLocation } from "react-router-dom";
import { ImagePreview } from "@/components";

export default function CommentCreationComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [addComment, { isLoading }] = useAddCommentMutation();

  const formik = useFormik({
    initialValues: {
      ratings: 0,
      text: "",
      image: [],
      transaction: location.state?.transactionId || "",
    },
    validationSchema: createCommentValidation,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("ratings", values?.ratings);
      formData.append("text", values?.text);
      formData.append("transaction", values?.transaction);
      console.log(values?.transaction);

      Array.from(values?.image).forEach((file) => {
        formData.append("image", file);
      });

      const response = await addComment(formData);
      const toastProps = {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      };

      if (response?.data?.success) {
        toast.success(response?.data?.message, toastProps);
        navigate("/customer/comment");
      } else {
        toast.error(response?.error?.data?.error?.message, toastProps);
      }
    },
  });

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
                  <label htmlFor="text">Text:</label>
                  <input
                    type="text"
                    id="text"
                    name="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.text}
                  />
                  {formik.touched.text && formik.errors.text && (
                    <div className="text-red-600">{formik.errors.text}</div>
                  )}
                </div>
                <div>
                  <label htmlFor="ratings">Ratings:</label>
                  <input
                    type="number"
                    id="ratings"
                    name="ratings"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.ratings}
                    min="1"
                    max="5"
                  />
                  {formik.touched.ratings && formik.errors.ratings && (
                    <div className="text-red-600">
                      {formik.errors.ratings}
                    </div>
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
