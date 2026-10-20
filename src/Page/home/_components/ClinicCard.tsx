import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getClinics, type ClinicListItem } from "../../../lib/clinicApi";

type Treatment = {
  name: string;
  price: string;
};

type Clinic = {
  id: number;
  name: string;
  image: string;
  rating: number;
  location: string;
  distance: string;
  badges: string[];
  amenities: string[];
  treatments: Treatment[];
};

const fallbackImage =
  "https://images.unsplash.com/photo-1587351021355-a479a299d2f9?w=600&q=80";

const defaultClinics: Clinic[] = [
  {
    id: 1,
    name: "City Medical Center",
    image: "https://images.unsplash.com/photo-1587351021355-a479a299d2f9?w=600&q=80",
    rating: 4.9,
    location: "Marsala, Italy",
    distance: "0.69 km from the city center",
    badges: ["EHIC", "GHIC"],
    amenities: ["Refreshments", "Free Transfer", "Free Parking"],
    treatments: [
      { name: "Dialysis HD", price: "$250" },
      { name: "Dialysis HDF", price: "$250" },
    ],
  },
  {
    id: 2,
    name: "City Medical Center",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80",
    rating: 4.9,
    location: "Marsala, Italy",
    distance: "0.69 km from the city center",
    badges: ["EHIC", "GHIC"],
    amenities: ["Refreshments", "Free Transfer", "Free Parking"],
    treatments: [
      { name: "Dialysis HD", price: "$250" },
      { name: "Dialysis HDF", price: "$250" },
    ],
  },
  {
    id: 3,
    name: "City Medical Center",
    image: "https://images.unsplash.com/photo-1626315869436-d6781ba69d6e?w=600&q=80",
    rating: 4.9,
    location: "Marsala, Italy",
    distance: "0.69 km from the city center",
    badges: ["EHIC", "GHIC"],
    amenities: ["Refreshments", "Free Transfer", "Free Parking"],
    treatments: [
      { name: "Dialysis HD", price: "$250" },
      { name: "Dialysis HDF", price: "$250" },
    ],
  },
];

const normalizeTreatmentName = (rawName: string): string => {
  const lower = rawName.toLowerCase().trim();
  if (lower === "hdf" || lower.includes("hdf") || lower.includes("hemodiafiltration")) {
    return "Dialysis HDF";
  }
  if (lower === "hd" || lower.includes("hd") || lower.includes("hemodialysis") || lower.includes("dialysis")) {
    return "Dialysis HD";
  }
  return rawName || "Dialysis HD";
};

const getTreatmentName = (treatment: ClinicListItem["treatments"][number]) => {
  const raw = treatment.name ?? treatment.treatment_name ?? treatment.title ?? "Treatment";
  return normalizeTreatmentName(raw);
};

const getTreatmentPrice = (treatment: ClinicListItem["treatments"][number]) => {
  const rawPrice = treatment.price ?? treatment.amount ?? "";
  if (!rawPrice) return "";
  const trimmed = String(rawPrice).trim();
  return /^\d/.test(trimmed) ? `$${trimmed}` : trimmed;
};

const getFacilityName = (facility: ClinicListItem["facilities"][number]) =>
  facility.name ?? facility.facility_name ?? facility.title ?? "";

const getRating = (clinic: ClinicListItem) => {
  const rating =
    clinic.average_rating ?? Number.parseFloat(clinic.ratings[0]?.rating ?? "0");

  return Number.isFinite(rating) ? rating : 0;
};

