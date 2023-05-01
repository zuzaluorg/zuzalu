// pages/api/signin.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://polcxtixgqxfuvrqgthn.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
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
