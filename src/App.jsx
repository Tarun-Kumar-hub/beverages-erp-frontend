import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Layout from "./Layouts/Layout";

// Guards
import AuthBootstrap from "./components/auth/AuthBootstrap";
import ProtectedRoute from "./guards/ProtectedRoute";
import GuestRoute from "./guards/GuestRoute";
import RoleRoute from "./guards/RoleRoute";

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
// Dashboard
import Dashboard from "./pages/Dashboard";

// Inventory
import Materials from "./pages/Materials";
import RecipeList from "./pages/RecipeList";
import Containers from "./pages/Containers";
import Packaging from "./pages/Packaging";
import Stocks from "./pages/Stocks";
import InventoryHistory from "./pages/InventoryHistory";

// Customers
import Customers from "./pages/Customers";
import CustomerDetails from "./components/admin/CustomerDetails";
import CreateCustomer from "./pages/CreateCustomer";
import CustomerHistory from "./components/admin/CustomerOrderHistory";

// Orders
import Orders from "./pages/Orders";
import CreateOrder from "./pages/CreateOrder";
import OrderDetails from "./pages/OrderDetails";

// Misc
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// Roles
import { ROLES } from "./constants/roles";

export default function App() {
  return (
    <BrowserRouter>
      <AuthBootstrap>
        <Toaster
          position="top-center"
          containerStyle={{
            top: 80,
            zIndex: 99999,
          }}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1f2937",
              color: "#fff",
            },
          }}
        />

        <Routes>
          {/* Home */}
          <Route
            path="/"
            element={<Navigate to="/admin/dashboard" replace />}
          />

          {/* Guest Routes */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
          </Route>

          {/* Protected Layout */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Layout />}>
              <Route index element={<Navigate to="dashboard" replace />} />

              {/* Dashboard */}
              <Route
                path="dashboard"
                element={
                  <RoleRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}
                  >
                    <Dashboard />
                  </RoleRoute>
                }
              />

              {/* Inventory */}
              <Route
                path="materials"
                element={
                  <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
                    <Materials />
                  </RoleRoute>
                }
              />

              <Route
                path="recipes"
                element={
                  <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
                    <RecipeList />
                  </RoleRoute>
                }
              />

              <Route
                path="containers"
                element={
                  <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
                    <Containers />
                  </RoleRoute>
                }
              />

              <Route
                path="packaging"
                element={
                  <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
                    <Packaging />
                  </RoleRoute>
                }
              />

              <Route
                path="stock"
                element={
                  <RoleRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}
                  >
                    <Stocks />
                  </RoleRoute>
                }
              />

              <Route
                path="inventory-history"
                element={
                  <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
                    <InventoryHistory />
                  </RoleRoute>
                }
              />

              {/* Customers */}
              <Route
                path="customers"
                element={
                  <RoleRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}
                  >
                    <Customers />
                  </RoleRoute>
                }
              />

              <Route
                path="customers/create"
                element={
                  <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
                    <CreateCustomer />
                  </RoleRoute>
                }
              />

              <Route
                path="customers/edit/:id"
                element={
                  <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
                    <CreateCustomer />
                  </RoleRoute>
                }
              />

              <Route
                path="customers/:id/history"
                element={
                  <RoleRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}
                  >
                    <CustomerHistory />
                  </RoleRoute>
                }
              />

              <Route
                path="customers/:id"
                element={
                  <RoleRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}
                  >
                    <CustomerDetails />
                  </RoleRoute>
                }
              />

              {/* Orders */}
              <Route
                path="orders"
                element={
                  <RoleRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}
                  >
                    <Orders />
                  </RoleRoute>
                }
              />

              <Route
                path="orders/create"
                element={
                  <RoleRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}
                  >
                    <CreateOrder />
                  </RoleRoute>
                }
              />

              <Route
                path="orders/:id"
                element={
                  <RoleRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}
                  >
                    <OrderDetails />
                  </RoleRoute>
                }
              />
            </Route>
          </Route>

          {/* Unauthorized */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthBootstrap>
    </BrowserRouter>
  );
}
