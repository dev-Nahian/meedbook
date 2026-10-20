import { AnimatePresence,motion } from "framer-motion";
import hero_image from "../../../../public/Images/about_hero.png";

const AboutHero = () => {
  return (
    <section className="relative w-full overflow-hidden rounded-2xl gradient py-16 md:py-39 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AnimatePresence>  
        <motion.div
        initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
        className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-16 ">
          
         {/* IMAGE */}
          <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
            <div className="relative w-full h-75 sm:h-100 md:h-125 rounded-xl overflow-hidden">
              <img
                src={hero_image}
                alt="About Hero"
                className="object-cover"
              />
            </div>
          </div>

          {/* TEXT CONTENT */}
          <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start max-w-md">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight ">
              Supporting Your Health Journey Worldwide
            </h1>

            <p className="text-gray-600 text-sm sm:text-base">
              Trusted clinics, easy booking, global reach
            </p>

            {/* BADGE (NOT FULL WIDTH) */}
            <div className="inline-flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-md w-fit">
              
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 60 60" fill="none">
  <path d="M59.7646 29.1212L56.2165 22.975V15.8789C56.2165 15.2509 55.8815 14.6705 55.3375 14.3565L49.1915 10.8085L45.6436 4.66253C45.3296 4.11866 44.7493 3.78362 44.1213 3.78362H37.0251L30.8788 0.235415C30.3351 -0.0784131 29.6651 -0.0785303 29.1211 0.235415L22.975 3.7835H15.8789C15.2509 3.7835 14.6705 4.11854 14.3566 4.66253L10.8087 10.8085L4.66257 14.3565C4.11858 14.6705 3.78355 15.2508 3.78355 15.8789V22.975L0.235459 29.1212C-0.0784863 29.6651 -0.0784863 30.3349 0.235459 30.8788L3.78343 37.025V44.1211C3.78343 44.7491 4.11847 45.3295 4.66245 45.6435L10.8086 49.1914L14.3566 55.3375C14.6705 55.8814 15.2508 56.2165 15.8789 56.2165H22.9751L29.1212 59.7646C29.3931 59.9215 29.6966 60 30.0002 60C30.3037 60 30.6071 59.9215 30.8789 59.7646L37.0251 56.2165H44.1211C44.7491 56.2165 45.3296 55.8814 45.6435 55.3376L49.1914 49.1916L55.3374 45.6436C55.8814 45.3296 56.2164 44.7493 56.2164 44.1212V37.0252L59.7645 30.8789C60.0786 30.3349 60.0786 29.6651 59.7646 29.1212ZM47.6429 29.3151L45.5508 38.7299C44.9845 41.2764 42.7672 43.0547 40.1587 43.0547H16.8203C15.8495 43.0547 15.0625 42.2677 15.0625 41.2969V26.2344C15.0625 25.2636 15.8495 24.4766 16.8203 24.4766H23.9025C25.427 23.5663 26.3594 21.9388 26.3594 20.1416V14.9375C26.3594 13.9667 27.1464 13.1797 28.1172 13.1797H30.9414C34.5173 13.1797 37.4063 16.0732 37.4063 19.6446V22.5937H42.2515C43.9355 22.5937 45.5058 23.3471 46.5598 24.6608C47.6131 25.975 48.0077 27.6712 47.6429 29.3151Z" fill="#307BC4"/>
  <path d="M42.2593 26.1127H35.6563C34.6855 26.1127 33.8984 25.3257 33.8984 24.3549V19.6478C33.8984 18.0057 32.5665 16.6985 30.9492 16.6985H29.8828V20.1448C29.8828 23.0321 28.4646 25.662 26.1172 27.243V39.5424H40.1666C41.1148 39.5424 41.921 38.8959 42.1269 37.9701L44.2188 28.5562C44.3514 27.9584 44.2079 27.3412 43.825 26.8634C43.4422 26.3866 42.8714 26.1127 42.2593 26.1127Z" fill="#307BC4"/>
  <path d="M18.5703 27.9903H22.586V39.5371H18.5703V27.9903Z" fill="#307BC4"/>
</svg>

              <div>
                <p className="text-lg font-semibold text-secondary0">No. 1</p>
                <p className="text-xs text-gray-500">
                  Platform for Dialysis Booking
                </p>
              </div>
            </div>
          </div>

         

        </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AboutHero;