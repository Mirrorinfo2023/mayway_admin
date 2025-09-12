import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { verifyToken } from "@/redux/slices/authSlice";

const ProtectedRoute = ({ children, isProtected }) => {
  const { isAuthenticated, status } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(verifyToken()); 
    }
  }, [dispatch, isAuthenticated]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-t-transparent border-blue-700 border-solid rounded-full animate-spin"></div>
          <span className="text-xl font-bold text-blue-700 drop-shadow-md">
            Checking token...
          </span>
        </div>
      </div>
    );
  }

  if (!isProtected && !isAuthenticated) {
    return children;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAuthenticated && location.pathname === "/login") {
    return <Navigate to={location.state?.from?.pathname || "/dashboard"} replace />;
  }

  return children;
};

export default ProtectedRoute;
