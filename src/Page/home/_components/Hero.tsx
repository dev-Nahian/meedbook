import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const hero_image = "/Images/hero-doctor-image.png";

const avatars = [
  "https://randomuser.me/api/portraits/women/1.jpg",
  "https://randomuser.me/api/portraits/men/2.jpg",
  "https://randomuser.me/api/portraits/women/3.jpg",
  "https://randomuser.me/api/portraits/men/4.jpg",
  "https://randomuser.me/api/portraits/women/5.jpg",
  "https://randomuser.me/api/portraits/men/6.jpg",
];

export default function HeroSection() {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams({
      location: location.trim(),
      date,
    });

    navigate(`/see-all-clinic?${params.toString()}`);
  };

  return (
    <section className="relative w-full overflow-hidden rounded-2xl gradient">
      <div className="w-full mt-16 md:mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* ─── MOBILE LAYOUT: image on top, then content below ─── */}
          <div className="flex flex-col lg:hidden">
            {/* MOBILE IMAGE */}
            <div
              className="relative w-full flex justify-center items-end pt-6 pb-0"
              style={{ minHeight: 280 }}
            >
              <img
                src={hero_image}
                alt="Doctor"
                className="object-contain object-top w-full max-w-xs sm:max-w-sm drop-shadow-xl"
                style={{ maxHeight: 300 }}
              />

              {/* Floating card — mobile */}
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg flex items-center gap-3 px-4 py-3"
                style={{ minWidth: 170 }}
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-[#22D3BB]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.684l1.25 3.75a1 1 0 01-.23 1.02l-1.5 1.5a11.042 11.042 0 005.516 5.516l1.5-1.5a1 1 0 011.02-.23l3.75 1.25a1 1 0 01.684.95V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-[0.68rem] text-gray-400 font-medium">
                    24 hour service
                  </p>
                  <p className="text-sm font-bold text-secondary">
                    (000) 111 1020
                  </p>
                </div>
              </div>
            </div>

            {/* MOBILE CONTENT */}
            <div className="flex flex-col gap-5 py-8">
              {/* Headline */}
              <div>
                <h1
                  className="text-[1.8rem] sm:text-[2.2rem] font-bold leading-tight text-gray-800 text-center"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  Book Verified Dialysis Clinics
                  <br />
                  While You Travel
                </h1>
                <p className="mt-3 text-gray-500 text-sm font-normal text-center">
                  Real-time availability, secure booking, and trusted clinics at
                  your fingertips
                </p>
              </div>

              {/* MOBILE SEARCH BAR — stacked */}
              <form
                onSubmit={handleSearch}
                className="flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden w-full"
              >
                {/* Location */}
                <div className="flex flex-col px-4 py-3 border-b border-gray-100">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
                    Clinic Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Search Location"
                    className="text-sm text-gray-500 bg-transparent outline-none placeholder-gray-300 w-full"
                    required
                  />
                </div>

                {/* Available Date */}
                <div className="flex flex-col px-4 py-3 border-b border-gray-100">
                  <label className="text-xs font-semibold text-gray-700 mb-1">
                    Available Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="text-sm text-gray-500 bg-transparent outline-none w-full"
                    style={{ colorScheme: "light" }}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                {/* Button */}
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 text-white text-sm font-semibold px-6 py-4 bg-primary transition-all hover:opacity-90 active:scale-95 w-full"
                >
                  <Search size={17} />
                  Search Clinics
                </button>
              </form>

              {/* Social Proof */}
              <div className="bg-white rounded-2xl shadow-md px-5 py-4 flex flex-col gap-2 mx-auto">
                <div className="flex items-center">
                  {avatars.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`User ${i + 1}`}
                      className="w-8 h-8 rounded-full border-2 border-white object-cover"
                      style={{
                        marginLeft: i === 0 ? 0 : "-10px",
                        zIndex: avatars.length - i,
                      }}
                    />
                  ))}
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                    style={{
                      marginLeft: "-10px",
                      background: "linear-gradient(135deg, #38bdf8, #06b6d4)",
                      zIndex: 0,
                    }}
                  >
                    +
                  </div>
                </div>
                <p className="text-[0.78rem] text-gray-500 font-medium leading-snug">
                  Book from{" "}
                  <span className="font-bold text-gray-700">
                    200+ Verified & Certified
                  </span>
                  <br />
                  Clinics Worldwide
                </p>
              </div>
            </div>
          </div>

          {/* ─── DESKTOP LAYOUT: original side-by-side ─── */}
          <div className="hidden lg:block">
            <div className="flex flex-col gap-6 py-14 max-w-3xl">
              {/* Headline */}
              <div>
                <h1
                  className="text-[2.6rem] font-bold leading-tight text-gray-800"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  Book Verified Dialysis Clinics
                  <br />
                  While You Travel
                </h1>
                <p className="mt-3 text-gray-500 text-[0.97rem] font-normal">
                  Real-time availability, secure booking, and trusted clinics at
                  your fingertips
                </p>
              </div>

              {/* Search Bar */}
              <form
  onSubmit={handleSearch}
  className="flex items-center bg-white rounded-2xl shadow-lg px-2 py-2 gap-1 mt-2 w-full"
