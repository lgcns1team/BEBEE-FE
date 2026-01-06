// import axios, {
//   type InternalAxiosRequestConfig,
//   type AxiosResponse,
//   type AxiosError,
// } from "axios";

// export const instance = axios.create({
//   baseURL:
//     import.meta.env.VITE_API_URL ||
//     "https://bebee-match-1036667053569.asia-northeast3.run.app",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// // 요청 인터셉터
// instance.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     return config;
//   },
//   (error: AxiosError) => {
//     return Promise.reject(error);
//   }
// );

// // 응답 인터셉터
// instance.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error: AxiosError) => {
//     return Promise.reject(error);
//   }
// );

import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.be-bee.link",
  headers: {
    "Content-Type": "application/json",
  },

  // withCredentials: true,
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log(payload);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);
