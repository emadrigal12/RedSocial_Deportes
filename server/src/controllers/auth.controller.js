import admin from '../config/firebase-admin';

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    
    res.status(200).json({
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture
      }
    });
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(401).json({ message: 'Error en autenticación' });
  }
};

export const getProfile = async (req, res) => {
  try {
    
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
};