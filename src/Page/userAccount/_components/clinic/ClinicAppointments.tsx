import { useState } from "react";
import {
  Search,
  Calendar,
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import type { AppointmentListItem } from "../../../../lib/clinicApi";
import AppointmentDetailsModal from "./AppointmentDetailsModal";

interface ClinicAppointmentsProps {
  appointments: AppointmentListItem[];
  onUpdateStatus: (id: number, status: "Confirmed" | "Cancelled" | "Completed") => void;
  selectedAppointment: AppointmentListItem | null;
  setSelectedAppointment: (apt: AppointmentListItem | null) => void;
}

const formatDate = (val?: string) => {
  if (!val) return "N/A";
  const d = new Date(val);
  return Number.isNaN(d.getTime())
    ? val
    : d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};

export default function ClinicAppointments({
  appointments,
  onUpdateStatus,
  selectedAppointment,
  setSelectedAppointment,
}: ClinicAppointmentsProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const aptList = Array.isArray(appointments) ? appointments : [];

  const filteredAppointments = aptList.filter((apt) => {
    const currentStatus = typeof apt?.status === "string" ? apt.status.toLowerCase() : "pending";
    const matchesFilter =
      filterStatus === "all" || currentStatus === filterStatus.toLowerCase();

    const name = apt?.patient_detail?.full_name?.toLowerCase() || "";
    const email = apt?.patient_detail?.email?.toLowerCase() || "";
    const id = (apt?.appointment_id || apt?.id?.toString() || "").toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      name.includes(query) || email.includes(query) || id.includes(query);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Search Filter Bar */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Patient Appointments & Bookings
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Review international patient booking requests, inspect medical histories, and approve treatments
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-100">
              Total: {aptList.length}
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
              Pending: {aptList.filter((a) => (typeof a?.status === "string" ? a.status.toLowerCase() : "pending") === "pending").length}
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row items-center gap-3 pt-2">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by patient name, email, or booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:border-sky-400 outline-none transition bg-gray-50/50 focus:bg-white"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {["all", "pending", "confirmed", "completed", "cancelled"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold capitalize transition whitespace-nowrap cursor-pointer ${
                  filterStatus === st
                    ? "bg-sky-500 text-white shadow-2xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {filteredAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/90 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider">
                  <th className="py-4 px-6">Patient</th>
                  <th className="py-4 px-6">Treatment</th>
                  <th className="py-4 px-6">Dates & Shift</th>
                  <th className="py-4 px-6">Serology & Health</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredAppointments.map((apt) => {
                  const isPositive =
                    apt.health_status?.hivpositive ||
                    apt.health_status?.hbvpositive ||
                    apt.health_status?.hvbpositive ||
                    apt.health_status?.hcvpositive;

                  const currentStatus = (apt.status || "pending").toLowerCase();

                  return (
                    <tr
                      key={apt.id}
                      className="hover:bg-sky-50/30 transition-colors"
                    >
                      {/* Patient Name & Contact */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0 text-xs">
                            {apt.patient_detail?.full_name?.charAt(0) || "P"}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {apt.patient_detail?.full_name || "Guest Patient"}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              #{apt.appointment_id || apt.id} • {apt.patient_detail?.phone || "No phone"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Treatment Type */}
                      <td className="py-4 px-6">
                        <span className="inline-block font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                          {apt.treatment_type?.treatment_type || "Dialysis HD"}
                        </span>
                      </td>

                      {/* Schedule & Shifts */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-medium text-gray-800">
                            <Calendar size={13} className="text-sky-500 shrink-0" />
                            {apt.schedules && apt.schedules[0]
                              ? formatDate(apt.schedules[0].treatment_date)
                              : "Pending Date"}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-gray-500 capitalize">
                            <Clock size={12} className="text-gray-400 shrink-0" />
                            {apt.schedules && apt.schedules[0]
                              ? `${apt.schedules[0].shift} shift`
                              : "Shift TBD"}
                            {apt.schedules && apt.schedules.length > 1 && (
                              <span className="text-sky-600 font-semibold ml-1">
                                (+{apt.schedules.length - 1} more)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Serology Alerts */}
                      <td className="py-4 px-6">
                        {isPositive ? (
                          <div className="flex items-center gap-1.5 text-amber-600 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 w-fit">
                            <AlertTriangle size={13} />
                            <span>Isolation Req.</span>
                          </div>
                        ) : (
                          <span className="text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                            Standard
                          </span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${
                            currentStatus === "confirmed"
                              ? "bg-emerald-100 text-emerald-700"
                              : currentStatus === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : currentStatus === "completed"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {apt.status || "Pending"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedAppointment(apt)}
                            className="p-1.5 text-gray-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition cursor-pointer"
                            title="View Full Dossier"
                          >
                            <Eye size={16} />
                          </button>

                          {currentStatus === "pending" && (
                            <>
                              <button
                                onClick={() => onUpdateStatus(apt.id, "Confirmed")}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
                                title="Accept & Confirm"
                              >
                                <CheckCircle2 size={16} />
                              </button>
                              <button
                                onClick={() => onUpdateStatus(apt.id, "Cancelled")}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                                title="Decline Request"
                              >
                                <XCircle size={16} />
                              </button>
                            </>
                          )}

                          {currentStatus === "confirmed" && (
                            <button
                              onClick={() => onUpdateStatus(apt.id, "Completed")}
                              className="text-[11px] font-semibold px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg transition cursor-pointer"
                            >
                              Mark Completed
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400">
            <p className="text-sm font-semibold">No appointments found.</p>
            <p className="text-xs text-gray-400 mt-1">
              Try adjusting your filter or search query.
            </p>
          </div>
        )}
      </div>

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        isOpen={Boolean(selectedAppointment)}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
        onUpdateStatus={onUpdateStatus}
      />
    </div>
  );
}
