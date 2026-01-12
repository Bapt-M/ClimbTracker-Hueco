import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Upload a single profile photo
 * @param file - Image file to upload
 * @returns Cloudinary URL of the uploaded image
 */
export const uploadProfilePhoto = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('photo', file);

  const token = localStorage.getItem('accessToken');

  const response = await axios.post(
    `${API_URL}/api/upload/profile-photo`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.url;
};

/**
 * Upload multiple user photos
 * @param files - Array of image files to upload
 * @returns Array of Cloudinary URLs
 */
export const uploadUserPhotos = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append('photos', file));

  const token = localStorage.getItem('accessToken');

  const response = await axios.post(
    `${API_URL}/api/upload/user-photos`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.urls;
};

/**
 * Upload a single route photo
 * @param file - Image file to upload
 * @returns Cloudinary URL of the uploaded image
 */
export const uploadRoutePhoto = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('photo', file);

  const token = localStorage.getItem('accessToken');

  const response = await axios.post(
    `${API_URL}/api/upload/route-photo`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.url;
};

/**
 * Delete a photo from Cloudinary
 * @param publicId - Cloudinary public ID of the image
 */
export const deletePhoto = async (publicId: string): Promise<void> => {
  const token = localStorage.getItem('accessToken');

  await axios.delete(`${API_URL}/api/upload/photo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { publicId },
  });
};
