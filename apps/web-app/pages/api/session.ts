// pages/api/session.js
import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl as string, supabaseKey as string);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const session = await supabase.auth.getSession();
      res.status(200).json(session);
    } catch (error) {
      res.status(500).json({ message: "Unable to get session" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
