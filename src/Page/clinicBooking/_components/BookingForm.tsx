import { useCallback, useEffect, useMemo, useState, useRef, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ClinicApiError,
  createAppointment,
  getBookedSlots,
  checkoutAppointment,
  type AppointmentSchedule,
  type BookedSlot,
} from "../../../lib/clinicApi";
import { useAuthStore } from "../../../store/authStore";

// ── Types ──────────────────────────────────────────────
type ShiftOption = "Morning shift" | "Afternoon shift" | "Evening shift";
type TreatmentType = "Dialysis HD" | "Dialysis HDF";

interface SelectedDate {
  year: number;
  month: number;
  day: number;
  shift: ShiftOption;
}

type PatientFormValues = {
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  language: string;
};

type HomeClinicValues = {
  country: string;
  clinicName: string;
  consultantName: string;
};

// ── Helpers ─────────────────────────────────────────────
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const FULL_DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const SHIFTS: ShiftOption[] = ["Morning shift","Afternoon shift","Evening shift"];

function getDayName(year: number, month: number, day: number) {
  return FULL_DAY_NAMES[new Date(year, month, day).getDay()];
}

function formatTreatmentDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function mapShift(shift: ShiftOption): AppointmentSchedule["shift"] {
  if (shift === "Afternoon shift") return "afternoon";
  if (shift === "Evening shift") return "evening";
  return "morning";
}

function mapApiShiftToOption(shift: string): ShiftOption {
  if (shift === "afternoon") return "Afternoon shift";
  if (shift === "evening") return "Evening shift";
  return "Morning shift";
}

function getAvailableShift(bookedShifts: Set<AppointmentSchedule["shift"]>) {
  return SHIFTS.find((shift) => !bookedShifts.has(mapShift(shift)));
}

function createBookedSlotMap(bookedSlots: BookedSlot[]) {
  return bookedSlots.reduce<Record<string, Set<AppointmentSchedule["shift"]>>>(
    (slotMap, slot) => {
      const shift = mapShift(mapApiShiftToOption(slot.shift));

      if (!slotMap[slot.treatment_date]) {
        slotMap[slot.treatment_date] = new Set();
      }

      slotMap[slot.treatment_date].add(shift);
      return slotMap;
    },
    {}
  );
}

function normalizeBirthDate(value: string) {
  const trimmed = value.trim();
  const isoDate = /^\d{4}-\d{2}-\d{2}$/;
  const slashDate = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  if (isoDate.test(trimmed)) return trimmed;

  const match = trimmed.match(slashDate);
  if (!match) return trimmed;

  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}



function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

