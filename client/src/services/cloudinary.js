import { cloudinaryConfig } from '../config/cloudinary';

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`;

export const uploadToCloudinary = async (file) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  formData.append('api_key', cloudinaryConfig.apiKey);

  try {
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error de Cloudinary:', errorData);
      throw new Error('Error al subir el archivo a Cloudinary');
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
      resourceType: data.resource_type,
    };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};