import { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("Update subevent triggered")
    const auth = process.env.NEXT_PUBLIC_PRETIX_API
    const headers = {
        Accept: "application/json, text/javascript",
        Authorization: `Token ${auth}`,
        "Content-Type": "application/json"
    }

    const { name, startDate, slug, subEventId } = req.body
    console.log(req.body)

    const body = {
        name: { en: `${name}` },
        date_from: `${startDate}`
    }

    try {
        const response = await axios.patch(
            `https://beta.ticketh.xyz/api/v1/organizers/zuzalu/events/${slug}/subevents/${subEventId}/`,
            body,
            {
                headers
            }
        )

        console.log(response)

        if (response.status === 200) {
            res.status(200).json(response.data)
        } else {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}
