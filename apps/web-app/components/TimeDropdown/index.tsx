import React from "react"

import { to24HourFormat } from "../../data/dateFormat"

interface TimeDropdownProps {
    id: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    minTime?: string
}

const TimeDropdown: React.FC<TimeDropdownProps> = ({ id, value, onChange, minTime = "00:00" }) => {
    const times = []

    const to12HourFormat = (time: string) => {
        const [hour, minute] = time.split(":")
        const hourInt = parseInt(hour)
        const amPm = hourInt >= 12 ? "PM" : "AM"
        const hour12 = hourInt % 12 === 0 ? 12 : hourInt % 12
        const hourString = hour12 < 10 ? `0${hour12}` : hour12
        return `${hourString}:${minute} ${amPm}`
    }

    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 4; j++) {
            const hour = i < 10 ? `0${i}` : i
            const minute = j * 15
            const minuteString = minute < 10 ? `0${minute}` : minute
            times.push(`${hour}:${minuteString}`)
        }
    }

    const filteredTimes = times.filter((time) => time > to24HourFormat(minTime)).map(to12HourFormat)

    return (
        <select
            id={id}
            className="border-[#C3D0CF] bg-white border-2 p-1 rounded-[8px] h-[42px] w-full"
            value={value}
            onChange={onChange}
        >
            <option value="" disabled>
                Please Select
            </option>
            {filteredTimes.map((time, index) => (
                <option key={index} value={time}>
                    {time}
                </option>
            ))}
        </select>
    )
}

export default TimeDropdown
