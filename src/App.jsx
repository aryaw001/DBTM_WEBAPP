import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import LoginForm from '@/components/LoginForm';
import AthleteProfile from '@/components/AthleteProfile';
import MeasurementDashboard from '@/components/MeasurementDashboard';
import { API_BASE_URL } from '@/lib/config';

const API_BASE_URL = "https://dbtm-webapp.onrender.com/api";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [athleteProfile, setAthleteProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedProfile = localStorage.getItem('athleteProfile');

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    if (savedProfile) {
      setAthleteProfile(JSON.parse(savedProfile));
    }

    setLoading(false);
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await res.json();
      setCurrentUser(data);
      localStorage.setItem('currentUser', JSON.stringify(data));
    } catch (err) {
      console.error('Login failed:', err.message);
      alert('Login failed: ' + err.message);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAthleteProfile(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('athleteProfile');
  };

  const handleProfileComplete = (profile) => {
    setAthleteProfile(profile);
    localStorage.setItem('athleteProfile', JSON.stringify(profile));
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
        <meta name="description" content="Advanced athlete measurement dashboard with ESP32 integration for real-time body measurements and activity tracking. Monitor your performance with precision." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white">
        <Toaster />
        {!currentUser ? (
          <LoginForm onLogin={(user) => {
            setCurrentUser(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
          }} />
        ) : (
          <MeasurementDashboard
            profile={currentUser}
            onLogout={() => {
              setCurrentUser(null);
              localStorage.removeItem('currentUser');
            }}
          />
        )}
      </div>
    </>
  );
}

export default App;
