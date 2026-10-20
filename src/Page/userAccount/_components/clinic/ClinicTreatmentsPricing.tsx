import React, { useState } from "react";
import {
  Stethoscope,
  Plus,
  Trash2,
  Save,
  Check,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuthStore } from "../../../../store/authStore";

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
  const submittedClinicInfo = useAuthStore((state) => state.submittedClinicInfo);

  const regCost = submittedClinicInfo?.dialysisCost || "280";
  const regCurrency = submittedClinicInfo?.currency || "USD";
  const hasHDF = submittedClinicInfo?.dialysisType ? submittedClinicInfo.dialysisType.includes("HDF") : true;
  const isHIV = submittedClinicInfo?.acceptedPatients ? submittedClinicInfo.acceptedPatients.includes("HIV") : true;
  const isHBV = submittedClinicInfo?.acceptedPatients ? submittedClinicInfo.acceptedPatients.includes("HBV") : true;
  const isHCV = submittedClinicInfo?.acceptedPatients ? submittedClinicInfo.acceptedPatients.includes("HCV") : true;

  const [treatments, setTreatments] = useState<TreatmentItem[]>([
    {
      id: "1",
      name: "Standard Hemodialysis (HD)",
      code: "HD",
      price: regCost,
      currency: regCurrency,
      duration: "4 Hours",
      description: "High-flux biocompatible dialyzer with ultrapure dialysate water filtration.",
      active: true,
    },
    {
      id: "2",
      name: "Online Hemodiafiltration (HDF)",
      code: "HDF",
      price: (Number.parseInt(regCost) + 60).toString(),
      currency: regCurrency,
      duration: "4.5 Hours",
      description: "Advanced convective clearance for superior middle-molecule toxin elimination.",
      active: hasHDF,
    },
    {
      id: "3",
      name: "Single-Needle Dialysis",
      code: "SN-HD",
      price: (Number.parseInt(regCost) + 30).toString(),
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

  React.useEffect(() => {
    if (submittedClinicInfo) {
      const cost = submittedClinicInfo.dialysisCost || "280";
      const curr = submittedClinicInfo.currency || "USD";
      setTreatments((prev) =>
        prev.map((t) =>
          t.id === "1" ? { ...t, price: cost, currency: curr } : t
        )
      );
      if (submittedClinicInfo.acceptedPatients) {
        setAcceptedPatients((prev) => ({
          ...prev,
          hiv: submittedClinicInfo.acceptedPatients?.includes("HIV") ?? prev.hiv,
          hbv: submittedClinicInfo.acceptedPatients?.includes("HBV") ?? prev.hbv,
          hcv: submittedClinicInfo.acceptedPatients?.includes("HCV") ?? prev.hcv,
        }));
      }
    }
  }, [submittedClinicInfo]);

  const [isSaved, setIsSaved] = useState(false);

  const [newTreatment, setNewTreatment] = useState({
    name: "",
    code: "HD",
    price: "",
    duration: "4 Hours",
    description: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);

  const handleToggleTreatment = (id: string) => {
    setTreatments(
      treatments.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    );
  };

  const handleDeleteTreatment = (id: string) => {
    setTreatments(treatments.filter((t) => t.id !== id));
  };

  const handleAddTreatment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTreatment.name || !newTreatment.price) return;

    setTreatments([
      ...treatments,
      {
        id: Date.now().toString(),
        name: newTreatment.name,
        code: newTreatment.code,
        price: newTreatment.price,
        currency: "USD",
        duration: newTreatment.duration,
        description: newTreatment.description || "Specialized dialysis treatment protocol.",
        active: true,
      },
    ]);

    setNewTreatment({
      name: "",
      code: "HD",
      price: "",
      duration: "4 Hours",
      description: "",
    });
    setShowAddModal(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
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
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2.5 rounded-2xl text-xs transition cursor-pointer"
          >
            <Plus size={16} />
            Add Treatment
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2.5 rounded-2xl shadow-xs text-xs transition cursor-pointer"
          >
            <Save size={16} />
            {isSaved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isSaved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2"
          >
            <Check size={16} className="text-emerald-600" />
            Treatment types, prices, and patient acceptance criteria saved!
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
        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <Stethoscope size={18} className="text-sky-500" />
          Offered Dialysis Treatments & Pricing
        </h3>

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
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition ${
                      treatment.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {treatment.active ? "Active" : "Disabled"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTreatment(treatment.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition"
                    aria-label="Delete treatment"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-2.5 rounded-xl">
                {treatment.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Treatment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4"
          >
            <h3 className="font-bold text-gray-900 text-base">Add New Treatment Option</h3>

            <form onSubmit={handleAddTreatment} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Treatment Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nocturnal Hemodialysis"
                  value={newTreatment.name}
                  onChange={(e) =>
                    setNewTreatment({ ...newTreatment, name: e.target.value })
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
                    value={newTreatment.code}
                    onChange={(e) =>
                      setNewTreatment({ ...newTreatment, code: e.target.value })
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
                    placeholder="350"
                    value={newTreatment.price}
                    onChange={(e) =>
                      setNewTreatment({ ...newTreatment, price: e.target.value })
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
                  placeholder="e.g. 6-8 Hours"
                  value={newTreatment.duration}
                  onChange={(e) =>
                    setNewTreatment({ ...newTreatment, duration: e.target.value })
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
                  value={newTreatment.description}
                  onChange={(e) =>
                    setNewTreatment({ ...newTreatment, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-sky-400 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-xs"
                >
                  Add Treatment
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
