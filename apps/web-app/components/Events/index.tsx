import NextLink from "next/link"
import { useRouter } from "next/router"
import NextImage from "next/image"
import moment from "moment"
import { EventsDTO } from "../../types"
import { sites } from "../../data/sites"

type Props = {
    events: EventsDTO[]
    sitedata: (typeof sites)["vitalia"]
}

const Events = ({ events, sitedata }: Props) => {
    const router = useRouter()
    let eventsArr = events

    const findOpenSessions = events.find((item) => item.name === "Open Sessions")

    if (findOpenSessions) {
        const idxOpenSessions = events.indexOf(findOpenSessions)
        eventsArr.splice(idxOpenSessions, 1)
    }

    eventsArr.sort((a, b) => {
        const dateA = new Date(a.startDate)
        const dateB = new Date(b.startDate)

        // Compare the two dates to determine the sort order
        if (dateA < dateB) {
            return -1
        }
        if (dateA > dateB) {
            return 1
        }
        return 0
    })

    const halfIndex = Math.ceil(eventsArr.length / 4)

    const firstHalf = eventsArr.slice(0, halfIndex + 1)
    const secondHalf = eventsArr.slice(halfIndex + 1)

    const handleClickEvent = (eventId: number) => {
        router.push(`/event/${eventId}`)
    }

    const formatDates = (startDate: Date, endDate: Date) => {
        const start = moment.utc(startDate)
        const end = moment.utc(endDate)

        if (start.month() === end.month()) {
            const formattedDate = `${start.format("MMMM D")} - ${end.format("D")}`
            return formattedDate
        }
        const formattedDate = `${start.format("MMMM D")} - ${end.format("MMMM D")}`
        return formattedDate
    }

    return (
        <div className="flex flex-col bg-fora-gray900 py-[40px] px-[36px]">
            <div className="flex flex-col md:flex-row md:gap-0 gap-5  w-full justify-between items-start">
                <div className="flexflex-col md:w-3/6 w-full text-fora-gray50">
                    <h6 className="tracking-[0.3em] font-semibold text-fora-gray400 uppercase">Events</h6>
                    <p className="tracking-[0.2em] font-medium text-lg text-gray600 mt-[0.2rem]">January 6th to March 1st, 2024</p>
                    <h3 className="font-light font-serif text-3xl md:text-4xl tracking-wide mt-[2rem]">
                        Renegade life scientists, biotechnology engineers and an entrepreneurially driven community of
                        people that care.
                    </h3>
                    <h3 className="font-light font-serif ext-3xl md:text-4xl tracking-wide"></h3>

                    <h1 className="text-md mt-[2rem]"></h1>
                </div>
                <NextLink href="/full-program">
                    <div className="my-[2rem] md:my-0 flex cursor-pointer border items-center rounded-full border-fora-primary/80 bg-fora-primary/10 hover:bg-fora-primary/20 transition-all duration-300 text-fora-primary/90 font-[600] py-2 px-4 ">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-fora-primary/90"
                        >
                            <g clip-path="url(#clip0_1349_17743)">
                                <path d="M11 6.5C11 6.36739 11.0527 6.24021 11.1464 6.14645C11.2402 6.05268 11.3674 6 11.5 6H12.5C12.6326 6 12.7598 6.05268 12.8536 6.14645C12.9473 6.24021 13 6.36739 13 6.5V7.5C13 7.63261 12.9473 7.75979 12.8536 7.85355C12.7598 7.94732 12.6326 8 12.5 8H11.5C11.3674 8 11.2402 7.94732 11.1464 7.85355C11.0527 7.75979 11 7.63261 11 7.5V6.5Z" />
                                <path d="M3.5 0C3.63261 0 3.75979 0.0526784 3.85355 0.146447C3.94732 0.240215 4 0.367392 4 0.5V1H12V0.5C12 0.367392 12.0527 0.240215 12.1464 0.146447C12.2402 0.0526784 12.3674 0 12.5 0C12.6326 0 12.7598 0.0526784 12.8536 0.146447C12.9473 0.240215 13 0.367392 13 0.5V1H14C14.5304 1 15.0391 1.21071 15.4142 1.58579C15.7893 1.96086 16 2.46957 16 3V14C16 14.5304 15.7893 15.0391 15.4142 15.4142C15.0391 15.7893 14.5304 16 14 16H2C1.46957 16 0.960859 15.7893 0.585786 15.4142C0.210714 15.0391 0 14.5304 0 14V3C0 2.46957 0.210714 1.96086 0.585786 1.58579C0.960859 1.21071 1.46957 1 2 1H3V0.5C3 0.367392 3.05268 0.240215 3.14645 0.146447C3.24021 0.0526784 3.36739 0 3.5 0V0ZM1 4V14C1 14.2652 1.10536 14.5196 1.29289 14.7071C1.48043 14.8946 1.73478 15 2 15H14C14.2652 15 14.5196 14.8946 14.7071 14.7071C14.8946 14.5196 15 14.2652 15 14V4H1Z" />
                            </g>
                            <defs>
                                <clipPath id="clip0_1349_17743">
                                    <rect width="20" height="20" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        <span className="ml-6 mr-6">FULL PROGRAM</span>
                    </div>
                </NextLink>
            </div>
            <div className="grid w-full gap-5 grid-cols-1">
                <div className="grid md:grid-rows-1 md:grid-cols-4 grid-cols-1 gap-5">
                    {firstHalf.map((event, index) => (
                        <div
                            key={index}
                            onClick={() => handleClickEvent(event.id)}
                            className={`flex overflow-hidden relative cursor-pointer flex-col gap-1 md:gap-2 justify-start md:justify-start p-5 md:p-[32px] h-[100px] md:h-[250px] rounded-[16px]`}
                        >
                            <div className="flex z-[1] absolute right-0 left-0 top-0 w-full h-full overflow-hidden">
                                <NextImage
                                    alt={"Event Background Image"}
                                    src={event.bg_image_url}
                                    width={900}
                                    height={400}
                                    objectFit="cover"
                                />
                            </div>

                            <h1 className="md:text-[24px] text-[16px] font-semibold capitalize z-[2]">{`${event.name}`}</h1>
                            <div className="flex gap-1 z-[2] font-[600]">
                                <NextImage src={"/vector-calendar.svg"} alt="calendar" width={15} height={15} />
                                <h1 className="text-black md:text-[14px] text-[10px]">
                                    {formatDates(event.startDate, event.endDate)}
                                </h1>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="grid md:grid-rows-1 md:grid-cols-4 grid-cols-1 gap-5">
                    {secondHalf.map((event, index) => (
                        <div
                            key={index}
                            onClick={() => handleClickEvent(event.id)}
                            className={`flex overflow-hidden relative cursor-pointer flex-col gap-1 md:gap-2 justify-start md:justify-start p-5 md:p-[32px] h-[100px] md:h-[250px] rounded-[16px]`}
                        >
                            <div className="flex z-[1] absolute right-0 left-0 top-0 w-full h-full overflow-hidden">
                                <NextImage
                                    alt={"Event Background Image"}
                                    src={event.bg_image_url}
                                    width={900}
                                    height={400}
                                    objectFit="cover"
                                />
                            </div>

                            <h1 className="md:text-[24px] text-[16px] font-semibold capitalize z-[2]">{`${event.name}`}</h1>
                            <div className="flex gap-1 z-[2] font-[600]">
                                <NextImage src={"/vector-calendar.svg"} alt="calendar" width={15} height={15} />
                                <h1 className="text-black md:text-[14px] text-[10px]">
                                    {formatDates(event.startDate, event.endDate)}
                                </h1>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Events
