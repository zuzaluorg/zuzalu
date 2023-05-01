import { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "@supabase/supabase-js"
import authMiddleware from "../../hooks/auth"

const supabaseUrl = "https://polcxtixgqxfuvrqgthn.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey as string)

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const response = await supabase.from("tracks").select("*")

        if (response.error === null) {
            const newobj = response.data.filter((item) => item.active !== false)
            res.status(200).send(newobj)
        } else res.status(response.status).send(response.error)
    } catch (err: any) {
        console.log("error: ", err)
        res.status(500).json({ statusCode: 500, message: err })
    }
}

export default authMiddleware(handler)
