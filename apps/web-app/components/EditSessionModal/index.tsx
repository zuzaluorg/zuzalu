import { Dialog, Transition } from "@headlessui/react"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import { Fragment, useRef, useState } from "react"
import axios from "axios"

import ModalSteps from "./ModalSteps"
import Step1 from "./Step1"
import Step2 from "./Step2"
import { EventsDTO, SessionsDTO, NewSessionState } from "../../types"
import { to12HourFormat, to24HourFormat } from "../../data/dateFormat"

type Props = {
    isOpen: boolean
    closeModal: (b: boolean) => void
    session: SessionsDTO
    sessions: SessionsDTO[]
    events: EventsDTO[]
}

const EditSessionModal = ({ isOpen, closeModal, session, sessions, events }: Props) => {
    const router = useRouter()
    const questionTextRef = useRef(null)
    const [isLoading, setIsLoading] = useState(false)
    const [steps, setSteps] = useState(1)
    const [newSession, setNewSession] = useState<NewSessionState>({
        description: session.description,
        name: session.name,
        team_members: session.team_members,
        startDate: String(session.startDate),
        startTime: to12HourFormat(session.startTime),
        endTime: to12HourFormat(session.end_time),
        location: session.location,
        custom_location: session.custom_location,
        tags: session.tags,
        info: session.info,
        hasTicket: session.hasTicket,
        format: session.format,
        maxRsvp: String(session.capacity === null ? 0 : session.capacity),
        level: session.level,
        equipment: session.equipment,
        track: session.track,
        event_id: session.event_id,
        event_type: session.type,
        event_slug: session.event_slug,
        event_item_id: session.event_item_id
    })

    const handleSubmit = async () => {
        setIsLoading(true)

        try {
            await axios
                .post(
                    "/api/updateSession",
                    {
                        ...newSession,
                        startTime: to24HourFormat(newSession.startTime),
                        endTime: to24HourFormat(newSession.endTime),
                        id: session.id
                    },
                    {
                        headers: {
                            htmlcode: process.env.KEY_TO_API as string // Pass cookies from the incoming request
                        }
                    }
                )
                .then((res) => {
                    console.log("UPDATE RES", res)
                })
                .catch((res) => {
                    console.log("ERROR RES", res)
                })
        } catch (error) {
            return toast.error("Failed to create an event", {
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

        // CLEAN EVERYTHING AFTER CREATING EVENT

        setIsLoading(false)
        setSteps(1)
        setNewSession({
            description: session.description,
            name: session.name,
            team_members: session.team_members,
            startDate: String(session.startDate),
            startTime: session.startTime,
            endTime: session.end_time,
            location: session.location,
            custom_location: session.custom_location,
            tags: session.tags,
            info: session.info,
            hasTicket: session.hasTicket,
            format: session.format,
            maxRsvp: String(session.capacity),
            level: session.level,
            equipment: session.equipment,
            track: session.track,
            event_id: session.event_id,
            event_type: session.type,
            event_slug: session.event_slug,
            event_item_id: session.event_item_id
        })

        closeModal(false)
        router.reload()
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
                            <Dialog.Panel className="flex flex-col h-full w-5/6 overflow-y-scroll max-w-full transform rounded-lg bg-white text-left align-middle  transition-all">
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
                                            newSession={newSession}
                                            setNewSession={setNewSession}
                                            setSteps={setSteps}
                                            sessions={sessions}
                                            sessionId={session.id}
                                            events={events}
                                        />
                                    )}

                                    {steps === 2 && (
                                        <Step2
                                            setSteps={setSteps}
                                            newSession={newSession}
                                            handleSubmit={handleSubmit}
                                            isLoading={isLoading}
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

export default EditSessionModal
