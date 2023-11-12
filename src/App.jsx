import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import {
  RootLayout,
  NotFound,
  Welcome,
  HomeLayout,
  AdminLayout,
  EmployeeLayout,
  CustomerLayout,
} from "@/layouts";
import {
  Test,
  LoginUser,
  CustomerRegister,
  EmployeeRegister,
  UpdateUserInfo,
  UpdateUserPassword,
  ForgotPassword,
  ResetPassword,
} from "@/page";
import { ProtectedRoute, UnprotectedRoute } from "@/components";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      {/* Public Routes */}
      <Route element={<HomeLayout />}>
        <Route
          index
          element={
            <UnprotectedRoute>
              <Welcome />
            </UnprotectedRoute>
          }
        />
        <Route
          path="login"
          element={
            <UnprotectedRoute>
              <LoginUser />
            </UnprotectedRoute>
          }
        />
        <Route
          path="customerRegister"
          element={
            <UnprotectedRoute>
              <CustomerRegister />
            </UnprotectedRoute>
          }
        />
        <Route
          path="employeeRegister"
          element={
            <UnprotectedRoute>
              <EmployeeRegister />
            </UnprotectedRoute>
          }
        />
        <Route
          path="forgotPassword"
          element={
            <UnprotectedRoute>
              <ForgotPassword />
            </UnprotectedRoute>
          }
        />
        <Route
          path="resetPassword/:id"
          element={
            <UnprotectedRoute>
              <ResetPassword />
            </UnprotectedRoute>
          }
        />
      </Route>

      {/* Admin Routes */}
      <Route path="admin" element={<AdminLayout />}>
        <Route
          index
          element={
            <ProtectedRoute userRoles={["Admin"]}>
              <Test />
            </ProtectedRoute>
          }
        />
        <Route
          path="updateUserInfo"
          element={
            <ProtectedRoute userRoles={["Admin", "Employee", "Customer"]}>
              <UpdateUserInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="updateUserPassword"
          element={
            <ProtectedRoute userRoles={["Admin", "Employee", "Customer"]}>
              <UpdateUserPassword />
            </ProtectedRoute>
          }
        />
      </Route>
      {/* Employee Routes */}
      <Route path="employee" element={<EmployeeLayout />}>
        <Route
          index
          element={
            <ProtectedRoute userRoles={["Employee"]}>
              <Test />
            </ProtectedRoute>
          }
        />
        <Route
          path="updateUserInfo"
          element={
            <ProtectedRoute userRoles={["Admin", "Employee", "Customer"]}>
              <UpdateUserInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="updateUserPassword"
          element={
            <ProtectedRoute userRoles={["Admin", "Employee", "Customer"]}>
              <UpdateUserPassword />
            </ProtectedRoute>
          }
        />
      </Route>
      {/* Customer Routes */}
      <Route path="customer" element={<CustomerLayout />}>
        <Route
          index
          element={
            <ProtectedRoute userRoles={["Customer"]}>
              <Test />
            </ProtectedRoute>
          }
        />
        <Route
          path="updateUserInfo"
          element={
            <ProtectedRoute userRoles={["Admin", "Employee", "Customer"]}>
              <UpdateUserInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="updateUserPassword"
          element={
            <ProtectedRoute userRoles={["Admin", "Employee", "Customer"]}>
              <UpdateUserPassword />
            </ProtectedRoute>
          }
        />
      </Route>
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
