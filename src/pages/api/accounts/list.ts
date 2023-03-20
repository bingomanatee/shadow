import { NextApiRequest, NextApiResponse } from 'next'
import { getSupabase } from '@/lib/getSupabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = getSupabase();

  try {
    const { data: accounts, error } = await supabase.from('accounts').select();
    if (error) {
      throw error;
    }

    res.status(200).json({ accounts });
  } catch
    (err) {
    res.status(500).json({ error: err });
  }
}
