import AboutUs from "./_components/AboutUs"
import Awards from "./_components/Award"
import BlogPost from "./_components/BlogPost"
import FeaturedClinics from "./_components/ClinicCard"
import ConnectPlatform from "./_components/ConnectPlatform"
import FAQSection from "../../components/shared_component/Faq"
import HeroSection from "./_components/Hero"
import OurValues from "./_components/OurValues"
import Reviews from "./_components/Reviews"


const Home = () => {
  return (
    <div className="md:space-y-35 space-y-20">
        <HeroSection />
        <AboutUs />
        <OurValues />
        <Awards />
        <FeaturedClinics />
        <Reviews />
        <BlogPost />
        <FAQSection />
        <ConnectPlatform />
    </div>
  )
}

export default Home