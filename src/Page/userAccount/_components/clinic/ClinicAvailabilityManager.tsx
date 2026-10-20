import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
  Save,
  Check,
  Ban,
  Sun,
  Sunset,
  Moon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuthStore } from "../../../../store/authStore";

interface BlockedDate {
  id: string;
  date: string;
  reason: string;
}

export default function ClinicAvailabilityManager() {
  const submittedClinicInfo = useAuthStore((state) => state.submittedClinicInfo);

  const bedNum = Number.parseInt(submittedClinicInfo?.bedCount || "12", 10) || 12;
  const shiftCap = Math.max(2, Math.floor(bedNum / 2));

  const hasMorning = submittedClinicInfo?.availableShifts ? submittedClinicInfo.availableShifts.includes("morning") : true;
  const hasAfternoon = submittedClinicInfo?.availableShifts ? submittedClinicInfo.availableShifts.includes("afternoon") : true;
  const hasEvening = submittedClinicInfo?.availableShifts ? submittedClinicInfo.availableShifts.includes("evening") : true;

  const [shifts, setShifts] = useState({
    morning: {
      enabled: hasMorning,
      startTime: "08:00",
      endTime: "12:00",
      capacity: shiftCap,
    },
    afternoon: {
      enabled: hasAfternoon,
      startTime: "13:00",
      endTime: "17:00",
      capacity: shiftCap,
    },
    evening: {
      enabled: hasEvening,
      startTime: "18:00",
      endTime: "22:00",
      capacity: Math.max(2, bedNum - shiftCap),
    },
  });

  const [operatingDays, setOperatingDays] = useState<{ [key: string]: boolean }>({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: true,
    Sunday: false,
  });

  React.useEffect(() => {
    if (submittedClinicInfo?.bedCount) {
      const bCount = Number.parseInt(submittedClinicInfo.bedCount, 10) || 12;
      const sCap = Math.max(2, Math.floor(bCount / 2));
      setShifts((prev) => ({
        ...prev,
        morning: { ...prev.morning, capacity: sCap },
        afternoon: { ...prev.afternoon, capacity: sCap },
        evening: { ...prev.evening, capacity: Math.max(2, bCount - sCap) },
      }));
    }
  }, [submittedClinicInfo]);

  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([
    {
      id: "1",
      date: "2026-12-25",
      reason: "Christmas Public Holiday",
    },
    {
      id: "2",
      date: "2026-10-15",
      reason: "Quarterly Water Purification Loop Sterilization & Maintenance",
    },
  ]);

  const [newBlockedDate, setNewBlockedDate] = useState({
    date: "",
    reason: "",
  });

  const [isSaved, setIsSaved] = useState(false);

  const toggleDay = (day: string) => {
    setOperatingDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const handleAddBlockedDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedDate.date) return;

    setBlockedDates([
      ...blockedDates,
      {
        id: Date.now().toString(),
        date: newBlockedDate.date,
        reason: newBlockedDate.reason || "Clinic Maintenance / Closed",
      },
    ]);

    setNewBlockedDate({ date: "", reason: "" });
  };

  const handleRemoveBlockedDate = (id: string) => {
    setBlockedDates(blockedDates.filter((b) => b.id !== id));
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
          <h2 className="text-xl font-bold text-gray-900">Availability & Shift Capacities</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Set dialysis station quotas per shift, working days, and block maintenance dates
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2.5 rounded-2xl shadow-xs text-xs transition cursor-pointer"
        >
          <Save size={16} />
          {isSaved ? "Saved Successfully!" : "Save Changes"}
        </button>
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
            Operating hours, shift capacities, and blocked dates saved successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Operating Days of the Week */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-xs space-y-4">
        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <CalendarIcon size={18} className="text-sky-500" />
          Weekly Operational Schedule
        </h3>
        <p className="text-xs text-gray-500">
          Toggle the days of the week your clinic accepts patient treatment appointments:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-2">
          {Object.entries(operatingDays).map(([day, enabled]) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                enabled
                  ? "bg-sky-50 border-sky-300 text-sky-900 shadow-2xs"
                  : "bg-gray-50 border-gray-200 text-gray-400"
              }`}
            >
              <span className="block font-bold text-xs">{day.slice(0, 3)}</span>
              <span className="block text-[11px] mt-1 text-gray-500">{day}</span>
              <span
                className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                  enabled
                    ? "bg-sky-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {enabled ? "Open" : "Closed"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Shift Time & Capacity Configuration */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-xs space-y-5">
        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <Clock size={18} className="text-sky-500" />
          Shift Timings & Dialysis Bed Capacities
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Morning Shift */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              shifts.morning.enabled
                ? "bg-sky-50/40 border-sky-200"
                : "bg-gray-50 border-gray-200 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sun className="text-amber-500" size={18} />
                <span className="font-bold text-sm text-gray-900">Morning Shift</span>
              </div>
              <input
                type="checkbox"
                checked={shifts.morning.enabled}
                onChange={(e) =>
                  setShifts({
                    ...shifts,
                    morning: { ...shifts.morning, enabled: e.target.checked },
                  })
                }
                className="w-4 h-4 text-sky-600 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-500 block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={shifts.morning.startTime}
                    onChange={(e) =>
                      setShifts({
                        ...shifts,
                        morning: { ...shifts.morning, startTime: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">End Time</label>
                  <input
                    type="time"
                    value={shifts.morning.endTime}
                    onChange={(e) =>
                      setShifts({
                        ...shifts,
                        morning: { ...shifts.morning, endTime: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-500 block mb-1">
                  Bed / Station Capacity Limit
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={shifts.morning.capacity}
                  onChange={(e) =>
                    setShifts({
                      ...shifts,
                      morning: { ...shifts.morning, capacity: Number(e.target.value) },
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Afternoon Shift */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              shifts.afternoon.enabled
                ? "bg-indigo-50/40 border-indigo-200"
                : "bg-gray-50 border-gray-200 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sunset className="text-indigo-500" size={18} />
                <span className="font-bold text-sm text-gray-900">Afternoon Shift</span>
              </div>
              <input
                type="checkbox"
                checked={shifts.afternoon.enabled}
                onChange={(e) =>
                  setShifts({
                    ...shifts,
                    afternoon: { ...shifts.afternoon, enabled: e.target.checked },
                  })
                }
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-500 block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={shifts.afternoon.startTime}
                    onChange={(e) =>
                      setShifts({
                        ...shifts,
                        afternoon: { ...shifts.afternoon, startTime: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">End Time</label>
                  <input
                    type="time"
                    value={shifts.afternoon.endTime}
                    onChange={(e) =>
                      setShifts({
                        ...shifts,
                        afternoon: { ...shifts.afternoon, endTime: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-500 block mb-1">
                  Bed / Station Capacity Limit
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={shifts.afternoon.capacity}
                  onChange={(e) =>
                    setShifts({
                      ...shifts,
                      afternoon: { ...shifts.afternoon, capacity: Number(e.target.value) },
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Evening Shift */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              shifts.evening.enabled
                ? "bg-purple-50/40 border-purple-200"
                : "bg-gray-50 border-gray-200 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Moon className="text-purple-500" size={18} />
                <span className="font-bold text-sm text-gray-900">Evening Shift</span>
              </div>
              <input
                type="checkbox"
                checked={shifts.evening.enabled}
                onChange={(e) =>
                  setShifts({
                    ...shifts,
                    evening: { ...shifts.evening, enabled: e.target.checked },
                  })
                }
                className="w-4 h-4 text-purple-600 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-500 block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={shifts.evening.startTime}
                    onChange={(e) =>
                      setShifts({
                        ...shifts,
                        evening: { ...shifts.evening, startTime: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">End Time</label>
                  <input
                    type="time"
                    value={shifts.evening.endTime}
                    onChange={(e) =>
                      setShifts({
                        ...shifts,
                        evening: { ...shifts.evening, endTime: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-500 block mb-1">
                  Bed / Station Capacity Limit
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={shifts.evening.capacity}
                  onChange={(e) =>
                    setShifts({
                      ...shifts,
                      evening: { ...shifts.evening, capacity: Number(e.target.value) },
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blocked Dates / Maintenance Scheduler */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-xs space-y-4">
        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <Ban size={18} className="text-red-500" />
          Blackout & Maintenance Dates
        </h3>
        <p className="text-xs text-gray-500">
          Add dates where your clinic is unavailable for booking (e.g. holidays, water testing):
        </p>

        {/* Add Blocked Date Form */}
        <form
          onSubmit={handleAddBlockedDate}
          className="flex flex-col sm:flex-row items-center gap-3 bg-gray-50/70 p-4 rounded-2xl border border-gray-200"
        >
          <div className="w-full sm:w-auto flex-1">
            <input
              type="date"
              value={newBlockedDate.date}
              onChange={(e) =>
                setNewBlockedDate({ ...newBlockedDate, date: e.target.value })
              }
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-sky-400"
              required
            />
          </div>

          <div className="w-full sm:w-auto flex-2">
            <input
              type="text"
              placeholder="Reason (e.g. Disinfection, Holiday)"
              value={newBlockedDate.reason}
              onChange={(e) =>
                setNewBlockedDate({ ...newBlockedDate, reason: e.target.value })
              }
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-sky-400"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Plus size={15} />
            Block Date
          </button>
        </form>

        {/* Blocked Dates List */}
        <div className="space-y-2 pt-2">
          {blockedDates.length > 0 ? (
            blockedDates.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between bg-red-50/50 border border-red-200/70 rounded-xl p-3 text-xs"
              >
                <div className="flex items-center gap-2.5 text-gray-800">
                  <span className="font-bold text-red-600 px-2.5 py-0.5 rounded-md bg-red-100">
                    {b.date}
                  </span>
                  <span className="text-gray-700">{b.reason}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveBlockedDate(b.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition"
                  aria-label="Remove blocked date"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 italic">No blackout dates added.</p>
          )}
        </div>
      </div>
    </div>
  );
}
