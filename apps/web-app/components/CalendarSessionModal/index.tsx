import { Dialog, Transition } from "@headlessui/react"
import { useRouter } from "next/router"
import { Fragment, useRef, useState } from "react"
import { format, parse, startOfDay } from "date-fns"
import { toast } from "react-toastify"
import axios from "axios"
import moment from "moment"
import ModalSteps from "./ModalSteps"
import Step1 from "./Step1"
import Step2 from "./Step2"
import { EventsDTO, SessionsDTO, NewSessionState } from "../../types"
import { displayDateWithoutTimezone, to24HourFormat } from "../../data/dateFormat"

type Props = {
    isOpen: boolean
    closeModal: (b: boolean) => void
    events: EventsDTO[]
    event?: EventsDTO
    sessions: SessionsDTO[]
}

const CalendarSessionModal = ({ isOpen, closeModal, events, sessions, event }: Props) => {
    const checkIfSessionByEventPage = !!event

    const router = useRouter()
    const questionTextRef = useRef(null)
    const [isLoading, setIsLoading] = useState(false)
    const [steps, setSteps] = useState(1)
    const [newSession, setNewSession] = useState<NewSessionState>({
        description: "",
        name: "",
        team_members: [],
        startDate: format(new Date(), "yyyy-MM-dd"),
        startTime: "",
        endTime: "",
        location: "",
        custom_location: "",
        tags: [],
        info: "",
        hasTicket: false,
        format: "Live",
        maxRsvp: "",
        level: "Beginner",
        equipment: "",
        track: checkIfSessionByEventPage ? event.name : "",
        event_id: checkIfSessionByEventPage ? event.id : 97,
        event_type: "Workshop",
        event_slug: checkIfSessionByEventPage ? event.slug : "",
        event_item_id: checkIfSessionByEventPage ? event.item_id : 111
    })

    const [amountTickets, setAmountTickets] = useState("0")

    const handleSubmit = async () => {
        setIsLoading(true)

        try {
            const createEventDB = await axios.post(
                "/api/createSession",
                {
                    ...newSession,
                    startDate: displayDateWithoutTimezone(newSession.startDate),
                    startTime: to24HourFormat(newSession.startTime),
                    endTime: to24HourFormat(newSession.endTime)
                },
                {
                    headers: {
                        htmlcode: process.env.KEY_TO_API as string // Pass cookies from the incoming request
                    }
                }
            )
        } catch (error) {
            console.log("Error creating session", error)
            toast.error("Failed to create an event", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
            })
        }

        router.reload()

        // CLEAN EVERYTHING AFTER CREATING EVENT
        setIsLoading(false)
        setSteps(1)
        setNewSession({
            description: "",
            name: "",
            team_members: [],
            startDate: format(new Date(), "yyyy-MM-dd"),
            startTime: "00",
            endTime: "00",
            location: "Amphitheater",
            custom_location: "",
            tags: [],
            info: "",
            maxRsvp: "",
            event_id: 97,
            hasTicket: false,
            format: "Live",
            level: "Beginner",
            equipment: "",
            track: "ZK Week",
            event_type: "Workshop",
            event_slug: "CoordiNations",
            event_item_id: 111
        })
        closeModal(false)
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" initialFocus={questionTextRef} className="relative z-40 " onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 h-full ">
                    <div className="flex h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="flex flex-col h-full w-5/6 overflow-y-scroll max-w-[650px] transform rounded-lg bg-white text-left align-middle  transition-all">
                                <div className="w-full h-full py-5 px-10">
                                    <div className="flex w-full justify-between items-center">
                                        <h1 className="text-[24px] font-[600]">
                                            {steps === 1 ? "Session Info" : "Review Session"}
                                        </h1>
                                        <div
                                            onClick={() => closeModal(false)}
                                            className="cursor-pointer flex p-4 items-center border-2 border-black justify-center w-[18px] h-[18px] rounded-full"
                                        >
                                            X
                                        </div>
                                    </div>
                                    <ModalSteps steps={steps} />
                                    {steps === 1 && (
                                        <Step1
                                            checkIfSessionByEventPage={checkIfSessionByEventPage}
                                            event={event}
                                            events={events}
                                            setSteps={setSteps}
                                            newSession={newSession}
                                            setNewSession={setNewSession}
                                            sessions={sessions}
                                        />
                                    )}

                                    {steps === 2 && (
                                        <Step2
                                            setSteps={setSteps}
                                            newSession={newSession}
                                            isLoading={isLoading}
                                            handleSubmit={handleSubmit}
                                            amountTickets={amountTickets}
                                        />
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default CalendarSessionModal
