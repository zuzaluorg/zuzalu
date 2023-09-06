const MainSection = () => (
    <div className="flex flex-col bg-[#ffffff] rounded-[16px] bg-cover bg-top md:bg-right bg-no-repeat bg-[url('/50.png')] py-10 px-[20px] lg:py-20">
        <div>
            <div className="flex lg:w-3/6 w-full flex-col gap-5">
                <h1 className="font-semibold text-[44px] md:text-[58px]">
                    ZuConnect in
                    <br />
                    <span className="font-extrabold">Instanbul</span>
                </h1>
                <h1 className="font-medium text-[20px] md:text-[20px] w-[auto] md:leading-8">
                    Join us for a two-week popup village where the leading innovators in crypto, AI, governance,
                    decentralized science, and culture unite in the heart of Istanbul to co-work, break down siloes, and
                    have fun.
                </h1>
                <div className="flex flex-row -center ">
                    <button className="flex w-full md:w-fit items-center justify-center bg-zulalu-primary text-white py-[8px] px-[18px] rounded-[8px] mt-5">
                        Apply for ZuConnect
                    </button>
                </div>
            </div>
        </div>
    </div>
)

export default MainSection
