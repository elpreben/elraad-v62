import { redis } from "../../utils/upstashClient";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id, status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ message: 'Mangler id eller status' });
  }

  try {
    const cases = await redis.lrange('cases', 0, -1);
    const updatedCases = cases.map((item) => {
      const parsed = JSON.parse(item);
      if (parsed.id === id) {
        parsed.status = status;
      }
      return JSON.stringify(parsed);
    });

    await redis.del('cases');
    await redis.rpush('cases', ...updatedCases);

    return res.status(200).json({ message: 'Status oppdatert' });
  } catch (error) {
    console.error('Feil ved oppdatering av status:', error);
    return res.status(500).json({ message: 'Kunne ikke oppdatere status' });
  }
}