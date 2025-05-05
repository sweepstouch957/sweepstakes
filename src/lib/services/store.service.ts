// services/authService.ts
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_STORE_URL || "http://localhost:5000/api/auth";

// Guarda el token en localStorage
export const getStores = async () => {
  const res = await axios.get(`${API_URL}/`);
  
  return res.data;
};

export const getStore = async (storeId: string) => {
  const res = await axios.get(`${API_URL}/${storeId}`);
  return res.data;
};


export const getStoreByOwnerId = async (storeId: string) => {   
    const res = await axios.get(`${API_URL}/owner/${storeId}`);    
    return res.data;
  };
  
