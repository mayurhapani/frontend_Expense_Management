import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import GlobalLoader from "../components/GlobalLoader";
import PropTypes from "prop-types";

// Set axios to always send credentials
axios.defaults.withCredentials = true;

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
      console.log("Checking login status, token:", token ? "exists" : "not found");

      if (token) {
        const response = await axios.get(`${BASE_URL}/users/getUser`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("User data response:", response.data);

        if (response.data.success && response.data.data) {
          const userData = response.data.data;
          console.log("User data:", userData);

          setUser(userData);
          setIsLoggedIn(true);
          setUserName(userData.name || "");
          setUserRole(userData.role || "");
        } else {
          console.error("Invalid user data structure:", response.data);
          throw new Error("Invalid user data received");
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
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Login response:", response.data);

      if (response.data.success && response.data.data && response.data.data.token) {
        setToken(response.data.data.token);
        setIsLoggedIn(true);
        setUser(response.data.data.user);
        setUserName(response.data.data.user.name || "");
        setUserRole(response.data.data.user.role || "");

        // Add a small delay before checking login status
        setTimeout(async () => {
          await checkLoginStatus();
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
