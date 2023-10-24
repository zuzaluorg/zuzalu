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
                    Join us for a{" "}
                    <span style={{ fontWeight: "bold", textDecoration: "underline" }}>
                        <a
                            href="https://app.skiff.com/docs/686afeda-6dd6-4e45-bd9c-025da5ab7af2#%2FAPhdwcKl0ybzpGeElvYgLL3%2BIXTf%2B8vm5OMl%2Bs%2F1P0%3D"
                            target="_blank"
                        >
                            two-week popup village
                        </a>
                    </span>{" "}
                    where the leading innovators in crypto, AI, governance, decentralized science, and culture unite in
                    the heart of Istanbul to co-work, break down siloes, and have fun.
                </h1>
                <div className="flex items-center gap-8">
                    <a href="https://app.tripsha.com/trip/64ff3a6eb4b6950008dee4f8" target="_blank">
                        <button className="flex w-full md:w-fit items-center justify-center bg-zulalu-primary text-white py-[14px] px-[30px] rounded-[10px] mt-5 text-[18px] font-medium">
                            Apply
                        </button>
                    </a>
                    <a href="/faq">
                        <button className="flex w-full md:w-fit items-center justify-center bg-zulalu-primary text-white py-[14px] px-[30px] rounded-[10px] mt-5 text-[18px] font-medium">
                            More details
                        </button>
                    </a>
                </div>
            </div>
        </div>
    </div>
)

export default MainSection
