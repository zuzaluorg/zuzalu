import { NextApiRequest, NextApiResponse } from "next"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createServerSupabaseClient({ req, res })

    try {
    switch (req.method) {
      case "GET": {
        const { id } = req.query;

        let { data } = await supabase
          .from("sessions")
          .select("id, created_at, name, startDate, startTime, description, duration")
          .eq("id", id);

        if (!data || !Array.isArray(data)) {
          res.status(404).end();
          return;
        }

        res.status(200).json(data[0]);

        break;
      }
      default:
        res.status(400).end();
    }
  } catch (err: any) {
    console.log("error: ", err);
    res.status(500).json({ statusCode: 500, message: err });
  }
}
