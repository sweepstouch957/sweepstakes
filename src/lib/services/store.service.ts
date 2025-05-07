// services/authService.ts
import apiClient from "../http/config";

// Guarda el token en localStorage
export const getStores = async () => {
  const res = await apiClient.get(`/sweepstakes/${process.env.NEXT_PUBLIC_SWEEPSTAKE_ID}/stores`);
  return res.data;
};

export const getStore = async (storeId: string) => {
  const res = await apiClient.get(`/store/${storeId}`);
  return res.data;
};

export const getStoreByOwnerId = async (storeId: string) => {
  const res = await apiClient.get(`/store/owner/${storeId}`);
  return res.data;
};
