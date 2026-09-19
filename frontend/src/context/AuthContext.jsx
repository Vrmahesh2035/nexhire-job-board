import { jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";
const AuthContext = createContext(void 0);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("nexhire_token"));
  const [loading, setLoading] = useState(true);
  const [activePortal, setActivePortal] = useState("student");
  const refreshUser = async () => {
    const savedToken = localStorage.getItem("nexhire_token");
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await api.auth.me();
      setUser(data.user);
      if (data.user.role) {
        setActivePortal(data.user.role);
      }
    } catch (err) {
      console.warn("Session expired or invalid token");
      localStorage.removeItem("nexhire_token");
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    refreshUser();
  }, []);
  const login = async (email, password, expectedRole) => {
    const data = await api.auth.login({ email, password, expectedRole });
    localStorage.setItem("nexhire_token", data.token);
    setToken(data.token);
    setUser(data.user);
    if (data.user.role) {
      setActivePortal(data.user.role);
    }
  };
  const register = async (regData) => {
    const data = await api.auth.register(regData);
    localStorage.setItem("nexhire_token", data.token);
    setToken(data.token);
    setUser(data.user);
    if (data.user.role) {
      setActivePortal(data.user.role);
    }
  };
  const loginDemo = async (demoRole) => {
    setLoading(true);
    try {
      const data = await api.auth.demoLogin(demoRole);
      localStorage.setItem("nexhire_token", data.token);
      setToken(data.token);
      setUser(data.user);
      setActivePortal(demoRole);
    } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    localStorage.removeItem("nexhire_token");
    setToken(null);
    setUser(null);
  };
  return /* @__PURE__ */ jsx(
    AuthContext.Provider,
    {
      value: {
        user,
        token,
        role: user?.role || null,
        loading,
        activePortal,
        setActivePortal,
        login,
        register,
        logout,
        loginDemo,
        refreshUser
      },
      children
    }
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
