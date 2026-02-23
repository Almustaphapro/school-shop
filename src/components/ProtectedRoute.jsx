import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate replace to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate replace to="/unauthorized" />; // Or back to their own dash
  }

  return <Outlet />;
};

export default ProtectedRoute;