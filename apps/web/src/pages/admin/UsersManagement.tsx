import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'CLIMBER' | 'OPENER' | 'ADMIN';
  createdAt: string;
  validationCount?: number;
  commentCount?: number;
}

export const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // API returns { users: [], total: number }
      const userData = response.data?.users || [];
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch users');
      setUsers([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (
      !confirm(
        `Are you sure you want to change this user's role to ${newRole}?`
      )
    ) {
      return;
    }

    try {
      setUpdatingUserId(userId);
      const token = localStorage.getItem('accessToken');
      await axios.put(
        `http://localhost:3000/api/admin/users/${userId}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === userId
            ? { ...user, role: newRole as User['role'] }
            : user
        )
      );
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this user? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:3000/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove from local state
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-mono-600">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-urgent-light text-urgent rounded-xl">{error}</div>
    );
  }

  return (
    <div className="users-management">
      <h2 className="text-xl font-bold text-mono-900 mb-4">
        Users Management
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-mono-200">
              <th className="text-left py-3 px-4 font-semibold text-mono-900">
                Email
              </th>
              <th className="text-left py-3 px-4 font-semibold text-mono-900">
                Name
              </th>
              <th className="text-left py-3 px-4 font-semibold text-mono-900">
                Role
              </th>
              <th className="text-center py-3 px-4 font-semibold text-mono-900">
                Joined
              </th>
              <th className="text-center py-3 px-4 font-semibold text-mono-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-mono-100 hover:bg-cream"
              >
                <td className="py-3 px-4 text-mono-900">
                  {user.email}
                </td>
                <td className="py-3 px-4 text-mono-700">
                  {user.name}
                </td>
                <td className="py-3 px-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={updatingUserId === user.id}
                    className="px-3 py-1 border-2 border-mono-200 rounded-lg bg-white text-mono-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CLIMBER">CLIMBER</option>
                    <option value="OPENER">OPENER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="py-3 px-4 text-center text-mono-700 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-4 py-1 bg-urgent text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-8 text-mono-600">
            No users found
          </div>
        )}
      </div>
    </div>
  );
};
