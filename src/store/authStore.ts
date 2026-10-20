import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "../lib/authApi";

export type SubmittedClinicInfo = {
  clinicName?: string;
  title?: string;
  description?: string;
  country?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  bedCount?: string;
  dialysisCost?: string;
  currency?: string;
  dialysisType?: string;
  facilities?: string[];
  acceptedInsurances?: string[];
  paymentOptions?: string[];
  acceptedPatients?: string[];
  availableShifts?: string[];
  operatingDays?: string[];
  licenseNumber?: string;
  accreditationBody?: string;
  contactEmail?: string;
  contactPhone?: string;
  ownerName?: string;
  images?: string[];
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  pendingVerificationEmail: string | null;
  pendingFullName: string | null;
  submittedClinicInfo: SubmittedClinicInfo | null;
  isAuthenticated: boolean;
  setAuth: (payload: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  }) => void;
  clearAuth: () => void;
  setPendingVerificationEmail: (email: string | null) => void;
  setPendingFullName: (name: string | null) => void;
  setSubmittedClinicInfo: (info: SubmittedClinicInfo | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      pendingVerificationEmail: null,
      pendingFullName: null,
      submittedClinicInfo: null,
      isAuthenticated: false,
      setAuth: ({ accessToken, refreshToken, user }) =>
        set((state) => ({
          accessToken,
          refreshToken,
          user: {
            ...user,
            full_name:
              user.full_name ||
              (user as any)?.name ||
              state.pendingFullName ||
              "",
          },
          isAuthenticated: true,
        })),
      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          pendingFullName: null,
          submittedClinicInfo: null,
          isAuthenticated: false,
        }),
      setPendingVerificationEmail: (email) =>
        set({ pendingVerificationEmail: email }),
      setPendingFullName: (name) => set({ pendingFullName: name }),
      setSubmittedClinicInfo: (info) => set({ submittedClinicInfo: info }),
    }),
    {
      name: "medbook-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        pendingFullName: state.pendingFullName,
        submittedClinicInfo: state.submittedClinicInfo,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
