"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Building2,
  Stethoscope,
  CalendarCheck,
  Clock,
  Settings,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  FileCheck2,
  Globe,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  getAppointments,
  getClinicSubmissionStatus,
  getClinicRegistration,
  getClinicDashboard,
  updateAppointmentStatus,
  type AppointmentListItem,
} from "../../lib/clinicApi";
import { useAuthStore } from "../../store/authStore";

import ClinicOverview from "./_components/clinic/ClinicOverview";
import ClinicProfileManager from "./_components/clinic/ClinicProfileManager";
import ClinicTreatmentsPricing from "./_components/clinic/ClinicTreatmentsPricing";
import ClinicAppointments from "./_components/clinic/ClinicAppointments";
import ClinicAvailabilityManager from "./_components/clinic/ClinicAvailabilityManager";
import Setting from "./_components/Setting";

export type ClinicTab =
  | "overview"
  | "profile"
  | "treatments"
  | "appointments"
  | "availability"
  | "setting";

// Realistic fallback sample appointments for demo / offline experience
const mockAppointments: AppointmentListItem[] = [
  {
    id: 101,
    user: 5,
    clinic: 1,
    appointment_id: "MED-2026-901",
    schedules: [
      { id: 1, appointment: 101, treatment_date: "2026-09-20", shift: "morning" },
      { id: 2, appointment: 101, treatment_date: "2026-09-22", shift: "morning" },
      { id: 3, appointment: 101, treatment_date: "2026-09-24", shift: "morning" },
    ],
    patient_detail: {
      id: 1,
      appointment: 101,
      full_name: "Alexander Wright",
      email: "alex.wright@traveler.co.uk",
      phone: "+44 7911 123456",
      birth_date: "1974-06-15",
      language: "English",
    },
    health_status: {
      id: 1,
      appointment: 101,
      hivpositive: false,
      hbvpositive: false,
      hcvpositive: false,
    },
    insurance: {
      id: 1,
      appointment: 101,
      ehic_holder: true,
      ghic_holder: true,
    },
    treatment_type: {
      id: 1,
      appointment: 101,
      treatment_type: "HD",
    },
    care_partner: {
      id: 1,
      appointment: 101,
      bringing_partner: true,
    },
    home_clinic: {
      id: 1,
      appointment: 101,
      clinic_name: "St. Thomas' Hospital Renal Unit",
      home_clinic_consultant_name: "Dr. Evelyn Reed",
    },
    medical_reports: [
      {
        id: 1,
        appointment: 101,
        file_url: "#",
      },
    ],
    status: "Pending",
    created_at: "2026-09-15T08:30:00Z",
  },
  {
    id: 102,
    user: 8,
    clinic: 1,
    appointment_id: "MED-2026-902",
    schedules: [
      { id: 4, appointment: 102, treatment_date: "2026-09-21", shift: "afternoon" },
      { id: 5, appointment: 102, treatment_date: "2026-09-23", shift: "afternoon" },
    ],
    patient_detail: {
      id: 2,
      appointment: 102,
      full_name: "Elena Rostova",
      email: "elena.rostova@medtravel.de",
      phone: "+49 151 23456789",
      birth_date: "1982-11-04",
      language: "German, English",
    },
    health_status: {
      id: 2,
      appointment: 102,
      hivpositive: false,
      hbvpositive: true,
      hcvpositive: false,
    },
    insurance: {
      id: 2,
      appointment: 102,
      ehic_holder: true,
      ghic_holder: false,
    },
    treatment_type: {
      id: 2,
      appointment: 102,
      treatment_type: "HDF",
    },
    care_partner: {
      id: 2,
      appointment: 102,
      bringing_partner: false,
    },
    home_clinic: {
      id: 2,
      appointment: 102,
      clinic_name: "Charité Universitätsmedizin Berlin",
      home_clinic_consultant_name: "Prof. Dr. Klaus Weber",
    },
    medical_reports: [
      {
        id: 2,
        appointment: 102,
        file_url: "#",
      },
    ],
    status: "Confirmed",
    created_at: "2026-09-14T14:15:00Z",
  },
];

