import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getFaqs, type FaqItem } from "../../lib/cmsApi";

const defaultFaqs: FaqItem[] = [
  {
    id: 1,
    question: "What if I need urgent assistance?",
    answer:
      "If you need urgent assistance, please call our 24/7 emergency hotline immediately. Our team is always ready to help you get the care you need as quickly as possible.",
  },
  {
    id: 2,
    question: "How does the booking process work?",
    answer:
      "Simply search for your destination, choose a clinic, select a date and time, and complete your booking online. You will receive an instant confirmation email.",
  },
  {
    id: 3,
    question: "Are the clinics verified?",
    answer:
      "Yes. All clinics listed on our platform go through a verification process to ensure they meet safety, quality, and certification standards.",
  },
  {
    id: 4,
    question: "Can I book a dialysis session while traveling abroad?",
    answer:
      "Absolutely. Our platform helps you find and reserve dialysis treatments in multiple countries—perfect for business trips, vacations, or family travel.",
  },
  {
    id: 5,
    question: "Which payment methods do you support?",
    answer:
      "We support secure online payments via Stripe, PayPal, and major credit/debit cards.",
  },
  {
    id: 6,
    question: "Can I cancel or modify my appointment?",
    answer:
      "Cancellation and modification policies depend on the clinic. Please check the clinic's rules before booking.",
  },
];

export default function FAQSection() {
  const { data: apiFaqs } = useQuery({
    queryKey: ["faqs"],
    queryFn: getFaqs,
    staleTime: 1000 * 60 * 10,
  });

  const faqs = apiFaqs && apiFaqs.length > 0 ? apiFaqs : defaultFaqs;
  const [openIds, setOpenIds] = useState<number[]>([2, 3, 4, 5, 6]);

  const toggle = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <section className="w-full bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

        {/* LEFT — Label + Title */}
        <div className="w-full lg:w-84 shrink-0 pt-2 lg:sticky lg:top-24">
          <div
            className="inline-block px-4 py-1 rounded-full text-xs font-semibold mb-4"
            style={{
              border: "1.5px solid #4fc3f7",
              color: "#4fc3f7",
              letterSpacing: "0.05em",
            }}
          >
            FAQ
          </div>

          <h2
            className="text-3xl md:text-3xl font-extrabold leading-tight"
            style={{
              color: "#4fc3f7",
              lineHeight: 1.25,
            }}
          >
            Most Asked
            Questions
          </h2>
        </div>

        {/* RIGHT — Accordion */}
        <div className="flex-1 flex flex-col gap-4 w-full">
          {faqs.map((faq, index) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="rounded-2xl overflow-hidden cursor-pointer gradientfaq w-full"
                onClick={() => toggle(faq.id)}
              >
                {/* Question Row */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#1a2e3b" }}
                  >
                    {faq.question}
                  </span>

                  <motion.div
                    animate={{ rotate: isOpen ? 0 : 90 }}
                    className="shrink-0 ml-4"
                    style={{ color: "#4a6070" }}
                  >
                    {isOpen ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a6070" strokeWidth="2" strokeLinecap="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a6070" strokeWidth="2" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    )}
                  </motion.div>
                </div>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{ overflow: "hidden" }}
                    >
                      <p
                        className="px-4 sm:px-6 pb-5 sm:pb-6 text-sm leading-relaxed"
                        style={{ color: "#5a7080", lineHeight: 1.75 }}
                      >
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}