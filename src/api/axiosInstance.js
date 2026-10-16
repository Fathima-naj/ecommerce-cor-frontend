
import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/user/refresh")
    ) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${baseURL}/user/refresh`,
          {},
          { withCredentials: true }
        );

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