const mapClinic = (clinic: ClinicListItem): Clinic => ({
  id: clinic.id,
  name: clinic.name,
  image: clinic.images?.[0]?.image_url ?? clinic.images?.[0]?.image ?? fallbackImage,
  rating: getRating(clinic),
  location: [clinic.city, clinic.country].filter(Boolean).join(", ") || "Singapore",
  distance: clinic.distance_from_city_center || "0.69 km from the city center",
  badges: clinic.insurances && clinic.insurances.length > 0
    ? clinic.insurances.map((insurance) => insurance.insurance_name)
    : ["EHIC", "GHIC"],
  amenities: clinic.facilities && clinic.facilities.length > 0
    ? clinic.facilities.map(getFacilityName).filter(Boolean)
    : ["Refreshments", "Free Transfer", "Free Parking"],
  treatments: clinic.treatments && clinic.treatments.length > 0
    ? clinic.treatments.map((treatment) => ({
        name: getTreatmentName(treatment),
        price: getTreatmentPrice(treatment),
      }))
    : [
        { name: "Dialysis HD", price: "$250" },
        { name: "Dialysis HDF", price: "$250" },
      ],
});

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex bg-amber-100/50 p-1.5 rounded-lg items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          viewBox="0 0 20 20"
          fill={star <= Math.floor(rating) ? "#FBBF24" : star - 0.5 <= rating ? "#FBBF24" : "#D1D5DB"}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm font-semibold text-gray-700 ml-1">{rating}</span>
    </div>
  );
}

function LocationIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-green-300 shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

function AmenityIcon({ type }: { type: string }) {
  if (type === "Refreshments") return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
  if (type === "Free Transfer") return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  );
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  );
}

function ClinicCard({ clinic }: { clinic: Clinic }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/clinic-details/${clinic.id}`)}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col w-full hover:shadow-md hover:border-sky-200 transition-all cursor-pointer group"
    >
      {/* Image */}
      <div
        className="w-full h-82.5 overflow-hidden rounded-xl m-3 block"
        style={{ width: "calc(100% - 24px)" }}
      >
        <img
          src={clinic.image}
          alt={clinic.name}
          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="px-5 pb-5 flex flex-col gap-3 flex-1">
        {/* Name + Rating */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-primary group-hover:text-sky-500 transition-colors">
            {clinic.name}
          </h3>
          <StarRating rating={clinic.rating} />
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <LocationIcon />
          <span>{clinic.location}</span>
          <span className="text-gray-300 mx-1">|</span>
          <span>{clinic.distance}</span>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-3">
          {clinic.badges.map((badge, idx) => (
            <div key={`${badge}-${idx}`} className="flex items-center gap-1">
              <div className="text-green-200">
                <CheckIcon />
              </div>
              <span className="text-sm text-cyan-500 font-medium">{badge}</span>
            </div>
          ))}
        </div>

        {/* Amenities */}
        <div className="flex items-center gap-4">
          {clinic.amenities.map((amenity, idx) => (
            <div key={`${amenity}-${idx}`} className="flex items-center gap-1">
              <AmenityIcon type={amenity} />
              <span className="text-xs text-gray-500">{amenity}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mt-1" />

        {/* Pricing + Button */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1">Per treatment</p>
            {clinic.treatments.map((t, idx) => (
              <p key={`${t.name}-${idx}`} className="text-sm font-normal text-gray-500">
                {t.name}{" "}
                <span className="font-normal text-gray-500">{t.price}</span>
              </p>
            ))}
          </div>
          <Link
            to={`/clinic-details/${clinic.id}`}
            onClick={(e) => e.stopPropagation()}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90 active:scale-95 inline-flex items-center justify-center text-center cursor-pointer"
            style={{ background: "linear-gradient(135deg, #38bdf8, #0ea5e9)" }}
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedClinics() {
  const { data } = useQuery({
    queryKey: ["clinics"],
    queryFn: () => getClinics(),
  });

  const clinicsList = useMemo(() => {
    if (data?.clinics && data.clinics.length > 0) {
      return data.clinics.slice(0, 3).map(mapClinic);
    }
    return defaultClinics;
  }, [data?.clinics]);

  return (
    <section className="w-full bg-white py-10 sm:py-14 lg:py-16 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-10 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-primary">
          Featured Clinics
        </h2>
        <p className="text-gray-400 text-sm sm:text-base">
          Trusted and certified dialysis centers available for booking
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">
        {clinicsList.map((clinic) => (
          <ClinicCard key={clinic.id} clinic={clinic} />
        ))}
      </div>
    </section>
  );
}