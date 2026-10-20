import award from "../../../../public/Icon/awardSmall.svg";
import doctorImage from "../../../../public/Images/why_choose_us.png";
import type { AboutWhyChooseUs } from "../../../lib/aboutApi";

const features = [
  {
    icon: award,
    title: "Verified & Safe Clinics",
    description:
      "Every clinic on our platform is certified, trusted, and meets strict medical standards—ensuring safe treatment every time.",
  },
  {
    icon: award,
    title: "Easy, Fast Booking",
    description:
      "From searching to confirming your appointment, the entire process is smooth, quick, and user-friendly.",
  },
  {
    icon: award,
    title: "Global Coverage",
    description:
      "Access clinics across multiple countries, making medical travel simple, secure, and worry-free no matter where you go.",
  },
  {
    icon: award,
    title: "Transparent Information",
    description:
      "Clear pricing, honest reviews, and complete clinic details—so patients always know exactly what to expect.",
  },
];

type WhyChooseUsProps = {
  items?: AboutWhyChooseUs[];
};

const WhyChooseUs = ({ items }: WhyChooseUsProps) => {
  const displayFeatures =
    items && items.length > 0
      ? items
          .slice()
          .sort((a, b) => a.id - b.id)
          .map((item) => ({
            icon: item.icon_class || award,
            title: item.title,
            description: item.description,
          }))
      : features;

  return (
    <section className="w-full py-12 sm:py-14 md:py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 md:gap-12">
        
        {/* Left — Doctor Image */}
        <div className="flex-shrink-0 w-full md:w-[480px]">
          <div className="relative w-full h-[300px] sm:h-[420px] md:h-[580px] rounded-2xl overflow-hidden">
            <img
              src={doctorImage}
              alt="Doctor"
              className="object-cover"
            />
          </div>
        </div>

        {/* Right — Content */}
        <div className="flex-1 w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-6 md:mb-8 text-center md:text-left">
            Why Choose Us
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {displayFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-5 sm:p-6 flex flex-col gap-3 sm:gap-4"
              >
                {/* Icon */}
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    width={40}
                    height={40}
                  />
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed text-justify">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
