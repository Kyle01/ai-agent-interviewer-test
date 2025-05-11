'use client';

import { useState, useEffect } from "react";

export default function Home() {
  const [data, setData] = useState<{ message: string; status: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/test')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">API Test Response</h1>
        
        {loading && (
          <div className="p-4 bg-gray-100 rounded">
            Loading...
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded">
            Error: {error}
          </div>
        )}

        {data && (
          <div className="p-4 bg-green-100 rounded">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 