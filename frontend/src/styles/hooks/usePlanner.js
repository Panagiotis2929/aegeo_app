import { useState } from 'react';

export const usePlanner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateTrip = async (tripData) => {
    setLoading(true);
    setError(null);

    try {
      // Στέλνουμε τα δεδομένα στο δικό σου FastAPI backend στη θύρα 8000
      const res = await fetch('http://localhost:8000/api/generate-trip', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(tripData)
      });

      if (!res.ok) {
        throw new Error('Κάτι πήγε στραβά με την επικοινωνία με τον server');
      }

      const data = await res.json();
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generateTrip, loading, error };
};