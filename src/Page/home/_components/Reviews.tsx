import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getHappyPatients } from "../../../lib/cmsApi";

interface Review {
  id: number;
  name: string;
  location: string;
  avatar: string;
  text: string;
  rating: number;
}

const defaultReviews: Review[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    location: "New York, USA",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "I recently had to bring my child to ProHealth for a minor injury, and I was so impressed with the care he received. The pediatrician was great with him and made him feel at ease, and the entire staff was kind and attentive.",
    rating: 5,
  },
  {
    id: 2,
    name: "Paulo Hubert",
    location: "New York, USA",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "I recently had to bring my child to ProHealth for a minor injury, and I was so impressed with the care he received. The pediatrician was great with him and made him feel at ease, and the entire staff was kind and attentive.",
    rating: 5,
  },
  {
    id: 3,
    name: "James Caldwell",
    location: "New York, USA",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "Exceptional service from start to finish. The team at ProHealth made my visit stress-free and the follow-up care was outstanding. I highly recommend their services to anyone looking for quality healthcare.",
    rating: 4,
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-1 mt-6">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        width="22"
        height="22"
        viewBox="0 0 20 20"
        fill={star <= rating ? "#f5a623" : "#e0e0e0"}
      >
        <path d="M10 1l2.39 4.84 5.34.78-3.86 3.76.91 5.32L10 13.27l-4.78 2.51.91-5.32L2.27 6.62l5.34-.78z" />
      </svg>
    ))}
  </div>
);

export default function Reviews() {
  const { data: happyPatients } = useQuery({
    queryKey: ["happy-patients"],
    queryFn: getHappyPatients,
  });

  const reviews: Review[] =
    happyPatients && happyPatients.length > 0
      ? happyPatients.map((p, idx) => ({
          id: p.id ?? idx + 1,
          name: p.name || p.full_name || p.patient_name || "Happy Patient",
          location: p.location || [p.city, p.country].filter(Boolean).join(", ") || "Verified Patient",
          avatar: p.avatar || p.image || `https://randomuser.me/api/portraits/women/${(idx % 50) + 10}.jpg`,
          text: p.text || p.message || p.review || p.comment || "",
          rating: p.rating ?? 5,
        }))
      : defaultReviews;

  const [activeIndex, setActiveIndex] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const lastScrollTime = useRef(0);
  const isInViewRef = useRef(false);

  useEffect(() => {
    lastScrollTime.current = Date.now();
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth < 1024) return; // disable on small
      if (!isInViewRef.current) return;

      const now = Date.now();
      if (now - lastScrollTime.current < 600) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      const nextIndex = activeIndex + direction;

      if (nextIndex >= 0 && nextIndex < reviews.length) {
        e.preventDefault();
        setActiveIndex(nextIndex);
        lastScrollTime.current = now;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activeIndex]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.4 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const activeReview = reviews[activeIndex];

  return (
    <section
      ref={sectionRef}
      className="w-full flex flex-col items-center bg-white px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4fc3f7]">
            Some Reviews
          </h2>
          <p className="text-xs tracking-[0.25em] mt-3 sm:mt-4 font-semibold text-gray-400">
            OF OUR CLIENTS
          </p>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-60 max-w-7xl mx-auto">
          
          {/* LEFT — Reviewer List */}
          <div className="flex lg:flex-col gap-4 sm:gap-6 w-full lg:w-[420px] shrink-0 overflow-x-auto lg:overflow-visible pb-2">
            {reviews.map((r, i) => {
              const isActive = i === activeIndex;

              return (
                <motion.div
                  key={r.id}
                  onClick={() => setActiveIndex(i)}
                  animate={{
                    scale: isActive ? 1 : 0.95,
                    backgroundColor: isActive ? "#ffffff" : "transparent",
                    boxShadow: isActive
                      ? "0 10px 30px rgba(0,0,0,0.08)"
                      : "none",
                    padding: isActive ? "16px 18px" : "12px 14px",
                  }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3 sm:gap-5 rounded-2xl cursor-pointer min-w-[220px] lg:min-w-0"
                >
                  <motion.div
                    animate={{
                      width: isActive ? 64 : 52,
                      height: isActive ? 64 : 52,
                    }}
                    className="rounded-full overflow-hidden shrink-0"
                    style={{
                      border: isActive
                        ? "3px solid #e3f7fd"
                        : "2px solid #e0e0e0",
                    }}
                  >
                    <img
                      src={r.avatar}
                      alt={r.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  <div>
                    <motion.p
                      animate={{
                        color: isActive ? "#1a1a2e" : "#555",
                      }}
                      className="font-bold text-sm sm:text-base"
                    >
                      {r.name.toUpperCase()}
                    </motion.p>

                    <motion.p
                      animate={{
                        color: isActive ? "#777" : "#aaa",
                      }}
                      className="text-xs sm:text-sm mt-1"
                    >
                      {r.location}
                    </motion.p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CENTER — Timeline (hidden on mobile) */}
          <div className="hidden lg:flex flex-col items-center justify-center relative pt-6 h-[380px]">
            <div className="absolute top-0 bottom-0 w-px bg-[#d0eef9]" />

            {reviews.map((_, i) => {
              const isActive = i === activeIndex;
              const topPct =
                i === 0 ? "12%" : i === 1 ? "50%" : "88%";

              return (
                <motion.div
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  animate={{
                    width: isActive ? 16 : 11,
                    height: isActive ? 16 : 11,
                    backgroundColor: isActive
                      ? "#4fc3f7"
                      : "#b3e5fc",
                  }}
                  className="absolute rounded-full cursor-pointer z-10 ring-2 ring-white"
                  style={{
                    top: topPct,
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    boxShadow: isActive
                      ? "0 0 0 4px #b3e5fc"
                      : "none",
                  }}
                />
              );
            })}
          </div>

          {/* RIGHT — Review Content */}
          <div className="w-full lg:flex-1 lg:pl-8 max-w-full lg:max-w-md items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <svg
                  width="45"
                  height="42"
                  viewBox="0 0 52 36"
                  fill="none"
                  className="mb-3 sm:mb-4"
                >
                  <path
                    d="M0 36V22.08C0 9.888 6.624 2.784 19.872 0L22.08 4.032C16.224 5.472 12.672 8.256 11.424 12.384H20.16V36H0ZM31.68 36V22.08C31.68 9.888 38.304 2.784 51.552 0L53.76 4.032C47.904 5.472 44.352 8.256 43.104 12.384H51.84V36H31.68Z"
                    fill="#c9edf8"
                  />
                </svg>

                <p className="text-sm sm:text-base lg:text-[17px] leading-relaxed text-gray-600">
                  {activeReview.text}
                </p>

                <StarRating rating={activeReview.rating} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}