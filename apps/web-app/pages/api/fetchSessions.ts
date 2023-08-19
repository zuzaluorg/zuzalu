import { NextApiRequest, NextApiResponse } from "next"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import authMiddleware from "../../hooks/auth"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createServerSupabaseClient({ req, res })

    let userId = 0

    const {
        data: { session }
    } = await supabase.auth.getSession()

    try {
        if (session) {
            await supabase
                .from("users")
                .select()
                .eq("uui_auth", session.user.id)
                .single()
                .then((user: any) => {
                    userId = user.data.id
                })
        }
    } catch (err) {
        userId = 0
        console.log(err)
    }

    try {
        const response = await supabase
            .from("sessions")
            .select(
                "*, participants (*), favoritedSessions:favorited_sessions (*), totalParticipants:participants (count)"
            )
            .eq("participants.user_id", userId)
            .eq("favoritedSessions.user_id", userId)
            .order("startDate", { ascending: true })
            .order("startTime", { ascending: true })
        if (response.error === null) {
            // Map over the response.data array and extract the count from participants
            const formattedData = response.data.map((item) => ({
                ...item,
                totalParticipants: item.totalParticipants[0].count
            }))
            res.status(200).send(formattedData)
        } else res.status(response.status).send(response.error)
    } catch (err: any) {
        console.log("error: ", err)
        res.status(500).json({ statusCode: 500, message: err })
    }
}

export default authMiddleware(handler)
