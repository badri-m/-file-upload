import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute";
import ConfirmSignup from "./pages/ConfirmSignup";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Send users to the dashboard; ProtectedRoute will redirect to /login if needed.
      { index: true, element: <Navigate to="/dashboard" replace /> },

      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "confirm-signup", element: <ConfirmSignup /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },

      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
