import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const DashboardHeader = ({
  profile,
  onLogout,
  onProfileUpdate,
  esp32Ip,
  onEsp32IpChange,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editProfile, setEditProfile] = useState({
    name: profile?.name || '',
    weight: profile?.weight || '',
    age: profile?.age || '',
  });
  const [ipInput, setIpInput] = useState(esp32Ip || '');

  const handleApply = () => {
    if (onProfileUpdate) onProfileUpdate(editProfile);
    if (onEsp32IpChange) onEsp32IpChange(ipInput);
    setMenuOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between items-center"
    >
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Athlete Dashboard
        </h1>
        <p className="text-gray-300 mt-1">Welcome back, {profile.name}!</p>
      </div>
      <div className="relative">
        <button
          className="p-2 rounded hover:bg-slate-800"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
        >
          <Bars3Icon className="h-7 w-7 text-white" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded shadow-lg z-50 p-4 text-black">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setMenuOpen(false)}
              aria-label="Close"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            <div className="mb-4 mt-4">
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                type="text"
                value={editProfile.name}
                onChange={(e) => setEditProfile(p => ({ ...p, name: e.target.value }))}
                className="w-full border px-2 py-1 rounded"
              />

              <label className="block text-sm font-semibold mt-2 mb-1">Weight (kg)</label>
              <input
                type="number"
                value={editProfile.weight}
                onChange={(e) => setEditProfile(p => ({ ...p, weight: e.target.value }))}
                className="w-full border px-2 py-1 rounded"
              />

              <label className="block text-sm font-semibold mt-2 mb-1">Age</label>
              <input
                type="number"
                value={editProfile.age}
                onChange={(e) => setEditProfile(p => ({ ...p, age: e.target.value }))}
                className="w-full border px-2 py-1 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">ESP32 IP</label>
              <input
                type="text"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                placeholder="e.g. 192.168.0.140"
                className="w-full border px-2 py-1 rounded"
              />
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold transition"
              >
                Logout
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-green-600 text-white border-2 border-green-600 rounded hover:bg-green-700 font-semibold transition"
              >
                Apply Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
