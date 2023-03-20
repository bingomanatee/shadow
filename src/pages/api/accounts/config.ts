import { NextApiRequest, NextApiResponse } from 'next'
import { getSupabase } from '@/lib/getSupabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('req body: ', req.body);
  const { uid, qa, basis, url, context } = req.body;
  try {

    const supabase = getSupabase();

    const { data, error } = await supabase.from('account-config')
      .select()
      .eq('account', uid);
    if (error) {
      throw error;
    }

    const [existing] = data;
    console.log('existing', existing);

    if (existing) {
      const { data: config, error } = await supabase.from('account-config')
        .update({ qa, basis, url, context })
        .eq('account', uid);
      if (error) {
        throw error;
      }
      res.status(200).json({ config });
    } else {
      const newConfig = { account: uid, qa, basis, url, context };
      const { data: config, error } = await supabase.from('account-config')
        .insert(newConfig);
      if (error) {
        throw error;
      }
      res.status(200).json({ config });
    }


  } catch (err) {
    console.log('config error:', err);
    res.status(500).json({ error: err });
  }
}
