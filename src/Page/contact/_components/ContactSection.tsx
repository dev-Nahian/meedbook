import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import ContactMap from "./ContactMap";
import {
  ContactApiError,
  submitContactMessage,
  type ContactSubmitPayload,
} from "../../../lib/contactApi";

// ─── Query Types ──────────────────────────────────────────────────────────────
const queryTypes = [
  "General Inquiry",
  "Book an Appointment",
  "List My Clinic",
  "Technical Support",
  "Billing & Payments",
  "Partnership",
  "Other",
];

const queryTypeValues: Record<string, string> = {
  "General Inquiry": "general_inquiry",
  "Book an Appointment": "book_an_appointment",
  "List My Clinic": "list_my_clinic",
  "Technical Support": "technical_support",
  "Billing & Payments": "billing_payments",
  Partnership: "partnership",
  Other: "other",
};

// ─── Social Icons ─────────────────────────────────────────────────────────────
const socials = [
  {
    label: "Facebook",
    color: "#1877F2",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    color: "#FF0000",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    color: "#0A66C2",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    color: "#1DA1F2",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    color: "#E1306C",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
];

// ─── Select Dropdown ──────────────────────────────────────────────────────────
function SelectDropdown({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm transition-all duration-200 focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/10"
      >
        <span className={value ? "text-gray-700" : "text-gray-300"}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden py-2"
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-sky-50 transition-colors flex items-center justify-between ${
                  value === opt ? "text-sky-600 bg-sky-50" : "text-gray-700"
                }`}
              >
                {opt}
                {value === opt && <Check size={14} className="text-sky-500" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Checkbox ─────────────────────────────────────────────────────────────────
function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all duration-200 ${
          checked ? "bg-[#38bdf8] border-[#38bdf8]" : "border-gray-300 bg-white group-hover:border-[#38bdf8]"
        }`}
      >
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Check size={11} className="text-white" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className="text-sm text-gray-500 leading-relaxed">{label}</span>
    </label>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ContactSection() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    queryType: "",
    message: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const contactMutation = useMutation({
    mutationFn: (payload: ContactSubmitPayload) => submitContactMessage(payload),
    onSuccess: (response) => {
      setToast({
        type: "success",
        message: response.message || "Message sent successfully!",
      });
      setForm({
        fullName: "",
        email: "",
        queryType: "",
        message: "",
      });
      setAgreed(false);
    },
    onError: (error) => {
      setToast({
        type: "error",
        message:
          error instanceof ContactApiError
            ? error.message
            : "Unable to send your message. Please try again.",
      });
    },
  });

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName.trim() || !form.email.trim() || !form.queryType || !form.message.trim()) {
      setToast({ type: "error", message: "Please complete all fields before submitting." });
      return;
    }

    if (!agreed) {
      setToast({ type: "error", message: "Please agree to the privacy policy first." });
      return;
    }

    const payload: ContactSubmitPayload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      queryType: queryTypeValues[form.queryType] ?? form.queryType,
      message: form.message.trim(),
      isAgree: agreed,
    };

    contactMutation.mutate(payload);
  };

  return (
    <section
      className="w-full bg-white py-16 px-4 sm:px-6"
      style={{ fontFamily: "'Nunito Sans', 'Segoe UI', sans-serif" }}
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={`fixed right-5 top-28 z-[70] max-w-sm rounded-2xl border px-5 py-4 text-sm font-medium shadow-2xl ${
              toast.type === "success"
                ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                : "border-red-100 bg-red-50 text-red-700"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto">

        {/* ── HEADER ── */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            className="text-4xl font-bold mb-3"
            style={{ color: "#38bdf8", fontFamily: "'Raleway', 'Nunito Sans', sans-serif" }}
          >
            How to reach us
          </h2>
          <p className="text-gray-400 text-sm">
            We're Here to Help—Find the Best Way to Connect
          </p>
        </motion.div>

        {/* ── INFO ROW ── */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12 pb-8 border-b border-gray-100"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Address */}
          <div>
            <h3 className="text-base font-bold text-gray-800 mb-3">Address</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Level 5, 221 Business Tower, Sheikh<br />
              Zayed Road, Dubai ,UAE
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-bold text-gray-800 mb-3">Contact</h3>
            <p className="text-sm text-gray-500 mb-1">
              Email:{" "}
              <a href="mailto:info@demo.com" className="hover:text-[#38bdf8] transition-colors">
                info@demo.com
              </a>
            </p>
            <p className="text-sm text-gray-500">
              Phone:{" "}
              <a href="tel:+0001234567890" className="hover:text-[#38bdf8] transition-colors">
                +000 123 456 7890
              </a>
            </p>
          </div>

          {/* Connect with us */}
          <div>
            <h3 className="text-base font-bold text-gray-800 mb-3">Connect with us</h3>
            <p className="text-sm text-gray-500 mb-4">
              Looking to Reach More Patients? Partner With Us Today!
            </p>
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                  style={{ backgroundColor: s.color, color: "white" }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── MAP + FORM ── */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* LEFT — Map */}
          <motion.div
            className="flex-1 rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
            style={{ minHeight: 460 }}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <ContactMap lat={25.2048} lng={55.2708} zoom={13} />
          </motion.div>

          {/* RIGHT — Form */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm px-7 py-8 flex flex-col gap-5 h-full"
            >
              <h3
                className="text-xl font-semibold text-gray-800 text-center mb-1"
                style={{ fontFamily: "'Raleway', 'Nunito Sans', sans-serif" }}
              >
                Have questions? We're ready to help
              </h3>

              {/* Full Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Full Name</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={set("fullName")}
                    required
                    placeholder="David John"
                    className="px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-300 outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/10 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    required
                    placeholder="email@example.com"
                    className="px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-300 outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/10 transition-all"
                  />
                </div>
              </div>

              {/* Query Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Query Type</label>
                <SelectDropdown
                  value={form.queryType}
                  onChange={(v) => setForm((p) => ({ ...p, queryType: v }))}
                  options={queryTypes}
                  placeholder="Select query type..."
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs font-semibold text-gray-600">Message</label>
                <textarea
                  value={form.message}
                  onChange={set("message")}
                  required
                  placeholder="Write your message..."
                  rows={5}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-300 outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/10 transition-all resize-none"
                />
              </div>

              {/* Privacy checkbox */}
              <Checkbox
                checked={agreed}
                onChange={setAgreed}
                label={
                  <>
                    By submitting your information, you agree to the use and processing
                    of your personal data in accordance with our{" "}
                    <a href="#" className="text-[#38bdf8] hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </>
                }
              />

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={contactMutation.isPending}
                whileHover={{ opacity: 0.92 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl text-white font-semibold text-sm transition-all disabled:cursor-not-allowed disabled:opacity-70"
                style={{ background: "linear-gradient(90deg, #38bdf8 0%, #22d3ee 100%)" }}
              >
                {contactMutation.isPending ? "Sending..." : "Submit"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
