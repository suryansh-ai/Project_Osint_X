import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useRole } from '../../../context/RoleContext';

// Landing & Loader Pages
import Index from '../../Index';
import Loader from '../../Loader';
import ContactUs from '../../ContactUs';
import AboutUs from '../../AboutUs';

// Auth Pages
import Login from '../Login';
import Signup from '../Signup';
import RoleSelection from '../RoleSelection';
import DemoSelector from '../DemoSelector';
import OAuthCallback from '../OAuthCallback';

// Investigation Interface - Student (Restricted Field Interface)
import RestrictedFieldInterface from '../../dashboards/student/RestrictedFieldInterface';
import ToolAccess from '../../dashboards/student/ToolAccess';
import CaseFiles from '../../dashboards/student/CaseFiles';
import Profile from '../../dashboards/student/Profile';
import Settings from '../../dashboards/student/Settings';
import Search from '../../dashboards/student/Search';
import HelpCenter from '../../dashboards/student/HelpCenter';
import Notifications from '../../dashboards/student/Notifications';
import ProgressReports from '../../dashboards/student/ProgressReports';
import Feedback from '../../dashboards/student/Feedback';

// Investigation Interface - User (Cyber Avatar Dashboard)
import CyberAvatarDashboard from '../../dashboards/user/CyberAvatarDashboard';
import ActiveCases from '../../dashboards/user/ActiveCases';
import CaseDetailPage from '../../dashboards/user/CaseDetailPage';
import EvidenceBoard from '../../dashboards/user/EvidenceBoard';
import ProfileSettings from '../../dashboards/user/ProfileSettings';
import NotificationsPage from '../../dashboards/user/NotificationsPage';
import RechargeCredits from '../../dashboards/user/RechargeCredits';

// Protected Route wrapper
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <Loader targetPage="dashboard" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on user's role
    return <Navigate to={`/dashboard/${user?.role}`} replace />;
  }

  return children;
};

// Public Route wrapper (redirects if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  return children;
};

// Dashboard redirect based on role
const DashboardRedirect = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={`/dashboard/${user.role}`} replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<Index />} />
      
      {/* Contact & About Pages */}
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/about" element={<AboutUs />} />
      
      {/* Boot Loader */}
      <Route path="/loading" element={<Loader />} />

      {/* Public Routes */}
      <Route
        path="/select-role"
        element={
          <PublicRoute>
            <RoleSelection />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />
      <Route
        path="/demo"
        element={
          <PublicRoute>
            <DemoSelector />
          </PublicRoute>
        }
      />

      {/* OAuth Callback */}
      <Route path="/auth/callback" element={<OAuthCallback />} />

      {/* Dashboard Redirect */}
      <Route
        path="/dashboard"
        element={<DashboardRedirect />}
      />

      {/* Student Investigation Interface Routes */}
      <Route
        path="/dashboard/student"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <RestrictedFieldInterface />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/student/tools"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <ToolAccess />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/student/cases"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <CaseFiles />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/student/profile"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/student/settings"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/student/search"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Search />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/student/help"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <HelpCenter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/student/notifications"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/student/progress"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <ProgressReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/student/feedback"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Feedback />
          </ProtectedRoute>
        }
      />

      {/* User Investigation Workspace Routes */}
      <Route
        path="/dashboard/user"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <CyberAvatarDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/user/cases"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <ActiveCases />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/user/cases/:caseId"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <CaseDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/user/evidence"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <EvidenceBoard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/user/settings"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <ProfileSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/user/notifications"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/user/recharge"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <RechargeCredits />
          </ProtectedRoute>
        }
      />

      {/* Root redirect - now goes to landing page */}
      <Route
        path="/"
        element={<Index />}
      />

      {/* 404 Fallback */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 p-4 relative overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 investigation-grid-student opacity-20" />
            
            {/* Glitch effect container */}
            <div className="relative z-10 text-center">
              <h1 className="text-8xl font-mono font-bold text-red-500 mb-4 animate-glitch">
                404
              </h1>
              <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-red-500 to-transparent mb-6" />
              <p className="text-gray-400 mb-2 font-mono text-sm tracking-wider">
                TARGET NOT FOUND
              </p>
              <p className="text-gray-600 mb-8 font-mono text-xs">
                The requested intelligence data does not exist in the database
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-300 font-mono text-sm hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-300"
              >
                <span>←</span>
                <span>RETURN TO BASE</span>
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
