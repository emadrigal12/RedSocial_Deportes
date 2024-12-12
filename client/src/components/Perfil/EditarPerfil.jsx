import React, { useState, useEffect, useRef } from 'react';
import { uploadToCloudinary } from '../../services/cloudinary';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PropTypes } from 'prop-types';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { updateProfile } from 'firebase/auth';
import { onFindById } from '../../config/Login/Login';
import { auth, db } from '../../lib/firebase/config';
import { useToast } from "@/hooks/use-toast"

const EditarPerfil = ({ user, onClose }) => {
  const [afinidades, setAfinidades] = useState('');
  const [biografia, setBiografia] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState('');
  const [nombrePerfil, setNombrePerfil] = useState('');
  const [nombreUsuario, setUsuario] = useState('');
  const [privacidad, setPrivacidad] = useState(true);
  const [ubicacion, setUbicacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const { toast } = useToast();
  useEffect(() => {
    if (user) {
      setNombrePerfil(user.displayName || '');
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const docSnapshot = await onFindById(user.uid);
      const userDocRef = doc(db, docSnapshot.ref.path);
      const userData = await getDoc(userDocRef);
      
      if (userData.exists()) {
        setAfinidades(userData.data().afinidades || '');
        setUsuario(userData.data().usuario || '');
        setBiografia(userData.data().biografia || '');
        setFotoPerfil(userData.data().fotoPerfil || '');
        setPrivacidad(userData.data().privacidad ?? true);
        setUbicacion(userData.data().ubicacion || '');
      }
    } catch (error) {
      setError('Error al cargar datos del usuario.');
      console.error(error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validaciones de archivo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Tipo de archivo no permitido. Solo se aceptan imágenes.');
        return;
      }

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
    // Validaciones más exhaustivas
    if (!nombreUsuario.trim()) {
      setError('El nombre de usuario es obligatorio.');
      return;
    }
  
    if (nombreUsuario.length > 50) {
      setError('El nombre de perfil no puede exceder los 50 caracteres.');
      return;
    }
  
    if (biografia.length > 150) {
      setError('La biografía no puede exceder los 150 caracteres.');
      return;
    }
  
    if (afinidades.length > 100) {
      setError('Las afinidades no pueden exceder los 100 caracteres.');
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
  
      if (auth.currentUser) {
        const docSnapshot = await onFindById(user.uid);
        const userDocRef = doc(db, docSnapshot.ref.path);
        await updateDoc(userDocRef, {
          afinidades: afinidades.trim(),
          biografia: biografia.trim(),
          fotoPerfil: updatedFotoPerfil,
          privacidad,
          ubicacion: ubicacion.trim(),
          usuario: nombreUsuario.trim()
        });
  
        
        await updateProfile(auth.currentUser, {
          displayName: nombrePerfil,
          photoURL: updatedFotoPerfil
        });

        toast({
          variant: "outline",
          title: "Éxito",
          description: "Perfil editado con éxito."
        });
      } else {
        setError('El usuario no está autenticado.');
        toast({
          variant: "destructive",
          title: "Error",
          description: 'El usuario no está autenticado.'
          
        });
      }
  
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
      setError(error.message || 'Error al guardar los cambios.');
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
          <Input
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
          <Textarea
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
                className="max-h-80 w-full rounded-lg object-cover mb-2"
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
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,video/*"
              className="hidden mb-2"
              aria-label="Seleccionar archivo"
            />
            <Button
              type="button"
              size="sm"
              className="bg-white text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white mr-4"
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
          <Input
            type="text"
            id="nombrePerfil"
            value={nombreUsuario}
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
          <Input
            type="text"
            id="ubicacion"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            aria-label="Campo de ubicación"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button onClick={handleCancel} className="bg-white text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white">
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
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    displayName: PropTypes.string,
    photoURL: PropTypes.string
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditarPerfil;