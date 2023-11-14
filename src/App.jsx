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
  User,
  UserGetById,
  EditUser,
  UpdateUserInfo,
  UpdateUserPassword,
  ForgotPassword,
  ResetPassword,
  Delivery,
  DeliveryGetById,
  EditDelivery,
  CreateDelivery,
  Product,
  ProductGetById,
  EditProduct,
  CreateProduct,
  Transaction,
  CreateTransaction,
  CartPreview,
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
          path="user"
          element={
            <ProtectedRoute userRoles={["Admin"]}>
              <User />
            </ProtectedRoute>
          }
        />
        <Route
          path="user/:id"
          element={
            <ProtectedRoute userRoles={["Admin"]}>
              <UserGetById />
            </ProtectedRoute>
          }
        />
        <Route
          path="user/edit/:id"
          element={
            <ProtectedRoute userRoles={["Admin"]}>
              <EditUser />
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
        <Route
          path="delivery"
          element={
            <ProtectedRoute userRoles={["Admin"]}>
              <Delivery />
            </ProtectedRoute>
          }
        />
        <Route
          path="delivery/create"
          element={
            <ProtectedRoute userRoles={["Admin"]}>
              <CreateDelivery />
            </ProtectedRoute>
          }
        />
        <Route
          path="delivery/:id"
          element={
            <ProtectedRoute userRoles={["Admin"]}>
              <DeliveryGetById />
            </ProtectedRoute>
          }
        />
        <Route
          path="delivery/edit/:id"
          element={
            <ProtectedRoute userRoles={["Admin"]}>
              <EditDelivery />
            </ProtectedRoute>
          }
        />
        <Route
          path="product"
          element={
            <ProtectedRoute userRoles={["Admin"]}>
              <Product />
            </ProtectedRoute>
          }
        />
        <Route
          path="product/create"
          element={
            <ProtectedRoute userRoles={["Admin"]}>
              <CreateProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="product/:id"
          element={
            <ProtectedRoute userRoles={["Admin"]}>
              <ProductGetById />
            </ProtectedRoute>
          }
        />
        <Route
          path="product/edit/:id"
          element={
            <ProtectedRoute userRoles={["Admin"]}>
              <EditProduct />
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
        <Route
          path="transaction"
          element={
            <ProtectedRoute userRoles={["Customer"]}>
              <Transaction />
            </ProtectedRoute>
          }
        />
        <Route
          path="transaction/create"
          element={
            <ProtectedRoute userRoles={["Customer"]}>
              <CreateTransaction />
            </ProtectedRoute>
          }
        />
        <Route
          path="cart"
          element={
            <ProtectedRoute userRoles={["Customer"]}>
              <CartPreview />
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
