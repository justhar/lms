import { create } from "zustand";
import type { ApiResponse } from "shared";

interface AppState {
  // UI State
  isLoading: boolean;

  // API State
  lastApiResponse: ApiResponse | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setLastApiResponse: (response: ApiResponse | null) => void;

  // API helper
  callApi: (endpoint: string, options?: RequestInit) => Promise<ApiResponse>;
}

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  isLoading: false,
  lastApiResponse: null,

  // Actions
  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setLastApiResponse: (response: ApiResponse | null) =>
    set({ lastApiResponse: response }),

  callApi: async (endpoint: string, options: RequestInit = {}) => {
    const { setLoading, setLastApiResponse } = get();

    setLoading(true);

    try {
      const response = await fetch(`${SERVER_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data: ApiResponse = await response.json();
      setLastApiResponse(data);

      return data;
    } catch (error) {
      const errorResponse: ApiResponse = {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred",
      };
      setLastApiResponse(errorResponse);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  },
}));
