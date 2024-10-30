import { auth } from '../config/firebase-admin';

export const GoogleAuth = async (req, res) => {
  try {
    const idToken = req.body.idToken;
    const decodedToken = await auth.verifyIdToken(idToken);

    const userId = decodedToken.uid;
    const userSnapshot = await db.collection('users').doc(userId).get();
    if (!userSnapshot.exists) {
      await db.collection('users').doc(userId).set({
        displayName: decodedToken.name,
        email: decodedToken.email,
        photoURL: decodedToken.picture,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const token = await auth.createCustomToken(userId);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ message: 'Invalid Google ID token' });
  }
};