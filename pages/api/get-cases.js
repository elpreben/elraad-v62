import { redis } from "../../utils/upstashClient";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const cases = await redis.lrange('cases', 0, -1);
    const parsedCases = cases.map((item) => JSON.parse(item));
    return res.status(200).json(parsedCases);
  } catch (error) {
    console.error('Feil ved henting av saker:', error);
    return res.status(500).json({ message: 'Kunne ikke hente saker' });
  }
}