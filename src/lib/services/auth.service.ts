// services/authService.ts

import { User } from "@/types";
import apiClient from "../http/config";
import Cookies from "js-cookie";

export const login = async (email: string, password: string) => {
  const res = await apiClient.post("/auth/login", { email, password });
  const token = res.data.token;
  Cookies.set("auth_token", token);
  return res.data;
};

export const loginWithAccessCode = async (accessCode: string) => {
  const res = await apiClient.post("/auth/login", { accessCode });
  const token = res.data.token;
  Cookies.set("auth_token", token);
  return res.data;
};

export const getMe = async () => {
  const res = await apiClient.get("/auth/me");
  return res.data;
};

export const logout = () => {
  Cookies.remove("auth_token");
  window.location.href = "/login";
};

export const updateProfile = async (userId: string, updates: User) => {
  const res = await apiClient.patch(`/auth/users/profile/${userId}/`, updates);
  return res.data;
};

export const uploadProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("photo", file);
  const res = await apiClient.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const uploadPhoto = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", "profile_photos");
  const res = await apiClient.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};