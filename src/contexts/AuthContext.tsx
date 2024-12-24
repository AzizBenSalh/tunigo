// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, User as FirebaseUser } from 'firebase/auth';
import { app } from '@/lib/firebase';

const AuthContext = createContext<any>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const auth = getAuth(app);

  // Sign up method
  const signup = async (email: string, password: string, username: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        await updateProfile(user, { displayName: username });
      }
      return { user };
    } catch (error) {
      return { error: error.message };
    }
  };

  // Login method
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  };

  // Handle user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const isAuthenticated = user !== null;  // Explicit check for user authentication

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, signup, login }}>
      {children}
    </AuthContext.Provider>
  );
};
