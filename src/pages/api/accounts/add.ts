import { NextApiRequest, NextApiResponse } from 'next'
import { getSupabase } from '@/lib/getSupabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const email = req.body.email;
  const name = req.body.name || '';
  const account_owner = !!req.body.account_owner;
  const manager = req.body.manager || undefined;
  const bulk = req.body.bulk;
  try {
    if (!email && !bulk) {
      throw new Error('no email -- not saving');
    }
    const supabase = getSupabase();
    if (bulk) {
      const { data: newBulk, error } = await supabase.from('accounts').insert(bulk);
      if (error) {
        throw error;
      }
      res.status(200).json({ accounts: newBulk });
    } else {
      const account = { email, name, account_owner, manager };
      const { data: newAccount, error } = await supabase.from('accounts').insert([
        account
      ]);
      if (error) {
        console.log('db error:', error);
        throw error;
      }
      res.status(200).json({ account: newAccount });
    }


  } catch (err) {
    res.status(500).json({ error: err });
  }
}
