import { ComponentType, useEffect, useRef, useState } from "react"
import dynamic, { Loader } from "next/dynamic"
import DatePicker from "react-datepicker"
import { format, parse, startOfDay } from "date-fns"
import NextImage from "next/image"
import axios from "axios"
import moment from "moment"
import { toast } from "react-toastify"
import { IoMdArrowBack } from "react-icons/io"
import { EditorState } from "draft-js"
import { stateToHTML } from "draft-js-export-html"
import { EditorProps } from "react-draft-wysiwyg"
import { stateFromHTML } from "draft-js-import-html"

import UserIcon from "../../public/userIcon.svg"

import TimeDropdown from "../TimeDropdown"

import { removeTimezone, displayDateWithoutTimezone, to24HourFormat } from "../../data/dateFormat"

import {
    TracksDTO,
    FormatDTO,
    LevelDTO,
    LocationDTO,
    EventTypeDTO,
    EventsDTO,
    SessionsDTO,
    UserDTO,
    NewSessionState
} from "../../types"

type Props = {
    newSession: NewSessionState
    setNewSession: (newEvent: NewSessionState) => void
    setSteps: (steps: number) => void
    sessions: SessionsDTO[]
    events: EventsDTO[]
    event?: EventsDTO
    checkIfSessionByEventPage: boolean
}

// @ts-ignore
const loadEditor: Loader<EditorProps> = async () => {
    const mod = await import("react-draft-wysiwyg")
    return mod.Editor as ComponentType<EditorProps>
}

const Editor = dynamic<EditorProps>(loadEditor, { ssr: false })

