import { useState } from 'react';
import axios from 'axios';
import { ImageUpload } from './ImageUpload';
import { MultipleImageUpload } from './MultipleImageUpload';
import { uploadProfilePhoto, uploadUserPhotos } from '../lib/upload';

interface ProfileEditFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    height?: number;
    wingspan?: number;
    bio?: string;
    profilePhoto?: string;
    additionalPhotos?: string[];
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export const ProfileEditForm = ({
  user,
  onSuccess,
  onCancel,
}: ProfileEditFormProps) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    age: user.age || undefined,
    height: user.height || undefined,
    wingspan: user.wingspan || undefined,
    bio: user.bio || '',
    profilePhoto: user.profilePhoto || '',
    additionalPhotos: user.additionalPhotos || [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProfilePhotoUpload = async (file: File) => {
    try {
      const url = await uploadProfilePhoto(file);
      setFormData({ ...formData, profilePhoto: url });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload profile photo');
    }
  };

  const handleAdditionalPhotosUpload = async (files: File[]) => {
    try {
      const urls = await uploadUserPhotos(files);
      setFormData({
        ...formData,
        additionalPhotos: [...formData.additionalPhotos, ...urls],
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload photos');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(
        `http://localhost:3000/api/users/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-edit-form space-y-6">
      <h2 className="text-2xl font-bold text-mono-900 mb-6">
        Edit Profile
      </h2>

      {error && (
        <div className="p-4 bg-urgent-light text-urgent rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Profile Photo */}
      <ImageUpload
        onUpload={handleProfilePhotoUpload}
        currentImage={formData.profilePhoto}
        label="Profile Photo"
        maxSize={5}
      />

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-mono-900 mb-2">
            Display Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-2 border-2 border-mono-200 rounded-xl bg-white text-mono-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-mono-900 mb-2">
            Email (read-only)
          </label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-4 py-2 border-2 border-mono-200 rounded-xl bg-mono-100 text-mono-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-mono-900 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className="w-full px-4 py-2 border-2 border-mono-200 rounded-xl bg-white text-mono-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-mono-900 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className="w-full px-4 py-2 border-2 border-mono-200 rounded-xl bg-white text-mono-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Physical Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-mono-900 mb-2">
            Age
          </label>
          <input
            type="number"
            min="1"
            max="120"
            value={formData.age || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                age: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            className="w-full px-4 py-2 border-2 border-mono-200 rounded-xl bg-white text-mono-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-mono-900 mb-2">
            Height (cm)
          </label>
          <input
            type="number"
            min="1"
            max="300"
            value={formData.height || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                height: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            className="w-full px-4 py-2 border-2 border-mono-200 rounded-xl bg-white text-mono-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-mono-900 mb-2">
            Wingspan (cm)
          </label>
          <input
            type="number"
            min="1"
            max="300"
            value={formData.wingspan || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                wingspan: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            className="w-full px-4 py-2 border-2 border-mono-200 rounded-xl bg-white text-mono-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-semibold text-mono-900 mb-2">
          Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border-2 border-mono-200 rounded-xl bg-white text-mono-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Tell us about yourself..."
        />
      </div>

      {/* Additional Photos */}
      <MultipleImageUpload
        onUpload={handleAdditionalPhotosUpload}
        currentImages={formData.additionalPhotos}
        maxFiles={5}
        maxSize={10}
      />

      {/* Actions */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-success text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-mono-200 text-mono-900 rounded-xl font-semibold hover:opacity-90 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
