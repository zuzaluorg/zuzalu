import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useRef, useState } from "react"
import moment from "moment"

import { SessionsDTO } from "../../types"

type Props = {
    isOpen: boolean
    closeModal: (b: boolean) => void
    sessions: SessionsDTO[]
    startDate: Date
    location: string
}

const SlotsAvailableModal = ({ sessions, closeModal, isOpen, startDate, location }: Props) => {
    const questionTextRef = useRef(null)

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" initialFocus={questionTextRef} className="relative z-[50]" onClose={closeModal}>
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
                                    <div className="flex w-full justify-end items-center">
                                        <div
                                            onClick={() => closeModal(false)}
                                            className="cursor-pointer flex p-4 border-2 border-black items-center justify-center w-[25px] h-[25px] rounded-full"
                                        >
                                            X
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-5">
                                        <h1 className="text-[24px] bold">
                                            Sessions Booked for {moment.utc(startDate).format("MM/DD/YYYY")} at{" "}
                                            {location}
                                        </h1>
                                        <div className="flex flex-col gap-5">
                                            {sessions.map((item, index) => {
                                                const sessionStart = moment.utc(`${item.startDate}T${item.startTime}`)
                                                const sessionEnd = sessionStart.clone().add(item.duration, "minutes")
                                                return (
                                                    <div key={index} className="flex flex-col gap-2">
                                                        <h1 className="font-[600]">{item.name}</h1>
                                                        <div>
                                                            <h1>{`${sessionStart.format("HH:mm")} > ${sessionEnd.format(
                                                                "HH:mm"
                                                            )}`}</h1>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default SlotsAvailableModal
