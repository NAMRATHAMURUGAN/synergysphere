import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import Profile from './pages/Profile';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
        <Route path="/projects/:id" element={<PrivateRoute><ProjectDetail/></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
