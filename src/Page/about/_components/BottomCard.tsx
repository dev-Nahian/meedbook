import image from "../../../../public/Images/backseat.png";

const BottomCard = () => {
  return (
    <section className="w-full py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        <div
          className="relative flex flex-col lg:flex-row items-center justify-between rounded-3xl px-6 sm:px-10 lg:px-12 py-10 lg:py-12 overflow-hidden"
          style={{
            background: "linear-gradient(93deg, #86BBF1 0%, #D2EAEF 98.25%)",
          }}
        >
          
          {/* TEXT */}
          <div className="w-full lg:max-w-[55%] text-center lg:text-left z-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-snug mb-4">
              Don't Let Your Health Take a <br className="hidden sm:block" />
              Backseat!
            </h2>

            <p className="text-white text-sm md:text-base leading-relaxed mx-auto lg:mx-0 max-w-md">
              Schedule an appointment with one of our experienced medical
              professionals today!
            </p>
          </div>

          {/* IMAGE SIDE */}
          <div className="relative mt-10 lg:mt-0 flex justify-center lg:justify-end w-full">
            
            <div
              className="relative w-[220px] h-[240px] sm:w-[260px] sm:h-[280px] md:w-[300px] md:h-[320px] lg:w-[320px] lg:h-[340px]"
              style={{
                filter: "drop-shadow(0 8px 24px rgba(134,187,241,0.3))",
              }}
            >
              
              {/* Shield Background */}
              <svg
                viewBox="0 0 320 340"
                className="absolute inset-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M160 10 L300 60 L300 180 Q300 290 160 330 Q20 290 20 180 L20 60 Z"
                  fill="white"
                />
              </svg>

              {/* Clipped Image */}
              <div
                className="relative w-full h-full overflow-hidden"
                style={{
                  clipPath:
                    "path('M145 8 L275 55 L275 168 Q275 268 145 305 Q15 268 15 168 L15 55 Z')",
                }}
              >
                <img
                  src={image}
                  alt="Doctor with patient"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default BottomCard;