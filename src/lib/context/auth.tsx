// context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { login as loginService, getMe } from "@/lib/services/auth.service";
import toast from "react-hot-toast";
import { getStoreByOwnerId } from "../services/store.service";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  store?: {
    _id: string;
    name: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoaded: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      await loginService(email, password);
      const response = await getMe();
      setUser(response.user);

      if (response.user.role === "merchant") {
        const id = response.user._id;

        const store = await getStoreByOwnerId(id);
        if (store) {
          localStorage.setItem("storeId", store._id);
          localStorage.setItem("storeName", store.name);
        }
      }
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error al iniciar sesión");
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    toast("Sesión cerrada");
    // Podrías también hacer una llamada a /logout si la tienes implementada
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await getMe();
        setUser(response.user);
      } catch {
        setUser(null);
      } finally {
        setIsLoaded(true);
      }
    };

    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isLoaded, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