// ── Calendar Component ──────────────────────────────────
function InteractiveCalendar({
  year,
  month,
  selectedDays,
  disabledDays,
  onToggleDay,
  onPrevMonth,
  onNextMonth,
}: {
  year: number;
  month: number;
  selectedDays: number[];
  disabledDays: number[];
  onToggleDay: (day: number) => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
}) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="w-full max-w-xs">
      <div className="flex items-center justify-between mb-3 px-1">
        {onPrevMonth && (
          <button
            type="button"
            onClick={onPrevMonth}
            aria-label="Previous month"
            className="p-1 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
          >
            <ChevronLeftIcon />
          </button>
        )}
        <p className="text-xs font-semibold text-gray-700 text-center flex-1">
          {MONTH_NAMES[month]} {year}
        </p>
        {onNextMonth && (
          <button
            type="button"
            onClick={onNextMonth}
            aria-label="Next month"
            className="p-1 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
          >
            <ChevronRightIcon />
          </button>
        )}
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((d, i) => (
          <div
            key={d}
            className={`text-center text-[11px] font-medium pb-1 ${
              i === 0 || i === 6 ? "text-sky-400" : "text-gray-400"
            }`}
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          if (day === null) return <div key={idx} />;
          const col = idx % 7;
          const isSat = col === 6;
          const isSun = col === 0;
          const isSelected = selectedDays.includes(day);
          const isDisabled = disabledDays.includes(day);
          return (
            <button
              type="button"
              key={idx}
              disabled={isDisabled}
              onClick={() => onToggleDay(day)}
              className={`flex items-center justify-center h-8 w-8 mx-auto rounded-full text-[12px] font-medium transition-all
                ${isSelected
                  ? "text-white"
                  : isDisabled
                  ? "text-gray-300 cursor-not-allowed bg-gray-50 line-through"
                  : isSat || isSun
                  ? "text-sky-400 hover:bg-sky-50"
                  : "text-gray-700 hover:bg-gray-100"
                }`}
              style={isSelected ? { background: "linear-gradient(135deg, #38bdf8, #0ea5e9)" } : {}}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Shift Selector Row ──────────────────────────────────
function ShiftRow({
  label, shift, bookedShifts, onChangeShift, onRemove,
}: {
  label: string;
  shift: ShiftOption;
  bookedShifts: Set<AppointmentSchedule["shift"]>;
  onChangeShift: (s: ShiftOption) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-4">
      <p className="text-xs text-gray-500 mb-1.5">{label}</p>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-600 bg-white hover:border-gray-300 transition-colors"
          >
            <span>{shift}</span>
            <ChevronDownIcon />
          </button>
          {open && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-100 rounded-lg shadow-lg z-10 overflow-hidden">
              {SHIFTS.map((s) => {
                const isBooked = bookedShifts.has(mapShift(s));

                return (
                  <button
                    type="button"
                    key={s}
                    disabled={isBooked}
                    onClick={() => { onChangeShift(s); setOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      isBooked
                        ? "text-gray-300 cursor-not-allowed bg-gray-50"
                        : shift === s
                        ? "text-sky-500 bg-sky-50/50 hover:bg-sky-50 hover:text-sky-500"
                        : "text-gray-600 hover:bg-sky-50 hover:text-sky-500"
                    }`}
                  >
                    {s}{isBooked ? " - Booked" : ""}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}

// ── Right Panel ─────────────────────────────────────────
function BookingSummaryPanel({
  selectedCount,
  clinicName,
  price,
  isSubmitting,
  submitError,
  submitSuccess,
  onConfirm,
  createdAppointmentId,
  isCheckingOut,
  onProceedToPayment,
}: {
  selectedCount: number;
  clinicName: string;
  price: number;
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: string | null;
  onConfirm: () => void;
  createdAppointmentId?: string | number | null;
  isCheckingOut?: boolean;
  onProceedToPayment?: () => void;
}) {
  const total = price * selectedCount;
  return (
    <div className="sticky top-6 flex flex-col gap-4">
      {/* Clinic card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <div className="flex gap-3 items-start">
          <img
            src="https://images.unsplash.com/photo-1587351021355-a479a299d2f9?w=120&q=80"
            alt="City Medical Center"
            className="w-16 h-16 rounded-xl object-cover shrink-0"
          />
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-1">{clinicName}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Block 21A, Orchard Boulevard, #12-144<br />
              Orchard Gateway Tower 2, Near Somerset<br />
              MRT Exit B, Singapore 238895
            </p>
          </div>
        </div>

        <hr className="border-gray-100 my-4" />

        {/* Price details */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">Price Details</p>
          <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
            <span>${price} × {selectedCount} treatment{selectedCount !== 1 ? "s" : ""}</span>
            <span className="font-semibold text-gray-800">${total}</span>
          </div>
          <button
            type="button"
            onClick={onConfirm}
            disabled={selectedCount === 0 || isSubmitting}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            style={{
              background: selectedCount > 0 && !isSubmitting
                ? "linear-gradient(135deg, #38bdf8, #0ea5e9)"
                : "#e5e7eb",
              color: selectedCount > 0 && !isSubmitting ? "white" : "#9ca3af",
            }}
          >
            {isSubmitting ? "Confirming..." : "Confirm Your Booking"}
          </button>
          {submitError && <p className="mt-3 text-xs text-red-500">{submitError}</p>}
          {submitSuccess && (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-green-600 font-medium">{submitSuccess}</p>
              {createdAppointmentId && onProceedToPayment && (
                <button
                  type="button"
                  onClick={onProceedToPayment}
                  disabled={isCheckingOut}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70"
                >
                  {isCheckingOut ? "Connecting Stripe..." : "💳 Pay Now (Stripe Checkout)"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────
export default function BookAppointmentPage() {
  const [searchParams] = useSearchParams();
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // November

  const clinicId = searchParams.get("clinic") ?? "2";
  const clinicName = searchParams.get("clinicName") ?? "City Medical Center";
  const priceFromParams = Number.parseFloat(searchParams.get("price") ?? "79");
  const price = Number.isFinite(priceFromParams) ? priceFromParams : 79;

  const { data: bookedSlotsData } = useQuery({
    queryKey: ["booked-slots", clinicId],
    queryFn: () => getBookedSlots(clinicId),
    enabled: Boolean(clinicId),
  });

  const [selectedDates, setSelectedDates] = useState<SelectedDate[]>([
    { year: 2026, month: 10, day: 22, shift: "Morning shift" },
    { year: 2026, month: 10, day: 23, shift: "Afternoon shift" },
  ]);

  const [patientDetails, setPatientDetails] = useState<PatientFormValues>(() => ({
    fullName: user?.full_name || (user as any)?.name || "",
    email: user?.email || "",
    phone: (user as any)?.phone || "",
    birthDate: (user as any)?.dob || "",
    language: "English",
  }));

  const [homeClinic, setHomeClinic] = useState<HomeClinicValues>({
    country: "Bangladesh",
    clinicName: "",
    consultantName: "",
  });
  const [treatment, setTreatment] = useState<TreatmentType>("Dialysis HD");
  const [patientStatus, setPatientStatus] = useState({ hiv: false, hbv: false, hcv: false });
  const [insurance, setInsurance] = useState({ ehic: true, ghic: false });
  const [carepartner, setCarepartner] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [createdAppointmentId, setCreatedAppointmentId] = useState<string | number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const bookedSlotMap = useMemo(
    () => createBookedSlotMap(bookedSlotsData?.booked_slots ?? []),
    [bookedSlotsData?.booked_slots]
  );

  const disabledDays = useMemo(() => {
    return Object.entries(bookedSlotMap)
      .filter(([treatmentDate, bookedShifts]) => {
        const [year, month] = treatmentDate.split("-");

        return (
          year === String(currentYear) &&
          month === String(currentMonth + 1).padStart(2, "0") &&
          SHIFTS.every((shift) => bookedShifts.has(mapShift(shift)))
        );
      })
      .map(([treatmentDate]) => Number(treatmentDate.split("-")[2]))
      .filter((day) => Number.isFinite(day));
  }, [bookedSlotMap, currentYear, currentMonth]);

  const selectedDays = useMemo(() => {
    return selectedDates
      .filter((d) => d.year === currentYear && d.month === currentMonth)
      .map((d) => d.day);
  }, [selectedDates, currentYear, currentMonth]);

  const getBookedShifts = useCallback(
    (year: number, month: number, day: number) => {
      return (
        bookedSlotMap[formatTreatmentDate(year, month, day)] ??
        new Set<AppointmentSchedule["shift"]>()
      );
    },
    [bookedSlotMap]
  );

  function isBookedSlot(year: number, month: number, day: number, shift: ShiftOption) {
    return getBookedShifts(year, month, day).has(mapShift(shift));
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setSelectedDates((previousDates) => {
        let changed = false;
        const updated = previousDates.flatMap((selectedDate) => {
          const bookedShifts = getBookedShifts(
            selectedDate.year,
            selectedDate.month,
            selectedDate.day
          );

          if (!bookedShifts.has(mapShift(selectedDate.shift))) {
            return selectedDate;
          }

          changed = true;
          const availableShift = getAvailableShift(bookedShifts);
          return availableShift ? { ...selectedDate, shift: availableShift } : [];
        });

        return changed ? updated : previousDates;
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [getBookedShifts]);

  function handlePrevMonth() {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }

  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }

  function toggleDay(day: number) {
    const bookedShifts = getBookedShifts(currentYear, currentMonth, day);
    const availableShift = getAvailableShift(bookedShifts);

    if (!availableShift) return;

    const exists = selectedDates.find(
      (d) => d.year === currentYear && d.month === currentMonth && d.day === day
    );
    if (exists) {
      setSelectedDates((prev) =>
        prev.filter(
          (d) => !(d.year === currentYear && d.month === currentMonth && d.day === day)
        )
      );
    } else {
      const sorted = [
        ...selectedDates,
        { year: currentYear, month: currentMonth, day, shift: availableShift },
      ].sort(
        (a, b) =>
          new Date(a.year, a.month, a.day).getTime() -
          new Date(b.year, b.month, b.day).getTime()
      );
      setSelectedDates(sorted);
    }
  }

  function updateShift(year: number, month: number, day: number, shift: ShiftOption) {
    if (isBookedSlot(year, month, day, shift)) return;

    setSelectedDates((prev) =>
      prev.map((d) =>
        d.year === year && d.month === month && d.day === day ? { ...d, shift } : d
      )
    );
  }

  function removeDate(year: number, month: number, day: number) {
    setSelectedDates((prev) =>
      prev.filter(
        (d) => !(d.year === year && d.month === month && d.day === day)
      )
    );
  }

  function getDateLabel(year: number, month: number, day: number) {
    const dayName = getDayName(year, month, day);
    return `${dayName}, ${MONTH_NAMES[month]} ${day}, ${year}`;
  }

  async function handleSubmit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (selectedDates.length === 0) {
      setSubmitError("Please select at least one treatment date.");
      return;
    }

    if (
      selectedDates.some(({ year, month, day, shift }) =>
        isBookedSlot(year, month, day, shift)
      )
    ) {
      setSubmitError("One or more selected slots are already booked. Please choose another shift.");
      return;
    }

    if (
      !patientDetails.fullName.trim() ||
      !patientDetails.email.trim() ||
      !patientDetails.phone.trim() ||
      !patientDetails.birthDate.trim()
    ) {
      setSubmitError("Please complete all required patient details.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createAppointment(
        {
          clinic: clinicId,
          patient_detail: {
            full_name: patientDetails.fullName.trim(),
            email: patientDetails.email.trim(),
            phone: patientDetails.phone.trim(),
            birth_date: normalizeBirthDate(patientDetails.birthDate),
            language: patientDetails.language,
          },
          schedules: selectedDates.map(({ year, month, day, shift }) => ({
            treatment_date: formatTreatmentDate(year, month, day),
            shift: mapShift(shift),
          })),
          health_status: {
            hivpositive: patientStatus.hiv,
            hvbpositive: patientStatus.hbv,
            hbvpositive: patientStatus.hbv,
            hcvpositive: patientStatus.hcv,
          },
          insurance: {
            ehic_holder: insurance.ehic,
            ghic_holder: insurance.ghic,
          },
          treatment_type: {
            treatment_type: treatment === "Dialysis HD" ? "HD" : "HDF",
          },
          care_partner: {
            bringing_partner: carepartner,
          },
          home_clinic: {
            clinic_name: homeClinic.clinicName.trim() || "Dhaka Kidney Clinic",
            home_clinic_consultant_name: homeClinic.consultantName.trim() || "Dr. Hasan",
          },
          medical_reports: uploadedFile,
        },
        accessToken
      );

      const refId = res.data?.appointment_id || res.data?.id;
      if (refId) {
        setCreatedAppointmentId(refId);
      }
      setSubmitSuccess(
        refId
          ? `Appointment created successfully! Booking Ref: ${refId}`
          : "Appointment created successfully."
      );
    } catch (error) {
      setSubmitError(
        error instanceof ClinicApiError
          ? error.message
          : "Unable to submit your appointment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedToPayment = async () => {
    if (!createdAppointmentId) return;
    setIsCheckingOut(true);
    try {
      const checkoutRes = await checkoutAppointment(
        {
          appointment_id: createdAppointmentId,
          success_url: `${window.location.origin}/billing/success`,
          cancel_url: `${window.location.origin}/billing/cancel`,
        },
        accessToken
      );
      if (checkoutRes.data?.url) {
        window.location.href = checkoutRes.data.url;
      }
    } catch (err: any) {
      setSubmitError(err?.message || "Could not initialize checkout. Please check your booking in account.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 py-10">
        <form className="flex gap-10 items-start" onSubmit={handleSubmit}>

          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 min-w-0">
            {/* Page header */}
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Book Your Appointment</h1>
            <p className="text-sm text-gray-400 mb-8">Plan Your Visit With Confidence and Clarity</p>


            <hr className="border-gray-100 mb-8" />

            {/* Treatment Days & Shifts */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-gray-800">Treatment Days & Shifts</h2>
                
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Select the days you prefer for your treatment by clicking on each date<br />
                within the selected period. After choosing the dates, pick your preferred<br />
                treatment shift from the options shown below the calendar.
              </p>

              {/* Calendar */}
              <div className="mb-6 mt-12">
                <InteractiveCalendar
                  year={currentYear}
                  month={currentMonth}
                  selectedDays={selectedDays}
                  disabledDays={disabledDays}
                  onToggleDay={toggleDay}
                  onPrevMonth={handlePrevMonth}
                  onNextMonth={handleNextMonth}
                />
              </div>

              {/* Shift selectors */}
              {selectedDates.map(({ year, month, day, shift }) => (
                <ShiftRow
                  key={`${year}-${month}-${day}`}
                  label={getDateLabel(year, month, day)}
                  shift={shift}
                  bookedShifts={getBookedShifts(year, month, day)}
                  onChangeShift={(s) => updateShift(year, month, day, s)}
                  onRemove={() => removeDate(year, month, day)}
                />
              ))}
            </div>

            <hr className="border-gray-100 mb-8" />

            {/* Patient Details */}
            <div className="mb-8">
              <h2 className="text-base font-bold text-gray-800 mb-1">Patient Details</h2>
              <p className="text-sm text-gray-400 mb-6">
                Please Provide the Full Personal Details of the Individual You Are Booking the Treatment For
              </p>

              <div className="flex flex-col gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={patientDetails.fullName}
                    onChange={(e) =>
                      setPatientDetails((details) => ({
                        ...details,
                        fullName: e.target.value,
                      }))
                    }
                    placeholder="Enter your full name"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-sky-300 transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={patientDetails.email}
                    onChange={(e) =>
                      setPatientDetails((details) => ({
                        ...details,
                        email: e.target.value,
                      }))
                    }
                    placeholder="email@example.com"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-sky-300 transition-colors"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone Number</label>
                  <div className="flex border border-gray-200 rounded-lg overflow-hidden focus-within:border-sky-300 transition-colors">
                    <div className="flex items-center gap-2 px-3 py-2.5 border-r border-gray-200 bg-gray-50 shrink-0">
                      <span className="text-base">🇦🇪</span>
                      <span className="text-xs text-gray-500">—</span>
                    </div>
                    <input
                      type="tel"
                      value={patientDetails.phone}
                      onChange={(e) =>
                        setPatientDetails((details) => ({
                          ...details,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="111 222 333 444"
                      className="flex-1 px-4 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none bg-white"
                    />
                  </div>
                </div>

                {/* Birth date */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Birth date</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={patientDetails.birthDate}
                      onChange={(e) =>
                        setPatientDetails((details) => ({
                          ...details,
                          birthDate: e.target.value,
                        }))
                      }
                      placeholder="dd/mm/yyyy"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-sky-300 transition-colors pr-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      <CalendarIcon />
                    </span>
                  </div>
                </div>

                {/* Language Preference */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Language Preference</label>
                  <div className="relative">
                    <select
                      value={patientDetails.language}
                      onChange={(e) =>
                        setPatientDetails((details) => ({
                          ...details,
                          language: e.target.value,
                        }))
                      }
                      className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:border-sky-300 transition-colors bg-white pr-10"
                    >
                      <option>English</option>
                      <option>Arabic</option>
                      <option>French</option>
                      <option>Spanish</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>

                {/* Patient Status */}
                <div className="pt-2">
                  <p className="text-xs font-medium text-gray-600 mb-2">Patient Status</p>
                  <div className="flex items-center gap-5 flex-wrap">
                    {[
                      { key: "hiv" as const, label: "HIV Positive" },
                      { key: "hbv" as const, label: "HBV Positive" },
                      { key: "hcv" as const, label: "HCV Positive" },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={patientStatus[key]}
                          onChange={() => setPatientStatus((p) => ({ ...p, [key]: !p[key] }))}
                          className="w-4 h-4 rounded border-gray-300 text-sky-500 focus:ring-sky-400"
                        />
                        <span className="text-sm text-gray-600">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Health Insurance Card */}
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-2">Health Insurance Card</p>
                  <div className="flex items-center gap-5">
                    {[
                      { key: "ehic" as const, label: "EHIC Holder" },
                      { key: "ghic" as const, label: "GHIC Holder" },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={insurance[key]}
                          onChange={() => setInsurance((i) => ({ ...i, [key]: !i[key] }))}
                          className="w-4 h-4 rounded border-gray-300 text-sky-500 focus:ring-sky-400"
                        />
                        <span className="text-sm text-gray-600">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Select treatment type */}
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-2">Select treatment type</p>
                  <div className="flex gap-2">
                    {(["Dialysis HD", "Dialysis HDF"] as TreatmentType[]).map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setTreatment(t)}
                        className="px-5 py-2 rounded-full text-sm font-semibold border transition-all"
                        style={
                          treatment === t
                            ? { background: "linear-gradient(135deg, #38bdf8, #0ea5e9)", color: "white", borderColor: "transparent" }
                            : { background: "white", color: "#9ca3af", borderColor: "#e5e7eb" }
                        }
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Care partner */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={carepartner}
                    onChange={() => setCarepartner((v) => !v)}
                    className="w-4 h-4 rounded border-gray-300 text-sky-500 focus:ring-sky-400"
                  />
                  <span className="text-sm text-gray-600">I'm bringing my care partner</span>
                </label>
              </div>
            </div>

            <hr className="border-gray-100 mb-8" />

            {/* Home Clinic Details */}
            <div className="mb-8">
              <h2 className="text-base font-bold text-gray-800 mb-5">Home Clinic Details</h2>

              <div className="flex flex-col gap-4">
                {/* Country */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Home Clinic Country</label>
                  <div className="relative">
                    <select
                      value={homeClinic.country}
                      onChange={(e) =>
                        setHomeClinic((clinic) => ({
                          ...clinic,
                          country: e.target.value,
                        }))
                      }
                      className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:border-sky-300 transition-colors bg-white pr-10"
                    >
                      <option>Singapore</option>
                      <option>United Arab Emirates</option>
                      <option>United Kingdom</option>
                      <option>United States</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>

                {/* Clinic Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Home Clinic Name</label>
                  <input
                    type="text"
                    value={homeClinic.clinicName}
                    onChange={(e) =>
                      setHomeClinic((clinic) => ({
                        ...clinic,
                        clinicName: e.target.value,
                      }))
                    }
                    placeholder="Clinic Name"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-sky-300 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Home Clinic Consultant Name</label>
                  <input
                    type="text"
                    value={homeClinic.consultantName}
                    onChange={(e) =>
                      setHomeClinic((clinic) => ({
                        ...clinic,
                        consultantName: e.target.value,
                      }))
                    }
                    placeholder="Consultant Name"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-sky-300 transition-colors"
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-100 mb-8" />

            {/* Medical Report */}
            <div className="mb-10">
              <h2 className="text-base font-bold text-gray-800 mb-1">Medical Report</h2>
              <p className="text-sm text-gray-400 mb-5">
                A recent summary from your neurologist or dialysis clinic about your current treatment.
              </p>

              <input
                type="file"
                ref={fileRef}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setUploadedFile(f);
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-200 rounded-xl py-8 flex flex-col items-center justify-center hover:border-sky-300 transition-colors"
              >
                <UploadIcon />
                {uploadedFile ? (
                  <p className="text-sm text-sky-500 font-medium">{uploadedFile.name}</p>
                ) : (
                  <p className="text-xs text-gray-400 text-center">
                    Select a file to upload. Formats: PDF, DOC,<br />JPG, PNG. Max size: 5MB.
                  </p>
                )}
              </button>
            </div>

          </div>

          {/* ── RIGHT STICKY COLUMN ── */}
          <div className="">
            <BookingSummaryPanel
              selectedCount={selectedDates.length}
              clinicName={clinicName}
              price={price}
              isSubmitting={isSubmitting}
              submitError={submitError}
              submitSuccess={submitSuccess}
              createdAppointmentId={createdAppointmentId}
              isCheckingOut={isCheckingOut}
              onProceedToPayment={handleProceedToPayment}
              onConfirm={() => void handleSubmit()}
            />
          </div>

        </form>
      </div>
    </div>
  );
}
