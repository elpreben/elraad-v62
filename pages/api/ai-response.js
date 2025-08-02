import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { problem } = req.body;

  if (!problem) {
    return res.status(400).json({ message: "Mangler beskrivelse av problemet" });
  }

  try {
    const prompt = `
    Du er en autorisert elektriker som gir trygge, presise råd til en boligeier.
    Kundeproblemet: ${problem}
    
    Svar kort, men forklar årsak og mulige løsninger. Gi alltid sikkerhetsråd først.
    Ikke foreslå noe ulovlig eller farlig. Hvis kunden bør kontakte elektriker, si det tydelig.
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Du er en hjelpsom elektriker-assistent." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    });

    const aiResponse = response.choices[0].message.content;

    return res.status(200).json({ aiResponse });
  } catch (error) {
    console.error("Feil ved OpenAI-kall:", error);
    return res.status(500).json({ message: "Feil ved henting av AI-svar" });
  }
}
