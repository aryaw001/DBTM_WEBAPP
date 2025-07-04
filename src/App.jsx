import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import LoginForm from '@/components/LoginForm';
import AthleteProfile from '@/components/AthleteProfile';
import MeasurementDashboard from '@/components/MeasurementDashboard';

export const API_BASE_URL = "https://dbtm-backend.onrender.com/api";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Athlete Measurement Dashboard - Track Your Performance</title>
        <meta
          name="description"
          content="Advanced athlete measurement dashboard with ESP32 integration for real-time body measurements and activity tracking. Monitor your performance with precision."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white">
        <Toaster />
        {!currentUser ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <MeasurementDashboard profile={currentUser} onLogout={handleLogout} />
        )}
      </div>
    </>
  );
}

export default App;
