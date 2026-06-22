import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(function(config) {
  if (typeof window !== "undefined") {
    var token = window.localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
  }
  return config;
});

api.interceptors.response.use(
  function(response) { return response; },
  function(error) {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        window.localStorage.clear();
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);
