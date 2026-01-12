import { useState } from 'react';
import { commentsAPI, CommentCreateInput } from '../lib/api/comments';
import { useAuth } from '../hooks/useAuth';

interface CommentFormProps {
  routeId: string;
  onCommentCreated: () => void;
}

export const CommentForm = ({ routeId, onCommentCreated }: CommentFormProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Le commentaire ne peut pas être vide');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data: CommentCreateInput = {
        content: content.trim(),
      };

      await commentsAPI.createComment(routeId, data);

      // Reset form
      setContent('');

      // Notify parent
      onCommentCreated();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create comment');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 bg-white dark:bg-mono-900 border border-mono-200 dark:border-mono-800 rounded-xl text-center shadow-card">
        <p className="text-sm text-mono-500">
          Connectez-vous pour laisser un commentaire
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="p-3 bg-urgent/10 border border-urgent/20 rounded-xl text-urgent text-sm">
          {error}
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-mono-900 dark:bg-white flex items-center justify-center">
            <span className="text-white dark:text-black font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Partagez vos conseils, votre expérience..."
            rows={3}
            maxLength={2000}
            className="w-full px-4 py-3 rounded-xl border border-mono-200/50 dark:border-mono-800 bg-white/60 dark:bg-mono-900 backdrop-blur-md text-mono-900 dark:text-white placeholder:text-mono-400 resize-none focus:outline-none focus:border-mono-400 dark:focus:border-mono-600 transition-colors"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-mono-500">
              {content.length} / 2000
            </span>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="px-4 py-2 bg-mono-900 dark:bg-white text-white dark:text-black rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm active:scale-95"
            >
              {loading ? 'Envoi...' : 'Publier'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
