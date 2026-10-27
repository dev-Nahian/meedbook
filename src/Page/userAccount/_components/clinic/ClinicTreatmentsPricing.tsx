import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  Plus,
  Trash2,
  Save,
  Check,
  Clock,
  ShieldAlert,
  Loader2,
  AlertCircle,
  Pencil,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "../../../../store/authStore";
import {
  getClinicProfile,
  updateClinicTreatments,
} from "../../../../lib/clinicApi";
import { extractErrorMessage } from "../../../../lib/apiClient";

interface TreatmentItem {
  id: string;
  name: string;
  code: string;
  price: string;
  currency: string;
  duration: string;
  description: string;
  active: boolean;
}

export default function ClinicTreatmentsPricing() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const submittedClinicInfo = useAuthStore((state) => state.submittedClinicInfo);

  const regCost = submittedClinicInfo?.dialysisCost || "280";
  const regCurrency = submittedClinicInfo?.currency || "USD";
  const hasHDF = submittedClinicInfo?.dialysisType ? submittedClinicInfo.dialysisType.includes("HDF") : true;
  const isHIV = submittedClinicInfo?.acceptedPatients ? submittedClinicInfo.acceptedPatients.includes("HIV") : true;
  const isHBV = submittedClinicInfo?.acceptedPatients ? submittedClinicInfo.acceptedPatients.includes("HBV") : true;
  const isHCV = submittedClinicInfo?.acceptedPatients ? submittedClinicInfo.acceptedPatients.includes("HCV") : true;

  const [treatments, setTreatments] = useState<TreatmentItem[]>([
    {
      id: "default-1",
      name: "Standard Hemodialysis (HD)",
      code: "HD",
      price: regCost,
      currency: regCurrency,
      duration: "4 Hours",
      description: "High-flux biocompatible dialyzer with ultrapure dialysate water filtration.",
      active: true,
    },
    {
      id: "default-2",
      name: "Online Hemodiafiltration (HDF)",
      code: "HDF",
      price: (Number.parseInt(regCost, 10) || 280) + 60 + "",
      currency: regCurrency,
      duration: "4.5 Hours",
      description: "Advanced convective clearance for superior middle-molecule toxin elimination.",
      active: hasHDF,
    },
    {
      id: "default-3",
      name: "Single-Needle Dialysis",
      code: "SN-HD",
      price: (Number.parseInt(regCost, 10) || 280) + 30 + "",
      currency: regCurrency,
      duration: "4 Hours",
      description: "Specialized vascular access care for temporary or sensitive fistula access.",
      active: false,
    },
  ]);

  const [acceptedPatients, setAcceptedPatients] = useState({
    hiv: isHIV,
    hbv: isHBV,
    hcv: isHCV,
    pediatric: false,
    wheelchair: true,
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Fetch live clinic profile and treatments from backend
  const {
    data: profileData,
    isLoading: isProfileLoading,
    refetch,
  } = useQuery({
    queryKey: ["clinic-profile-treatments", accessToken],
    queryFn: () => getClinicProfile(accessToken),
    enabled: Boolean(accessToken),
  });

  // Populate state when live data arrives
  useEffect(() => {
    const clinic = profileData?.data?.clinic;
    if (clinic) {
      if (Array.isArray(clinic.treatments) && clinic.treatments.length > 0) {
        setTreatments(
          clinic.treatments.map((t: any, idx: number) => ({
            id: String(t.id || `live-${idx}`),
            name: t.treatment_name || "Dialysis",
            code:
              t.treatment_code ||
              (t.treatment_name?.toUpperCase().includes("HDF") ? "HDF" : "HD"),
            price: t.price ? String(t.price).replace(/\.00$/, "") : "0",
            currency: "USD",
            duration: t.duration || "4 Hours",
            description: t.description || "Dialysis treatment protocol.",
            active: true,
          }))
        );
      }

      const inf = clinic.accepted_infectious;
      const pts = clinic.accepted_patients;
      if (Array.isArray(inf) && inf.length > 0) {
        setAcceptedPatients((prev) => ({
          ...prev,
          hiv: inf.some((x: string) => x.toUpperCase().includes("HIV")),
          hbv: inf.some((x: string) => x.toUpperCase().includes("HBV")),
          hcv: inf.some((x: string) => x.toUpperCase().includes("HCV")),
        }));
      } else if (Array.isArray(pts) && pts.length > 0) {
        setAcceptedPatients((prev) => ({
          ...prev,
          hiv: pts.some((p: any) => (p.patient_name || p.name || "").toUpperCase().includes("HIV")),
          hbv: pts.some((p: any) => (p.patient_name || p.name || "").toUpperCase().includes("HBV")),
          hcv: pts.some((p: any) => (p.patient_name || p.name || "").toUpperCase().includes("HCV")),
        }));
      }
    }
  }, [profileData]);

  // Modal State for Add & Edit
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [treatmentForm, setTreatmentForm] = useState({
    name: "",
    code: "HD",
    price: "",
    duration: "4 Hours",
    description: "",
  });
  const [showModal, setShowModal] = useState(false);

  const handleToggleTreatment = (id: string) => {
    setTreatments(
      treatments.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    );
  };

  const handleDeleteTreatment = (id: string) => {
    setTreatments(treatments.filter((t) => t.id !== id));
  };

  const handleOpenAdd = () => {
    setModalMode("add");
    setEditingId(null);
    setTreatmentForm({
      name: "",
      code: "HD",
      price: "",
      duration: "4 Hours",
      description: "",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item: TreatmentItem) => {
    setModalMode("edit");
    setEditingId(item.id);
    setTreatmentForm({
      name: item.name,
      code: item.code,
      price: item.price,
      duration: item.duration,
      description: item.description,
    });
    setShowModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!treatmentForm.name.trim() || !treatmentForm.price.trim()) return;

    if (modalMode === "add") {
      setTreatments([
        ...treatments,
        {
          id: `new-${Date.now()}`,
          name: treatmentForm.name.trim(),
          code: treatmentForm.code.trim() || "HD",
          price: treatmentForm.price.trim(),
          currency: "USD",
          duration: treatmentForm.duration.trim() || "4 Hours",
          description: treatmentForm.description.trim() || "Specialized dialysis treatment protocol.",
          active: true,
        },
      ]);
    } else if (modalMode === "edit" && editingId) {
      setTreatments(
        treatments.map((t) =>
          t.id === editingId
            ? {
                ...t,
                name: treatmentForm.name.trim(),
                code: treatmentForm.code.trim() || "HD",
                price: treatmentForm.price.trim(),
                duration: treatmentForm.duration.trim() || "4 Hours",
                description: treatmentForm.description.trim(),
              }
            : t
        )
      );
    }

    setShowModal(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    const activeList = treatments.filter((t) => t.active);
    const toSave = activeList.length > 0 ? activeList : treatments;

    if (toSave.length === 0) {
      setSaveError("Please add or enable at least one treatment before saving.");
      setIsSaving(false);
      return;
    }

    const payloadTreatments = toSave.map((t) => ({
      treatment_name: t.name.trim(),
      treatment_code: t.code ? t.code.trim() : "HD",
      price: String(t.price).trim().replace(/^\$/, ""),
      duration: t.duration ? t.duration.trim() : "4 Hours",
      description: t.description ? t.description.trim() : "",
    }));

    const acceptedInfectious: string[] = [];
    if (acceptedPatients.hiv) acceptedInfectious.push("HIV");
    if (acceptedPatients.hbv) acceptedInfectious.push("HBV");
    if (acceptedPatients.hcv) acceptedInfectious.push("HCV");

    try {
      await updateClinicTreatments(
        {
          treatments: payloadTreatments,
          accepted_infectious: acceptedInfectious,
        },
        accessToken
      );
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 4000);
      refetch();
    } catch (err: any) {
      const msg = extractErrorMessage(
        err?.details || err?.message,
        err?.status,
        "Failed to save treatments & pricing. Please check your network and try again."
      );
      setSaveError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Treatments & Pricing</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure dialysis treatment types, pricing per session, and infectious disease isolation capacity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2.5 rounded-2xl text-xs transition cursor-pointer"
          >
            <Plus size={16} />
            Add Treatment
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-2xl shadow-xs text-xs transition cursor-pointer"
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isSaving ? "Saving..." : isSaved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {isSaved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2"
          >
            <Check size={16} className="text-emerald-600 shrink-0" />
            Treatment types, prices, and patient acceptance criteria saved successfully to your clinic profile!
          </motion.div>
        )}
        {saveError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-red-600 shrink-0" />
              <span>{saveError}</span>
            </div>
            <button
              type="button"
              onClick={() => setSaveError(null)}
              className="text-red-500 hover:text-red-700 text-sm font-bold px-1"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accepted Patient Categories & Infectious Protocols */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <ShieldAlert size={18} className="text-amber-500" />
              Accepted Patient Categories & Isolation Units
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              International kidney patients require strict serology screening. Specify which patient profiles your clinic can accommodate:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {/* HIV */}
          <div
            onClick={() =>
              setAcceptedPatients({
                ...acceptedPatients,
                hiv: !acceptedPatients.hiv,
              })
            }
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              acceptedPatients.hiv
                ? "bg-amber-50/70 border-amber-300 text-amber-950"
                : "bg-gray-50 border-gray-200 text-gray-500 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm">HIV Positive Patients</span>
              <div
                className={`w-5 h-5 rounded flex items-center justify-center ${
                  acceptedPatients.hiv ? "bg-amber-500 text-white" : "bg-gray-300"
                }`}
              >
                {acceptedPatients.hiv && <Check size={13} strokeWidth={3} />}
              </div>
            </div>
            <p className="text-xs text-gray-600">
              Dedicated isolated room & dedicated machine protocol available.
            </p>
          </div>

          {/* HBV */}
          <div
            onClick={() =>
              setAcceptedPatients({
                ...acceptedPatients,
                hbv: !acceptedPatients.hbv,
              })
            }
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              acceptedPatients.hbv
                ? "bg-amber-50/70 border-amber-300 text-amber-950"
                : "bg-gray-50 border-gray-200 text-gray-500 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm">Hepatitis B (HBV+)</span>
              <div
                className={`w-5 h-5 rounded flex items-center justify-center ${
                  acceptedPatients.hbv ? "bg-amber-500 text-white" : "bg-gray-300"
                }`}
              >
                {acceptedPatients.hbv && <Check size={13} strokeWidth={3} />}
              </div>
            </div>
            <p className="text-xs text-gray-600">
              Isolated Hepatitis B bay with dedicated staff assignment.
            </p>
          </div>

          {/* HCV */}
          <div
            onClick={() =>
              setAcceptedPatients({
                ...acceptedPatients,
                hcv: !acceptedPatients.hcv,
              })
            }
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              acceptedPatients.hcv
                ? "bg-amber-50/70 border-amber-300 text-amber-950"
                : "bg-gray-50 border-gray-200 text-gray-500 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm">Hepatitis C (HCV+)</span>
              <div
                className={`w-5 h-5 rounded flex items-center justify-center ${
                  acceptedPatients.hcv ? "bg-amber-500 text-white" : "bg-gray-300"
                }`}
              >
                {acceptedPatients.hcv && <Check size={13} strokeWidth={3} />}
              </div>
            </div>
            <p className="text-xs text-gray-600">
              Equipped with dedicated HCV machines and biohazard protocols.
            </p>
          </div>
        </div>
      </div>

      {/* Treatment List & Pricing Cards */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <Stethoscope size={18} className="text-sky-500" />
            Offered Dialysis Treatments & Pricing
          </h3>
          {isProfileLoading && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Loader2 size={13} className="animate-spin" />
              <span>Loading saved options...</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {treatments.map((treatment) => (
            <div
              key={treatment.id}
              className={`p-5 rounded-2xl border transition-all ${
                treatment.active
                  ? "bg-white border-gray-200 shadow-2xs hover:border-sky-300"
                  : "bg-gray-50/80 border-gray-200 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-700">
                      {treatment.code}
                    </span>
                    <h4 className="font-bold text-gray-900 text-sm">{treatment.name}</h4>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1.5">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-gray-400" />
                      {treatment.duration}
                    </span>
                    <span>•</span>
                    <span className="font-bold text-emerald-600 text-sm">
                      ${treatment.price} {treatment.currency} / session
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleTreatment(treatment.id)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      treatment.active
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    {treatment.active ? "Active" : "Disabled"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(treatment)}
                    className="p-1.5 text-gray-400 hover:text-sky-600 rounded-lg transition cursor-pointer"
                    title="Edit treatment"
                    aria-label="Edit treatment"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTreatment(treatment.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition cursor-pointer"
                    title="Delete treatment"
                    aria-label="Delete treatment"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-2.5 rounded-xl">
                {treatment.description || "Specialized dialysis treatment protocol."}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Treatment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4"
          >
            <h3 className="font-bold text-gray-900 text-base">
              {modalMode === "add" ? "Add New Treatment Option" : "Edit Treatment Option"}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Treatment Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nocturnal Hemodialysis"
                  value={treatmentForm.name}
                  onChange={(e) =>
                    setTreatmentForm({ ...treatmentForm, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-sky-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Treatment Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. N-HD"
                    value={treatmentForm.code}
                    onChange={(e) =>
                      setTreatmentForm({ ...treatmentForm, code: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-sky-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="350"
                    value={treatmentForm.price}
                    onChange={(e) =>
                      setTreatmentForm({ ...treatmentForm, price: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-sky-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4 Hours"
                  value={treatmentForm.duration}
                  onChange={(e) =>
                    setTreatmentForm({ ...treatmentForm, duration: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Details about equipment, water purity, and protocol..."
                  value={treatmentForm.description}
                  onChange={(e) =>
                    setTreatmentForm({ ...treatmentForm, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-sky-400 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-xs cursor-pointer"
                >
                  {modalMode === "add" ? "Add Treatment" : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
