// services/authService.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/auth";

// Guarda el token en localStorage
export const login = async (email: string, password: string) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  const token = res.data.token;
  localStorage.setItem("auth_token", token);
  return res.data;
};

export const getMe = async () => {
  const token = localStorage.getItem("auth_token");
  if (!token) throw new Error("No token found");

  const res = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("auth_token");
};
