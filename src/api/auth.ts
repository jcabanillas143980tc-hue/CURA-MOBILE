import AsyncStorage from '@react-native-async-storage/async-storage';
import client from './client';

export async function login(email: string, password: string) {
  const { data } = await client.post('/login', { email, password });
  await AsyncStorage.setItem('cura_token', data.token);
  return data.user;
}

export async function register(name: string, email: string, phone: string, password: string) {
  const { data } = await client.post('/register', { name, email, phone, password });
  await AsyncStorage.setItem('cura_token', data.token);
  return data.user;
}

export async function logout() {
  await client.post('/logout');
  await AsyncStorage.removeItem('cura_token');
}

export async function getCurrentUser() {
  const { data } = await client.get('/user');
  return data;
}
