import { useState, useMemo, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BookingPanel from "./BookingPanel";
import ClinicMap from "./ClinicMap";
import type {
  ClinicAcceptedPatient,
  ClinicDetailsItem,
  ClinicFacility,
  ClinicPaymentMethod,
  ClinicAvailability,
} from "../../../lib/clinicApi";
// ── Types ──────────────────────────────────────────────
type NearbyTab = "Visit" | "Stay" | "Eat";

const defaultAddress =
  "Block 21A, Orchard Boulevard, #12-144 Orchard Gateway Tower 2, New Somerset MRT Exit 9, Singapore 238895";

const defaultDescription =
  "Our clinic proudly welcomes international patients seeking trusted and high-quality medical services in Singapore. From expert consultations to advanced treatments, we offer complete support, including appointment management and personalized care plans. With our multilingual team and globally recognized specialists, we ensure a smooth and comfortable healthcare experience for patients from around the world.";

const defaultAcceptedPatients = ["HIV Patients", "HBV Patients", "HCV Patients"];
const defaultFacilities = ["Refreshments", "Free Transfer", "Free Parking"];
const defaultPaymentMethods = ["Cash", "Bank Transfers", "Credit Cards"];

const getAcceptedPatientName = (patient: ClinicAcceptedPatient) =>
  patient.patient_name ?? patient.name ?? patient.patient_type ?? patient.title ?? "";

const getFacilityName = (facility: ClinicFacility) =>
  facility.facility_name ?? facility.name ?? facility.title ?? "";

const getPaymentMethodName = (method: ClinicPaymentMethod) =>
  method.payment_method_name ?? method.name ?? method.payment_method ?? method.title ?? "";

// ── Icons ──────────────────────────────────────────────
function ShareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  );
}

function LocationPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-green-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

function RefreshmentIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function TransferIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  );
}

function ParkingIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  );
}

function CashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

function VisitIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function StayIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function EatIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  );
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ── Dynamic Treatment Days Calendar ─────────────────────────────────────
// ── Dynamic Treatment Days Calendar ─────────────────────────────────────
const parseAvailabilityDate = (dateStr?: string) => {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();
  const parts = trimmed.split("-").map(Number);
  if (parts.length === 3 && !parts.some(Number.isNaN)) {
    return { year: parts[0], month: parts[1] - 1, day: parts[2] };
  }
  const d = new Date(trimmed);
  if (!Number.isNaN(d.getTime())) {
    return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
  }
  return null;
};

