import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DEFAULT_GYM_SVG } from '../../lib/defaultGymLayout';

export const GymLayoutEditor = () => {
  const [svgContent, setSvgContent] = useState<string>(DEFAULT_GYM_SVG);
  const [originalContent, setOriginalContent] = useState<string>(DEFAULT_GYM_SVG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCurrentLayout = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(
          'http://localhost:3000/api/admin/gym-layout',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.svgContent) {
          setSvgContent(response.data.svgContent);
          setOriginalContent(response.data.svgContent);
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load gym layout');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentLayout();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const token = localStorage.getItem('accessToken');
      await axios.post(
        'http://localhost:3000/api/admin/gym-layout',
        {
          name: 'main_gym',
          svgContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setOriginalContent(svgContent);
      setSuccess('Gym layout saved successfully!');

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save gym layout');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSvgContent(originalContent);
    setError(null);
    setSuccess(null);
  };

  const handleResetToDefault = () => {
    if (
      confirm(
        'Are you sure you want to reset to the default template? This will discard your current changes.'
      )
    ) {
      setSvgContent(DEFAULT_GYM_SVG);
      setError(null);
      setSuccess(null);
    }
  };

  // Configure SVG in preview
  useEffect(() => {
    if (!previewRef.current) return;

    const svgElement = previewRef.current.querySelector('svg');
    if (svgElement) {
      svgElement.style.width = '100%';
      svgElement.style.height = 'auto';
      svgElement.style.maxHeight = '400px';
      svgElement.style.display = 'block';
      svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    }
  }, [svgContent]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-mono-600 dark:text-mono-400">
          Loading gym layout editor...
        </div>
      </div>
    );
  }

  return (
    <div className="gym-layout-editor max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-mono-900 dark:text-white mb-6">
        Gym Layout Editor
      </h2>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900 border-2 border-blue-200 dark:border-blue-700 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Instructions:
        </h3>
        <ul className="list-disc list-inside text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>
            Each sector must have <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">class="sector-path"</code>
          </li>
          <li>
            Each sector must have <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">data-sector="ID"</code> (e.g., A, B, C, D)
          </li>
          <li>Use SVG elements like &lt;rect&gt;, &lt;polygon&gt;, &lt;path&gt;, etc.</li>
          <li>You can customize colors, positions, and shapes</li>
          <li>Preview updates in real-time on the right</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div>
          <label className="block text-sm font-semibold text-mono-900 dark:text-white mb-2">
            SVG Code:
          </label>
          <textarea
            value={svgContent}
            onChange={(e) => setSvgContent(e.target.value)}
            className="w-full h-96 p-4 border-2 border-mono-200 dark:border-mono-800 rounded-xl bg-white dark:bg-mono-900 text-mono-900 dark:text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            spellCheck={false}
          />

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-success text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {saving ? 'Saving...' : 'Save Layout'}
            </button>

            <button
              onClick={handleReset}
              className="px-6 py-2 bg-mono-200 dark:bg-mono-800 text-mono-900 dark:text-white rounded-xl font-semibold hover:opacity-90 transition-all"
            >
              Reset Changes
            </button>

            <button
              onClick={handleResetToDefault}
              className="px-6 py-2 bg-urgent text-white rounded-xl font-semibold hover:opacity-90 transition-all"
            >
              Reset to Default
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-urgent-light text-urgent rounded-xl text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-success-light text-success rounded-xl text-sm">
              {success}
            </div>
          )}
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-semibold text-mono-900 dark:text-white mb-2">
            Preview:
          </label>
          <div
            ref={previewRef}
            className="border-2 border-mono-200 dark:border-mono-800 rounded-xl p-4 bg-white dark:bg-mono-900 overflow-auto"
            style={{ height: '400px' }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>
      </div>
    </div>
  );
};
