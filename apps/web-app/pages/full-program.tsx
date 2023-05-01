import { GetServerSideProps } from "next"
import axios from "axios"

import { EventsDTO, SessionsDTO } from "../types"
import CalendarPage from "../templates/CalendarPage"

type Props = {
    events: EventsDTO[]
    sessions: SessionsDTO[]
}

export default function Event({ sessions, events }: Props) {
    return <CalendarPage sessions={sessions} events={events} />
}

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

        return {
            props: { sessions, events }
        }
    } catch (error) {
        res.statusCode = 404
        return {
            props: {}
        }
    }
}
