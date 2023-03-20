import { NextApiRequest, NextApiResponse } from 'next'
import { getSupabase } from '@/lib/getSupabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ids = req.body.ids;
  console.log('delete accounts: body =', req.body);
  // @TODO: check method
  try {
    if (!Array.isArray(ids)) throw new Error('no ids');

    const supabase = getSupabase();
    const { data, error } = await supabase.from('accounts')
      .delete()
      .in('uid', ids);

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch
    (err) {
    console.log('delete error:', err);
    res.status(500).json({ error: err });
  }
}
