import React, { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Room from './pages/Room'

const App = () => {
  const {user} = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user && location.pathname !== '/') {
      sessionStorage.setItem("redirectPath". location.pathname);
    }
  }, [user, location])

  return (
    <>
      <Routes>
        {!user && <Route path='/' element={<LandingPage/>}></Route>}
        {user && <Route path='/dashboard' element={<Navigate to={`/dashboard/${user.uid}`} />} />}
        {user && <Route path='/room/:roomid' element={<Room/>}></Route>}
      </Routes>
    </>
  )
}

export default App