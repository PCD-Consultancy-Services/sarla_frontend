import axios from "axios";
import Swal from "sweetalert2";

const baseURL = `${import.meta.env.VITE_API_BASE_URL}${
  import.meta.env.VITE_API_VERSION
}`;
const axiosInstance = axios.create({
  baseURL,
  // withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.log("Axios-Request-Error", error);
    Swal.fire({
      text: error.response?.data.message || "Error! while requesting",
      icon: "error",
      allowOutsideClick: "false",
    });
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log("Axios-Response-Error:", error);
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(
            `${baseURL}/auth/refresh-token`,
            { refreshToken }
            // { withCredentials: true }
          );
          const newAccessToken = response.data.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return axios(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        Swal.fire({
          text: error.response?.data.message || "Error! while authenticating",
          icon: "error",
          allowOutsideClick: "false",
        }).then(() => {
          localStorage.clear();
          window.location.href = "/";
        });
      }
    }
    Swal.fire({
      text: error.message || "Unexpected error",
      icon: "error",
      allowOutsideClick: "false",
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;
