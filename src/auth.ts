// src/auth.ts
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from './lib/firebase'; // Import Firebase auth

// Sign up function
export const signUp = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name
    await updateProfile(user, { displayName });

    return user; // Return user object on success
  } catch (err) {
    console.error('Error signing up:', err);
    throw new Error(err instanceof Error ? err.message : 'Error signing up');
  }
};

// Login function
export const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null }; // Return user object and null error
    } catch (err) {
      console.error('Error logging in:', err);
      return { user: null, error: err instanceof Error ? err.message : 'Error logging in' };
    }
  };
