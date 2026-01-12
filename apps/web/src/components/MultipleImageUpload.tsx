import { useState, useRef } from 'react';

interface MultipleImageUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  currentImages?: string[];
  maxFiles?: number;
  maxSize?: number; // in MB
  className?: string;
}

export const MultipleImageUpload = ({
  onUpload,
  currentImages = [],
  maxFiles = 5,
  maxSize = 10,
  className = '',
}: MultipleImageUploadProps) => {
  const [previews, setPreviews] = useState<string[]>(currentImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate number of files
    if (previews.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed`);
      return;
    }

    // Validate each file
    for (const file of files) {
      if (file.size > maxSize * 1024 * 1024) {
        setError(`Each file must be less than ${maxSize}MB`);
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('All files must be images');
        return;
      }
    }

    setError(null);
    setUploading(true);

    try {
      // Create previews
      const newPreviews = await Promise.all(
        files.map(
          (file) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            })
        )
      );

      setPreviews([...previews, ...newPreviews]);

      // Upload
      await onUpload(files);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setPreviews(previews.filter((_, i) => i !== index));
  };

  return (
    <div className={`multiple-image-upload ${className}`}>
      <label className="block text-sm font-semibold text-mono-900 dark:text-white mb-2">
        Additional Photos ({previews.length}/{maxFiles})
      </label>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative group">
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-32 object-cover rounded-xl border-2 border-mono-200 dark:border-mono-800"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-urgent text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {previews.length < maxFiles && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-mono-900 dark:bg-white text-white dark:text-black rounded-xl font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Add Photos'}
          </button>
        </>
      )}

      {error && (
        <p className="text-urgent text-sm mt-2">{error}</p>
      )}
    </div>
  );
};
