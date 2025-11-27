import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import ideaStore from "./store/store";

function Layout() {
  const { initialize, isLoading, isLoggedIn } = ideaStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isLoading && !isLoggedIn && !location.pathname.startsWith("/auth")) {
      navigate("/auth/login", {
        state: { from: location.pathname },
        replace: true,
      });
    }
  }, [isLoggedIn, isLoading, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <Header />
      <Outlet />
    </div>
  );
}

export default Layout;
