import moment from "moment"
import NextImage from "next/image"
import { IoMdArrowBack } from "react-icons/io"
import { Parser } from "html-to-react"

import Loading from "../Loading"

type NewSessionState = {
    description: string
    equipment: string
    event_id: number
    event_type: string
    maxRsvp: string
    format: string
    hasTicket: boolean
    info: string
    level: string
    location: string
    custom_location: string
    name: string
    startDate: string
    endTime: string
    startTime: string
    tags: string[]
    team_members: {
        name: string
        role: string
    }[]
    track: string
    event_slug: string
    event_item_id: number
}

type Props = {
    setSteps: (step: number) => void
    newSession: NewSessionState
    handleSubmit: () => void
    isLoading: boolean
}

const Step2 = ({ setSteps, newSession, handleSubmit, isLoading }: Props) => {
    const parser = new Parser()
    const reactContent = parser.parse(newSession.description)

    return (
        <div className="flex flex-col w-full gap-8 bg-white rounded-lg mt-5">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <h1 className="text-[16px] font-[600]">{newSession.track}</h1>
                    <h1 className="text-[22px] font-[600]">{newSession.name}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <NextImage src="/vector-calendar.svg" width={20} height={20} />
                    <h1>{moment.utc(newSession.startDate).format("dddd, MMMM DD")}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <NextImage src="/vector-location.svg" width={20} height={20} />
                    <h1 className="text-[18px]">
                        {newSession.location === "Other" ? newSession.custom_location : newSession.location}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <NextImage src="/vector-clock.svg" width={20} height={20} />
                    <h1>
                        {newSession.startTime}-{newSession.endTime}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <NextImage src="/vector-clock.svg" width={20} height={20} />
                    <h1>{newSession.maxRsvp} RSVPs Allowed</h1>
                </div>
                <div className="flex items-center gap-2 mt-10">
                    <h1 className="text-[18px]">{reactContent}</h1>
                </div>
            </div>
            <div className="w-full flex flex-col md:flex-row gap-5 justify-center items-center mb-10">
                <button
                    type="button"
                    className="w-full flex flex-row border-zulalu-primary border font-[600] justify-center items-center py-[8px] px-[16px] gap-[8px] bg-white rounded-[8px] text-black text-[16px]"
                    onClick={() => setSteps(1)}
                >
                    <IoMdArrowBack size={20} />
                    BACK
                </button>
                <button
                    type="button"
                    disabled={isLoading}
                    className="w-full flex flex-row font-[600] justify-center items-center py-[8px] px-[16px] gap-[8px] bg-[#35655F] rounded-[8px] text-white text-[16px]"
                    onClick={() => handleSubmit()}
                >
                    {isLoading ? <Loading size="xs" /> : "SAVE"}
                </button>
            </div>
        </div>
    )
}

export default Step2
