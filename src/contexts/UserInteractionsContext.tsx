// src/contexts/UserInteractionsContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { AuthMessage } from "@/components/ui/auth-message";

type Rating = {
  destinationId: string;
  rating: number;
};

type UserComment = {
  id: string;
  destinationId: string;
  comment: string;
  date: string;
  user: string;
};

type UserInteractionsContextType = {
  ratings: Rating[];
  userComments: UserComment[];
  addRating: (destinationId: string, rating: number) => boolean;
  getRating: (destinationId: string) => number | null;
  addComment: (destinationId: string, comment: string) => boolean;
  removeComment: (commentId: string) => boolean;
  getUserComments: (destinationId: string) => UserComment[];
  requireAuth: () => boolean;
};

const UserInteractionsContext = createContext<UserInteractionsContextType | undefined>(undefined);

export function UserInteractionsProvider({ children }: { children: ReactNode }) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userComments, setUserComments] = useState<UserComment[]>([]);
  const [showAuthMessage, setShowAuthMessage] = useState(false);
  const { isAuthenticated } = useAuth();  // Access the `isAuthenticated` from AuthContext
  const navigate = useNavigate();

  // Redirect if not authenticated
  const requireAuth = () => {
    if (!isAuthenticated) {
      setShowAuthMessage(true);
      navigate("/guest-profile");
      return false;
    }
    return true;
  };

  const handleAuthMessageClose = () => {
    setShowAuthMessage(false);
  };

  const addRating = (destinationId: string, rating: number) => {
    if (!requireAuth()) return false;

    setRatings((prev) => {
      const existing = prev.find((r) => r.destinationId === destinationId);
      if (existing) {
        return prev.map((r) =>
          r.destinationId === destinationId ? { ...r, rating } : r
        );
      }
      return [...prev, { destinationId, rating }];
    });
    return true;
  };

  const getRating = (destinationId: string): number | null => {
    if (!isAuthenticated) return null;
    const rating = ratings.find((r) => r.destinationId === destinationId);
    return rating ? rating.rating : null;
  };

  const addComment = (destinationId: string, comment: string) => {
    if (!requireAuth()) return false;

    const newComment: UserComment = {
      id: Math.random().toString(36).substr(2, 9),
      destinationId,
      comment,
      date: new Date().toLocaleDateString(),
      user: "You",
    };
    setUserComments((prev) => [...prev, newComment]);
    return true;
  };

  const removeComment = (commentId: string) => {
    if (!requireAuth()) return false;

    setUserComments((prev) => prev.filter((c) => c.id !== commentId));
    return true;
  };

  const getUserComments = (destinationId: string): UserComment[] => {
    if (!isAuthenticated) return [];
    return userComments.filter((c) => c.destinationId === destinationId);
  };

  return (
    <UserInteractionsContext.Provider
      value={{
        ratings,
        userComments,
        addRating,
        getRating,
        addComment,
        removeComment,
        getUserComments,
        requireAuth,
      }}
    >
      {children}
      <AuthMessage open={showAuthMessage} onClose={handleAuthMessageClose} />
    </UserInteractionsContext.Provider>
  );
}

export function useUserInteractions() {
  const context = useContext(UserInteractionsContext);
  if (context === undefined) {
    throw new Error(
      "useUserInteractions must be used within a UserInteractionsProvider"
    );
  }
  return context;
}
