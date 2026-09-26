import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CampusChatbot } from './components/common/CampusChatbot';
import { PrivacyExplainerModal } from './components/common/PrivacyExplainerModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { StudentDashboard } from './pages/StudentDashboard';
import { SubmitComplaint } from './pages/SubmitComplaint';
import { MyComplaints } from './pages/MyComplaints';
import { ComplaintDetails } from './pages/ComplaintDetails';
import { IssueExplorer } from './pages/IssueExplorer';
import { IssueDetails } from './pages/IssueDetails';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminIssueView } from './pages/AdminIssueView';
import { Analytics } from './pages/Analytics';
import { Profile } from './pages/Profile';

// Route guards
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-wine-600 dark:text-peach-300 font-medium">
        Loading session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const App = () => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 dark:bg-wine-950 text-wine-900 dark:text-cream-100 selection:bg-burgundy-800 selection:text-cream-50 transition-colors duration-200 relative">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/issues" element={<IssueExplorer />} />
          <Route path="/issues/:id" element={<IssueDetails />} />

          {/* Student Protected Routes */}
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submit"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <SubmitComplaint />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-complaints"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MyComplaints />
              </ProtectedRoute>
            }
          />

          {/* Shared Complaint Details (Student Owner or Admin) */}
          <Route
            path="/complaints/:publicComplaintId"
            element={
              <ProtectedRoute>
                <ComplaintDetails />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/issues/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminIssueView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Analytics />
              </ProtectedRoute>
            }
          />

          {/* Profile Route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Global Interactive Campus Guide Chatbot Widget */}
      <CampusChatbot onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)} />

      {/* Global Privacy Explainer Modal */}
      <PrivacyExplainerModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
    </div>
  );
};

export default App;

