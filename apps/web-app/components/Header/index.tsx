import { useEffect, useState } from "react"
import NextImage from "next/image"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { FiArrowUpRight, FiMenu, FiX } from "react-icons/fi"

import { useUserAuthenticationContext } from "../../context/UserAuthenticationContext"
import { useUserPassportContext } from "../../context/UserPassportContext"
import PassportLoadingModal from "../PassportLoadingModal"
import { sites } from "../../data/sites"
import ConnectPassportButton from "../ConnectPassportButton"

const Header = ({ sitedata }: { sitedata: (typeof sites)["vitalia"] }) => {
    const { userInfo } = useUserAuthenticationContext()

    const { requestSignedZuID, loadingPassport, errorPassport } = useUserPassportContext()

    const [navbar, setNavbar] = useState(false)

    const router = useRouter()

    return (
        <div className="relative px-[24px] md:px-[82px] flex flex-row h-[112px] md:justify-between w-full z-10 bg-fora-gray100 items-center">
            {!userInfo && loadingPassport.step !== 0 && (
                <PassportLoadingModal loadingPassport={loadingPassport} errorPassport={errorPassport} />
            )}
            <div className="w-full flex relative justify-between md:justify-start overflow-hidden gap-5 items-center">
                {/* <NextLink href={"/"}>
                    <div className="hidden md:flex cursor-pointer gap-2 items-center justify-center ">
                        <div className="h-14 w-14">
                            <img src={sitedata.logo} alt="Zuzalu City Logo" height={50} />
                        </div>
                    </div>
                </NextLink> */}
                <NextLink href={"/"}>
                    <div className="flex cursor-pointer items-center justify-center h-14 w-14 lg:h-16 lg:w-16">
                        <div className="p-2 lg:p-0">
                            <img src={sitedata.logo} alt={`${sitedata.name} logo`} />
                        </div>
                    </div>
                </NextLink>

                {userInfo && (
                    <div className="flex gap-2 text-fora-primary justify-center items-center text-[18px] text-center self-center">
                        <div className="w-[8px] h-[8px] bg-fora-gray900 rounded-full" />
                        <h1 className="text-fora-primary text-[18px] font-[400]">Passport Connected</h1>
                    </div>
                )}

                <ul className="hidden md:flex flex-row gap-5 md:ml-auto items-center text-white">
                    <NextLink href={"/about"}>
                        <li
                            className={`cursor-pointer text-fora-gray900 text-[18px] ${
                                router.asPath === "/about" ? "font-[700]" : "font-[400]"
                            }`}
                        >
                            About
                        </li>
                    </NextLink>
                    <NextLink href={"/full-program"}>
                        <li
                            className={`cursor-pointer text-fora-gray900 text-[18px] ${
                                router.asPath === "/events" ? "font-[700]" : "font-[400]"
                            }`}
                        >
                            Schedule
                        </li>
                    </NextLink>
                    <NextLink href={"/faq"}>
                        <li
                            className={`cursor-pointer text-fora-gray900 text-[18px] ${
                                router.asPath === "/faq" ? "font-[700]" : "font-[400]"
                            }`}
                        >
                            FAQ
                        </li>
                    </NextLink>
                    <a href={"https://zupass.org/"} target="_blank">
                        <li
                            className={`flex items-center gap-2 cursor-pointer text-fora-gray900 text-[18px] ${
                                router.asPath === "/faq" ? "font-[700]" : "font-[400]"
                            }`}
                        >
                            Zuzalu Passport
                        </li>
                    </a>
                    <a href={"https://zuzalu.streameth.org/"} target="_blank">
                        <li
                            className={`flex items-center gap-2 cursor-pointer text-fora-gray900 text-[18px] ${
                                router.asPath === "/faq" ? "font-[700]" : "font-[400]"
                            }`}
                        >
                            Livestreams
                        </li>
                    </a>
                    <NextLink href={"/zapps"}>
                        <li
                            className={`cursor-pointer text-fora-gray900 text-[18px] ${
                                router.asPath === "/zapps" ? "font-[700]" : "font-[400]"
                            }`}
                        >
                            ZApps
                        </li>
                    </NextLink>
                    {!userInfo && (
                        <a href="https://airtable.com/shrRZrZbozPE2g6HH" target="_blank" rel="noopener noreferrer">
                            <li className="cursor-pointer font-[400] text-[18px] text-fora-gray900">Apply Now</li>
                        </a>
                    )}
                    {userInfo ? (
                        <li
                            className={`cursor-pointer text-fora-gray900 text-[18px] ${
                                router.asPath === "/myprofile" ? "font-[700]" : "font-[400]"
                            }`}
                        >
                            <NextLink href="/myprofile">My Profile</NextLink>
                        </li>
                    ) : null}
                </ul>
                <div>
                    <ConnectPassportButton>
                        Connect Passport
                        </ConnectPassportButton>
                </div>
                <div className="md:hidden">
                    <button
                        className="p-3 text-fora-gray800 rounded-md outline-none focus:border-gray-400 focus:border "
                        onClick={() => setNavbar(!navbar)}
                    >
                        {navbar ? <FiX fontSize={32} /> : <FiMenu fontSize={32} />}
                    </button>
                </div>
            </div>
            {/* Add the responsive dropdown menu */}
            <div
                className={`${
                    navbar ? "block" : "hidden"
                } md:hidden absolute left-0 top-full mt-0 bg-fora-gray900 w-full flex flex-row items-start pt-[16px] pb-[32px] gap-[8px] px-[32px] space-x-2`}
            >
                <ul className="flex flex-col pt-[16px] pb-[32px] w-full gap-[32px] text-f8fffe text-lg uppercase">
                    <NextLink href={"/about"}>
                        <li
                            className={`cursor-pointer text-fora-gray900 text-[18px] ${
                                router.asPath === "/about" ? "font-[700]" : "font-[400]"
                            }`}
                        >
                            About
                        </li>
                    </NextLink>
                    <NextLink href={"/full-program"}>
                        <li
                            className={`cursor-pointer text-fora-gray900 text-[18px] ${
                                router.asPath === "/events" ? "font-[700]" : "font-[400]"
                            }`}
                        >
                            Schedule
                        </li>
                    </NextLink>
                    <NextLink href={"/faq"}>
                        <li
                            className={`cursor-pointer text-fora-gray900 text-[18px] ${
                                router.asPath === "/faq" ? "font-[700]" : "font-[400]"
                            }`}
                        >
                            FAQ
                        </li>
                    </NextLink>
                    <a href={"https://zuzalu.streameth.org/"} target="_blank">
                        <li
                            className={`flex items-center gap-2 cursor-pointer text-fora-gray900 text-[18px] ${
                                router.asPath === "/faq" ? "font-[700]" : "font-[400]"
                            }`}
                        >
                            Livestreams
                            <FiArrowUpRight />
                        </li>
                    </a>
                    <NextLink href={"/zapps"}>
                        <li
                            className={`cursor-pointer text-fora-gray900 text-[18px] ${
                                router.asPath === "/zapps" ? "font-[700]" : "font-[400]"
                            }`}
                        >
                            ZApps
                        </li>
                    </NextLink>
                    <a href={"https://zupass.org/"} target="_blank">
                        <li
                            className={`flex items-center gap-2 cursor-pointer text-fora-gray900 text-[18px] ${
                                router.asPath === "/faq" ? "font-[700]" : "font-[400]"
                            }`}
                        >
                            Zuzalu Passport
                            <FiArrowUpRight />
                        </li>
                    </a>
                    {!userInfo ? (
                        <a href="https://airtable.com/shrRZrZbozPE2g6HH" target="_blank" rel="noopener noreferrer">
                            <li className="cursor-pointer font-[400] text-[18px] text-fora-gray900">Apply Now</li>
                        </a>
                    ) : (
                        <NextLink href={"/myprofile"}>
                            <li
                                className={`cursor-pointer text-fora-gray900 text-[18px] ${
                                    router.asPath === "/myprofile" ? "font-[700]" : "font-[400]"
                                }`}
                            >
                                My Profile
                            </li>
                        </NextLink>
                    )}
                    <div className="w-full h-[1px] bg-fora-primary" />
                    <li
                        className={`capitalize text-fora-gray900 text-[18px] ${
                            router.asPath === "/faq" ? "font-[700]" : "font-[400]"
                        }`}
                    >
                        Contact: support@zuzalu.org
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Header
