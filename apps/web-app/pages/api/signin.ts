// pages/api/signin.js
import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl as string, supabaseKey as string);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  if (req.method === "POST") {
    const { email, password } = req.body;
    try {
      const result = await supabase.auth.signInWithPassword({ email, password });
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: "Not a valid login" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
