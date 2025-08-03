import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, LoginRequest, LoginResponse, VerifyResponse } from "shared";

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  verifyToken: () => Promise<void>;
  clearError: () => void;
}

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${SERVER_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });

          const data: LoginResponse = await response.json();

          if (!response.ok || !data.success) {
            set({ error: data.message || "Login failed" });
            throw new Error(data.message || "Login failed");
          }

          // Store the token and verify it to get user data
          set({ token: data.token });

          // Verify the token to get user details
          await get().verifyToken();
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Login failed",
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          throw error;
        }
      },

      // Logout action
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Verify token and get user data
      verifyToken: async () => {
        const { token } = get();

        if (!token) {
          set({ isAuthenticated: false, user: null, isLoading: false });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${SERVER_URL}/auth/verify`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          const data: VerifyResponse = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(data.message || "Token verification failed");
          }

          console.log(data);

          // Convert the JWT payload to User format
          const user: User = {
            id: data.user.userId,
            fullName: data.user.fullName,
            classId: data.user.classId,
            username: data.user.username, // Not available in JWT payload, would need to fetch separately
            role: data.user.role, // Not available in JWT payload, would need to fetch separately
          };

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Token verification failed",
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          });
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
