import {
  X,
  User,
  Calendar,
  Clock,
  FileText,
  AlertTriangle,
  ShieldCheck,
  Stethoscope,
  HeartHandshake,
  Download,
  Mail,
  Phone,
  Globe,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import type { AppointmentListItem } from "../../../../lib/clinicApi";

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentListItem | null;
  onUpdateStatus?: (id: number, status: "Confirmed" | "Cancelled" | "Completed") => void;
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

export default function AppointmentDetailsModal({
  isOpen,
  onClose,
  appointment,
  onUpdateStatus,
}: AppointmentDetailsModalProps) {
  if (!isOpen || !appointment) return null;

  const {
    id,
    appointment_id,
    status,
    patient_detail,
    schedules,
    health_status,
    insurance,
    treatment_type,
    care_partner,
    home_clinic,
    medical_reports,
  } = appointment;

  const isPositive =
    health_status?.hivpositive ||
    health_status?.hbvpositive ||
    health_status?.hvbpositive ||
    health_status?.hcvpositive;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-sky-50 to-blue-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700">
                Booking #{appointment_id || id}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                  status?.toLowerCase() === "confirmed"
                    ? "bg-emerald-100 text-emerald-700"
                    : status?.toLowerCase() === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {status || "Pending"}
              </span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mt-1">
              Patient Dossier & Booking Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-all"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Health Alert Banner if patient has special infectious status */}
          {isPositive && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="font-semibold text-amber-900">
                  Special Isolation Protocol Required
                </p>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {health_status?.hivpositive && (
                    <span className="bg-amber-200/70 text-amber-900 text-xs px-2.5 py-0.5 rounded-md font-medium">
                      HIV Positive Station
                    </span>
                  )}
                  {(health_status?.hbvpositive || health_status?.hvbpositive) && (
                    <span className="bg-amber-200/70 text-amber-900 text-xs px-2.5 py-0.5 rounded-md font-medium">
                      HBV Positive Station
                    </span>
                  )}
                  {health_status?.hcvpositive && (
                    <span className="bg-amber-200/70 text-amber-900 text-xs px-2.5 py-0.5 rounded-md font-medium">
                      HCV Positive Station
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Patient Details */}
          <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <User size={16} className="text-sky-500" />
              Patient Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-600">
              <div>
                <span className="text-xs text-gray-400 block">Full Name</span>
                <span className="font-medium text-gray-800">
                  {patient_detail?.full_name || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Date of Birth</span>
                <span className="font-medium text-gray-800">
                  {formatDate(patient_detail?.birth_date)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gray-400" />
                <span>{patient_detail?.email || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gray-400" />
                <span>{patient_detail?.phone || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <Globe size={14} className="text-gray-400" />
                <span>Language: {patient_detail?.language || "English"}</span>
              </div>
            </div>
          </div>

          {/* Treatment & Schedules */}
          <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <Stethoscope size={16} className="text-sky-500" />
              Treatment & Shift Schedules
            </h3>
            <div className="mb-3">
              <span className="text-xs text-gray-400 block">Prescribed Treatment</span>
              <span className="inline-block mt-1 font-semibold text-sky-600 bg-sky-50 border border-sky-200 px-3 py-1 rounded-lg">
                {treatment_type?.treatment_type || "Hemodialysis (HD)"}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-gray-400 block">Requested Sessions ({schedules?.length || 0})</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {schedules && schedules.length > 0 ? (
                  schedules.map((s, idx) => (
                    <div
                      key={s.id || idx}
                      className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs"
                    >
                      <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                        <Calendar size={13} className="text-sky-500" />
                        {formatDate(s.treatment_date)}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 capitalize">
                        <Clock size={13} className="text-gray-400" />
                        {s.shift} shift
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">No schedules recorded.</p>
                )}
              </div>
            </div>
          </div>

          {/* Insurance & Home Clinic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                <ShieldCheck size={16} className="text-sky-500" />
                Insurance Status
              </h3>
              <div className="space-y-1.5 text-xs text-gray-600">
                <p>
                  EHIC Card:{" "}
                  <strong className={insurance?.ehic_holder ? "text-emerald-600" : "text-gray-500"}>
                    {insurance?.ehic_holder ? "Yes, Active" : "No"}
                  </strong>
                </p>
                <p>
                  GHIC Card:{" "}
                  <strong className={insurance?.ghic_holder ? "text-emerald-600" : "text-gray-500"}>
                    {insurance?.ghic_holder ? "Yes, Active" : "No"}
                  </strong>
                </p>
              </div>
            </div>

            <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                <HeartHandshake size={16} className="text-sky-500" />
                Home Clinic & Care Partner
              </h3>
              <div className="space-y-1 text-xs text-gray-600">
                <p className="truncate">
                  Clinic: <strong>{home_clinic?.clinic_name || "N/A"}</strong>
                </p>
                <p className="truncate">
                  Consultant: <strong>{home_clinic?.home_clinic_consultant_name || "N/A"}</strong>
                </p>
                <p>
                  Bringing Partner:{" "}
                  <strong>{care_partner?.bringing_partner ? "Yes" : "No"}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Medical Reports & Documents */}
          <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <FileText size={16} className="text-sky-500" />
              Attached Medical Reports & Prescriptions
            </h3>
            {medical_reports && medical_reports.length > 0 ? (
              <div className="space-y-2">
                {medical_reports.map((report, idx) => (
                  <div
                    key={report.id || idx}
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-3"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={18} className="text-sky-500 shrink-0" />
                      <span className="text-xs font-medium text-gray-700 truncate">
                        Medical_Report_Patient_{appointment.id}_{idx + 1}.pdf
                      </span>
                    </div>
                    {report.file_url ? (
                      <a
                        href={report.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-medium text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg transition-colors shrink-0"
                      >
                        <Download size={13} />
                        View / Download
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">File attached</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">
                No uploaded medical files for this booking.
              </p>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Close
          </button>

          {onUpdateStatus && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onUpdateStatus(id, "Cancelled");
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors"
              >
                <XCircle size={15} />
                Decline
              </button>
              <button
                onClick={() => {
                  onUpdateStatus(id, "Confirmed");
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-xl shadow-xs transition-colors"
              >
                <CheckCircle2 size={15} />
                Accept & Confirm
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
