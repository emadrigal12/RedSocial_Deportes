import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  ImagePlus, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { createPost } from '../../config/Publicaciones/Publicacion';
import { uploadToCloudinary } from '../../services/cloudinary';
import { getAuth } from 'firebase/auth';

const SportIcons = {
  futbol: '⚽',
  baloncesto: '🏀', 
  tenis: '🎾', 
  ciclismo: '🚴',
  general: '🌐'
};

const PrivacyIcons = {
  public: '🌍',
  private: '🔒',
  friends: '👥'
};

export const CrearPublicacion = ({ onPostCreated }) => {
  const [contenido, setContenido] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tipoDeporte, setTipoDeporte] = useState('');
  const [privacidad, setPrivacidad] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const auth = getAuth();

  const MAX_CHARACTERS = 280;

  useEffect(() => {
    setCharacterCount(contenido.length);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [contenido]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setValidationMessage('El archivo es demasiado grande. Máximo 5MB permitido.');
        setShowValidationModal(true);
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
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contenido.trim()) {
      setValidationMessage('Por favor, escribe algo antes de publicar.');
      setShowValidationModal(true);
      return;
    }

    if (contenido.length > MAX_CHARACTERS) {
      setValidationMessage(`Tu publicación supera el límite de ${MAX_CHARACTERS} caracteres.`);
      setShowValidationModal(true);
      return;
    }

    if (!tipoDeporte) {
      setValidationMessage('Por favor, selecciona un tipo de deporte.');
      setShowValidationModal(true);
      return;
    }

    if (!privacidad) {
      setValidationMessage('Por favor, selecciona la privacidad de tu publicación.');
      setShowValidationModal(true);
      return;
    }

    setIsLoading(true);
    try {
      let mediaInfo = null;
      if (selectedFile) {
        mediaInfo = await uploadToCloudinary(selectedFile);
      }

      const postData = {
        content: contenido,
        mediaUrl: mediaInfo?.url || null,
        mediaPublicId: mediaInfo?.publicId || null,
        mediaType: mediaInfo?.resourceType || null,
        tipoDeporte: tipoDeporte,
        privacidad: privacidad,
        createdAt: new Date(),
      };

      await createPost(postData);
      setContenido('');
      setTipoDeporte('');
      setPrivacidad('');
      removeFile();
      if (onPostCreated) onPostCreated();
    } catch (error) {
      console.error('Error al publicar:', error);
      setValidationMessage('Error al crear la publicación. Por favor, intenta de nuevo.');
      setShowValidationModal(true);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Card className="mb-6 border-2 border-orange-100 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
        <CardHeader className="p-4 pb-0">
          <CardTitle className="flex items-center space-x-3 mb-2">
            <Avatar className="h-10 w-10 ring-2 ring-orange-200">
              <AvatarImage src={auth.currentUser?.photoURL || "/api/placeholder/32/32"} />
              <AvatarFallback>{auth.currentUser?.displayName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              
              <p className="text-xs text-gray-500">Crear nueva publicación deportiva</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-4 space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <textarea 
                ref={textareaRef}
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                className="w-full resize-none rounded-lg border-2 border-orange-100 p-4 text-base focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white hover:bg-gray-50 transition-colors min-h-[100px]"
                placeholder="¿Qué está pasando en el mundo deportivo?"
                maxLength={MAX_CHARACTERS}
              />
              <div className="flex justify-end text-sm text-gray-500">
                {characterCount}/{MAX_CHARACTERS}
              </div>
              
              {previewUrl && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-h-80 w-full rounded-lg object-cover"
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
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-orange-500 border-orange-200 hover:bg-orange-50"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <ImagePlus className="mr-2 h-4 w-4" />
                  
                </Button>
                
                <Select 
                  value={tipoDeporte} 
                  onValueChange={setTipoDeporte}
                >
                  <SelectTrigger className="w-[125px] h-9">
                    <SelectValue placeholder={
                      <div className="flex items-center text-sm">
                        <span className="mr-1 text-base">🌐</span>
                        Deporte
                      </div>
                    }>
                      {tipoDeporte && (
                        <div className="flex items-center text-sm">
                          <span className="mr-1 text-base">{SportIcons[tipoDeporte]}</span>
                          {tipoDeporte.charAt(0).toUpperCase() + tipoDeporte.slice(1)}
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SportIcons).map(([sport, icon]) => (
                      <SelectItem key={sport} value={sport}>
                        <div className="flex items-center">
                          <span className="mr-2 text-base">{icon}</span>
                          {sport.charAt(0).toUpperCase() + sport.slice(1)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={privacidad} 
                  onValueChange={setPrivacidad}
                >
                  <SelectTrigger className="w-[140px] h-9">
                    <SelectValue placeholder={
                      <div className="flex items-center text-sm">
                        <span className="mr-1 text-base">🌍</span>
                        Privacidad
                      </div>
                    }>
                      {privacidad && (
                        <div className="flex items-center text-sm">
                          <span className="mr-1 text-base">{PrivacyIcons[privacidad]}</span>
                          {privacidad.charAt(0).toUpperCase() + privacidad.slice(1)}
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PrivacyIcons).map(([privacy, icon]) => (
                      <SelectItem key={privacy} value={privacy}>
                        <div className="flex items-center">
                          <span className="mr-2 text-base">{icon}</span>
                          {privacy.charAt(0).toUpperCase() + privacy.slice(1)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex-grow"></div> 
                
                <Button 
                  type="submit"
                  size="sm"
                  disabled={isLoading || !contenido.trim()}
                  className="bg-orange-500 hover:bg-orange-600 text-white transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publicando...
                    </>
                  ) : (
                    'Publicar'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      
      <Dialog 
        open={showValidationModal}
        onOpenChange={setShowValidationModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-500">
              <AlertTriangle className="mr-2 h-6 w-6" />
              Validación de Publicación
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-gray-700">{validationMessage}</p>
          </div>
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => setShowValidationModal(false)}
            >
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

CrearPublicacion.propTypes = {
  onPostCreated: PropTypes.func,
};