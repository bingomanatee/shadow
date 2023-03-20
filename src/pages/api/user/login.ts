import { NextApiRequest, NextApiResponse } from 'next'
import { getSupabase } from '@/lib/getSupabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = getSupabase();
  console.log('signing up with ', req.body);
  const attempt = {
    email: req.body.email,
    password: req.body.password
  };

  try {
    let { data, error } = await supabase.auth.signUp(attempt)
    if (error) {
      throw error;
    }

    res.status(200).json({ data });
  } catch
    (err) {
    res.status(500).json({ error: err });
  }
}
