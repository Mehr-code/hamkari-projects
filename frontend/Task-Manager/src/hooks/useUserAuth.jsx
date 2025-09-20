import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

export const useUserAuth = () => {
  // Get user state, loading state, and clearUser function from context
  const { user, loading, clearUser } = useContext(UserContext);
  const navigate = useNavigate(); // Hook to programmatically navigate

  useEffect(() => {
    if (loading) return; // If user data is still loading, do nothing

    // If user does not exist, clear any user state and redirect to login page
    if (!user) {
      clearUser();
      navigate("/login");
    }
  }, [user, loading, clearUser, navigate]); // Re-run effect when any dependency changes
};
