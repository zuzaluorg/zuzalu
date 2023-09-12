import NextLink from "next/link"

const Footer = () => (
    <div className="flex h-[300px] md:h-[220px] text-[14px] bg-zulalu-darkBase text-white p-[25px] md:px-[72px] w-full md:py-[35px]">
        <div className="flex flex-col md:flex-row  ">
            <h1 className=" text-[16px] md:text-[18px]">Zuzalu Montenegro 2023</h1>
            <div className="mt-[15px] md:ml-[64px] md:mt-0">
                <h2 className=" font-[600]  mb-[5px] text-[18px] md:text-[20px] md:mb-[16px] text-[rgba(255,255,255,0.7)]">
                    Zuzalu 1
                </h2>
                <div>
                    <a href={"https://zuzalu.streameth.org/"} target="_blank">
                        <h3 className="font-[400] mb-[7px] text-[14px]  md:text-[18px] text-[white] cursor-pointer md:mb-[14px]">
                            Livestreams
                        </h3>
                    </a>
                    <NextLink href={"/about"}>
                        <h3 className="font-[400] mb-[7px] text-[14px]  md:text-[18px] text-[white] cursor-pointer md:mb-[14px]">
                            About
                        </h3>
                    </NextLink>
                    <NextLink href={"/faq"}>
                        <h3 className="font-[400]  mb-[7px] text-[14px] md:text-[18px] text-[white] cursor-pointer md:mb-[14px]">
                            FAQ
                        </h3>
                    </NextLink>
                </div>
            </div>
        </div>
    </div>
)

export default Footer
