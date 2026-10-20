import type { ClinicImage } from "../../../lib/clinicApi";

const fallbackImages = [
  "/Images/Clinic_main_image.png",
  "/Images/Clininc_image1.png",
  "/Images/Clinic_image2.png",
  "/Images/Clinic_image3.png",
];

const HeroImage = ({ images = [] }: { images?: ClinicImage[] }) => {
  const apiImages = images
    .map((image) => image.image_url || image.image)
    .filter(Boolean);

  const getImage = (index: number) =>
    apiImages[index] ?? apiImages[0] ?? fallbackImages[index];

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
      
      {/* Left Large Image */}
      <div className="w-full h-160">
        <img
          src={getImage(0)}
          alt="Main Clinic"
          className="w-full h-full object-cover rounded-3xl"
        />
      </div>

      {/* Right Side Images */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Top Right (small) */}
        <div className="col-span-2 h-50">
          <img
            src={getImage(1)}
            alt="Clinic 1"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        {/* Top Right (small) */}
        <div className="col-span-2 h-50">
          <img
            src={getImage(2)}
            alt="Clinic 2"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        {/* Bottom Full Width */}
        <div className="col-span-2 h-50">
          <img
            src={getImage(3)}
            alt="Clinic 3"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

      </div>
    </div>
  );
};

export default HeroImage;
