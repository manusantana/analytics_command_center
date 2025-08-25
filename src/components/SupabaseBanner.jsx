import React from 'react';

const SupabaseBanner = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnon) return null;

  return (
    <div className="bg-yellow-100 text-yellow-800 p-2 text-center text-sm">
      Supabase environment variables are missing. Features depending on Supabase are disabled.
    </div>
  );
};

export default SupabaseBanner;
