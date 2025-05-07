// services/authService.ts

import apiClient from "../http/config";

export const login = async (email: string, password: string) => {
  const res = await apiClient.post("/auth/login", { email, password });
  const token = res.data.token;
  localStorage.setItem("auth_token", token);
  return res.data;
};

export const getMe = async () => {
  const res = await apiClient.get("/auth/me");
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("auth_token");
  window.location.href = "/login";
};
