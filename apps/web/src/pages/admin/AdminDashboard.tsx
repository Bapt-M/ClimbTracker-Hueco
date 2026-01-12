import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';

interface DashboardStats {
  totalUsers: number;
  totalRoutes: number;
  totalValidations: number;
  totalComments: number;
  activeRoutes: number;
  adminCount: number;
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(
          'http://localhost:3000/api/admin/stats',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStats(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="admin-dashboard min-h-screen bg-mono-50 dark:bg-mono-950">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-mono-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-mono-600 dark:text-mono-400">
            Manage your ClimbTracker database
          </p>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="text-center py-8">
            <div className="text-mono-600 dark:text-mono-400">
              Loading statistics...
            </div>
          </div>
        ) : error ? (
          <div className="p-4 bg-urgent-light text-urgent rounded-xl mb-6">
            {error}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-mono-900 border-2 border-mono-200 dark:border-mono-800 rounded-xl p-6">
              <div className="text-sm font-medium text-mono-600 dark:text-mono-400 mb-1">
                Total Users
              </div>
              <div className="text-3xl font-bold text-mono-900 dark:text-white">
                {stats.totalUsers}
              </div>
              <div className="text-xs text-mono-500 dark:text-mono-500 mt-1">
                {stats.adminCount} admins
              </div>
            </div>

            <div className="bg-white dark:bg-mono-900 border-2 border-mono-200 dark:border-mono-800 rounded-xl p-6">
              <div className="text-sm font-medium text-mono-600 dark:text-mono-400 mb-1">
                Total Routes
              </div>
              <div className="text-3xl font-bold text-mono-900 dark:text-white">
                {stats.totalRoutes}
              </div>
              <div className="text-xs text-mono-500 dark:text-mono-500 mt-1">
                {stats.activeRoutes} active
              </div>
            </div>

            <div className="bg-white dark:bg-mono-900 border-2 border-mono-200 dark:border-mono-800 rounded-xl p-6">
              <div className="text-sm font-medium text-mono-600 dark:text-mono-400 mb-1">
                Total Validations
              </div>
              <div className="text-3xl font-bold text-mono-900 dark:text-white">
                {stats.totalValidations}
              </div>
            </div>

            <div className="bg-white dark:bg-mono-900 border-2 border-mono-200 dark:border-mono-800 rounded-xl p-6">
              <div className="text-sm font-medium text-mono-600 dark:text-mono-400 mb-1">
                Total Comments
              </div>
              <div className="text-3xl font-bold text-mono-900 dark:text-white">
                {stats.totalComments}
              </div>
            </div>
          </div>
        ) : null}

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 border-b-2 border-mono-200 dark:border-mono-800">
          <Link
            to="/admin"
            className={`px-6 py-3 font-semibold transition-all ${
              isActive('/admin')
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 -mb-0.5'
                : 'text-mono-600 dark:text-mono-400 hover:text-mono-900 dark:hover:text-white'
            }`}
          >
            Overview
          </Link>
          <Link
            to="/admin/users"
            className={`px-6 py-3 font-semibold transition-all ${
              isActive('/admin/users')
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 -mb-0.5'
                : 'text-mono-600 dark:text-mono-400 hover:text-mono-900 dark:hover:text-white'
            }`}
          >
            Users
          </Link>
          <Link
            to="/admin/gym-layout"
            className={`px-6 py-3 font-semibold transition-all ${
              isActive('/admin/gym-layout')
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 -mb-0.5'
                : 'text-mono-600 dark:text-mono-400 hover:text-mono-900 dark:hover:text-white'
            }`}
          >
            Gym Layout
          </Link>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-mono-900 border-2 border-mono-200 dark:border-mono-800 rounded-xl p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
