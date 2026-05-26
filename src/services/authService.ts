import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, googleProvider, rootEmail } from '../firebase/firebase';
import { userRepository } from '../repositories/userRepository';

export const authService = {
  onChanged(cb: (user: User | null) => void) {
    return onAuthStateChanged(auth, cb);
  },
  async signInGoogle() {
    const credential = await signInWithPopup(auth, googleProvider);
    const u = credential.user;
    await userRepository.ensureUser({
      uid: u.uid,
      email: u.email || '',
      displayName: u.displayName || undefined,
      rootEmail,
    });
  },
  signOut() {
    return signOut(auth);
  },
};
