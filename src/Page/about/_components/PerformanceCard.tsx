import type { AboutStatistic } from "../../../lib/aboutApi";

const fallbackStatistics = [
  { id: 1, title: "Partner Clinics", value: "500+", order: 1 },
  { id: 2, title: "Happy Patients", value: "50k+", order: 2 },
  { id: 3, title: "Average Rating", value: "4.9/5", order: 3 },
  { id: 4, title: "Satisfaction Rate", value: "98%", order: 4 },
];

type PerformanceCardProps = {
  statistics?: AboutStatistic[];
};

export default function PerformanceCard({ statistics }: PerformanceCardProps) {
  const displayStatistics =
    statistics && statistics.length > 0
      ? statistics.slice().sort((a, b) => a.order - b.order)
      : fallbackStatistics;

  return (
    <section className="w-full py-5 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div 
          className="rounded-3xl py-6 px-8 md:px-12 text-center text-white relative overflow-hidden gradienttwo"
          
        >
          {/* Subtle overlay for depth */}
          <div className="absolute inset-0 bg-[radial-gradient(at_center,#ffffff10_0%,transparent_70%)]" />

          <div className="relative z-10">
            {/* Main Heading */}
            <h2 className="text-2xl font-bold leading-tight mb-1">
              Performance That Drives Trust
            </h2>

            {/* Description */}
            <p className="max-w-4xl mx-auto text-sm  opacity-90 leading-relaxed mb-10">
              Real data showcasing our growth and dedication
            </p>

            {/* Button */}
            <div className="flex items-center justify-evenly gap-6 ">
                {displayStatistics.map((item) => (
                  <div key={item.id} className="px-2 py-2">
                      <h3 className="text-3xl">{item.value}</h3>
                      <p className="text-base">{item.title}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
