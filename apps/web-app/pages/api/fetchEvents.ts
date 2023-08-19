import { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "@supabase/supabase-js"
import authMiddleware from "../../hooks/auth"



const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY
const supabase = createClient(supabaseUrl as string, supabaseKey as string)

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const response = await supabase.from("events").select(`*, sessions (*)`)

        res.status(200).send(response.data)
    } catch (err: any) {
        console.log("error: ", err)
        res.status(500).json({ statusCode: 500, message: err })
    }
}

export default authMiddleware(handler)
