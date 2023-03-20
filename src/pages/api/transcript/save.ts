import { NextApiRequest, NextApiResponse } from 'next'
import { v4 } from 'uuid';

import getRedis from '@/lib/getRedis'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {
    const { userId, name, lines } = req.body;

    if (userId && Array.isArray(lines) && lines.length) {
      const redis = getRedis();
      let time = new Date().toISOString();
      let id = v4();

      const root = `TRANSCRIPTS/${userId}/${id}`;


      const data = { id: id, userId, name: name || id, time, lines: lines.length };
      console.log('saving for user id ', userId, root, data);

      await redis.set(`${root}/info`, JSON.stringify(data));
      await redis.set(root, lines.join("\t"));
      res.status(200).json({ id, saved: true });
    } else {
      res.status(200).json({ saved: false });
    }
  } catch
    (err) {
    res.status(500).json({ error: err });
  }
}
