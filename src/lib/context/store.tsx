// context/StoreContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  getStore,
  getStores,
  getStoreByOwnerId,
} from "@/lib/services/store.service";
import { usePathname } from "next/navigation";

export interface Store {
  id: string;
  _id: string;
  name: string;
  address: string;
  zipCode: string;
  owner: string;
  ownerId: string;
  description: string;
  image: string;
  active: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscription: any | null;
  createdAt: string;
  updatedAt: string;
  twilioPhoneNumber: string;
  twilioPhoneNumberFriendlyName: string;
  twilioPhoneNumberSid: string;
  location: {
    type: "Point";
    coordinates?: [number, number];
  };
  __v: number;
}

interface StoreContextType {
  stores: Store[];
  selectedStore: Store | null;
  loading: boolean;
  fetchStores: () => Promise<void>;
  fetchStore: (id: string) => Promise<void>;
  fetchStoreByOwnerId: (ownerId: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(false);
  const path = usePathname();

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await getStores(
        path === "/sweepstakes/carnewyear"
          ? `${process.env.NEXT_PUBLIC_SWEEPSTAKE_NEW_YEAR}`
          : `${process.env.NEXT_PUBLIC_SWEEPSTAKE_ID}`
      );

      setStores(res);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching stores", err);
      setLoading(false);
    }
  };

  const fetchStore = async (id: string) => {
    try {
      const res = await getStore(id);
      setSelectedStore(res);
    } catch (err) {
      console.error("Error fetching store", err);
    }
  };

  const fetchStoreByOwnerId = async (ownerId: string) => {
    try {
      const res = await getStoreByOwnerId(ownerId);
      setSelectedStore(res);
    } catch (err) {
      console.error("Error fetching store by ownerId", err);
    }
  };

  // Fetch stores when provider mounts
  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        stores,
        selectedStore,
        loading,
        fetchStores,
        fetchStore,
        fetchStoreByOwnerId,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
