import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

interface KiviatChartProps {
  userId: string;
  className?: string;
}

interface KiviatDataPoint {
  routeType: string;
  successRate: number;
  averageGrade: number;
  totalAttempts: number;
  completedCount: number;
}

export const KiviatChart = ({ userId, className = '' }: KiviatChartProps) => {
  const [data, setData] = useState<KiviatDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKiviatData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(
          `http://localhost:3000/api/users/${userId}/kiviat-data`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch performance data');
      } finally {
        setLoading(false);
      }
    };

    fetchKiviatData();
  }, [userId]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-mono-600">
          Loading performance data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-urgent-light text-urgent rounded-xl ${className}`}>
        {error}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`p-8 text-center text-mono-600 ${className}`}>
        Aucune donnée de performance disponible. Validez des voies pour voir vos statistiques !
      </div>
    );
  }

  // Transform data for radar chart
  const chartData = data.map((point) => ({
    subject: point.routeType,
    'Taux de réussite': point.successRate,
    'Note moyenne (normalisée)': point.averageGrade,
  }));

  return (
    <div className={`kiviat-chart ${className}`}>
      <h3 className="text-lg font-bold text-mono-900 mb-4">
        Performance par type de voie
      </h3>

      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#6b7280" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#6b7280' }}
          />
          <Radar
            name="Taux de réussite"
            dataKey="Taux de réussite"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
          <Radar
            name="Note moyenne (normalisée)"
            dataKey="Note moyenne (normalisée)"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.6}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
              color: '#fff',
            }}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>

      {/* Details table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-mono-200">
              <th className="text-left py-2 px-3 font-semibold text-mono-900">
                Type
              </th>
              <th className="text-center py-2 px-3 font-semibold text-mono-900">
                Tentatives
              </th>
              <th className="text-center py-2 px-3 font-semibold text-mono-900">
                Réussites
              </th>
              <th className="text-center py-2 px-3 font-semibold text-mono-900">
                Taux
              </th>
              <th className="text-center py-2 px-3 font-semibold text-mono-900">
                Note moy.
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((point, index) => (
              <tr
                key={index}
                className="border-b border-mono-100 hover:bg-cream"
              >
                <td className="py-2 px-3 text-mono-900 font-medium">
                  {point.routeType}
                </td>
                <td className="py-2 px-3 text-center text-mono-700">
                  {point.totalAttempts}
                </td>
                <td className="py-2 px-3 text-center text-mono-700">
                  {point.completedCount}
                </td>
                <td className="py-2 px-3 text-center text-mono-700">
                  {point.successRate.toFixed(0)}%
                </td>
                <td className="py-2 px-3 text-center text-mono-700">
                  {point.averageGrade.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
