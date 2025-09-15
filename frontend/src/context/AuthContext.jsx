import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../utils/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get("/auth/profile");
      if (response.data.success) setUser(response.data.user);
    } catch (error) {
      console.log("Not authenticated");
      console.log("error : ", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        toast.success(`Welcome back, ${response.data.user.email}!`);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
  };

  const inviteUser = async (email, role) => {
    try {
      const response = await api.post("/auth/invite", { email, role });
      if (response.data.success) {
        toast.success("User invited successfully");
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to invite user";
      toast.error(message);
      return { success: false, message };
    }
  };

  const upgradeTenant = async () => {
    try {
      const response = await api.post(`/tenants/${user.tenant.slug}/upgrade`);
      if (response.data.success) {
        setUser((prev) => ({
          ...prev,
          tenant: { ...prev.tenant, subscription: "pro" },
        }));
        toast.success("Upgraded to Pro successfully!");
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Upgrade failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    inviteUser,
    upgradeTenant,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
