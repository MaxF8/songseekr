import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { apiRequest } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    apiRequest("/api/session", { signal: controller.signal })
      .then((session) => {
        setStatus(session.authenticated ? "authenticated" : "anonymous");
        setError("");
      })
      .catch((requestError) => {
        if (requestError.name === "AbortError") return;
        setStatus("anonymous");
        setError(requestError.message);
      });
    return () => controller.abort();
  }, []);

  const logout = useCallback(async () => {
    await apiRequest("/api/logout", { method: "POST" });
    setStatus("anonymous");
  }, []);

  const value = useMemo(
    () => ({
      authenticated: status === "authenticated",
      error,
      logout,
      status,
    }),
    [error, logout, status]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
