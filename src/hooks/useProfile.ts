import { useState, useEffect } from "react";
import { firestore } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc, updateDoc, serverTimestamp, onSnapshot } from "firebase/firestore";

type Profile = {
  auth_id: string;
  name: string;
  email: string;
  [key: string]: any;
};

type ProfileUpdate = {
  name?: string;
  email?: string;
  [key: string]: any;
};

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const profileRef = doc(firestore, `user_profiles/${user.uid}`);
      const profileDoc = await getDoc(profileRef);

      if (!profileDoc.exists()) {
        throw new Error("Profile not found");
      }

      setProfile(profileDoc.data() as Profile);
    } catch (err) {
      console.error("Error in fetchProfile:", err);
      setError(err instanceof Error ? err.message : "Error fetching profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    if (user) {
      const unsubscribe = onSnapshot(doc(firestore, `user_profiles/${user.uid}`), (docSnapshot) => {
        if (docSnapshot.exists()) {
          setProfile(docSnapshot.data() as Profile);
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user?.uid]);

  const updateProfile = async (updates: ProfileUpdate) => {
    if (!user) return { error: "No user logged in" };

    try {
      setLoading(true);
      const profileRef = doc(firestore, `user_profiles/${user.uid}`);
      await updateDoc(profileRef, {
        ...updates,
        updated_at: serverTimestamp(),
      });

      const updatedProfile = await getDoc(profileRef);
      setProfile(updatedProfile.data() as Profile);

      return { data: updatedProfile.data(), error: null };
    } catch (err) {
      console.error("Error updating profile:", err);
      return {
        data: null,
        error: err instanceof Error ? err.message : "Error updating profile",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile: fetchProfile,
  };
}
