import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

export const useUserAuth = () => {
  // Get user state, loading state, and clearUser function from context
  const { user, loading, clearUser } = useContext(UserContext);
  const naviagte = useNavigate(); // Hook to programmatically navigate

  useEffect(() => {
    if (loading) return; // If user data is still loading, do nothing
    if (user) return; // If user exists, do nothing

    // If user does not exist, clear any user state and redirect to login page
    if (!user) {
      clearUser();
      naviagte("/login");
    }
  }, [user, loading, clearUser, naviagte]); // Re-run effect when any dependency changes
};
