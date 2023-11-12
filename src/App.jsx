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
} from "@/page";
import { ProtectedRoute, UnprotectedRoute } from "@/components";

const commonProtectedRoute = (
  <ProtectedRoute userRoles={["Admin", "Employee", "Customer"]}>
    <UpdateUserInfo />
  </ProtectedRoute>
);

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
          path="/login"
          element={
            <UnprotectedRoute>
              <LoginUser />
            </UnprotectedRoute>
          }
        />
        <Route
          path="/customerRegister"
          element={
            <UnprotectedRoute>
              <CustomerRegister />
            </UnprotectedRoute>
          }
        />
        <Route
          path="/employeeRegister"
          element={
            <UnprotectedRoute>
              <EmployeeRegister />
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
        <Route path="updateUserInfo" element={commonProtectedRoute} />
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
        <Route path="updateUserInfo" element={commonProtectedRoute} />
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
        <Route path="updateUserInfo" element={commonProtectedRoute} />
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
