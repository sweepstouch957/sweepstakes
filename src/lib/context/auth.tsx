/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { login as loginService, getMe } from "@/lib/services/auth.service";
import { getStore, getStoreByOwnerId } from "../services/store.service";
import { Store } from "./store";

interface User {
  _id: string;
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
  changeStore: () => void;
  store: Store | null;
  handleSetStore: (store: Store | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const urlStoreId = searchParams.get("store");

  const [user, setUser] = useState<User | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadMerchantStore = useCallback(async (userId: string) => {
    const merchantStore = await getStoreByOwnerId(userId);
    if (merchantStore) {
      localStorage.setItem("storeId", merchantStore._id);
      setStore(merchantStore);
    }
  }, []);

  const loadPromotorStore = useCallback(async () => {
    const storeId = localStorage.getItem("storeId");
    if (storeId) {
      const promotorStore = await getStore(storeId);
      if (promotorStore) {
        setStore(promotorStore);
      }
    }
  }, []);

  const handleSetStore = useCallback((store: Store | null) => {
    setStore(store);
    if (store) {
      localStorage.setItem("storeId", store._id);
    } else {
      localStorage.removeItem("storeId");
    }
  }, []);

  const fetchAndSetUser = useCallback(async () => {
    const response = await getMe();
    const fetchedUser = response.user;
    setUser(fetchedUser);

    if (fetchedUser.role === "merchant") {
      await loadMerchantStore(fetchedUser._id);
    } else if (fetchedUser.role === "promotor") {
      await loadPromotorStore();
    }
  }, [loadMerchantStore, loadPromotorStore]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        await loginService(email, password);
        await fetchAndSetUser();
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Error al iniciar sesión");
      } finally {
        setLoading(false);
      }
    },
    [fetchAndSetUser]
  );

  const logout = useCallback(() => {
    setUser(null);
    setStore(null);
    localStorage.removeItem("storeId");
    localStorage.removeItem("auth_token");
    toast("Sesión cerrada");
  }, []);

  const changeStore = useCallback(() => {
    setStore(null);
    localStorage.removeItem("storeId");
  }, []);

  // 🧠 Si hay storeId en URL, no hacemos sesión
  useEffect(() => {
    const checkSession = async () => {
      if (urlStoreId) {
        setIsLoaded(true); // flujo público, omitimos getMe
        return;
      }

      try {
        await fetchAndSetUser();
      } catch {
        setUser(null);
      } finally {
        setIsLoaded(true);
      }
    };

    checkSession();
  }, [fetchAndSetUser, urlStoreId]);

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      isLoaded,
      store,
      login,
      logout,
      changeStore,
      handleSetStore,
    }),
    [user, loading, isLoaded, store, login, logout, changeStore, handleSetStore]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
