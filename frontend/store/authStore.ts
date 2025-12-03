import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  preferred_language: string;
  wallet_balance: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  loadAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setUser: (user) => {
    set({ user, isAuthenticated: true });
    AsyncStorage.setItem('user', JSON.stringify(user));
  },
  setToken: (token) => {
    set({ token });
    AsyncStorage.setItem('token', token);
  },
  logout: async () => {
    await AsyncStorage.multiRemove(['user', 'token']);
    set({ user: null, token: null, isAuthenticated: false });
  },
  loadAuth: async () => {
    try {
      const [userStr, token] = await AsyncStorage.multiGet(['user', 'token']);
      if (userStr[1] && token[1]) {
        set({ 
          user: JSON.parse(userStr[1]), 
          token: token[1], 
          isAuthenticated: true 
        });
      }
    } catch (error) {
      console.error('Failed to load auth:', error);
    }
  },
}));
