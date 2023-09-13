const MainSection = () => (
    <div className="flex flex-col bg-[#ffffff] rounded-[20px] bg-cover bg-top md:bg-right bg-no-repeat bg-[url('/50.png')] py-8 px-5 md:px-9 md:py-18 lg:p-20">
        <div>
            <div className="flex lg:w-3/6 w-full flex-col gap-5">
                <h1 className="font-semibold text-[44px] md:text-[58px]">
                    ZuConnect in
                    <br />
                    <span className="font-extrabold">Istanbul</span>
                </h1>
                <h1 className="font-medium text-[20px] md:text-[20px] w-[auto] md:leading-8">
                    Join us for a two-week popup village where the leading innovators in crypto, AI, governance,
                    decentralized science, and culture unite in the heart of Istanbul to co-work, break down siloes, and
                    have fun.
                </h1>
                <div className="flex">
                    <a href="https://app.tripsha.com/trip/64ff3a6eb4b6950008dee4f8/book" target="_blank">
                        <button className="flex w-full md:w-fit items-center justify-center bg-zulalu-primary text-white py-[14px] px-[30px] rounded-[10px] mt-5 text-[18px] font-medium">
                            Apply for ZuConnect
                        </button>
                    </a>
                </div>
            </div>
        </div>
    </div>
)

export default MainSection
