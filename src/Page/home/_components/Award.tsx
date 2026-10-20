import Award_icon from "../../../../public/Icon/Award_Icon.svg"

export default function Awards() {
  const awards = [
    {
      title: "Malcolm Baldrige National Quality Award",
      description:
        "This award recognizes healthcare organizations that have used health information technology to improve patient outcomes and reduce costs.",
    },
    {
      title: "Malcolm Baldrige National Quality Award",
      description:
        "This award recognizes healthcare organizations that have used health information technology to improve patient outcomes and reduce costs.",
    },
    {
      title: "Malcolm Baldrige National Quality Award",
      description:
        "This award recognizes healthcare organizations that have used health information technology to improve patient outcomes and reduce costs.",
    },
    {
      title: "Malcolm Baldrige National Quality Award",
      description:
        "This award recognizes healthcare organizations that have used health information technology to improve patient outcomes and reduce costs.",
    },
  ];

  return (
    <section className="w-full px-6">
      <div className="max-w-7xl mx-auto">        
        {/* Heading */}
        <h2 className="text-3xl font-semibold text-primary mb-10">
          Awards
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {awards.map((award, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Top Row */}
              <div className="flex items-center gap-4">
                
                {/* Icon Box */}
                <div className=" object-cover">
                  <img src={Award_icon} alt="Award Icon" className="w-auto h-full object-cover" />
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-primary leading-snug">
                  {award.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 leading-relaxed mt-4">
                {award.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}