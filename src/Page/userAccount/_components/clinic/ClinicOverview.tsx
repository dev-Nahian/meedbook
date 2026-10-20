import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import type { AppointmentListItem } from "../../../../lib/clinicApi";

import { useAuthStore } from "../../../../store/authStore";

interface ClinicOverviewProps {
  appointments: AppointmentListItem[];
  onSelectTab: (tab: any) => void;
  onViewAppointment: (apt: AppointmentListItem) => void;
}

export default function ClinicOverview({
  appointments,
  onSelectTab,
  onViewAppointment,
}: ClinicOverviewProps) {
  const user = useAuthStore((state) => state.user);
  const submittedClinicInfo = useAuthStore((state) => state.submittedClinicInfo);

  const displayClinicName =
    submittedClinicInfo?.clinicName ||
    user?.full_name ||
    "Your Dialysis Clinic";

  const totalBeds = submittedClinicInfo?.bedCount || "12";

  const aptList = Array.isArray(appointments) ? appointments : [];

  const pendingCount = aptList.filter(
    (a) => !a?.status || (typeof a.status === "string" && a.status.toLowerCase() === "pending")
  ).length;

  const confirmedCount = aptList.filter(
    (a) => typeof a?.status === "string" && a.status.toLowerCase() === "confirmed"
  ).length;

  const totalSessions = aptList.reduce(
    (acc, cur) => acc + (Array.isArray(cur?.schedules) ? cur.schedules.length : 1),
    0
  );

  const stats = [
    {
      title: "Total Bookings",
      value: aptList.length || 0,
      subtitle: `${totalSessions} treatment sessions requested`,
      icon: <CalendarCheck className="text-sky-600" size={22} />,
      bg: "bg-sky-50 border-sky-100",
    },
    {
      title: "Pending Approvals",
      value: pendingCount,
      subtitle: "Action required",
      icon: <AlertCircle className="text-amber-600" size={22} />,
      bg: "bg-amber-50 border-amber-100",
      highlight: true,
    },
    {
      title: "Confirmed Patients",
      value: confirmedCount,
      subtitle: "Ready for treatment",
      icon: <CheckCircle2 className="text-emerald-600" size={22} />,
      bg: "bg-emerald-50 border-emerald-100",
    },
    {
      title: "Active Stations",
      value: `${totalBeds} Stations`,
      subtitle: `${totalBeds} Dialysis & HDF Beds`,
      icon: <TrendingUp className="text-purple-600" size={22} />,
      bg: "bg-purple-50 border-purple-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Clinic Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold tracking-wide uppercase">
              <Building2 size={13} /> {displayClinicName}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome to {displayClinicName}
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Manage international patient bookings, review patient medical reports,
              and customize treatment shift capacities for your facility.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onSelectTab("appointments")}
              className="bg-white text-sky-600 hover:bg-sky-50 font-semibold px-5 py-2.5 rounded-2xl shadow-sm text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              Review Bookings ({pendingCount})
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onSelectTab("availability")}
              className="bg-white/15 hover:bg-white/25 text-white font-medium px-5 py-2.5 rounded-2xl border border-white/20 backdrop-blur-xs text-sm transition-all cursor-pointer"
            >
              Manage Shifts
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-3xl bg-white border ${stat.bg} shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {stat.title}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-2xs">
                {stat.icon}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p
                className={`text-xs mt-1 ${
                  stat.highlight ? "text-amber-600 font-semibold" : "text-gray-500"
                }`}
              >
                {stat.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout: Recent Requests & Today's Shift Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Patient Appointment Queue */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-900 text-base">
                Recent Appointment Requests
              </h3>
              <p className="text-xs text-gray-500">
                Latest patients awaiting confirmation or review
              </p>
            </div>
            <button
              onClick={() => onSelectTab("appointments")}
              className="text-xs font-semibold text-sky-500 hover:text-sky-600 flex items-center gap-1 cursor-pointer"
            >
              View All ({appointments.length}) <ArrowRight size={13} />
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {appointments.length > 0 ? (
              appointments.slice(0, 4).map((apt) => (
                <div
                  key={apt.id}
                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-gray-50/80 -mx-2 px-2 rounded-2xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 font-bold flex items-center justify-center shrink-0 text-sm">
                      {apt.patient_detail?.full_name?.charAt(0) || "P"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">
                        {apt.patient_detail?.full_name || "Guest Patient"}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="text-sky-600 font-medium">
                          {apt.treatment_type?.treatment_type || "Dialysis HD"}
                        </span>
                        <span>•</span>
                        <span>{apt.schedules?.length || 1} Sessions</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                        apt.status?.toLowerCase() === "confirmed"
                          ? "bg-emerald-100 text-emerald-700"
                          : apt.status?.toLowerCase() === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {apt.status || "Pending"}
                    </span>
                    <button
                      onClick={() => onViewAppointment(apt)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-sky-50 hover:text-sky-600 text-gray-700 transition-colors cursor-pointer"
                    >
                      Dossier
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 py-6 text-center">
                No appointment requests yet.
              </p>
            )}
          </div>
        </div>

        {/* Right 1 Col: Today's Shift Status */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <Clock size={16} className="text-sky-500" />
                Today's Shifts
              </h3>
              <span className="text-xs text-gray-400">Operational</span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100">
                <div className="flex justify-between items-center text-xs font-semibold text-gray-800 mb-1">
                  <span>Morning Shift (08:00 - 12:00)</span>
                  <span className="text-sky-600 font-bold">5 / 6 Stations</span>
                </div>
                <div className="w-full bg-sky-200/50 rounded-full h-1.5 mt-2">
                  <div className="bg-sky-500 h-1.5 rounded-full w-[83%]" />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                <div className="flex justify-between items-center text-xs font-semibold text-gray-800 mb-1">
                  <span>Afternoon Shift (13:00 - 17:00)</span>
                  <span className="text-indigo-600 font-bold">6 / 6 Full</span>
                </div>
                <div className="w-full bg-indigo-200/50 rounded-full h-1.5 mt-2">
                  <div className="bg-indigo-500 h-1.5 rounded-full w-[100%]" />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100">
                <div className="flex justify-between items-center text-xs font-semibold text-gray-800 mb-1">
                  <span>Evening Shift (18:00 - 22:00)</span>
                  <span className="text-purple-600 font-bold">3 / 6 Stations</span>
                </div>
                <div className="w-full bg-purple-200/50 rounded-full h-1.5 mt-2">
                  <div className="bg-purple-500 h-1.5 rounded-full w-[50%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">Need to block a date?</span>
            <button
              onClick={() => onSelectTab("availability")}
              className="text-xs font-semibold text-sky-500 hover:text-sky-600 cursor-pointer"
            >
              Edit Calendar →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
