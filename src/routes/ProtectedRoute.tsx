 
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLoader from "../components/loaders/PageLoader";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader message="Loading..." />;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
