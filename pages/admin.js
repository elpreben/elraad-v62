import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

export default function Admin() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch('/api/get-cases');
        const data = await response.json();
        setCases(data);
      } catch (error) {
        console.error('Feil ved henting av saker:', error);
      }
      setLoading(false);
    };
    fetchCases();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch('/api/update-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (response.ok) {
        setCases((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item))
        );
      }
    } catch (error) {
      console.error('Feil ved oppdatering av status:', error);
    }
  };

  return (
    <Layout>
      <div className="bg-white shadow p-4 rounded-xl max-w-4xl w-full mt-4 text-gray-800">
        <h1 className="text-2xl font-bold mb-4 text-center">Admin - Oversikt over saker</h1>
        {loading ? (
          <p>Laster saker...</p>
        ) : (
          <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Saksnr</th>
                <th className="border border-gray-300 p-2">E-post</th>
                <th className="border border-gray-300 p-2">Beskrivelse</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Handling</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((item) => (
                <tr key={item.id}>
                  <td className="border border-gray-300 p-2">{item.id}</td>
                  <td className="border border-gray-300 p-2">{item.email}</td>
                  <td className="border border-gray-300 p-2">{item.description}</td>
                  <td className="border border-gray-300 p-2">{item.status}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => updateStatus(item.id, 'Under behandling')}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Sett til Under behandling
                    </button>
                    <button
                      onClick={() => updateStatus(item.id, 'Ferdig')}
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs ml-2"
                    >
                      Sett til Ferdig
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}