const Step1 = ({ events, newSession, setNewSession, setSteps, sessions, checkIfSessionByEventPage, event }: Props) => {
    const {
        name,
        team_members,
        startDate,
        tags,
        startTime,
        endTime,
        location,
        equipment,
        event_id,
        description,
        maxRsvp,
        track
    } = newSession

    const wraperRef = useRef(null)
    const [tag, setTag] = useState("")
    const [rerender, setRerender] = useState(true)

    const [teamMemberInput, setTeamMemberInput] = useState("")
    const [suggestions, setSuggestions] = useState<UserDTO[]>([])

    const [display, setDisplay] = useState(false)
    const [tracksOpt, setTracksOpt] = useState<TracksDTO[]>([])
    const [formatsOpt, setFormatsOpt] = useState<FormatDTO[]>()
    const [levelsOpt, setLevelsOpt] = useState<LevelDTO[]>()
    const [locationsOpt, setLocationsOpt] = useState<LocationDTO[]>()
    const [eventTypesOpt, setEventTypesOpt] = useState<EventTypeDTO[]>()

    const htmlToEditorState = (html: string) => {
        const contentState = stateFromHTML(html)
        return EditorState.createWithContent(contentState)
    }

    const [richTextEditor, setRichTextEditor] = useState<EditorState>(htmlToEditorState(description))

    const onEditorStateChange = (editorState: EditorState) => {
        setRichTextEditor(editorState)
        const html = stateToHTML(editorState.getCurrentContent())

        setNewSession({ ...newSession, description: html })
    }

    const handleSelectEventTrack = (eventName: string) => {
        const selectedEvent = events.find((item) => item.name === eventName)
        if (!selectedEvent) return

        if (selectedEvent.id === 101) {
            setNewSession({
                ...newSession,
                track: eventName,
                event_id: selectedEvent.id,
                event_slug: selectedEvent.slug,
                event_item_id: selectedEvent.item_id
            })
        } else {
            setNewSession({
                ...newSession,
                track: eventName,
                location: "",
                event_id: selectedEvent.id,
                event_slug: selectedEvent.slug,
                event_item_id: selectedEvent.item_id
            })
        }
    }

    const handleAddTeamMember = ({ userName, role }: { userName: string; role: string }) => {
        setNewSession({ ...newSession, team_members: [...newSession.team_members, { name: userName, role }] })
        setDisplay(false)
    }

    const handleRemoveTeamMember = (index: number) => {
        team_members.splice(index, 1)
        setRerender(!rerender)
    }

    const handleAddTag = () => {
        setNewSession({ ...newSession, tags: [...newSession.tags, tag] })
        setTag("")
    }

    const handleRemoveTag = (e: any, index: number) => {
        e.preventDefault()
        tags.splice(index, 1)
        setRerender(!rerender)
    }

    const handleClickOutside = (e: MouseEvent) => {
        const { current: wrap } = wraperRef as { current: HTMLElement | null }

        if (wrap && !wrap.contains(e.target as Node)) {
            setDisplay(false)
        }
    }

    const fetchTraks = async () => {
        await axios
            .get("/api/fetchTracks", {
                headers: {
                    htmlcode: process.env.KEY_TO_API as string
                }
            })
            .then((res) => {
                if (res.data) {
                    const data = res.data.filter((item: any) => item.type !== "Other")
                    setTracksOpt(data)
                }
            })
            .catch((err) => console.log(err))
    }

    const fetchLevels = async () => {
        await axios
            .get("/api/fetchLevels", {
                headers: {
                    htmlcode: process.env.KEY_TO_API as string
                }
            })
            .then((res) => {
                setLevelsOpt(res.data)
            })
            .catch((err) => console.log(err))
    }

    const fetchEventTypes = async () => {
        await axios
            .get("/api/fetchEventTypes", {
                headers: {
                    htmlcode: process.env.KEY_TO_API as string
                }
            })
            .then((res) => {
                setEventTypesOpt(res.data)
            })
            .catch((err) => console.log(err))
    }

    const fetchFormats = async () => {
        await axios
            .get("/api/fetchFormats", {
                headers: {
                    htmlcode: process.env.KEY_TO_API as string
                }
            })
            .then((res) => {
                setFormatsOpt(res.data)
            })
            .catch((err) => console.log(err))
    }

    const fetchLocations = async () => {
        await axios
            .get("/api/fetchLocations", {
                headers: {
                    htmlcode: process.env.KEY_TO_API as string,
                    "x-api-type": "fetchLocations"
                }
            })
            .then((res) => {
                setLocationsOpt(res.data)
            })
            .catch((err) => console.log(err))
    }

    const fetchUsers = async () => {
        await axios
            .get("/api/fetchUsers", {
                headers: {
                    htmlcode: process.env.KEY_TO_API as string
                }
            })
            .then((res) => {
                setSuggestions(res.data)
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        Promise.all([fetchLevels(), fetchEventTypes(), fetchFormats(), fetchLocations(), fetchTraks()])
    }, [])

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const isOverlapping = (filteredSessions: SessionsDTO[]) =>
        filteredSessions.some(
            (item) => !(to24HourFormat(endTime) <= item.startTime || to24HourFormat(startTime) >= item.end_time)
        )

    const handleNextStep = () => {
        if (
            newSession.name.length === 0 ||
            newSession.description.length === 0 ||
            newSession.team_members.length === 0 ||
            newSession.track === "" ||
            newSession.startTime === "" ||
            maxRsvp === "0" ||
            maxRsvp === ""
        ) {
            return toast.error("Please fill all inputs required.", {
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

        const selectedLocation = newSession.location.toLocaleLowerCase()

        const filteredSeshs = sessions
            .filter((item) => item.location.toLocaleLowerCase() === selectedLocation)
            .filter((item) => {
                const formatDate = moment.utc(startDate).format("YYYY-MM-DD")

                const selectedDate = moment.utc(formatDate)
                const newSessionStartDate = moment.utc(item.startDate)

                return selectedDate.isSame(newSessionStartDate)
            })

        if (location === "Other") {
            return setSteps(2)
        }

        if (isOverlapping(filteredSeshs)) {
            return toast.error("Session already booked on that Date and Time.", {
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
        setSteps(2)
    }

    const teamMembersCheck = team_members.map((item) => item.name)
    const checkIfAnyOtherSuggestion =
        suggestions
            .filter((item) => !teamMembersCheck.includes(item.userName))
            .filter(({ userName }) => userName.toLowerCase().indexOf(teamMemberInput.toLowerCase()) > -1).length !== 0

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-col gap-1 my-2 w-full">
                <label htmlFor="name" className="font-[600]">
                    Session Title*
                </label>
                <input
                    className="border-[#C3D0CF] border-2 p-1 rounded-[8px] h-[42px]"
                    type="text"
                    id="name"
                    placeholder="Event name"
                    value={name}
                    onChange={(e) => setNewSession({ ...newSession, name: e.target.value })}
                />
            </div>

            <div className="flex flex-col gap-1 my-2 w-full">
                <label htmlFor="name" className="font-[600]">
                    Event Track*
                </label>
                <select
                    id="track"
                    name="track"
                    disabled={checkIfSessionByEventPage}
                    className="border-[#C3D0CF] bg-white border-2 p-1 rounded-[8px] h-[42px]"
                    onChange={(e) => handleSelectEventTrack(e.target.value)}
                    value={track}
                >
                    <option value="">Select Option</option>
                    {tracksOpt &&
                        tracksOpt.map((item, index) => (
                            <option key={index} value={item.type}>
                                {item.type}
                            </option>
                        ))}
                </select>
            </div>

            {
                <div className="flex flex-col gap-1 w-full my-2">
                    <label htmlFor="location" className="font-[600]">
                        Location*
                    </label>
                    <select
                        id="location"
                        name="location"
                        value={newSession.location}
                        className="border-[#C3D0CF] bg-white border-2 p-1 rounded-[8px] h-[42px] w-full"
                        onChange={(e) => setNewSession({ ...newSession, location: e.target.value })}
                    >
                        <option value="Select Location">Select Location</option>
                        {locationsOpt &&
                            locationsOpt.map((item, index) => (
                                <option key={index} value={item.location}>
                                    {item.location}
                                </option>
                            ))}
                    </select>
                </div>
            }

            <div className="flex flex-col md:flex-row w-full gap-5 my-2">
                <div className="flex flex-col w-full md:w-2/6 z-[10]">
                    <label className="font-[600]">Date*</label>

                    <DatePicker
                        className="border-[#C3D0CF] border-2 p-1 rounded-[8px] h-[42px] w-full"
                        selected={parse(startDate, "yyyy-MM-dd", new Date())}
                        onChange={(e: any) => {
                            const newDate = format(e, "yyyy-MM-dd")
                            setNewSession({ ...newSession, startDate: newDate })
                        }}
                        minDate={startOfDay(new Date())}
                    />
                </div>
                <div className="flex flex-col w-full md:w-2/6">
                    <label htmlFor="startTime" className="font-[600]">
                        Start Time*
                    </label>
                    <TimeDropdown
                        id="startTime"
                        value={newSession.startTime}
                        onChange={(e: any) => setNewSession({ ...newSession, startTime: e.target.value })}
                    />
                </div>

                <div className="flex flex-col w-full md:w-2/6">
                    <label htmlFor="startTime" className="font-[600]">
                        End Time*
                    </label>
                    <TimeDropdown
                        id="endTime"
                        value={newSession.endTime}
                        minTime={newSession.startTime}
                        onChange={(e: any) => setNewSession({ ...newSession, endTime: e.target.value })}
                    />
                </div>
            </div>

            {location === "Other" ? (
                <div className="flex flex-col gap-1 w-full mt-2">
                    <label htmlFor="custom_location" className="font-[600]">
                        Specify location
                    </label>
                    <input
                        type="text"
                        placeholder="Specify Location"
                        className="border-[#C3D0CF] bg-white border-2 p-1 rounded-[8px] h-[42px] w-full"
                        value={newSession.custom_location}
                        onChange={(e) => setNewSession({ ...newSession, custom_location: e.target.value })}
                    />
                </div>
            ) : (
                ""
            )}

            <div className="flex flex-col gap-1 my-2 w-full">
                <label htmlFor="info" className="font-[600]">
                    Description*
                </label>
                <div className="w-full h-[400px] p-4 border border-gray-300 rounded overflow-scroll">
                    {richTextEditor && (
                        // @ts-ignore
                        <Editor
                            editorState={richTextEditor}
                            onEditorStateChange={onEditorStateChange}
                            wrapperClassName="wrapper-class"
                            editorClassName="editor-class"
                            toolbarClassName="toolbar-class"
                        />
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-1 my-2 w-full">
                <label htmlFor="info" className="font-[600]">
                    AV + Set up Needs*
                </label>
                <textarea
                    id="equipment"
                    className="w-full h-[200px] p-4 border border-gray-300 rounded overflow-scroll"
                    placeholder="Describe your AV + Set up Needs for organizers. Do you need screens? What setup do you need: Workspace with tables and chairs |  Chairs facing presentation stage | No chairs"
                    value={equipment}
                    onChange={(e) => setNewSession({ ...newSession, equipment: e.target.value })}
                />
            </div>

            <div className="flex flex-col gap-4 w-full my-8">
                <label htmlFor="tags" className="font-[600]">
                    Organizers*
                </label>
                <div className="flex flex-col relative" ref={wraperRef}>
                    <div className="flex flex-row gap-4">
                        <input
                            id="organizers"
                            type="text"
                            className="border-[#C3D0CF] w-full border-2 p-1 rounded-[8px] h-[42px]"
                            placeholder="People or organizations. Type to search for people"
                            value={teamMemberInput}
                            onChange={(e) => setTeamMemberInput(e.target.value)}
                            onClick={() => setDisplay(true)}
                        />
                    </div>
                    {display && (
                        <div className="border border-[#C3D0CF] py-2 rounded-[8px] custom-shadow bg-white flex flex-col absolute top-[45px] w-full z-10">
                            {checkIfAnyOtherSuggestion ? (
                                suggestions
                                    .filter((item) => !teamMembersCheck.includes(item.userName))
                                    .filter((item) =>
                                        item.userName.toLocaleLowerCase().includes(teamMemberInput.toLocaleLowerCase())
                                    )
                                    .map((item, index) => (
                                        <div
                                            key={index}
                                            onClick={() =>
                                                handleAddTeamMember({ userName: item.userName, role: item.role })
                                            }
                                            className="flex h-[40px] text-[12px] items-center px-2 uppercase hover:bg-[#CBE9E4] cursor-pointer transition duration-300 ease-in-out"
                                        >
                                            <span>{item.userName}</span>
                                        </div>
                                    ))
                            ) : (
                                <div className="flex h-[40px] items-center text-[12px] px-2 uppercase hover:bg-black hover:text-white cursor-pointer transition duration-300 ease-in-out">
                                    <span>No user found</span>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="flex flex-wrap gap-2 py-2">
                        {team_members.length > 0 &&
                            team_members.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex gap-2 items-center justify-center w-auto bg-[#E4EAEA] p-1 text-[14px] rounded-[4px]"
                                >
                                    <NextImage src={UserIcon} width={25} height={25} />
                                    <p>{item.name}</p>
                                    <h1 className="cursor-pointer" onClick={() => handleRemoveTeamMember(index)}>
                                        x
                                    </h1>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 w-full mb-8">
                <div className="flex flex-col gap-4">
                    <label htmlFor="tags" className="font-[600]">
                        Tags
                    </label>
                    <input
                        id="tags"
                        type="text"
                        className="border-[#C3D0CF] bg-white border-2 p-1 rounded-[8px] h-[42px] w-full"
                        placeholder="add tag"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                    />

                    <button
                        className="flex flex-row font-[600] justify-center items-center py-[8px] px-[16px] gap-[8px] bg-[#35655F] rounded-[8px] text-white text-[16px]"
                        onClick={() => handleAddTag()}
                    >
                        ADD
                    </button>
                </div>
                <ul className="flex flex-row items-center">
                    {newSession.tags.map((item, index) => (
                        <div
                            key={index}
                            className="bg-[#E4EAEA] py-[4px] px-[8px] text-sm rounded-[4px] cursor-pointe mr-[8px] cursor-pointer"
                            onClick={(e) => handleRemoveTag(e, index)}
                        >
                            {item}
                        </div>
                    ))}
                </ul>
            </div>
            <div className="flex flex-col gap-1 my-2">
                <label htmlFor="level" className="font-[600]">
                    What is the maximum number of RSVPs allowed?*
                </label>

                <input
                    id="maximum-rsvp"
                    autoComplete="new-password"
                    type="number"
                    value={maxRsvp}
                    className="border-[#C3D0CF] bg-white border-2 p-1 rounded-[8px] h-[42px] w-full"
                    placeholder="Ex: 40"
                    onChange={(e) => setNewSession({ ...newSession, maxRsvp: e.target.value })}
                />
            </div>
            <div className="flex flex-col gap-1 my-2">
                <label htmlFor="tags">Format:</label>
                <select
                    id="format"
                    name="format"
                    value={newSession.format}
                    className="border-[#C3D0CF] bg-white border-2 p-1 rounded-[8px] h-[42px]"
                    onChange={(e) => setNewSession({ ...newSession, format: e.target.value })}
                >
                    {formatsOpt &&
                        formatsOpt.map((item, index) => (
                            <option key={index} value={item.format}>
                                {item.format}
                            </option>
                        ))}
                </select>
            </div>
            <div className="flex flex-col gap-1 my-2">
                <label htmlFor="type">Type:</label>
                <select
                    id="type"
                    name="type"
                    value={newSession.event_type}
                    className="border-[#C3D0CF] bg-white border-2 p-1 rounded-[8px] h-[42px]"
                    onChange={(e) => setNewSession({ ...newSession, event_type: e.target.value })}
                >
                    {eventTypesOpt &&
                        eventTypesOpt.map((item, index) => (
                            <option key={index} value={item.type}>
                                {item.type}
                            </option>
                        ))}
                </select>
            </div>
            <div className="flex flex-col gap-1 my-2">
                <label htmlFor="level">Experience Level:</label>
                <select
                    id="level"
                    name="level"
                    value={newSession.level}
                    className="border-[#C3D0CF] bg-white border-2 p-1 rounded-[8px] h-[42px]"
                    onChange={(e) => setNewSession({ ...newSession, level: e.target.value })}
                >
                    {levelsOpt &&
                        levelsOpt.map((item, index) => (
                            <option key={index} value={item.level}>
                                {item.level}
                            </option>
                        ))}
                </select>
            </div>
            <div className="w-full flex flex-col md:flex-row gap-5 justify-center items-center my-5">
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
                    className="w-full lex flex-row font-[600] justify-center items-center py-[8px] px-[16px] gap-[8px] bg-[#35655F] rounded-[8px] text-white text-[16px]"
                    onClick={() => handleNextStep()}
                >
                    NEXT
                </button>
            </div>
        </div>
    )
}

export default Step1
