import { getSupabase } from '@/lib/getSupabase'
import { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = getSupabase();
  const attempt = {
    email: req.body.email,
    password: req.body.password
  };

  try {
    let { data, error } = await supabase.auth.signInWithPassword(attempt)
    if (error) {
      throw error;
    }

    res.status(200).json({ data });
  } catch
    (err) {
    res.status(500).json({ error: err });
  }
}
