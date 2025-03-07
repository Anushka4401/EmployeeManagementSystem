import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/login-user" replace />;
  }

  const user = JSON.parse(atob(token.split(".")[1]));

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login-user" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
