import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"

const authMiddleware = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
    // Validate the API key
    const apiKey = req.headers.htmlcode
    if (apiKey !== process.env.KEY_TO_API) {
        return res.status(403).json({ message: "Forbidden" })
    }

    return handler(req, res)
}

export default authMiddleware
