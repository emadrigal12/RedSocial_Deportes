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

export const checkUser = async (req, res) => {
    try {
      const { uid } = req.user;
      
      const userDoc = await admin.firestore()
        .collection('Usuarios')
        .doc(uid)
        .get();
      
      console.log(userDoc.exists, 'UserDoc');
      
      if (!userDoc.exists) {
        return res.json({ exists: false });
      }
  
      res.json({ 
        exists: true, 
        userData: userDoc.data()
      });
    } catch (error) {
      console.error('Error checking user:', error);
      res.status(500).json({ message: 'Error checking user' });
    }
  };
  

export const completeRegistro = async (req, res) => {
  try {
    let uid = req.user?.uid;
    const userData = req.body;

    if (!uid) {
      const newUser = await admin.auth().createUser({
        email: userData.email,
        password: userData.password
      });
      uid = newUser.uid;
    }

    await admin.firestore()
      .collection('Usuarios')
      .doc(uid)
      .set({
        ...userData,
        email: userData.email,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

    res.status(200).json({ message: 'Registration completed successfully' });
  } catch (error) {
    console.error('Error completing registration:', error);
    res.status(500).json({ message: 'Error completing registration' });
  }
};
