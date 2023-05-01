import { GetServerSideProps } from "next"
import axios from "axios"
import { SessionsDTO } from "../types"

import OverviewPage from "../templates/OverviewPage"

type Props = {
    sessions: SessionsDTO[]
}

export default function Events({ sessions }: Props) {
    return <OverviewPage sessions={sessions} />
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    try {
        const url = process.env.URL_TO_FETCH

        const response = await axios.get(`${url}/api/fetchOverview`, {
            headers: {
                htmlcode: process.env.KEY_TO_API as string // Pass cookies from the incoming request
            }
        })

        const sessions: SessionsDTO[] = response.data
        const newArray = sessions.map((item) => ({
            id: item.id,
            name: item.name,
            startDate: item.startDate,
            startTime: item.startTime,
            end_time: item.end_time,
            location: item.location,
            customLocation: item.custom_location,
            equipment: item.equipment
        }))

        return {
            props: { sessions: newArray }
        }
    } catch (error) {
        res.statusCode = 404
        return {
            props: {}
        }
    }
}
