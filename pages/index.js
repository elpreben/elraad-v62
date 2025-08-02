import { useState } from 'react';
import Layout from '../components/Layout';

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [caseNumber, setCaseNumber] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const description = e.target.problem.value;

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, description }),
      });

      const data = await response.json();

      if (response.ok) {
        setCaseNumber(data.caseNumber);
        setSubmitted(true);
      } else {
        alert('Det oppstod en feil: ' + (data.error || 'Prøv igjen.'));
      }
    } catch (error) {
      console.error('Feil ved sending:', error);
      alert('En uventet feil oppstod.');
    }

    setLoading(false);
  };

  const handleAISubmit = async (e) => {
    e.preventDefault();
    setAiLoading(true);
    setAiResponse("");

    const problem = e.target.problem.value;

    try {
      const response = await fetch('/api/ai-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem }),
      });

      const data = await response.json();

      if (response.ok) {
        setAiResponse(data.aiResponse);
      } else {
        setAiResponse("Det oppstod en feil. Prøv igjen.");
      }
    } catch (error) {
      console.error('Feil ved AI-henting:', error);
      setAiResponse("En uventet feil oppstod.");
    }

    setAiLoading(false);
  };

  return (
    <Layout>
      <div className="bg-white shadow p-4 rounded-xl max-w-2xl w-full mt-4 text-gray-800">
        {!submitted ? (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center">
              Velkommen til Elråd – din digitale elektroassistent
            </h1>
            <p className="mb-4 text-sm text-center">
              Hos Elråd hjelper vi deg med å løse problemer knyttet til ditt elektriske anlegg på en enkel og trygg måte.
              <br />
              Vår løsning kombinerer kunstig intelligens og ekte fagkompetanse for å gi deg raske og presise råd.
            </p>
            <div className="bg-gray-100 p-3 rounded-lg mb-4 text-sm">
              <h2 className="font-semibold mb-1">Slik fungerer det:</h2>
              <p>
                <strong>Steg 1:</strong> Beskriv problemet i skjemaet og få et umiddelbart AI-svar.
              </p>
              <p>
                <strong>Steg 2:</strong> Hvis problemet ikke blir løst, kan en av våre kvalifiserte fagpersoner – autorisert installatør og elektriker – ta kontakt.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2" encType="multipart/form-data">
              <textarea
                name="problem"
                className="w-full border p-2 rounded text-sm"
                placeholder="Beskriv problemet..."
                required
                rows="2"
              />
              <input
                name="boenhet"
                type="text"
                className="w-full border p-2 rounded text-sm"
                placeholder="Type boenhet"
                required
              />
              <input
                name="aarstall"
                type="text"
                className="w-full border p-2 rounded text-sm"
                placeholder="Årstall for anlegget"
                required
              />
              <input
                name="bilde"
                type="file"
                className="w-full border p-2 rounded text-sm"
              />
              <input
                name="email"
                type="email"
                className="w-full border p-2 rounded text-sm"
                placeholder="E-postadresse"
                required
              />

              <button
                onClick={handleAISubmit}
                type="button"
                className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg text-sm"
              >
                {aiLoading ? 'Henter AI-svar...' : 'Få AI-svar nå'}
              </button>

              {aiResponse && (
                <div className="bg-gray-100 p-3 rounded text-sm mt-2">
                  <h3 className="font-semibold mb-1">AI-svar:</h3>
                  <p>{aiResponse}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold py-2 rounded-lg text-sm mt-2"
              >
                {loading ? 'Sender...' : 'SEND INN'}
              </button>
            </form>
          </>
        ) : (
          <p className="text-center font-semibold text-md">
            Takk! Vi har mottatt din henvendelse.<br />
            <strong>Saksnummer:</strong> {caseNumber}.<br />
            Du vil snart få en e-post med mer informasjon.
          </p>
        )}
      </div>
    </Layout>
  );
}