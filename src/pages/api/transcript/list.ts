import { NextApiRequest, NextApiResponse } from 'next'
import { v4 } from 'uuid';

import getRedis from '@/lib/getRedis'

function parse(str: string) {
  try {
    return JSON.parse(str);
  } catch (_err) {
    return {};
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.body;

  const redis = getRedis();
  //@TODO: limit count, add security
  const keys = await redis.keys(`TRANSCRIPTS/${userId}/*/info`);
  console.log('keys for ', userId, keys);
  const process = redis.pipeline();
  keys.forEach((key) => process.get(key));
  let data;
  try {
    data = await process.exec();
  } catch (err) {
    res.status(500).send({ error: 'read error' });
  }
  const files = (data as unknown[][]).map(([err, result]) => {
    if (typeof result === 'string') {
      return parse(result)
    }
  });

  res.status(200).json(files);
}
