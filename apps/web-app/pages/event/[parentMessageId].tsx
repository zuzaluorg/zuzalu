import { GetServerSideProps } from "next"
import { useEffect } from "react"
import axios from "axios"
import Dexie from "dexie"
import { EventsDTO, SessionsDTO } from "../../types"
import EventPage from "../../templates/EventPage"

type Props = {
    event: EventsDTO
    allSessions: SessionsDTO[]
    sessions: SessionsDTO[]
}

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
    // Delete all cookies
    deleteAllCookies()
}

function checkAndUpdateVersion() {
    const storedVersion = localStorage.getItem(storageVersionKey)
    if (storedVersion !== currentVersion) {
        clearAllStorage()
        localStorage.setItem(storageVersionKey, currentVersion)
    }
}

export default function Event({ event, sessions, allSessions }: Props) {
    useEffect(() => {
        checkAndUpdateVersion()
    }, [])

    return <EventPage event={event} sessions={sessions} allSessions={allSessions} />
}

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
    try {
        const url = process.env.URL_TO_FETCH

        const eventResponse = await axios.post(
            `${url}/api/fetchEvents/${query.parentMessageId}`,
            {},
            {
                headers: {
                    htmlcode: process.env.KEY_TO_API as string // Pass cookies from the incoming request
                }
            }
        )
        const event = await eventResponse.data

        const sessionsByEventResponse = await axios.get(`${url}/api/fetchSessionsByEvent/${query.parentMessageId}`, {
            headers: {
                Cookie: req.headers.cookie || "", // Pass cookies from the incoming request
                htmlcode: process.env.KEY_TO_API as string // Pass cookies from the incoming request
            }
        })
        const sessions: SessionsDTO[] = await sessionsByEventResponse.data

        const allSessionsResponse = await axios.get(`${url}/api/fetchSessions`, {
            headers: {
                Cookie: req.headers.cookie || "", // Pass cookies from the incoming request
                htmlcode: process.env.KEY_TO_API as string // Pass cookies from the incoming request
            }
        })

        const allSessions = await allSessionsResponse.data

        return {
            props: { event, allSessions, sessions }
        }
    } catch (error: any) {
        console.error("Error fetching sessions:", error.message)
        res.statusCode = 404
        return {
            props: {}
        }
    }
}
