import Head from "next/head"
import NextImage from "next/image"
import NextLink from "next/link"
import moment from "moment"
import MainSection from "../../components/MainSection"
import { useUserAuthenticationContext } from "../../context/UserAuthenticationContext"
import { useUserPassportContext } from "../../context/UserPassportContext"
import CalendarPageSessions from "../../components/Sessions/CalendarPageSessions"
import Events from "../../components/Events"

import BaseTemplate from "../Base"
import { SessionsDTO, EventsDTO } from "../../types"

type Props = {
    sessions: SessionsDTO[]
    events: EventsDTO[]
}

const HomeTemplate = ({ sessions, events }: Props) => {
    const { userInfo } = useUserAuthenticationContext()
    const { requestSignedZuID } = useUserPassportContext()

    return (
        <BaseTemplate>
            <Head>
                <title>Zuzalu - home</title>
                <meta property="og:title" content="Zuzalu" key="title" />
            </Head>

            <div className="flex flex-col max-h-fit bg-[#EEEEF0] pb-[25px] pt-[15px] md:pb-[50px] md:pt-[25px] px-5 gap-10">
                <>
                    <MainSection />
                    <div className="flex flex-col items-center justify-between w-full p-[16px]  md:px-[20px] md:py-[16px] gap-[8px] bg-white rounded-[16px] lg:flex-row">
                        <p className="font-semibold text-[16px] md:text-[20px] w-fit">
                            View other Zuzalu schedules & add your own schedules
                        </p>
                        <div className="flex flex-col lg:flex-row justify-end w-full lg:w-7/12">
                            <button
                                className="flex flex-row justify-center items-center my-[10px] py-[8px] w-full lg:w-5/12 bg-[#1C2928] rounded-[8px] lg:my-0 lg:mr-[20px]"
                                onClick={requestSignedZuID}
                            >
                                {/* <NextImage src={"/passport-vector.svg"} width={16} height={16} /> */}
                                <p className="font-[500] text-[16px] lg:text-[18px] text-[white]">Connect Passport</p>
                            </button>
                            <NextLink href="/full-program">
                                <button className="flex flex-row justify-center items-center py-[8px] w-full lg:w-5/12 bg-[#1C2928] rounded-[8px]">
                                    {/* <NextImage src={"/calendar-vector.svg"} width={16} height={16} /> */}
                                    <p className="font-[500] text-[16px] lg:text-[18px] text-[white]">View Schedules</p>
                                </button>
                            </NextLink>
                        </div>
                    </div>
                    {/* <Events events={events} /> */}
                </>
            </div>
        </BaseTemplate>
    )
}

export default HomeTemplate
