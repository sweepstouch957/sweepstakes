import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
// Base URL configurable por entorno
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Crear instancia personalizada de Axios
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 👉 Interceptor para añadir el token en cada request
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 👉 Interceptor para manejar errores globales
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token expira o no autorizado
    if (error.response?.status === 401) {
      Cookies.remove("auth_token");
      toast.error("Sesión expirada. Por favor inicia sesión nuevamente.");
    }

    // Manejo opcional de otros errores
    if (error.response?.status === 500) {
      console.error("Error interno del servidor");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
