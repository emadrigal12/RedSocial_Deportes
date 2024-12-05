import React, { useState, useEffect, useRef } from 'react';
import { uploadToCloudinary } from '../../services/cloudinary';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { PropTypes } from 'prop-types';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

const EditarPerfil = ({ user, onClose }) => {
  const [afinidades, setAfinidades] = useState('');
  const [biografia, setBiografia] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState('');
  const [nombrePerfil, setNombrePerfil] = useState('');
  const [privacidad, setPrivacidad] = useState(true);
  const [ubicacion, setUbicacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setNombrePerfil(user.displayName || '');
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const firestore = getFirestore();
      const userDocRef = doc(firestore, `users/${user.uid}`);
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        setAfinidades(userData.afinidades || '');
        setBiografia(userData.biografia || '');
        setFotoPerfil(userData.fotoPerfil || '');
        setPrivacidad(userData.privacidad ?? true);
        setUbicacion(userData.ubicacion || '');
      }
    } catch (error) {
      setError('Error al cargar datos del usuario.');
      console.error(error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo es demasiado grande. Máximo 5MB permitido.');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSave = async () => {
    if (!nombrePerfil.trim()) {
      setError('El nombre de perfil es obligatorio.');
      return;
    }

    if (biografia.length > 150) {
      setError('La biografía no puede exceder los 150 caracteres.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      let updatedFotoPerfil = fotoPerfil;

      // Subir foto a Cloudinary si es necesario
      if (selectedFile) {
        const mediaInfo = await uploadToCloudinary(selectedFile, (progress) => {
          setUploadProgress(progress);
        });
        if (!mediaInfo?.url) {
          throw new Error('Error al subir la imagen a Cloudinary.');
        }
        updatedFotoPerfil = mediaInfo.url;
      }

      // Actualizar datos en Firestore
      const firestore = getFirestore();
      const userDocRef = doc(firestore, `users/${user.uid}`);
      await updateDoc(userDocRef, {
        afinidades,
        biografia,
        fotoPerfil: updatedFotoPerfil,
        privacidad,
        ubicacion,
      });

      // Cerrar modal después de guardar
      onClose();
    } catch (error) {
      setError('Error al guardar los cambios.');
      //console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
      aria-label="Modal de edición de perfil"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Editar Perfil</h2>

        <div className="mb-4">
          <label htmlFor="afinidades" className="block font-medium mb-2">
            Afinidades
          </label>
          <input
            type="text"
            id="afinidades"
            value={afinidades}
            onChange={(e) => setAfinidades(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            aria-label="Campo de afinidades"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="biografia" className="block font-medium mb-2">
            Biografía
          </label>
          <textarea
            id="biografia"
            value={biografia}
            onChange={(e) => setBiografia(e.target.value.slice(0, 150))}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            aria-label="Campo de biografía"
          />
          <p className="text-gray-500 text-sm">{biografia.length}/150 caracteres</p>
        </div>

        <div className="mb-4">
          <label htmlFor="fotoPerfil" className="block font-medium mb-2">
            Foto de Perfil
          </label>
          {previewUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <img
                src={previewUrl}
                alt="Vista previa"
                className="max-h-80 w-full rounded-lg object-cover"
                aria-label="Vista previa de la imagen"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 rounded-full"
                onClick={removeFile}
              >
                <X className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,video/*"
              className="hidden"
              aria-label="Seleccionar archivo"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-orange-500 border-orange-200 hover:bg-orange-50"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              Subir Foto
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="nombrePerfil" className="block font-medium mb-2">
            Nombre de Perfil
          </label>
          <input
            type="text"
            id="nombrePerfil"
            value={nombrePerfil}
            onChange={(e) => setNombrePerfil(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            aria-label="Campo de nombre de perfil"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="privacidad" className="block font-medium mb-2">
            Privacidad
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="privacidad"
              checked={privacidad}
              onChange={(e) => setPrivacidad(e.target.checked)}
              className="mr-2"
              aria-label="Campo de privacidad"
            />
            <label htmlFor="privacidad">Perfil público</label>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="ubicacion" className="block font-medium mb-2">
            Ubicación
          </label>
          <input
            type="text"
            id="ubicacion"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            aria-label="Campo de ubicación"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className={`bg-orange-500 text-white hover:bg-orange-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

EditarPerfil.propTypes = {
  user: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditarPerfil;