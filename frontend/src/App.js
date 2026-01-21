import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import PrincipalDashboard from './pages/PrincipalDashboard';
import ParentDashboard from './pages/ParentDashboard';
import './App.css';
import StudentAttendance from './pages/StudentAttendance';

// Component to redirect to appropriate dashboard based on role
function DashboardRedirect() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  switch (user.role) {
    case 'student':
      return <Navigate to="/dashboard/student" replace />;
    case 'teacher':
      return <Navigate to="/dashboard/teacher" replace />;
    case 'principal':
      return <Navigate to="/dashboard/principal" replace />;
    case 'parent':
      return <Navigate to="/dashboard/parent" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Dashboard Redirect Route */}
            <Route path="/dashboard" element={<DashboardRedirect />} />
            
            {/* Role-Specific Protected Routes */}
            <Route 
              path="/dashboard/student" 
              element={
                <PrivateRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/dashboard/teacher" 
              element={
                <PrivateRoute allowedRoles={['teacher']}>
                  <TeacherDashboard />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/dashboard/principal" 
              element={
                <PrivateRoute allowedRoles={['principal']}>
                  <PrincipalDashboard />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/dashboard/parent" 
              element={
                <PrivateRoute allowedRoles={['parent']}>
                  <ParentDashboard />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/attendance" 
              element={
              <PrivateRoute allowedRoles={['student']}>
              <StudentAttendance />
              </PrivateRoute>
            } 
          />
            
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            
            {/* 404 - Not Found */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;