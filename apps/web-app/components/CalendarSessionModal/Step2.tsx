import NextImage from "next/image"
import { IoMdArrowBack } from "react-icons/io"
import { Parser } from "html-to-react"
import { format, parse } from "date-fns"

import Loading from "../Loading"
import { NewSessionState } from "../../types"

type Props = {
    setSteps: (step: number) => void
    newSession: NewSessionState
    handleSubmit: Function
    isLoading: boolean
    amountTickets: string
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
                    <NextImage alt="Calendar icon" src="/vector-calendar.svg" width={20} height={20} />
                    <h1>{format(parse(newSession.startDate, "yyyy-MM-dd", new Date()), "EEEE, MMMM dd")}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <NextImage alt="Location icon" src="/vector-location.svg" width={20} height={20} />
                    <h1 className="text-[18px]">
                        {newSession.location === "Other" ? newSession.custom_location : newSession.location}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <NextImage alt="Clock icon" src="/vector-clock.svg" width={20} height={20} />
                    <h1>
                        {newSession.startTime}-{newSession.endTime}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <NextImage  alt="Clock icon" src="/vector-clock.svg" width={20} height={20} />
                    <h1>{newSession.maxRsvp} RSVPs Allowed</h1>
                </div>
                <div className="flex items-center gap-2 mt-10">
                    <h1 className="text-[18px]">{reactContent}</h1>
                </div>
            </div>
            <div className="w-full flex flex-col md:flex-row gap-5 justify-center items-center mb-10">
                <button
                    type="button"
                    className="w-full flex flex-row border-fora-primary border font-[600] justify-center items-center py-[8px] px-[16px] gap-[8px] bg-white rounded-[8px] text-black text-[16px]"
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
                    {isLoading ? <Loading size="xs" /> : "CREATE SESSION!"}
                </button>
            </div>
        </div>
    )
}

export default Step2
