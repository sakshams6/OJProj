import axios from 'axios';

// Create an axios instance
const instance = axios.create({
  // Use the actual public IP/domain of your backend API on AWS
   baseURL: 'https://api.algoarena.space/api'
});

// This part is correct and should stay
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;