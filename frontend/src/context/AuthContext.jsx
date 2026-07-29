import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!user;

  const fetchProfile = async () => {
    try {
      const { data } = await authService.getCurrentUser();
      setUser(data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    await authService.login(credentials);

    await fetchProfile();
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        fetchProfile,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
