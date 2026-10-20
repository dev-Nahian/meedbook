import {
  Users,
  ShieldCheck,
  Globe,
  Zap,
  Heart,
} from "lucide-react";

export default function OurValues() {
  const cards = [
    {
      icon: Users,
      title: "Trusted",
      description:
        "We provide clear information, verified clinic profiles, and honest patient reviews—ensuring you always make informed decisions with complete confidence.",
    },
    {
      icon: ShieldCheck,
      title: "Patient Safety",
      description:
        "We prioritize your well-being by partnering exclusively with certified clinics that meet strict global medical standards and deliver safe, reliable care.",
    },
    {
      icon: Globe,
      title: "Global Access",
      description:
        "We provide clear information, verified clinic profiles, and honest patient reviews—ensuring you always make informed decisions with complete confidence.",
    },
    {
      icon: Zap,
      title: "Fast & Easy",
      description:
        "We provide clear information, verified clinic profiles, and honest patient reviews—ensuring you always make informed decisions with complete confidence.",
    },
    {
      icon: Heart,
      title: "Empathetic Care",
      description:
        "We provide clear information, verified clinic profiles, and honest patient reviews—ensuring you always make informed decisions with complete confidence.",
    },
  ];

  return (
    <section className="w-full bg-white px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      
      {/* HEADER */}
      <div className="text-center mb-12 lg:mb-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-primary">
          Our Values
        </h2>
        <p className="text-gray-400 text-sm sm:text-base">
          Our commitment to responsible, honest, and patient-centered care.
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-6 sm:gap-4 lg:gap-10">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className={`
                group relative flex flex-col items-center text-center bg-white rounded-3xl px-6 py-8 sm:px-7 sm:py-10 border border-gray-100 shadow-sm 
                transition-all duration-300 hover:shadow-xl
                w-full sm:w-[48%] lg:w-[30%]
                ${index === 1 ? "lg:-mt-8" : ""}
              `}
              style={{ minHeight: "260px" }}
            >
              {/* HOVER TOP BAR */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-[110%] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <div className="bg-gradient-to-r from-sky-400 to-sky-500 text-white rounded-2xl px-5 py-3 flex items-center justify-center gap-3 shadow-lg">
                  <div className="w-10 h-10 rounded-full bg-[#307BC4] flex items-center justify-center">
                    <Icon size={18} />
                  </div>
                  <span className="font-semibold text-lg sm:text-xl">
                    {card.title}
                  </span>
                </div>
              </div>

              {/* ICON + TITLE */}
              <div className="flex items-center justify-center mb-4 gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-[#307BC4] text-white transition-all duration-300 group-hover:opacity-0">
                  <Icon size={20} />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-primary mb-4 transition-all duration-300 group-hover:opacity-0">
                  {card.title}
                </h3>
              </div>

              {/* DESCRIPTION */}
              <p className="text-gray-400 text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}