export default function ClinicOwnerPortal() {
  const [activeTab, setActiveTab] = useState<ClinicTab>("overview");
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const submittedClinicInfo = useAuthStore((state) => state.submittedClinicInfo);

  // Approval Lifecycle: "PENDING_APPROVAL" vs "APPROVED"
  const [approvalStatus, setApprovalStatus] = useState<"PENDING_APPROVAL" | "APPROVED">(
    "PENDING_APPROVAL"
  );

  // Check real submission status from API if token exists
  const { data: submissionData } = useQuery({
    queryKey: ["clinic-submission-status", accessToken],
    queryFn: async () => {
      try {
        const res = await getClinicSubmissionStatus(accessToken);
        if (res?.data) return res;
      } catch {
        // Fallback
      }
      try {
        const reg = await getClinicRegistration(accessToken);
        if (reg?.data) return reg;
      } catch {
        // Fallback
      }
      try {
        const dash = await getClinicDashboard(undefined, accessToken);
        if (dash?.data) return dash;
      } catch {
        // Fallback
      }
      return null;
    },
    enabled: Boolean(accessToken),
  });

  useEffect(() => {
    if (submissionData) {
      const raw = submissionData as any;
      const data = (raw && typeof raw === "object" && "data" in raw ? raw.data : raw) || {};
      const subStatus = (data && typeof data === "object" && data.submission_status) || {};
      const clinicObj = (data && typeof data === "object" && (data.clinic || data.registration || data.data)) || {};

      const checkStr = (val: unknown, expected: string) =>
        typeof val === "string" && val.toLowerCase() === expected.toLowerCase();

      const isApproved =
        data.is_approved === true ||
        data.approved === true ||
        data.is_active === true ||
        checkStr(data.status, "approved") ||
        checkStr(data.status, "active") ||
        checkStr(data.clinic_status, "approved") ||
        subStatus.is_approved === true ||
        subStatus.approved === true ||
        subStatus.is_active === true ||
        checkStr(subStatus.status, "approved") ||
        checkStr(subStatus.status, "active") ||
        checkStr(subStatus.status_badge, "APPLICATION APPROVED") ||
        clinicObj.is_approved === true ||
        clinicObj.is_active === true ||
        checkStr(clinicObj.status, "approved") ||
        checkStr(clinicObj.status, "active") ||
        (user as any)?.is_approved === true ||
        checkStr((user as any)?.clinic_status, "approved") ||
        checkStr((user as any)?.status, "approved");

      if (isApproved) {
        setApprovalStatus("APPROVED");
      }
    }
  }, [submissionData, user]);

  // Fetch appointments from API
  const { data: apiAppointmentData, refetch: refetchAppointments } = useQuery({
    queryKey: ["clinic-owner-appointments", accessToken],
    queryFn: () => getAppointments(accessToken),
    enabled: Boolean(accessToken),
  });

  const [localAppointments, setLocalAppointments] = useState<AppointmentListItem[]>(
    () => mockAppointments
  );

  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentListItem | null>(null);

  const appointments: AppointmentListItem[] = useMemo(() => {
    if (Array.isArray(apiAppointmentData?.data) && apiAppointmentData.data.length > 0) {
      return apiAppointmentData.data;
    }
    if (Array.isArray(apiAppointmentData) && apiAppointmentData.length > 0) {
      return apiAppointmentData;
    }
    if (Array.isArray((apiAppointmentData as any)?.appointments) && (apiAppointmentData as any).appointments.length > 0) {
      return (apiAppointmentData as any).appointments;
    }
    return localAppointments;
  }, [apiAppointmentData, localAppointments]);

  const handleUpdateStatus = async (
    id: number,
    status: "Confirmed" | "Cancelled" | "Completed"
  ) => {
    // Optimistically update local state
    setLocalAppointments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );

    // Call real API if accessToken exists
    if (accessToken) {
      try {
        const apiStatus =
          status === "Confirmed"
            ? "confirmed"
            : status === "Cancelled"
            ? "cancelled"
            : "confirmed";
        await updateAppointmentStatus(id, apiStatus as any, accessToken);
        refetchAppointments();
      } catch (err) {
        console.error("Failed to update appointment status on server:", err);
      }
    }
  };

  const tabs: { id: ClinicTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: "overview",

      label: "Dashboard",
      icon: <LayoutDashboard size={17} />,
    },
    {
      id: "appointments",
      label: "Bookings & Requests",
      icon: <CalendarCheck size={17} />,
      badge: appointments.filter((a) => (a.status || "pending").toLowerCase() === "pending")
        .length,
    },
    {
      id: "profile",
      label: "Clinic Profile",
      icon: <Building2 size={17} />,
    },
    {
      id: "treatments",
      label: "Treatments & Pricing",
      icon: <Stethoscope size={17} />,
    },
    {
      id: "availability",
      label: "Availability & Shifts",
      icon: <Clock size={17} />,
    },
    {
      id: "setting",
      label: "Settings",
      icon: <Settings size={17} />,
    },
  ];

  const subData = submissionData?.data as any;
  const subStatusObj = subData?.submission_status || subData || {};

  const displayClinicName =
    subStatusObj?.submitted_clinic ||
    subData?.clinic_name ||
    subData?.name ||
    submittedClinicInfo?.clinicName ||
    user?.full_name ||
    "Submitted Medical Facility";

  const displayLocation =
    subData?.address ||
    subData?.location ||
    subData?.city ||
    [submittedClinicInfo?.address, submittedClinicInfo?.city].filter(Boolean).join(", ") ||
    "Registered Facility Address";

  const displayBeds =
    subData?.total_beds ||
    submittedClinicInfo?.bedCount ||
    "12";

  const displayEmail =
    subStatusObj?.contact_email ||
    user?.email ||
    subData?.email ||
    submittedClinicInfo?.contactEmail ||
    "owner@clinic.com";

  return (
    <div className="space-y-8">
      {/* ── STATE 1: CLINIC UNDER COMPLIANCE REVIEW ── */}
      {approvalStatus === "PENDING_APPROVAL" ? (
        <div className="space-y-8">
          {/* Main Review Status Card */}
          <div className="bg-white rounded-3xl border border-amber-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1.5">
                    <AlertCircle size={13} />
                    Application Submitted • Review in Progress
                  </span>
                  <span className="text-xs text-gray-400">
                    {displayEmail}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Your Clinic Registration is Under Review
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-2xl">
                  Thank you for applying to join MedBook's certified dialysis network.
                  Our Medical Administration & Compliance team is currently verifying your
                  facility licensing and water purity certifications.
                </p>
              </div>

              <div className="text-right shrink-0 bg-amber-50/80 p-4 rounded-2xl border border-amber-200/60">
                <span className="text-[11px] font-semibold text-gray-500 block uppercase tracking-wider">
                  Estimated Review Time
                </span>
                <span className="text-lg font-bold text-amber-900 block mt-0.5">
                  24 – 48 Hours
                </span>
              </div>
            </div>

            {/* Approval Notification Box */}
            <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-sky-50/60 to-emerald-50/50 border border-indigo-100/90 text-indigo-950">
              <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <Mail size={18} />
              </div>
              <div className="space-y-1 text-xs sm:text-sm">
                <h4 className="font-bold text-indigo-950 flex items-center gap-1.5">
                  What happens once approved?
                </h4>
                <p className="text-indigo-900/90 leading-relaxed">
                  Once your application is approved by Super Admin, you will receive a confirmation email. From that email, you can log in to your <strong>Clinic Portal</strong> to manage your medical facility profile, dialysis shift schedules, and patient appointments.
                </p>
              </div>
            </div>

            {/* 4-Step Verification Progress Stepper */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                Verification & Onboarding Progress
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Step 1 */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-emerald-950">
                      1. Application Submitted
                    </p>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Clinic & Owner profile received
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-emerald-950">
                      2. Email Verified
                    </p>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Admin credentials activated
                    </p>
                  </div>
                </div>

                {/* Step 3 - Active In-Progress */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3 relative overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 animate-pulse">
                    <FileCheck2 size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-amber-950">
                      3. Super Admin Audit
                    </p>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      Medical license verification underway
                    </p>
                  </div>
                </div>

                {/* Step 4 - Pending */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-start gap-3 opacity-60">
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center shrink-0">
                    <Globe size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-gray-700">
                      4. Public Listing Live
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Accepting patient bookings
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submitted Draft Clinic Profile Overview */}
            <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-900 text-xs flex items-center gap-2">
                  <Building2 size={15} className="text-sky-500" />
                  Submitted Facility Details
                </h4>
                <span className="text-[11px] font-semibold text-gray-500">
                  Status: Hidden from Public Search
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-700 pt-1">
                <div>
                  <span className="text-gray-400 block text-[11px]">Clinic Name</span>
                  <span className="font-semibold text-gray-900">
                    {displayClinicName}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Location</span>
                  <span className="font-medium">{displayLocation}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Dialysis Stations</span>
                  <span className="font-medium">{displayBeds} Hemodialysis & HDF Beds</span>
                </div>
              </div>
            </div>

            {/* Contact Support Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-sky-50/60 border border-sky-100 text-xs text-sky-950">
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} className="text-sky-600" />
                <span>
                  Need to update your submitted medical documents or have questions?
                </span>
              </div>
              <div className="flex items-center gap-3 font-semibold text-sky-700">
                <span className="flex items-center gap-1">
                  <Mail size={13} /> compliance@medbook.health
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── STATE 2: FULL APPROVED & VERIFIED CLINIC DASHBOARD ── */
        <div className="space-y-8">
          {/* Header Card */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <ShieldCheck size={12} /> Verified & Approved Clinic Provider
                </span>
                <span className="text-xs text-gray-400">
                  {user?.email || "owner@clinic.com"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                {displayClinicName}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Manage your certified dialysis center listing, shift capacities, and approve international patient travel bookings.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold rounded-2xl transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                      : "text-gray-600 hover:text-sky-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? "bg-white text-sky-600"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content Panels */}
          <div className="pt-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "overview" && (
                  <ClinicOverview
                    appointments={appointments}
                    onSelectTab={setActiveTab}
                    onViewAppointment={setSelectedAppointment}
                  />
                )}

                {activeTab === "appointments" && (
                  <ClinicAppointments
                    appointments={appointments}
                    onUpdateStatus={handleUpdateStatus}
                    selectedAppointment={selectedAppointment}
                    setSelectedAppointment={setSelectedAppointment}
                  />
                )}

                {activeTab === "profile" && <ClinicProfileManager />}

                {activeTab === "treatments" && <ClinicTreatmentsPricing />}

                {activeTab === "availability" && <ClinicAvailabilityManager />}

                {activeTab === "setting" && <Setting />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
