import { create } from 'zustand';
import type { Profile, Report, IssueCategory, IssueStatus, MapViewport } from '@/types';

// ============================================================
// Auth Store
// ============================================================

interface AuthState {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  isLoading: boolean;
  setUser: (user: { id: string; email: string } | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, profile: null }),
}));

// ============================================================
// Map Store
// ============================================================

interface MapState {
  viewport: MapViewport;
  reports: Report[];
  selectedReport: Report | null;
  filters: {
    category: IssueCategory | 'all';
    status: IssueStatus | 'all';
    minUrgency: number;
  };
  showHeatmap: boolean;
  setViewport: (viewport: MapViewport) => void;
  setReports: (reports: Report[]) => void;
  addReport: (report: Report) => void;
  updateReport: (report: Report) => void;
  removeReport: (reportId: string) => void;
  setSelectedReport: (report: Report | null) => void;
  setFilter: (key: string, value: string | number) => void;
  resetFilters: () => void;
  toggleHeatmap: () => void;
}

const defaultFilters = {
  category: 'all' as const,
  status: 'all' as const,
  minUrgency: 0,
};

export const useMapStore = create<MapState>((set) => ({
  viewport: {
    latitude: 12.9716,  // Bangalore default
    longitude: 77.5946,
    zoom: 12,
  },
  reports: [],
  selectedReport: null,
  filters: { ...defaultFilters },
  showHeatmap: false,
  setViewport: (viewport) => set({ viewport }),
  setReports: (reports) => set({ reports }),
  addReport: (report) =>
    set((state) => ({ reports: [...state.reports, report] })),
  updateReport: (report) =>
    set((state) => ({
      reports: state.reports.map((r) => (r.id === report.id ? report : r)),
    })),
  removeReport: (reportId) =>
    set((state) => ({
      reports: state.reports.filter((r) => r.id !== reportId),
    })),
  setSelectedReport: (selectedReport) => set({ selectedReport }),
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  resetFilters: () => set({ filters: { ...defaultFilters } }),
  toggleHeatmap: () => set((state) => ({ showHeatmap: !state.showHeatmap })),
}));

// ============================================================
// Report Form Store
// ============================================================

interface ReportFormState {
  currentStep: number;
  photo: File | null;
  photoPreview: string | null;
  classification: {
    category: IssueCategory;
    severity: number;
    confidence: number;
    description: string;
  } | null;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;
  description: string;
  isClassifying: boolean;
  isSubmitting: boolean;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setPhoto: (file: File | null, preview: string | null) => void;
  setClassification: (classification: ReportFormState['classification']) => void;
  setLocation: (location: ReportFormState['location']) => void;
  setDescription: (description: string) => void;
  setClassifying: (isClassifying: boolean) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  reset: () => void;
}

export const useReportFormStore = create<ReportFormState>((set) => ({
  currentStep: 0,
  photo: null,
  photoPreview: null,
  classification: null,
  location: null,
  description: '',
  isClassifying: false,
  isSubmitting: false,
  setStep: (currentStep) => set({ currentStep }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 3) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),
  setPhoto: (photo, photoPreview) => set({ photo, photoPreview }),
  setClassification: (classification) => set({ classification }),
  setLocation: (location) => set({ location }),
  setDescription: (description) => set({ description }),
  setClassifying: (isClassifying) => set({ isClassifying }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  reset: () =>
    set({
      currentStep: 0,
      photo: null,
      photoPreview: null,
      classification: null,
      location: null,
      description: '',
      isClassifying: false,
      isSubmitting: false,
    }),
}));
