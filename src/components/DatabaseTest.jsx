import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function DatabaseTest() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .limit(10);

        if (error) {
          console.error('Supabase error:', error);
          setError(error.message);
        } else {
          setCategories(data || []);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Database Connection Test</h1>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <p className="text-lg">Testing connection to Supabase...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Database Connection Test</h1>
          <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-6 border border-red-500">
            <h2 className="text-xl font-bold text-red-400 mb-4">Connection Error</h2>
            <p className="text-red-300">{error}</p>
            <div className="mt-4 p-4 bg-gray-800 rounded">
              <p className="text-sm text-gray-300">Check your environment variables in .env</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Connection Test</h1>
        
        <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-6 border border-green-500 mb-8">
          <h2 className="text-xl font-bold text-green-400 mb-2">✅ Connection Successful!</h2>
          <p className="text-green-300">Your frontend is successfully connected to Supabase.</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Properties Data</h2>
          {categories.length === 0 ? (
            <p className="text-gray-300">No properties found. Add some test data in your Supabase dashboard.</p>
          ) : (
            <div className="space-y-4">
              {categories.map((property) => (
                <div key={property.id} className="bg-white/5 rounded-lg p-4">
                  <h3 className="font-semibold text-lg">{property.title || 'No Title'}</h3>
                  <p className="text-gray-300">{property.description || 'No description'}</p>
                  <p className="text-sm text-gray-400">Price: ${property.price || 'Not set'}</p>
                  <p className="text-sm text-gray-400">Location: {property.location || 'Not set'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 