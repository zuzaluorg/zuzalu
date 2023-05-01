/* eslint-disable import/prefer-default-export */
import { format } from "date-fns"

export const displayDateWithoutTimezone = (dateString: Date | string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    })
}

export const to24HourFormat = (time: string) => {
    const [timePart, amPm] = time.split(" ")
    const [hour, minute] = timePart.split(":")

    let hourInt = parseInt(hour)
    if (amPm === "PM" && hourInt !== 12) {
        hourInt += 12
    } else if (amPm === "AM" && hourInt === 12) {
        hourInt = 0
    }

    const hourString = hourInt < 10 ? `0${hourInt}` : hourInt
    return `${hourString}:${minute}`
}

export const to12HourFormat = (time: string) => {
    const [hour, minute] = time.split(":")
    const hourInt = parseInt(hour)
    const amPm = hourInt >= 12 ? "PM" : "AM"
    const hour12 = hourInt % 12 === 0 ? 12 : hourInt % 12
    const hourString = hour12 < 10 ? `0${hour12}` : hour12
    return `${hourString}:${minute} ${amPm}`
}

export const removeTimezone = (date: Date) => format(date, "yyyy-MM-dd")
