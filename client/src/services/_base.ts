import { TOKEN_PREFIX } from "@/constants/common";
import { shouldSkipAuthInterceptor } from "@/lib/logout";
import { useAuthStore } from "@/store/auth";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL!;
const apiInstance = axios.create({
  baseURL,
  timeout: 300_000, // 5min
});

apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_PREFIX);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle any request errors here
    return Promise.reject(error);
  }
);

// Add a response interceptor for unauthorized requests
apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      (error.response?.status === 403 || error.response?.status === 401) &&
      !shouldSkipAuthInterceptor()
    ) {
      useAuthStore.getState().resetUser();
    }
    return Promise.reject(error);
  }
);

export { apiInstance };

export type IApiResponse<T extends {}> = {
  data: T;
  message: string;
};
