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
    sitedata: {
        title: string
    }
}

const HomeTemplate = ({ sessions, events, sitedata }: Props) => {
    const { userInfo } = useUserAuthenticationContext()
    const { requestSignedZuID } = useUserPassportContext()

    return (
        <BaseTemplate sitedata={sitedata}>
            <Head>
                <title>{sitedata.title} - home</title>
                <meta property="og:title" content={sitedata.title} key="title" />
            </Head>

            <div className="flex flex-col min-h-[100vh] p-5 gap-10">
                {!userInfo ? (
                    <>
                        <MainSection sitedata={sitedata} />
                        <div className="flex flex-col items-center px-[32px] gap-[8px] bg-fora-gray200 rounded-[16px] z-10">
                            <div className="flex flex-col md:flex-row justify-center items-center p-[16px] gap-[24px]">
                                <p className="font-[600] text-[18px] w-[310px] h-[50px] md:w-auto md:h-auto">
                                    Get access to tickets and build your schedule!
                                </p>
                                <button
                                    className="flex flex-row justify-center items-center py-[8px] w-[310px] md:w-[416px] h-[40px] px-[16px] gap-[8px] bg-[#1C2928] rounded-[8px]"
                                    onClick={requestSignedZuID}
                                >
                                    <NextImage
                                        alt={"Passport Icon"}
                                        src={"/passport-vector.svg"}
                                        width={16}
                                        height={16}
                                    />
                                    <p className="font-[600] text-[16px] text-[#F8FFFE]">Connect Passport</p>
                                </button>
                                <NextLink href="/full-program">
                                    <button className="flex flex-row justify-center items-center py-[8px] px-[16px] w-[310px] md:w-[416px] h-[40px] gap-[8px] bg-[#1C2928] rounded-[8px]">
                                        <NextImage
                                            alt={"Calendar Icon"}
                                            src={"/calendar-vector.svg"}
                                            width={16}
                                            height={16}
                                        />
                                        <p className="font-[600] text-[16px] text-[#F8FFFE]">Full Program</p>
                                    </button>
                                </NextLink>
                            </div>
                        </div>
                        <Events events={events} />
                    </>
                ) : (
                    <>
                        <div className="flex md:hidden h-full w-full items-center justify-center rounded-[8px]">
                            <NextImage
                                src="https://polcxtixgqxfuvrqgthn.supabase.co/storage/v1/object/public/zulalu-images/Tag%20(1).png"
                                objectFit="fill"
                                alt="event-image"
                                style={{ borderRadius: "18px" }}
                                width="600"
                                height="345"
                                quality={100}
                            />
                        </div>
                        <div className="hidden md:flex h-full w-full items-center justify-center rounded-[8px]">
                            <NextImage
                                src="https://polcxtixgqxfuvrqgthn.supabase.co/storage/v1/object/public/zulalu-images/Tag.png"
                                objectFit="fill"
                                alt="event-image"
                                style={{ borderRadius: "18px" }}
                                width="1900"
                                height="245"
                                quality={100}
                            />
                        </div>
                        <div className="p-5 bg-white rounded-[16px]">
                            <div className="flex flex-col md:flex-row md:gap-0 gap-5 p-[16px] w-full justify-between items-start">
                                <div className="flex gap-5">
                                    <h1 className="font-semibold text-[40px]">
                                        Upcoming Sessions (
                                        {`${moment.utc(new Date()).format("MMMM Do")} - ${moment
                                            .utc(new Date())
                                            .add(7, "days")
                                            .format("MMMM Do")}`}
                                        )
                                    </h1>
                                </div>
                                <NextLink href="/full-program">
                                    <div className="flex cursor-pointer items-center gap-2 bg-white border border-primary text-fora-primary font-[600] py-[8px] px-[16px] rounded-[8px]">
                                        <NextImage
                                            alt={"Calendar Icon"}
                                            src={"/vector-calendar.svg"}
                                            width={16}
                                            height={16}
                                        />
                                        FULL PROGRAM
                                    </div>
                                </NextLink>
                            </div>
                            <CalendarPageSessions sessions={sessions} />
                        </div>
                    </>
                )}
            </div>
        </BaseTemplate>
    )
}

export default HomeTemplate
