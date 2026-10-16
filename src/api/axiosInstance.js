
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
        const url = originalRequest?.url || "";

        const excludedEndpoints = [
            "/user/login",
            "/user/register",
            "/user/refresh",
            "/user/logout",
        ];

        const isExcluded = excludedEndpoints.some(
            (endpoint) => url.includes(endpoint)
        );

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            isExcluded
        ) {
            return Promise.reject(error);
        }

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
);

