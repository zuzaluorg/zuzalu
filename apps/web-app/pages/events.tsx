import { GetServerSideProps } from "next"
import axios from "axios"

import { EventsDTO } from "../types"
import EventsPage from "../templates/EventsPage"

type Props = {
    events: EventsDTO[]
}

export default function Events({ events }: Props) {
    return <EventsPage events={events} />
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    try {
        const url = process.env.URL_TO_FETCH

        const eventsResponse = await axios.post(
            `${url}/api/fetchEvents`,
            {},
            {
                headers: {
                    htmlcode: process.env.KEY_TO_API as string // Pass cookies from the incoming request
                }
            }
        )

        const events = await eventsResponse.data
        return {
            props: { events }
        }
    } catch (error) {
        res.statusCode = 404
        return {
            props: {}
        }
    }
}
