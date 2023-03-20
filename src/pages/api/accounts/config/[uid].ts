import { NextApiRequest, NextApiResponse } from 'next'
import { getSupabase } from '@/lib/getSupabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { uid } = req.query;
  console.log('get account uid', uid);
  try {
    const supabase = getSupabase();
    const {data , error} = await supabase.from('account-config')
      .select()
      .eq('account', uid);

    const config = Array.isArray(data) ? data[0] || null : null;

    console.log('--- polled data is', config);
    res.status(200).json({config});
  } catch (err) {
    console.log('config error:', err);
    res.status(500).json({ error: err });
  }
}
