import React, { useEffect } from "react";
import {
  useUpdateCommentMutation,
  useGetCommentByIdQuery,
} from "@api";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RingLoader } from "react-spinners";
import { editCommentValidation } from "@/validation";
import { useNavigate, useParams } from "react-router-dom";

export default function () {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useGetCommentByIdQuery(id);
  const [updateComment] = useUpdateCommentMutation();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ratings: data?.details?.ratings || 0,
      text: data?.details?.text || "",
      image: data?.details?.image || [],
    },
    validationSchema: editCommentValidation,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("ratings", values?.ratings);
      formData.append("text", values?.text);
      Array.from(values?.image).forEach((file) => {
        formData.append("image", file);
      });
      console.log("Form Data:", formData);
      updateComment({ id: data?.details?._id, payload: formData }).then(
        (response) => {
          const toastProps = {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          };
          if (response?.data?.success === true) {
            navigate("/customer/comment");
            toast.success(`${response?.data?.message}`, toastProps);
          } else {
            toast.error(
              `${response?.error?.data?.error?.message}`,
              toastProps
            );
          }
        }
      );
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
            <form
              onSubmit={formik.handleSubmit}
              encType="multipart/form-data"
            >
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
                    type="text"
                    id="ratings"
                    name="ratings"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.ratings}
                    min="1"
                    max="5"
                  />
                  {formik.touched.ratings && formik.errors.ratings && (
                    <div className="text-red-600">{formik.errors.ratings}</div>
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
                    {data?.details?.image?.map((image) => (
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
  );
}
