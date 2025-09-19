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
import toast from "react-hot-toast";
import { login as loginService, getMe } from "@/lib/services/auth.service";
import { getStore, getStoreByOwnerId } from "../services/store.service";
import { Store } from "./store";
import Cookies from "js-cookie";

interface User {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profileImage?: string;
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
  setIsLoaded: (value: boolean) => void; // 👈 nuevo
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [user, setUser] = useState<User | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadMerchantStore = useCallback(async (userId: string) => {
    const merchantStore = await getStoreByOwnerId(userId);
    if (merchantStore) {
      Cookies.set("storeId", merchantStore._id);
      setStore(merchantStore);
    }
  }, []);

  const loadPromotorStore = useCallback(async () => {
    const storeId = Cookies.get("storeId");
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
      Cookies.set("storeId", store._id);
    } else {
      Cookies.remove("storeId");
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
    Cookies.remove("storeId");
    Cookies.remove("auth_token");
    toast("Sesión cerrada");
  }, []);

  const changeStore = useCallback(() => {
    setStore(null);
    Cookies.remove("storeId");
  }, []);

  // 🧠 Si hay storeId en URL, no hacemos sesión
  useEffect(() => {
    const checkSession = async () => {
      const urlStoreId = new URLSearchParams(window.location.search).get("store");
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
  }, [fetchAndSetUser]);

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
      setIsLoaded, // 👈 nuevo
    }),
    [
      user,
      loading,
      isLoaded,
      store,
      login,
      logout,
      changeStore,
      handleSetStore,
      setIsLoaded,
    ]
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