function SingleMonthCalendar({
  year,
  month,
  availabilities = [],
}: {
  year: number;
  month: number;
  availabilities?: ClinicAvailability[];
}) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const { availableDaysSet, hasExplicitAvailabilities } = useMemo(() => {
    const set = new Set<number>();
    const hasExplicit = availabilities.length > 0;

    // 1. If specific date strings are in availabilities (e.g. "2026-09-15")
    availabilities.forEach((item) => {
      if (item.date) {
        const parsed = parseAvailabilityDate(item.date);
        if (parsed && parsed.year === year && parsed.month === month) {
          set.add(parsed.day);
        }
      }
    });

    // 2. If day of week is specified
    const weekdayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const activeWeekdays = new Set<number>();

    availabilities.forEach((item) => {
      if (item.day) {
        const lower = item.day.toLowerCase().trim();
        const foundIdx = weekdayNames.findIndex((w) => w.startsWith(lower.slice(0, 3)));
        if (foundIdx !== -1) {
          activeWeekdays.add(foundIdx);
        }
      }
    });

    if (activeWeekdays.size > 0) {
      for (let d = 1; d <= daysInMonth; d++) {
        const dayOfWeek = new Date(year, month, d).getDay();
        if (activeWeekdays.has(dayOfWeek)) {
          set.add(d);
        }
      }
    }

    // 3. Fallback when no availabilities provided in API: default Sun (0) and Sat (6)
    if (!hasExplicit) {
      for (let d = 1; d <= daysInMonth; d++) {
        const dayOfWeek = new Date(year, month, d).getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          set.add(d);
        }
      }
    }

    return { availableDaysSet: set, hasExplicitAvailabilities: hasExplicit };
  }, [availabilities, year, month, daysInMonth]);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-xs flex-1">
      <h3 className="text-center text-sm font-medium text-gray-800 mb-6">
        {MONTH_NAMES[month]} {year}
      </h3>

      <div className="grid grid-cols-7 text-center mb-5">
        {DAY_NAMES.map((d, idx) => (
          <div
            key={d}
            className={`text-xs font-normal ${
              idx === 0 || idx === 6 ? "text-sky-400" : "text-gray-700"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 text-center gap-y-3">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="h-6" />;
          }

          const colIndex = idx % 7;
          const isWeekend = colIndex === 0 || colIndex === 6;
          const isAvailable = availableDaysSet.has(day);

          if (hasExplicitAvailabilities) {
            return (
              <div
                key={`day-${day}`}
                className="flex items-center justify-center h-6"
              >
                {isAvailable ? (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sky-50 text-sky-600 font-bold border border-sky-300 shadow-xs text-xs">
                    {day}
                  </span>
                ) : (
                  <span className="text-xs font-normal text-gray-400">{day}</span>
                )}
              </div>
            );
          }

          // Default styling when no explicit availabilities
          const isDefaultHighlight = isWeekend || isAvailable;
          return (
            <div
              key={`day-${day}`}
              className={`text-xs font-normal flex items-center justify-center h-6 ${
                isDefaultHighlight ? "text-sky-400" : "text-gray-700"
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TreatmentDaysCalendar({
  availabilities = [],
}: {
  availabilities?: ClinicAvailability[];
}) {
  const [monthOffset, setMonthOffset] = useState(0);

  // Auto-focus to the month of the first availability date if available
  const initialDate = useMemo(() => {
    for (const item of availabilities) {
      if (item.date) {
        const parsed = parseAvailabilityDate(item.date);
        if (parsed) {
          return new Date(parsed.year, parsed.month, 1);
        }
      }
    }
    return new Date();
  }, [availabilities]);

  const baseDate = useMemo(() => {
    return new Date(
      initialDate.getFullYear(),
      initialDate.getMonth() + monthOffset,
      1
    );
  }, [initialDate, monthOffset]);

  const year1 = baseDate.getFullYear();
  const month1 = baseDate.getMonth();

  const nextMonthDate = new Date(year1, month1 + 1, 1);
  const year2 = nextMonthDate.getFullYear();
  const month2 = nextMonthDate.getMonth();

  const handlePrevMonth = () => {
    setMonthOffset((prev) => prev - 1);
  };

  const handleNextMonth = () => {
    setMonthOffset((prev) => prev + 1);
  };

  const formattedRange = useMemo(() => {
    const parsedDates: { year: number; month: number; day: number; timestamp: number }[] = [];

    availabilities.forEach((a) => {
      if (a.date) {
        const p = parseAvailabilityDate(a.date);
        if (p) {
          parsedDates.push({
            ...p,
            timestamp: new Date(p.year, p.month, p.day).getTime(),
          });
        }
      }
    });

    parsedDates.sort((a, b) => a.timestamp - b.timestamp);

    const formatP = (p: { year: number; month: number; day: number }) =>
      `${String(p.day).padStart(2, "0")}/${String(p.month + 1).padStart(2, "0")}/${p.year}`;

    if (parsedDates.length === 1) {
      return formatP(parsedDates[0]);
    }

    if (parsedDates.length >= 2) {
      const min = parsedDates[0];
      const max = parsedDates[parsedDates.length - 1];
      return `${formatP(min)} - ${formatP(max)}`;
    }

    return "29/11/2025 - 02/12/2025";
  }, [availabilities]);

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-700 font-normal">
          {formattedRange}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Previous month"
            className="p-1 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next month"
            className="p-1 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SingleMonthCalendar year={year1} month={month1} availabilities={availabilities} />
        <SingleMonthCalendar year={year2} month={month2} availabilities={availabilities} />
      </div>

      {availabilities.length > 0 && (
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-sky-50 border border-sky-300 text-[10px] text-sky-600 font-bold">●</span>
            <span>Available Treatment Date</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 font-normal">12</span>
            <span>Unavailable Date</span>
          </div>
        </div>
      )}
    </div>
  );
}



// ── Main Page ───────────────────────────────────────────
export default function ClinicDetail({ clinic }: { clinic?: ClinicDetailsItem }) {
  const [nearbyTab, setNearbyTab] = useState<NearbyTab>("Visit");

  const nearbyTabs: { id: NearbyTab; icon: ReactNode}[] = [
    { id: "Visit", icon: <VisitIcon /> },
    { id: "Stay",  icon: <StayIcon /> },
    { id: "Eat",   icon: <EatIcon /> },
  ];
  const address =
    clinic?.address ||
    [clinic?.city, clinic?.country].filter(Boolean).join(", ") ||
    defaultAddress;

  const rawAccepted =
    clinic?.accepted_patients?.map(getAcceptedPatientName).filter(Boolean) ?? [];
  const acceptedPatients =
    rawAccepted.length > 0 ? rawAccepted : defaultAcceptedPatients;

  const rawFacilities =
    clinic?.facilities?.map(getFacilityName).filter(Boolean) ?? [];
  const facilities =
    rawFacilities.length > 0 ? rawFacilities : defaultFacilities;

  const rawPaymentMethods =
    clinic?.payment_methods?.map(getPaymentMethodName).filter(Boolean) ?? [];
  const paymentMethods =
    rawPaymentMethods.length > 0 ? rawPaymentMethods : defaultPaymentMethods;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px] gap-10">

          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">

            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{clinic?.name ?? "City Medical Center"}</h1>
                <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors shrink-0 ml-4">
                  <ShareIcon />
                  Share
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <LocationPinIcon />
                <span>{address}</span>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Expert Care */}
            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-3">Expert Care for Diverse Conditions*</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500 font-medium">Accepting:</span>
                {acceptedPatients.map((tag, index) => (
                  <div key={`${tag}-${index}`} className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1">
                    <CheckCircleIcon />
                    <span className="text-xs text-gray-600">{tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* About */}
            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-2">About the Clinic</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                {clinic?.description || defaultDescription}
              </p>
            </div>

            {/* What this clinic offers */}
            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-3">What this clinic offers</h2>
              <div className="flex items-center gap-6">
                {facilities.map((label, index) => (
                  <div key={`${label}-${index}`} className="flex items-center gap-1.5">
                    {label === "Refreshments" ? <RefreshmentIcon /> : label === "Free Transfer" ? <TransferIcon /> : <ParkingIcon />}
                    <span className="text-sm text-gray-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Available Treatment Days */}
            <div>
              <h2 className="text-xl font-medium text-gray-800 mb-1">Available Treatment Days</h2>
              <TreatmentDaysCalendar availabilities={clinic?.availabilities} />
            </div>

            <hr className="border-gray-100" />

            {/* Accepted payment method */}
            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-3">Accepted payment method</h2>
              <div className="flex items-center gap-6">
                {paymentMethods.map((label, index) => (
                  <div key={`${label}-${index}`} className="flex items-center gap-1.5">
                    {label === "Cash" ? <CashIcon /> : label === "Bank Transfers" ? <BankIcon /> : <CardIcon />}
                    <span className="text-sm text-gray-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-3">Clinic Location</h2>
              <ClinicMap
                lat={clinic?.latitude}
                lng={clinic?.longitude}
                clinicName={clinic?.name}
                address={address}
              />
            </div>

            <hr className="border-gray-100" />

            {/* What's Nearby */}
            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-4">What's Nearby the Clinic</h2>
              <div className="flex items-center gap-6">
                {nearbyTabs.map(({ id, icon }) => (
                  <button
                    key={id}
                    onClick={() => setNearbyTab(id)}
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    <div
                      className={`p-3 rounded-xl border transition-all ${
                        nearbyTab === id
                          ? "border-sky-200 bg-sky-50 text-sky-500"
                          : "border-gray-100 bg-gray-50 text-gray-400 group-hover:border-gray-200"
                      }`}
                    >
                      {icon}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        nearbyTab === id ? "text-sky-500" : "text-gray-500"
                      }`}
                    >
                      {id}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ── RIGHT STICKY COLUMN ── */}
          <div className="">
  <BookingPanel
    clinicId={clinic?.id}
    clinicName={clinic?.name}
    price={clinic?.per_treatment_price}
  />
</div>

        </div>
      </div>
    </div>
  );
}
