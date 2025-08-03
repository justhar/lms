import { create } from "zustand";
import type { Subject, ApiResponse } from "shared";

interface SubjectsState {
  // State
  subjects: Subject[];
  selectedSubject: Subject | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSubjects: () => Promise<void>;
  selectSubject: (subject: Subject | null) => void;
  clearError: () => void;
}

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

export const useSubjectsStore = create<SubjectsState>((set) => ({
  // Initial state
  subjects: [],
  selectedSubject: null,
  isLoading: false,
  error: null,

  // Fetch subjects from server
  fetchSubjects: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${SERVER_URL}/subjects`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse<Subject[]> = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch subjects");
      }

      set({
        subjects: data.data || [],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch subjects",
        isLoading: false,
      });
    }
  },

  // Select a subject
  selectSubject: (subject: Subject | null) => {
    set({ selectedSubject: subject });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
