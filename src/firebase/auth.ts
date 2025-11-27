import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { app } from './app';

export const auth = getAuth(app);

export const loginAdmin = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const tokenResult = await userCredential.user.getIdTokenResult();
  
  if (tokenResult.claims.role !== 'admin') {
    await signOut(auth);
    throw new Error('Acceso denegado: No tienes permisos de administrador');
  }
  
  return userCredential.user;
};

export const logoutAdmin = () => signOut(auth);
