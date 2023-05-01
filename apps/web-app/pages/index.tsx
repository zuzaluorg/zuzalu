// pages/index.tsx
import { GetServerSideProps } from "next"
import Dexie from "dexie"
import axios from "axios"
import moment from "moment"
import { useEffect } from "react"

import { startOfDay, addDays, format } from "date-fns"
import { utcToZonedTime } from "date-fns-tz"

import { EventsDTO, SessionsDTO } from "../types"
import HomeTemplate from "../templates/Home"

type Props = {
    sessions: SessionsDTO[]
    events: EventsDTO[]
}

const Home = ({ sessions, events }: Props) => {
    const currentVersion = "1.3.0"
    const storageVersionKey = "myAppVersion"

    async function deleteAllCacheStorage() {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
    }

    async function unregisterServiceWorkers() {
        const registrations = await navigator.serviceWorker.getRegistrations()
        await Promise.all(registrations.map((registration) => registration.unregister()))
    }

    async function deleteAllIndexedDB() {
        try {
            const dbNames = await Dexie.getDatabaseNames()
            for (const dbName of dbNames) {
                await Dexie.delete(dbName)
            }
        } catch (error) {
            console.error("Error deleting IndexedDB databases:", error)
        }
    }

    function deleteAllCookies() {
        document.cookie.split(";").forEach((c) => {
            document.cookie = c.replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
        })
    }

    function clearAllStorage() {
        // Clear LocalStorage
        localStorage.clear()
        // Clear SessionStorage
        sessionStorage.clear()
        // Clear all IndexedDB databases
        deleteAllIndexedDB()
        // Delete all cache storage
        deleteAllCacheStorage()
        // Unregister all service workers
        unregisterServiceWorkers()

        deleteAllCookies()
    }

    function checkAndUpdateVersion() {
        const storedVersion = localStorage.getItem(storageVersionKey)
        if (storedVersion !== currentVersion) {
            clearAllStorage()
            localStorage.setItem(storageVersionKey, currentVersion)
        }
    }

    useEffect(() => {
        checkAndUpdateVersion()
    }, [])

    return <HomeTemplate sessions={sessions} events={events} />
}

export default Home

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    try {
        const url = process.env.URL_TO_FETCH

        const eventsResponse = await axios.post(
            `${url}/api/fetchEvents`,
            {},
            {
                headers: {
                    htmlcode: process.env.KEY_TO_API as string
                }
            }
        )

        const events: EventsDTO[] = await eventsResponse.data

        const responseSessions = await axios.post(
            `${url}/api/fetchSessions`,
            {},
            {
                headers: {
                    Cookie: req.headers.cookie || "",
                    htmlcode: process.env.KEY_TO_API as string
                }
            }
        )

        const sessions = await responseSessions.data

        // Filter sessions to only include sessions for the upcoming 7 days

        const timezone = "Europe/Podgorica"
        const now = new Date()

        // Get the local time in the specified timezone
        const localTime = utcToZonedTime(now, timezone)

        // Get today's date in the specified timezone
        const todayDate = format(startOfDay(localTime), "yyyy-MM-dd")

        // Get the date 7 days from today in the specified timezone
        const endDate = format(addDays(startOfDay(localTime), 7), "yyyy-MM-dd")

        const filtered = sessions.filter((session: SessionsDTO) => {
            const sessionDate = moment.utc(session.startDate)
            return sessionDate.isSameOrAfter(todayDate) && sessionDate.isSameOrBefore(endDate)
        })

        return {
            props: { sessions: filtered, events }
        }
    } catch (error) {
        res.statusCode = 404
        return {
            props: {}
        }
    }
}
