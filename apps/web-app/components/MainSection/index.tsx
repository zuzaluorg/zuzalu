const MainSection = () => (
    <div className="flex flex-col bg-fora-gray100">
        <div className="w-full h-full flex justify-between lg:flex-row flex-col py-5  px-[28px] md:px-[48px] rounded-[16px] gap-[100px] lg:gap-10">
            <div className="flex lg:w-3/6 w-full flex-col">
                <h1 className="font-serif font-light text-brand-h3 md:text-brand-h2 lg:text-brand-h1 max-w-lg">
                    Zuzalu is a first-of-its-kind pop-up city community in{" "}
                    <span className="relative z-10 inline-block px-2">
                        <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-green-200"></span>
                        <span className="relative z-[10]">Montenegro.</span>
                    </span>{" "}
                </h1>
                <p className="font-medium text-[20px] mt-[1.2rem] md:mt-[2.5rem] md:text-[18px] leading-normal w-[auto] md:max-w-md">
                    Join 200 core residents brought together by a shared desire to learn, create, live longer and
                    healthier lives, and build self-sustaining communities.
                </p>
            </div>
            <div className="p-5 relative w-full lg:w-3/6 h-[500px] flex justify-center items-center max-w-[100vw] overflow-visible md:overflow-visible">
                <div className="absolute  bottom-0 border border-black w-[550px] h-[300px] bg-eventbg2 filter blur-[150px] z-[2]" />
                <div className="absolute  border border-black w-[500px] h-[379px] bg-eventbg1 filter blur-[150px] z-[1]" />

                <div className="top-0 absolute z-[11] w-full h-full bg-contain bg-center bg-no-repeat bg-[url('/vector.png')]" />
                <div className="top-0 absolute z-[12] w-full h-full bg-contain bg-center bg-no-repeat bg-[url('/49.png')]" />
            </div>
        </div>
    </div>
)

export default MainSection
