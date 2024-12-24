// src/database.ts
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from './lib/firebase'; // Import Firestore

// Function to get user profile from Firestore
export const getUserProfile = async (userId: string) => {
  try {
    const docRef = doc(firestore, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data(); // Return user profile data
    } else {
      throw new Error('No such user!');
    }
  } catch (err) {
    throw new Error('Error fetching user profile');
  }
};
