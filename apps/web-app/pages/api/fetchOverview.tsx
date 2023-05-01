import { NextApiRequest, NextApiResponse } from "next"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { DateTime } from "luxon"
import authMiddleware from "../../hooks/auth"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createServerSupabaseClient({ req, res })

    try {
        const today = DateTime.local().toISODate() // get today's date in ISO format
        const response = await supabase
            .from("sessions")
            .select("*")
            .neq("location", "Other") // filter out locations that are 'Other'
            .gte("startDate", today) // filter out startDates before today
            .order("startDate", { ascending: true })
            .order("startTime", { ascending: true })

        if (response.error === null) res.status(200).send(response.data)
        else res.status(response.status).send(response.error)
    } catch (err: any) {
        console.log("error: ", err)
        res.status(500).json({ statusCode: 500, message: err })
    }
}

export default authMiddleware(handler)
