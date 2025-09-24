// File: src/hooks/useApi.ts
import { useCallback } from 'react';
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { useToast } from './use-toast';

const API_URL = 'http://localhost:5000/api'; // Make sure this matches your backend URL

const api = axios.create({
  baseURL: API_URL,
});

export const useApi = () => {
  const { toast } = useToast();

  const request = useCallback(async <T,>(config: AxiosRequestConfig): Promise<T | null> => {
    try {
      // For now, authentication is mocked. We'll set up real auth later.
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
  }, [toast]);

  return { request };
};
