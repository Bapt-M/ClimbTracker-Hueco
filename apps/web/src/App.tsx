import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/Dashboard';
import { RoutesHub } from './pages/RoutesHub';
import { RouteDetail } from './pages/RouteDetail';
import { CreateRoute } from './pages/CreateRoute';
import { UserProfile } from './pages/UserProfile';
import { Leaderboard } from './pages/Leaderboard';
import { Friends } from './pages/Friends';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Overview } from './pages/admin/Overview';
import { UsersManagement } from './pages/admin/UsersManagement';
import { GymLayoutEditor } from './components/admin/GymLayoutEditor';
import { AdminRoutes } from './pages/AdminRoutes';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

// Admin route wrapper
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

function App() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/routes"
          element={
            <ProtectedRoute>
              <RoutesHub />
            </ProtectedRoute>
          }
        />
        <Route
          path="/routes/create"
          element={
            <ProtectedRoute>
              <CreateRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="/routes/:id"
          element={
            <ProtectedRoute>
              <RouteDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:userId"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <Friends />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/routes"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminRoutes />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="gym-layout" element={<GymLayoutEditor />} />
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
