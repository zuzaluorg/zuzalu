import { NextApiRequest, NextApiResponse } from "next"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import authMiddleware from "../../../hooks/auth"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createServerSupabaseClient({ req, res })
    try {
        const response = await supabase.from("events").select(`*, sessions (*)`).eq("id", req.query.slug).single()

        res.status(200).send(response.data)
    } catch (err: any) {
        console.log("error: ", err)
        res.status(500).json({ statusCode: 500, message: err })
    }
}

export default authMiddleware(handler)
