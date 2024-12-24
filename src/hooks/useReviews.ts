import { useState, useEffect } from "react";
import { firestore, auth } from "@/lib/firebase"; // Firebase services
import { doc, collection, getDocs, setDoc, deleteDoc, query, orderBy, where } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext"; // Your context for managing user

type Review = {
  id: string;
  user_id: string;
  destination_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
};

export function useReviews(destinationId?: string) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]); 
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (destinationId) {
      fetchReviews();
    }
  }, [destinationId]);

  const fetchReviews = async () => {
    if (!destinationId) return;

    try {
      setLoading(true);

      const q = query(
        collection(firestore, "reviews"),
        where("destination_id", "==", destinationId),
        orderBy("created_at", "desc")
      );

      const querySnapshot = await getDocs(q);

      const reviewsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Review[];

      setReviews(reviewsData);

      if (user) {
        const userReview = reviewsData.find((review) => review.user_id === user.uid);
        setUserReview(userReview || null);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Error fetching reviews");
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (rating: number, comment: string) => {
    if (!user || !destinationId) return { error: "Not authenticated" };

    try {
      setLoading(true);

      if (userReview) {
        const reviewRef = doc(firestore, "reviews", userReview.id);
        await setDoc(reviewRef, {
          rating,
          comment,
          updated_at: new Date().toISOString(),
        }, { merge: true });

        setUserReview({ ...userReview, rating, comment });
        await fetchReviews(); // Refresh reviews
        return { data: { rating, comment }, error: null };
      }

      const newReviewRef = doc(collection(firestore, "reviews"));
      await setDoc(newReviewRef, {
        user_id: user.uid,
        destination_id: destinationId,
        rating,
        comment,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const newReview = {
        id: newReviewRef.id,
        user_id: user.uid,
        destination_id: destinationId,
        rating,
        comment,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUserReview(newReview);
      await fetchReviews(); // Refresh reviews
      return { data: newReview, error: null };
    } catch (err) {
      console.error("Error adding/updating review:", err);
      return { data: null, error: "Error adding/updating review" };
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!user) return { error: "Not authenticated" };

    try {
      setLoading(true);
      const reviewRef = doc(firestore, "reviews", reviewId);
      await deleteDoc(reviewRef);

      setUserReview(null);
      await fetchReviews(); // Refresh reviews
      return { error: null };
    } catch (err) {
      console.error("Error deleting review:", err);
      return { error: "Error deleting review" };
    } finally {
      setLoading(false);
    }
  };

  return {
    reviews,
    userReview,
    loading,
    error,
    addReview,
    deleteReview,
    refreshReviews: fetchReviews,
  };
}
