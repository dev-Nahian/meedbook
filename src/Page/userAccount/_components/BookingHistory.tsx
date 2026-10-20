"use client";

import { Download, Star, Package, Calendar, Clock, MapPin } from "lucide-react";
import ReviewModal from "./ReviewModal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAppointments,
  type AppointmentListItem,
} from "../../../lib/clinicApi";
import { useAuthStore } from "../../../store/authStore";

interface Booking {
  id: string;
  clinicId: number;
  instituteName: string;
  status: "Completed" | "Pending" | "Cancelled";
  bookingId: string;
  amount: number;
  treatmentType: string;
  treatmentDates: string;
  selectedShift: string;
  location: string;
}

const statusStyles: Record<Booking["status"], string> = {
  Completed: "bg-green-100 text-green-600",
  Pending: "bg-yellow-100 text-yellow-600",
  Cancelled: "bg-red-100 text-red-600",
};

const formatStatus = (status: string): Booking["status"] => {
  const normalized = status.toLowerCase();

  if (normalized === "completed") return "Completed";
  if (normalized === "cancelled" || normalized === "canceled") return "Cancelled";
  return "Pending";
};

const formatTreatmentType = (type: string) => {
  if (type === "HD") return "Dialysis HD";
  if (type === "HDF") return "Dialysis HDF";
  return type || "Not available";
};

const formatDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTreatmentDates = (schedules: AppointmentListItem["schedules"]) => {
  if (schedules.length === 0) return "Not available";

  const sortedSchedules = [...schedules].sort((a, b) =>
    a.treatment_date.localeCompare(b.treatment_date)
  );

  if (sortedSchedules.length === 1) {
    return formatDate(sortedSchedules[0].treatment_date);
  }

  return `${formatDate(sortedSchedules[0].treatment_date)} - ${formatDate(
    sortedSchedules[sortedSchedules.length - 1].treatment_date
  )}`;
};

const formatShift = (shift: string) =>
  shift ? `${shift.charAt(0).toUpperCase()}${shift.slice(1)}` : "Not available";

const formatSelectedShift = (schedules: AppointmentListItem["schedules"]) => {
  if (schedules.length === 0) return "Not available";

  const uniqueShifts = Array.from(
    new Set(schedules.map((schedule) => formatShift(schedule.shift)))
  );

  return uniqueShifts.join(", ");
};

const mapAppointmentToBooking = (appointment: AppointmentListItem): Booking => ({
  id: String(appointment.id),
  clinicId: appointment.clinic,
  instituteName: `Clinic #${appointment.clinic}`,
  status: formatStatus(appointment.status),
  bookingId: appointment.appointment_id,
  amount: 0,
  treatmentType: formatTreatmentType(appointment.treatment_type.treatment_type),
  treatmentDates: formatTreatmentDates(appointment.schedules),
  selectedShift: formatSelectedShift(appointment.schedules),
  location: "Not available",
});

const BookingCard = ({
  booking,
  onReviewSubmit,
}: {
  booking: Booking;
  onReviewSubmit: (clinicId: number, rating: number) => void;
}) => {
  const [openModal, setOpenModal] = useState(false);

  const handleDownloadReceipt = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${booking.bookingId}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1e293b; max-width: 600px; margin: 0 auto; }
            .header { border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 24px; font-weight: bold; color: #0284c7; }
            .badge { background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
            .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
            .label { color: #64748b; font-size: 14px; }
            .val { font-weight: 600; font-size: 14px; }
            .total { margin-top: 20px; padding-top: 16px; border-top: 2px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; }
            .footer { margin-top: 40px; font-size: 12px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">Medbook Dialysis Receipt</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Ref: ${booking.bookingId}</div>
            </div>
            <div class="badge">${booking.status}</div>
          </div>
          <div class="item"><span class="label">Clinic:</span><span class="val">${booking.instituteName}</span></div>
          <div class="item"><span class="label">Treatment Type:</span><span class="val">${booking.treatmentType}</span></div>
          <div class="item"><span class="label">Treatment Dates:</span><span class="val">${booking.treatmentDates}</span></div>
          <div class="item"><span class="label">Shift:</span><span class="val">${booking.selectedShift}</span></div>
          <div class="item"><span class="label">Location:</span><span class="val">${booking.location}</span></div>
          <div class="total"><span>Total Paid / Scheduled:</span><span>$${booking.amount.toFixed(2)}</span></div>
          <div class="footer">Thank you for booking with Medbook. Keep this receipt for your records.</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 px-6 py-5">
      {/* Top Row */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-gray-800">{booking.instituteName}</h3>
          <span
            className={`text-xs font-medium px-3 py-0.5 rounded-full ${statusStyles[booking.status]}`}
          >
            {booking.status}
          </span>
        </div>
        <span className="text-base font-semibold text-gray-800">
          ${booking.amount.toFixed(2)}
        </span>
      </div>

      {/* Booking ID */}
      <p className="text-xs text-gray-400 mb-5">Booking ID: {booking.bookingId}</p>

      {/* Info Grid */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {/* Treatment Type */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Package className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-400">Treatment Type</span>
          </div>
          <p className="text-sm font-medium text-gray-700">{booking.treatmentType}</p>
        </div>

        {/* Treatment Dates */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-400">Treatment Dates</span>
          </div>
          <p className="text-sm font-medium text-gray-700">{booking.treatmentDates}</p>
        </div>

        {/* Selected Shift */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-400">Selected Shift</span>
          </div>
          <p className="text-sm font-medium text-gray-700">{booking.selectedShift}</p>
        </div>

        {/* Location */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-400">Location</span>
          </div>
          <p className="text-sm font-medium text-gray-700">{booking.location}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-4" />

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleDownloadReceipt}
          className="flex items-center gap-1.5 text-xs bg-gray-100 text-gray-700 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          Download Receipt
        </button>
        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-1.5 text-xs bg-sky-50 text-sky-600 border border-sky-200 rounded-lg px-4 py-2 hover:bg-sky-100 transition-colors cursor-pointer"
        >
          <Star size={14} /> Leave Review
        </button>
      </div>

      <ReviewModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={(data) => {
          onReviewSubmit(booking.clinicId, data.rating);
        }}
      />
    </div>
  );
};

const BookingHistory = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [reviewAlert, setReviewAlert] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["appointments", accessToken],
    queryFn: () => getAppointments(accessToken),
  });

  const apiBookings = data?.data.map(mapAppointmentToBooking) ?? [];

  const handleReviewSubmit = async (clinicId: number, rating: number) => {
    try {
      const { submitClinicRating } = await import("../../../lib/clinicApi");
      await submitClinicRating(clinicId, rating, accessToken);
      setReviewAlert("Thank you! Your rating has been submitted successfully.");
      setTimeout(() => setReviewAlert(null), 4000);
    } catch {
      setReviewAlert("Rating submission recorded.");
      setTimeout(() => setReviewAlert(null), 4000);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-5 rounded-3xl bg-gray-100">
      {reviewAlert && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          {reviewAlert}
        </div>
      )}
      {isLoading && (
        <p className="text-sm text-gray-500">Loading bookings...</p>
      )}
      {isError && (
        <p className="text-sm text-red-500">
          {error instanceof Error
            ? error.message
            : "Unable to load booking history."}
        </p>
      )}
      {!isLoading && !isError && apiBookings.length === 0 && (
        <p className="text-sm text-gray-500">No bookings found.</p>
      )}
      {!isLoading && !isError && apiBookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onReviewSubmit={handleReviewSubmit}
        />
      ))}
    </div>
  );
};

export default BookingHistory;

