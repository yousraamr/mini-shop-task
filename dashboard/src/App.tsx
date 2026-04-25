import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Products from "./pages/Products";

function Protected({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("admin_token");

  if (!token) return <Navigate to="/" />;

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <Protected>
            <Dashboard />
          </Protected>
        }
      />

      <Route
        path="/orders"
        element={
          <Protected>
            <Orders />
          </Protected>
        }
      />

      <Route
        path="/products"
        element={
          <Protected>
            <Products />
          </Protected>
        }
      />
    </Routes>
  );
}