import Link from "next/link"
import Image from "next/image"

import { useUserPassportContext } from "../../context/UserPassportContext"
import ConnectPassportButton from "../ConnectPassportButton"
import FullProgramButton from "../FullProgramButton"

const MainSection = ({ sitedata }: { sitedata: any }) => {
    const { requestSignedZuID } = useUserPassportContext()

    return (
        <div className="flex flex-col bg-fora-gray100 p-5 pb-60">
            <div className="w-full h-full flex justify-between lg:flex-row flex-col lg:py-5 px-3  md:px-[48px] rounded-[16px] gap-[100px] lg:gap-10">
                <div className="flex lg:w-3/6 w-full flex-col">
                    <h1 className="text-fora-gray900 font-serif font-light text-brand-h3 md:text-brand-h2 lg:text-brand-h1 max-w-lg">
                        {sitedata.title}
                        <span className="relative z-10 inline-block px-2">
                            {/* <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-green-200"></span> */}
                            {/* <span className="relative z-[10]">Montenegro.</span> */}
                        </span>{" "}
                    </h1>
                    <p className="font-medium text-[20px] mt-[1.2rem] md:mt-[2.5rem] md:text-[18px] leading-normal w-[auto] md:max-w-md">
                        {sitedata.description}
                    </p>
                    <div className="flex flex-col gap-5 mt-6">
                        <div className="hidden md:flex">
                            <ConnectPassportButton onClick={requestSignedZuID}>Connect Passport</ConnectPassportButton>
                        </div>
                        {/* <div>
                            <FullProgramButton />
                        </div> */}
                    </div>
                </div>
                <div className="lg:p-5 relative w-full lg:w-3/6  flex justify-center items-center max-w-[100vw] overflow-visible md:overflow-visible">
                    <img src={sitedata.banner} className="rounded-xl" />
                    {/* <div className="absolute  bottom-0 border border-black w-[550px] h-[300px] bg-eventbg2 filter blur-[150px] z-[2]" />
                <div className="absolute  border border-black w-[500px] h-[379px] bg-eventbg1 filter blur-[150px] z-[1]" />

                <div className="top-0 absolute z-[11] w-full h-full bg-contain bg-center bg-no-repeat bg-[url('/vector.png')]" />
                <div className="top-0 absolute z-[12] w-full h-full bg-contain bg-center bg-no-repeat bg-[url('/49.png')]" /> */}
                </div>
            </div>
        </div>
    )
}

export default MainSection
