import { useEffect } from "react";
import { useAuthStore } from "../stores";

/**
 * Hook to initialize the application
 * - Verifies authentication token
 * - Handles initial app state
 */
export function useAppInitialization() {
  const { verifyToken, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Verify authentication token if it exists
    verifyToken();
  }, [verifyToken]);

  return {
    isAuthenticated,
  };
}
