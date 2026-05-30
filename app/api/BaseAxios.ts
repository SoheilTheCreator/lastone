// src/api/baseAxios.ts
import axios from "axios";
import { useAuth } from "../context/AuthContext";
//

//
const baseAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});


// Optional: attach auth token automatically
baseAxios.interceptors.request.use(
  (config) => {
    const savedAuth = localStorage.getItem("auth_v1");
    if (savedAuth) {
      const parsed = JSON.parse(savedAuth);
      if (parsed?.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Optional: handle global errors
baseAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized — redirect to login?");
    }

    return Promise.reject(error);
  }
);

export default baseAxios;
