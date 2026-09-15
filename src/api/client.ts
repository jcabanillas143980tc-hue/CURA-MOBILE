import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Point this to your Laravel backend (same backend the doctor/staff web
// portal already talks to). Use your machine's LAN IP when testing on a
// physical device — "localhost" will not work from the phone.
export const API_BASE_URL = 'http://192.168.1.X:8000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: 'application/json' },
  timeout: 15000,
});

// Attach the Sanctum bearer token (saved after login) to every request.
client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('cura_token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Central place to react to 401s (expired/invalid token) by logging out.
client.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error?.response?.status === 401) {
      await AsyncStorage.removeItem('cura_token');
      // AuthContext listens for this via checkAuth() on next app focus,
      // or you can wire an event emitter here later if you want an
      // immediate redirect to the login screen.
    }
    return Promise.reject(error);
  }
);

export default client;
