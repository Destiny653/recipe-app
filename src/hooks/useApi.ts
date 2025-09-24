// File: src/hooks/useApi.ts
import { useCallback } from 'react';
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { useToast } from './use-toast';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'https://recipe-server-y83k.onrender.com/api'; // Make sure this matches your backend URL

const api = axios.create({
  baseURL: API_URL,
});

export const useApi = () => {
  const { toast } = useToast();
  const { setShowAuthModal } = useAuth();

  const request = useCallback(async <T,>(config: AxiosRequestConfig): Promise<T | null> => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = {
          ...config.headers,
          'x-auth-token': token,
        };
      }
      const response = await api.request<T>(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          setShowAuthModal(true);
        }
        toast({
          title: "Error",
          description: error.response.data.msg || "An unexpected error occurred.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
      return null;
    }
  }, [toast, setShowAuthModal]);

  return { request };
};
