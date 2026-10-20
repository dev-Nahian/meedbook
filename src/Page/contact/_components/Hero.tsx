import smile from "../../../../public/Images/smile.png"

const HeroSection = () => {
  return (
    <div className="w-full overflow-hidden rounded-2xl gradient max-h-162.5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col justify-center items-center text-center gap-6 md:py-26 py-10 mt-24">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary leading-tight">
                    Helping You Every Step of the Way
                </h1>
                <p className="text-base  text-secondary max-w-2xl">
                    Connect with our team for support or information
                </p>
                <div className="bg-white text-secondary font-semibold text-base px-3 py-2 rounded-md flex items-center gap-2 ">
                    <div className="w-10 h-10 flex items-center justify-center text-center bg-green-100 rounded-md">
                        <img src={smile} alt=""/>
                    </div>
                    <p className="text-start">50k+ <br /> <span className="text-xs"> Happy Patient </span></p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default HeroSection