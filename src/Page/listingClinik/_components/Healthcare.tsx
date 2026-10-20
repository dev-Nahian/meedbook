export default function Healthcare() {
  return (
    <section className="w-full  px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div 
          className="rounded-3xl py-6 px-8 md:px-12 text-center text-white relative overflow-hidden gradienttwo"
          
        >
          {/* Subtle overlay for depth */}
          <div className="absolute inset-0 bg-[radial-gradient(at_center,#ffffff10_0%,transparent_70%)]" />

          <div className="relative z-10">
            {/* Main Heading */}
            <h2 className="text-2xl font-bold leading-tight mb-1">
              Become Part of Our Healthcare Network
            </h2>

            {/* Description */}
            <p className="max-w-4xl mx-auto text-sm  opacity-90 leading-relaxed mb-10">
              Showcase your clinic and help patients find the care they need
            </p>

            {/* Button */}
            <div className="flex items-center justify-evenly gap-6 ">
                <div className="px-2 py-2">
                    <h3 className="text-3xl">40+</h3>
                    <p className="text-base">Countries</p>
                </div>
                <div className="px-2 py-2">
                    <h3 className="text-3xl">600+</h3>
                    <p className="text-base">Dialysis Care Centers</p>
                </div>
                <div className="px-2 py-2">
                    <h3 className="text-3xl">16,000+</h3>
                    <p className="text-base">Booking Complete</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}