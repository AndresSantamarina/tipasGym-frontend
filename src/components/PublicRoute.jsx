import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);
  if (loading) return null;
  if (token) {
    return <Navigate to="/admin/dashboard" />;
  }

  return children;
};

export default PublicRoute;
