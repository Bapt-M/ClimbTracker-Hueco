import { useState, useRef } from 'react';

interface ImageUploadProps {
  onUpload: (file: File) => Promise<void>;
  currentImage?: string;
  label?: string;
  maxSize?: number; // in MB
  className?: string;
}

export const ImageUpload = ({
  onUpload,
  currentImage,
  label = 'Upload Image',
  maxSize = 5,
  className = '',
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | undefined>(currentImage);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File must be an image');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload
      await onUpload(file);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed');
      setPreview(currentImage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`image-upload ${className}`}>
      <label className="block text-sm font-semibold text-mono-900 mb-2">
        {label}
      </label>

      {preview && (
        <div className="mb-4">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-xl border-2 border-mono-200"
          />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="px-4 py-2 bg-mono-900 text-white rounded-xl font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : 'Choose File'}
      </button>

      {error && (
        <p className="text-urgent text-sm mt-2">{error}</p>
      )}
    </div>
  );
};
