import { useQuery } from "@tanstack/react-query"
import { getAboutUs } from "../../lib/aboutApi"
import AboutUs from "../home/_components/AboutUs"
import AboutHero from "./_components/AboutHero"
import BottomCard from "./_components/BottomCard"
import ExpertTeam from "./_components/ExpertTeam"
import MissionVision from "./_components/MissionVission"
import PerformanceCard from "./_components/PerformanceCard"
import WhyChooseUs from "./_components/WhyChooseUs"

const AboutPage = () => {
  const { data } = useQuery({
    queryKey: ["about-us"],
    queryFn: getAboutUs,
  })

  return (
    <div className="md:space-y-35 space-y-20">
       <AboutHero /> 
       <AboutUs />
       <WhyChooseUs items={data?.why_choose_us}/>
       <MissionVision items={data?.mission_vision}/>
       <PerformanceCard statistics={data?.statistics}/>
       <ExpertTeam members={data?.team_members}/>
       <BottomCard/>
    </div>
  )
}

export default AboutPage
