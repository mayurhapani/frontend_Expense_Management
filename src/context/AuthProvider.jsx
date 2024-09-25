import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import GlobalLoader from "../components/GlobalLoader";
import PropTypes from "prop-types";

// Set axios to always send credentials
axios.defaults.withCredentials = true;

// Add this function near the top of the file
const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const getToken = () => {
    try {
      return localStorage.getItem("token");
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return null;
    }
  };

  const setToken = (token) => {
    try {
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Error setting token in localStorage:", error);
    }
  };

  const removeToken = () => {
    try {
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Error removing token from localStorage:", error);
    }
  };

  const checkLoginStatus = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();

      if (token) {
        try {
          const response = await axios.get(`${BASE_URL}/users/getUser`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.data.success && response.data.data) {
            const userData = response.data.data;

            setUser(userData);
            setIsLoggedIn(true);
            setUserName(userData.name || "");
            setUserRole(userData.role || "");
          } else {
            console.error("Invalid user data structure:", response.data);
            throw new Error("Invalid user data received");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            console.error("Response headers:", error.response.headers);
          } else if (error.request) {
            console.error("No response received:", error.request);
          } else {
            console.error("Error setting up request:", error.message);
          }
          throw error;
        }
      } else {
        console.log("No token found, user is not logged in");
        setIsLoggedIn(false);
        setUser(null);
        setUserName("");
        setUserRole("");
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsLoggedIn(false);
      setUser(null);
      setUserName("");
      setUserRole("");
      removeToken();
    } finally {
      setLoading(false);
    }
  }, [BASE_URL]);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  const login = async (email, password) => {
    try {
      console.log("Attempting login...");
      const response = await axios.post(
        `${BASE_URL}/users/login`,
        { email, password },
        { withCredentials: true }
      );
      console.log("Login response:", response.data);

      if (response.data.success && response.data.data && response.data.data.token) {
        setToken(response.data.data.token);
        console.log("Token saved:", response.data.data.token);
        console.log("Decoded token:", decodeToken(response.data.data.token));

        setIsLoggedIn(true);
        setUser(response.data.data.user);
        setUserName(response.data.data.user.name || "");
        setUserRole(response.data.data.user.role || "");

        // Add a delay before checking login status
        setTimeout(async () => {
          try {
            await checkLoginStatus();
          } catch (error) {
            console.error("Error in delayed checkLoginStatus:", error);
          }
        }, 1000);
      } else {
        console.error("Invalid login response structure:", response.data);
        throw new Error("Invalid login response");
      }
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("Attempting logout...");
      await axios.get(`${BASE_URL}/users/logout`, { withCredentials: true });
      removeToken();
      setIsLoggedIn(false);
      setUser(null);
      setUserName("");
      setUserRole("");
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error.response ? error.response.data : error.message);
    } finally {
      // Ensure state is reset even if the logout request fails
      removeToken();
      setIsLoggedIn(false);
      setUser(null);
      setUserName("");
      setUserRole("");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userName,
        userRole,
        user,
        loading,
        setLoading,
        login,
        logout,
        checkLoginStatus,
      }}
    >
      {loading && <GlobalLoader />}
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
