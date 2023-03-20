import Redis from 'ioredis'

export default function getRedis() {
  return new Redis({
    host: process.env.REDIS_HOST,
    username: "default",
    password: process.env.REDIS_PASSWORD,
    port: Number(process.env.REDIS_PORT)
  });
}
