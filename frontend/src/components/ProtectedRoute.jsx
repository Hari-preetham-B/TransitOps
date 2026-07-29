import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProtectedRoute({ children }) {
  const { user, loading, fetchProfile, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h2 className="text-lg font-semibold">Loading...</h2>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
