import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import {Toaster} from 'react-hot-toast'
import { AuthContext } from "../context/AuthContext.jsx"
import { Navigate } from 'react-router-dom'

const App = () => {

  const { authUser } = useContext(AuthContext)

  return (
    <div className="bg-[url('/bgImage.svg')] bg-contain ">
    <Toaster/>
      <Routes>
      {/* When the user is not authenticated , they cannot access the HomePage and they will be re-directed to login page */}
        <Route path="/" element={ authUser ? <HomePage /> : <Navigate to="/login"/> } />
        <Route path="/login" element={ !authUser ? <LoginPage /> : <Navigate to="/"/> } />
        <Route path="/profile" element={ authUser ? <ProfilePage /> : <Navigate to="/login"/> } />
      </Routes>
    </div>
  );
}

export default App;