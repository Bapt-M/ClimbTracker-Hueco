import { useState, useEffect } from 'react';
import axios from 'axios';

interface RouteCompletionCountProps {
  routeId: string;
  className?: string;
}

export const RouteCompletionCount = ({
  routeId,
  className = '',
}: RouteCompletionCountProps) => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompletionCount = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(
          `http://localhost:3000/api/routes/${routeId}/completion-count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCount(response.data.count);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch completion count');
      } finally {
        setLoading(false);
      }
    };

    fetchCompletionCount();
  }, [routeId]);

  if (loading) {
    return (
      <div className={`text-sm text-mono-600 dark:text-mono-400 ${className}`}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-sm text-urgent ${className}`}>
        {error}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        <svg
          className="w-5 h-5 text-success"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm font-semibold text-mono-900 dark:text-white">
          {count}
        </span>
      </div>
      <span className="text-sm text-mono-700 dark:text-mono-300">
        {count === 0 ? 'personne n\'a réussi cette voie' : count === 1 ? 'personne a réussi cette voie' : 'personnes ont réussi cette voie'}
      </span>
    </div>
  );
};
