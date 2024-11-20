import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PropTypes  } from 'prop-types';

const EditarPerfil = ({ onClose }) => {
  const [afinidades, setAfinidades] = useState('');
  const [biografia, setBiografia] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState('');
  const [nombrePerfil, setNombrePerfil] = useState('');
  const [privacidad, setPrivacidad] = useState(true);
  const [ubicacion, setUbicacion] = useState('');

  const handleSave = async () => {
    try {
      const updatedProfile = {
        afinidades,
        biografia,
        fotoPerfil,
        nombrePerfil,
        privacidad,
        ubicacion,
      };
  
      const currentUser = firebase.auth().currentUser;
      await currentUser.updateProfile({
        displayName: nombrePerfil,
        photoURL: fotoPerfil,
      });
      await firebase.firestore().collection('users').doc(currentUser.uid).update({
        afinidades,
        biografia,
        ubicacion,
        privacidad,
      });
  
      const { dispatch } = useContext(UserContext);
      dispatch({ type: 'UPDATE_USER_PROFILE', payload: updatedProfile });
  
      onClose();
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
      alert('Hubo un error al actualizar el perfil. Por favor, inténtalo de nuevo.');
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Editar Perfil</h2>
        <div className="mb-4">
          <label htmlFor="afinidades" className="block font-medium mb-2">Afinidades</label>
          <input
            type="text"
            id="afinidades"
            value={afinidades}
            onChange={(e) => setAfinidades(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="biografia" className="block font-medium mb-2">Biografía</label>
          <textarea
            id="biografia"
            value={biografia}
            onChange={(e) => setBiografia(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="fotoPerfil" className="block font-medium mb-2">Foto de Perfil</label>
        </div>
        <div className="mb-4">
          <label htmlFor="nombrePerfil" className="block font-medium mb-2">Nombre de Perfil</label>
          <input
            type="text"
            id="nombrePerfil"
            value={nombrePerfil}
            onChange={(e) => setNombrePerfil(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="privacidad" className="block font-medium mb-2">Privacidad</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="privacidad"
              checked={privacidad}
              onChange={(e) => setPrivacidad(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="privacidad">Perfil público</label>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="ubicacion" className="block font-medium mb-2">Ubicación</label>
          <input
            type="text"
            id="ubicacion"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <Button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-orange-500 text-white hover:bg-orange-600">
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
};

EditarPerfil.propTypes = {
    onClose: PropTypes.func.isRequired,
}

export default EditarPerfil;