import { NextApiRequest, NextApiResponse } from "next"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import authMiddleware from "../../hooks/auth"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createServerSupabaseClient({ req, res })

    // Check if we have a session
    const {
        data: { session }
    } = await supabase.auth.getSession()

    if (!session)
        return res.status(401).json({
            error: "not_authenticated",
            description: "The user does not have an active session or is not authenticated"
        })

    try {
        const {
            id,
            description,
            name,
            startDate,
            duration,
            location,
            custom_location,
            startTime,
            endTime,
            tags,
            info,
            hasTicket,
            event_id,
            format,
            level,
            equipment,
            team_members,
            track,
            subEventId,
            event_type,
            maxRsvp,
            event_slug,
            event_item_id,
            quota_id
        } = req.body

        const updateSB = await supabase
            .from("sessions")
            .update({
                name,
                description,
                startDate,
                location,
                startTime,
                end_time: endTime,
                capacity: maxRsvp,
                tags,
                info,
                event_id,
                hasTicket,
                event_type,
                level,
                format,
                team_members,
                track,
                equipment,
                subevent_id: subEventId,
                event_slug,
                event_item_id,
                quota_id,
                duration,
                custom_location
            })
            .eq("id", id)

        console.log("updateSB", updateSB)

        res.status(201).json("Event Updated")
    } catch (err: any) {
        console.log("error: ", err)
        res.status(500).json({ statusCode: 500, message: err })
    }
}

export default authMiddleware(handler)