>
  {/* Location */}
  <div className="flex flex-col px-4 py-2 flex-1 min-w-0 border-r border-gray-200">
    <label className="text-xs font-semibold text-gray-700 mb-1">
      Clinic Location
    </label>
    <input
      type="text"
      value={location}
      onChange={(e) => setLocation(e.target.value)}
      placeholder="Search Location"
      className="text-sm text-gray-500 bg-transparent outline-none placeholder-gray-300 w-full"
      required
    />
  </div>

  {/* Available Date */}
  <div className="flex flex-col px-4 py-2 flex-1 min-w-0">
    <label className="text-xs font-semibold text-gray-700 mb-1">
      Available Date
    </label>
    <input
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
      className="text-sm text-gray-500 bg-transparent outline-none w-full"
      style={{ colorScheme: "light" }}
      min={new Date().toISOString().split("T")[0]}
      required
    />
  </div>

  {/* Button */}
  <button
    type="submit"
    className="flex items-center gap-2 text-white text-sm font-semibold px-7 py-5 rounded-xl ml-2 transition-all hover:opacity-90 active:scale-95 shrink-0 bg-primary"
  >
    <Search size={18} />
    Search
  </button>
</form>

              {/* Social Proof */}
              <div className="bg-white rounded-2xl shadow-md px-5 py-4 flex flex-col gap-2 max-w-[280px] mt-10">
                <div className="flex items-center">
                  {avatars.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`User ${i + 1}`}
                      className="w-9 h-9 rounded-full border-2 border-white object-cover"
                      style={{
                        marginLeft: i === 0 ? 0 : "-10px",
                        zIndex: avatars.length - i,
                      }}
                    />
                  ))}
                  <div
                    className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                    style={{
                      marginLeft: "-10px",
                      background: "linear-gradient(135deg, #38bdf8, #06b6d4)",
                      zIndex: 0,
                    }}
                  >
                    +
                  </div>
                </div>
                <p className="text-[0.8rem] text-gray-500 font-medium leading-snug">
                  Book from{" "}
                  <span className="font-bold text-gray-700">
                    200+ Verified & Certified
                  </span>
                  <br />
                  Clinics Worldwide
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP IMAGE (absolute positioned, hidden on mobile) */}
        <div className="hidden lg:flex absolute right-30 bottom-0 h-full items-end justify-end pointer-events-none select-none">
          <img
            src={hero_image}
            alt="Doctor"
            className="object-contain h-[95%] max-h-[560px] drop-shadow-xl"
            style={{ objectPosition: "top" }}
          />

          {/* Floating card — desktop */}
          <div
            className="absolute bottom-30 right-[57%] bg-white rounded-2xl shadow-lg flex items-center gap-3 px-4 py-3"
            style={{ minWidth: "180px" }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-[#22D3BB]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.684l1.25 3.75a1 1 0 01-.23 1.02l-1.5 1.5a11.042 11.042 0 005.516 5.516l1.5-1.5a1 1 0 011.02-.23l3.75 1.25a1 1 0 01.684.95V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div>
              <p className="text-[0.7rem] text-gray-400 font-medium">
                24 hour service
              </p>
              <p className="text-sm font-bold text-secondary">(000) 111 1020</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
