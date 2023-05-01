import { GetServerSideProps } from "next"
import axios from "axios"
import SessionPage from "../../../../templates/SessionPage"
import { EventsDTO, SessionsDTO } from "../../../../types"

type Props = {
    session: SessionsDTO
    sessions: SessionsDTO[]
    userId: number
    events: EventsDTO[]
}

const Session = ({ session, sessions, userId, events }: Props) => (
    <SessionPage session={session} sessions={sessions} userId={userId} events={events} />
)

export default Session

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
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

        const events: EventsDTO[] = await eventsResponse.data

        const responseSession = await axios.get(`${url}/api/fetchSession/${query.sessionId}`, {
            headers: {
                Cookie: req.headers.cookie || "", // Pass cookies from the incoming request
                htmlcode: process.env.KEY_TO_API as string // Pass cookies from the incoming request
            }
        })

        const { session, userId } = await responseSession.data
        const responseSessions = await axios.get(`${url}/api/fetchSessions`, {
            headers: {
                Cookie: req.headers.cookie || "", // Pass cookies from the incoming request
                htmlcode: process.env.KEY_TO_API as string
            }
        })

        const sessions = await responseSessions.data

        return {
            props: { session, sessions, userId, events }
        }
    } catch (error) {
        res.statusCode = 404
        return {
            props: {}
        }
    }
}
