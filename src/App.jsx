import React, { useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import ProjectPage from "./pages/ProjectPage";
import JoinProjectPage from "./components/JoinProjectPage";

const App = () => {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user && location.pathname !== "/") {
      sessionStorage.setItem("redirectPath", location.pathname);
    }
  }, [user, location.pathname]);

  return (
    <>
      <Routes>
        {!user && <Route path="/" element={<LandingPage />}></Route>}
        <Route path="/dashboard/:uid" element={user ? <Dashboard /> : <Navigate to="/" />}/>
        <Route path="/project/:projectid" element={user ? <ProjectPage /> : <Navigate to="/" />}/>
        <Route path="/join/:projectid" element={user ? <JoinProjectPage /> : <Navigate to="/" />}/>
        <Route path="*" element={<Navigate to={user ? `/dashboard/${user.uid}` : "/"} />} />
      </Routes>
    </>
  );
};

export default App;
