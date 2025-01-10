import axios from 'axios';
import { create } from 'zustand';
const apiUrl = 'https://musicserver-uluy.onrender.com/user';

const useAuthStore = create((set) => ({
  user: null,
  isloading: false,
  error: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  signUp: async (username:string, email:string, password:string) => {
    set({ isloading: true, error: null });
    try {
      const response = await axios.post(`${apiUrl}/register`, {
        username,
        email,
        password,
      });
      set({ user: response.data.user, isloading: false });
    } catch (error) {
      set({
        error: error.response.data.message || 'error signing up',
        isloading: false,
      });
      throw error;
    }
  },



  signIn: async (email:string, password:string) => {
    set({ user: null, isloading: true });
    try {
      const response = await axios.post(`${apiUrl}/login`, { email, password });
      set({ user: response.data.user, error: null, isloading: false });
    } catch (error) {
      set({
        error: error.response.data.message || 'error signing in',
        isloading: false,
      });
      throw error;
    }
  },

  forgotPassword: async (email:string) => {
    set({ user: null, isloading: true });
    try {
      const response = await axios.post(`${apiUrl}/forgotPassword`, { email });
      set({ user: response.data.user, error: null, isloading: false });
    } catch (error) {
      set({
        error: error.response.data.message || 'wrong email',
        isloading: false,
      });
      throw error;
    }
  },

  resetPassword: async (token:string, password:string) => {
    set({ user: null, isloading: true });
    try {
      const response = await axios.post(`${apiUrl}/resetPasssword/${token}`, {
        password,
      });
      set({ user: response.data.user, error: null, isloading: false });
    } catch (error) {
      set({
        error: error.response.data.message || 'Error resetting the password',
        isloading: false,
      });
      throw error;
    }
  },
}));

export default useAuthStore;
