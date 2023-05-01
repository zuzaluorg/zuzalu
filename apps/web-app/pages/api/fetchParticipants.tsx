import { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "@supabase/supabase-js"
import authMiddleware from "../../hooks/auth"

const supabaseUrl = "https://polcxtixgqxfuvrqgthn.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey as string)

const allowedOrigins = ["https://zuzalu.city"]

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // Check for the 'Origin' header in the request
    const { origin } = req.headers

    if (origin !== allowedOrigins[0]) {
        res.status(403).json({ message: "Forbidden" })
        return
    }

    const {
        data: { session }
    } = await supabase.auth.getSession()

    if (!session) {
        return res.status(401).json({
            error: "not_authenticated",
            description: "The user does not have an active session or is not authenticated"
        })
    }
    // If the origin is in the list of allowed origins, set the appropriate CORS headers
    if (typeof origin === "string" && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin)
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    } else {
        res.status(403).json({ message: "Forbidden" })
        return
    }

    try {
        const response = await supabase.from("favorited_sessions").select("*,users(*),events(*)")

        res.status(200).send(response.data)
    } catch (err: any) {
        console.log("error: ", err)
        res.status(500).json({ statusCode: 500, message: err })
    }
}

export default authMiddleware(handler)
