import React from "react"

import { GetServerSideProps } from "next"

import axios from "axios"
import MyProfilePage from "../templates/MyProfilePage"

import { EventsDTO, SessionsDTO } from "../types"

type Props = {
    events: EventsDTO[]
    sessions: SessionsDTO[]
}

export default function MyProfile({ events, sessions }: Props) {
    return <MyProfilePage events={events} sessions={sessions} />
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    try {
        const url = process.env.URL_TO_FETCH

        const eventsResponse = await axios.post(
            `${url}/api/fetchEvents`,
            {},
            {
                headers: {
                    Cookie: req.headers.cookie || "",
                    htmlcode: process.env.KEY_TO_API as string // Pass cookies from the incoming request
                }
            }
        )

        const events: EventsDTO[] = await eventsResponse.data

        const sessionsResponse = await axios.get(`${url}/api/fetchSessions`, {
            headers: {
                Cookie: req.headers.cookie || "",
                htmlcode: process.env.KEY_TO_API as string
            }
        })

        const sessions = await sessionsResponse.data

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
