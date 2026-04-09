import React, { useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Room from "./pages/Room";

const App = () => {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user && location.pathname !== "/") {
      sessionStorage.setItem("redirectPath".location.pathname);
    }
  }, [user, location]);

  return (
    <>
      <Routes>
        {!user && <Route path="/" element={<LandingPage />}></Route>}
        <Route path="/dashboard/:uid" element={user ? <Dashboard /> : <Navigate to="/" />}/>
        <Route path="/room/:roomid" element={user ? <Room /> : <Navigate to="/" />}/>
        <Route path="*" element={<Navigate to={user ? `/dashboard/${user.uid}` : "/"} />} />
      </Routes>
    </>
  );
};

export default App;
