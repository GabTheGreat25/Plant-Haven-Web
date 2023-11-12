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
import { Test, LoginUser } from "@/page";
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
          path="/login"
          element={
            <UnprotectedRoute>
              <LoginUser />
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
