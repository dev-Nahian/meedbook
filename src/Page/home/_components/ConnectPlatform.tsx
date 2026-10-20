export default function ConnectPlatform() {
  return (
    <section className="w-full  px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div 
          className="rounded-3xl py-6 px-8 md:px-12 text-center text-white relative overflow-hidden gradienttwo"
          
        >
          {/* Subtle overlay for depth */}
          <div className="absolute inset-0 bg-[radial-gradient(at_center,#ffffff10_0%,transparent_70%)]" />

          <div className="relative z-10">
            {/* Small top text */}
            <p className="text-sm font-medium tracking-widest mb-3 opacity-90">
              Connect With Our Platform
            </p>

            {/* Main Heading */}
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Are You Clinic Owners? This Is for You
            </h2>

            {/* Description */}
            <p className="max-w-2xl mx-auto text-lg md:text-xl opacity-90 leading-relaxed mb-10">
              Serve international patients with ease, increase your bookings, <br className="hidden md:block" />
              and help more people access your services
            </p>

            {/* Button */}
            <button 
              className="bg-primary hover:bg-primary/80 transition-colors text-white font-semibold text-base px-8 py-3.5 rounded-md shadow-md hover:shadow-lg active:scale-95"
            >
              List your clinic
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}