import { useEffect, useState } from "react"
import axios from "axios"
import NextImage from "next/image"
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"
import BaseTemplate from "../Base"
import Sessions from "../../components/Sessions/CalendarPageSessions"
import { useUserAuthenticationContext } from "../../context/UserAuthenticationContext"
import CalendarSessionModal from "../../components/CalendarSessionModal"
import { EventsDTO, SessionsDTO } from "../../types"
import CreateProfileModal from "../../components/CreateProfileModal"
import EditProfileModal from "../../components/EditProfileModal"

const supabase = createBrowserSupabaseClient()

type Props = {
    events: EventsDTO[]
    sessions: SessionsDTO[]
}

const MyProfilePage = ({ events, sessions }: Props) => {
    const { userInfo, userSessions } = useUserAuthenticationContext()
    const [eventsOpt, setEventsOpt] = useState<string[]>([])
    const [selectedOpt, setSelectedOpt] = useState<string[]>([])
    const [openAddSessionModal, setOpenAddSessionModal] = useState(false)
    const [openCreateProfileModal, setOpenCreateProfileModal] = useState(false)
    const [openEditProfileModal, setOpenEditProfileModal] = useState(false)
    const [profile, setProfile] = useState<any>()
    const [reRender, setRerender] = useState(false)

    async function fetchProfile() {
        if (userInfo !== undefined) {
            try {
                const response = await axios.post(
                    "/api/fetchUserProfile",
                    { id: userInfo.id },
                    {
                        headers: {
                            htmlcode: process.env.KEY_TO_API as string
                        }
                    }
                )
                if (response.status === 200) {
                    setProfile(response.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    const openPDFPopup = async (apiURL: any) => {
        const response = await fetch(`/api/download-ticket?apiURL=${encodeURIComponent(apiURL)}`)
        const pdfBlob = await response.blob()
        const pdfURL = URL.createObjectURL(pdfBlob)
        window.open(pdfURL, "_blank", "resizable=yes,scrollbars=yes,width=800,height=600")
    }

    useEffect(() => {
        if (userSessions.length > 0) {
            const eventsName = userSessions.map((item) => item.events).map((event) => event.name.replace("\n", ""))
            const uniqueValues = eventsName.filter((value, index, self) => self.indexOf(value) === index)
            setEventsOpt(uniqueValues)
        }
    }, [userSessions])

    useEffect(() => {
        fetchProfile()
    }, [userInfo, reRender])

    const handleOptionChange = (i: string) => {
        if (selectedOpt.includes(i)) {
            setSelectedOpt(selectedOpt.filter((item) => item !== i))
        } else {
            setSelectedOpt([...selectedOpt, i])
        }
    }

    const sortByDate = userSessions.sort((a, b) => (new Date(a.startDate) as any) - (new Date(b.startDate) as any))

    const filteredSessions =
        selectedOpt.length > 0
            ? sortByDate.filter((item) => selectedOpt.includes(item.events.name.replace("\n", "")))
            : sortByDate
    return (
        <BaseTemplate>
            <div className="flex flex-col bg-fora-gray100 px-4 md:px-[24px] py-4 md:py-[24px] gap-4 md:gap-[16px]">
                {profile ? (
                    <div className="flex md:hidden flex-col items-start gap-[8px] bg-white w-full rounded-[16px]">
                        <div className="flex flex-col items-start pt-[16px] px-[16px] pb-[24px] gap-[24px] w-full">
                            <div className="flex flex-col items-start justify-center w-full">
                                <div className="flex flex-row justify-between items-center gap-[24px] w-full">
                                    <div className="flex flex-row items-start gap-[8px]">
                                        <NextImage src={"/user-icon-5.svg"} alt="calendar" width={24} height={24} />
                                        <p className="font-[700] text-[18px] text-[#1C2928]">
                                            {userInfo && userInfo.userName}
                                        </p>
                                    </div>
                                    <button onClick={() => setOpenEditProfileModal(true)}>
                                        <NextImage src={"/vector-pencil.svg"} alt="pencil" height={24} width={24} />
                                    </button>
                                </div>
                                {profile.location && (
                                    <div className="flex flex-row items-center gap-[8px] w-full">
                                        <div className="flex flex-row items-start py-[8px] px-[4px] gap-[8px]">
                                            <NextImage src={"/pin-map.svg"} alt="mappin" width={16} height={16} />
                                        </div>
                                        <p className="font-[600] text-[16px] text-[#1C2928]">{profile?.location}</p>
                                    </div>
                                )}
                                {profile?.company && (
                                    <div className="flex flex-row items-center gap-[8px]">
                                        <div className="flex flex-row items-start py-[8px] px-[4px] gap-[8px]">
                                            <NextImage src={"/briefcase.svg"} alt="mappin" width={16} height={16} />
                                        </div>
                                        <p className="font-[600] text-[16px] text-[#1C2928]">{profile?.company}</p>
                                    </div>
                                )}

                                {profile?.bio && (
                                    <div className="flex flex-row items-start gap-[8px]">
                                        <div className="flex flex-row items-start py-[8px] px-[4px] gap-[8px] w-[24px] h-[24px]">
                                            <NextImage src={"/info.svg"} alt="info" width={16} height={16} />
                                        </div>
                                        <p className="font-[400] text-[16px] text-[#1C2928] w-[310px]">
                                            {profile?.bio}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setOpenCreateProfileModal(true)}
                        className="flex md:hidden flex-row font-[600] justify-center items-center py-[8px] px-[16px] gap-[8px] bg-[#35655F] rounded-[8px] text-white text-[16px] w-full h-[48px]"
                    >
                        SET UP PROFILE
                    </button>
                )}
                <CreateProfileModal
                    closeModal={setOpenCreateProfileModal}
                    isOpen={openCreateProfileModal}
                    reRender={reRender}
                    setRerender={setRerender}
                />
                {profile ? (
                    <EditProfileModal
                        closeModal={setOpenEditProfileModal}
                        isOpen={openEditProfileModal}
                        userProfile={profile}
                        setRerender={setRerender}
                        reRender={reRender}
                    />
                ) : (
                    ""
                )}
                <CalendarSessionModal
                    closeModal={setOpenAddSessionModal}
                    isOpen={openAddSessionModal}
                    events={events}
                    sessions={sessions}
                />
                {profile ? (
                    <div className="flex md:hidden flex-col items-start py-[8px] px-[2px] gap-[8px]">
                        <button
                            onClick={() => setOpenAddSessionModal(true)}
                            className="flex flex-row font-[600] justify-center items-center py-[8px] px-[16px] gap-[8px] bg-[#35655F] rounded-[8px] text-white text-[16px] w-full h-[48px]"
                        >
                            CREATE SESSION
                        </button>
                    </div>
                ) : (
                    ""
                )}
                <div className="flex flex-col md:flex-row justify-between h-full">
                    <div className="px-[32px] pt-[16px] pb-[40px] flex flex-col items-start bg-white rounded-[8px] w-full md:w-4/6 gap-[8px]">
                        <div className="flex flex-col justify-between w-full gap-[16px]">
                            <div className="flex items-center py-[24px] px-[16px] gap-[24px]">
                                <h1 className="font-semibold text-[24px] md:text-[40px]">My Sessions</h1>
                                {profile ? (
                                    <button
                                        onClick={() => setOpenAddSessionModal(true)}
                                        className="hidden md:flex flex-row font-[600] justify-center items-center py-[8px] px-[16px] gap-[8px] bg-[#35655F] rounded-[8px] text-white text-[16px] h-[40px]"
                                    >
                                        CREATE SESSION
                                    </button>
                                ) : (
                                    ""
                                )}
                            </div>
                            <div className="flex flex-col items-start p-[2px] gap-[16px]">
                                <Sessions sessions={filteredSessions} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col pl-0 md:pl-5 w-full md:w-2/6 gap-[16px] mt-10 md:mt-0">
                        {profile ? (
                            <div className="hidden md:flex flex-col items-start gap-[8px] bg-white w-full rounded-[16px]">
                                <div className="flex flex-col items-start pt-[16px] px-[16px] pb-[24px] gap-[24px] w-full">
                                    <div className="flex flex-col items-start justify-center w-full gap-[24px]">
                                        <div className="flex flex-row justify-between items-center gap-[24px] w-full">
                                            <div className="flex flex-row items-start gap-[8px]">
                                                <NextImage
                                                    src={"/user-icon-5.svg"}
                                                    alt="calendar"
                                                    width={24}
                                                    height={24}
                                                />
                                                <p className="font-[700] text-[18px] text-[#1C2928]">
                                                    {userInfo && userInfo.userName}
                                                </p>
                                            </div>
                                            <button onClick={() => setOpenEditProfileModal(true)}>
                                                <NextImage
                                                    src={"/vector-pencil.svg"}
                                                    alt="pencil"
                                                    height={24}
                                                    width={24}
                                                />
                                            </button>
                                        </div>
                                        <div className="flex flex-row items-center gap-[8px] w-full">
                                            <div className="flex flex-row items-start py-[8px] px-[4px] gap-[8px]">
                                                <NextImage src={"/pin-map.svg"} alt="mappin" width={16} height={16} />
                                            </div>
                                            <p className="font-[600] text-[16px] text-[#1C2928]">{profile?.location}</p>
                                        </div>
                                        <div className="flex flex-row items-center gap-[8px]">
                                            <div className="flex flex-row items-start py-[8px] px-[4px] gap-[8px]">
                                                <NextImage src={"/briefcase.svg"} alt="mappin" width={16} height={16} />
                                            </div>
                                            <p className="font-[600] text-[16px] text-[#1C2928]">{profile?.company}</p>
                                        </div>
                                        <div className="flex flex-row items-start gap-[8px]">
                                            <div className="flex flex-row items-start py-[8px] px-[4px] gap-[8px] w-[24px] h-[24px]">
                                                <NextImage src={"/info.svg"} alt="info" width={16} height={16} />
                                            </div>
                                            <p className="font-[400] text-[16px] text-[#1C2928] w-[310px]">
                                                {profile?.bio}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setOpenCreateProfileModal(true)}
                                className="hidden md:flex flex-row font-[600] justify-center items-center py-[8px] px-[16px] gap-[8px] bg-[#35655F] rounded-[8px] text-white text-[16px] w-full h-[48px]"
                            >
                                SET UP PROFILE
                            </button>
                        )}
                        <div className="flex flex-col p-5 gap-5 bg-white rounded-[8px]">
                            <h1 className="text-[24px] font-semibold">My Sessions</h1>
                            <div className="flex gap-2 flex-col items-start justify-center">
                                {eventsOpt &&
                                    eventsOpt.map((item, index) => (
                                        <label
                                            key={index}
                                            className="flex w-auto items-center gap-2 capitalize text-[16px] cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                name="checkbox"
                                                value="value"
                                                checked={selectedOpt.includes(item)}
                                                onChange={() => handleOptionChange(item)}
                                            />
                                            {item}
                                        </label>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BaseTemplate>
    )
}

export default MyProfilePage
