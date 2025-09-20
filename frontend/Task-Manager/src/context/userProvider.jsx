import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { UserContext } from "./userContext";

const UserProvider = ({ children }) => {
  // State to store the current logged-in user
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("Mehr_token");
    return token ? { token } : null;
  });

  // State to track whether we're still loading user data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem("Mehr_token");

    // If no token, we are done loading and user is null
    if (!token) {
      setLoading(false);
      return;
    }

    // Set the Authorization header for axios requests
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Fetch the user profile from the API
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);

        // Merge token with user data from API
        const userData = {
          ...response.data,
          token,
        };

        // Update the user state
        setUser(userData);
      } catch (err) {
        // If fetching fails (e.g., 404 or unauthorized), log error and clear user
        console.error("کاربر شناسایی نشد!", err);
        clearUser();
      } finally {
        // Loading is finished whether request succeeds or fails
        setLoading(false);
      }
    };

    fetchUser(); // Call the async function
  }, []);

  // Function to update user state and save token to localStorage
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("Mehr_token", userData.token);
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${userData.token}`;
    setLoading(false);
  };

  // Function to clear user state and remove token from localStorage
  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("Mehr_token");
    delete axiosInstance.defaults.headers.common["Authorization"];
  };

  // Provide user state, loading state, and helper functions to the app
  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
