import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import Appointments from './pages/Appointments';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/booking" 
        element={
          <PrivateRoute>
            <Booking />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/appointments" 
        element={
          <PrivateRoute>
            <Appointments />
          </PrivateRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <div className="App">
            <AppRoutes />
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

