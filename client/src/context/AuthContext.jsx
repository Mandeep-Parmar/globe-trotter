import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const API_BASE_URL = "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize and load user profile if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.success && data.data) {
            setUser(data.data);
          } else if (data && data.id) {
            setUser(data);
          } else {
            handleLogout();
          }
        } else {
          handleLogout();
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const login = async (email, password) => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        const responseData = data.success ? data.data : data;
        const { token: userToken, user: userData } = responseData;
        
        localStorage.setItem("token", userToken);
        setToken(userToken);
        setUser(userData);
        return { success: true };
      } else {
        const message = data.error || data.message || "Invalid email or password.";
        setAuthError(message);
        return { success: false, message };
      }
    } catch (err) {
      const message = "Connection to server failed.";
      setAuthError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      const data = await res.json();
      if (res.ok) {
        const responseData = data.success ? data.data : data;
        const { token: userToken, user: createdUser } = responseData;
        
        localStorage.setItem("token", userToken);
        setToken(userToken);
        setUser(createdUser);
        return { success: true };
      } else {
        const message = data.error || data.message || "Registration failed.";
        setAuthError(message);
        return { success: false, message };
      }
    } catch (err) {
      const message = "Connection to server failed.";
      setAuthError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    if (!token) return { success: false, message: "Not authenticated" };

    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await res.json();
      if (res.ok) {
        const responseData = data.success ? data.data : data;
        setUser(responseData);
        return { success: true, user: responseData };
      } else {
        return { success: false, message: data.error || data.message || "Failed to update profile." };
      }
    } catch (err) {
      return { success: false, message: "Connection to server failed." };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        authError,
        login,
        register,
        logout: handleLogout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
