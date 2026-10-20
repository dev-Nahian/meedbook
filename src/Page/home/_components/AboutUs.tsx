import { MoveRight } from "lucide-react";
import image from "../../../../public/Images/special_doctors.jpg";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        
        {/* IMAGE */}
        <div className="w-full max-w-xl">
          <img
            src={image}
            alt="Special Doctors"
            className="w-full h-auto object-cover rounded-xl"
          />
        </div>

        {/* CONTENT */}
        <div className="flex flex-col gap-4 text-center lg:text-left">
          
          <h1 className="text-primary text-3xl sm:text-4xl lg:text-[48px] leading-tight">
            About Us
          </h1>

          <h4 className="flex items-center justify-center lg:justify-start gap-3">
            <MoveRight className="text-primary w-6 h-6 sm:w-7 sm:h-7" />
            <span className="text-lg sm:text-xl lg:text-[24px]">
              Safe, Simple, and Global Dialysis Booking
            </span>
          </h4>

          <p className="text-sm sm:text-base text-secondary/70 max-w-lg mx-auto lg:mx-0">
            We believe that travel should never be limited by health conditions.
            Our platform connects patients with certified dialysis clinics
            around the world, making it easy to compare services, check
            real-time availability, and book appointments with confidence.
            Whether you’re traveling for business, vacation, or family reasons
            your care is always within reach.
          </p>

          <Link
            to={"about-us"}
            className="bg-primary text-white mt-5 text-sm sm:text-base w-full sm:w-auto lg:w-2/7 text-center px-4 py-2.5 rounded-md"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;