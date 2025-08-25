import React from "react";
import Routes from "./Routes";
import { AuthProvider } from './contexts/AuthContext';
import SupabaseBanner from './components/SupabaseBanner';

function App() {
  return (
    <AuthProvider>
      <SupabaseBanner />
      <Routes />
    </AuthProvider>
  );
}

export default App;