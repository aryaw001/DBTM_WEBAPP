import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { esp32Communication, mockFirebase } from '@/lib/firebase';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ProfileSummary from '@/components/dashboard/ProfileSummary';
import BodyMeasurementWebSocket from "@/components/dashboard/BodyMeasurementWebSocket";
import ActivityMeasurementControl from '@/components/dashboard/ActivityMeasurementControl';
import BodyMeasurementHistory from '@/components/dashboard/BodyMeasurementHistory';
import ActivityMeasurementHistory from '@/components/dashboard/ActivityMeasurementHistory';

const MeasurementDashboard = ({ profile, onLogout }) => {
  const [liveMeasurement, setLiveMeasurement] = useState(null);
  const [bodyMeasurements, setBodyMeasurements] = useState([]);
  const [activityMeasurements, setActivityMeasurements] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [measuring, setMeasuring] = useState(false);
  const [measurementType, setMeasurementType] = useState('');
  const [esp32Ip, setEsp32Ip] = useState('');
  const [ipInput, setIpInput] = useState('');
  const [showIpModal, setShowIpModal] = useState(true);
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState(profile);

  useEffect(() => {
    const savedBodyMeasurements = localStorage.getItem('bodyMeasurements');
    if (savedBodyMeasurements) {
      setBodyMeasurements(JSON.parse(savedBodyMeasurements));
    }
  }, []);

  // Fetch measurements from backend (only after ESP32 IP is set)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id || !esp32Ip) return;
    axios.get(`http://${esp32Ip}:5000/api/measurements/${user.id}`)
      .then(res => setBodyMeasurements(res.data))
      .catch(err => console.error(err));
  }, [esp32Ip]);

  // Handle ESP32 IP connect
  const handleConnect = () => {
    if (!ipInput) {
      toast({
        title: 'IP Required',
        description: 'Please enter the ESP32 IP address.',
        variant: 'destructive',
      });
      return;
    }
    setEsp32Ip(ipInput);
    setShowIpModal(false);
  };

  // 🔁 Final Body Measurement Update from WebSocket
  const handleFinalBodyMeasurement = (newData) => {
  const updated = {
    ...newData,
    name: userProfile?.name ?? 'User',
    age: userProfile?.age ?? '-',
    weight: userProfile?.weight ?? '-',
    date: new Date().toLocaleDateString(),
  };

  // // 1. Local storage & Firebase
  // setBodyMeasurements((prev) => {
  //   const list = [...prev, updated];
  //   localStorage.setItem('bodyMeasurements', JSON.stringify(list));
  //   mockFirebase.database.ref('bodyMeasurements').push(updated);
  //   return list;
  // });

  // 2. Send to backend SQL
  console.log("📤 Sending to SQL DB:", updated);
  axios.post('http://192.168.0.140:5000/api/measurements', {
    user_id: user?.id || 1,  // default fallback
    crown_height: newData.crownHeight ?? 0,
    shoulder_height: newData.shoulderHeight ?? 0,
    elbow_reach: newData.elbowReach ?? 0,
    hip_height: newData.hipHeight ?? 0,
    hand_reach: newData.handReach ?? 0,
    knee_height: newData.kneeHeight ?? 0,
    ankle_height: newData.ankleHeight ?? 0,
  })
  .then(() => {
    console.log("✅ Successfully saved to SQL");
  })
  .catch((err) => {
    console.error("❌ Failed to save to SQL", err);
  });

  // 3. Toast notification
  toast({
    title: '✅ Body Measurement Recorded',
    description: 'Your new body measurement is saved.',
  });
  };



  // 🔁 Live Data from WebSocket
  const handleLiveBodyMeasurement = (liveData) => {
    if (liveData) {
      setLiveMeasurement(liveData);
      const others = bodyMeasurements.filter((m) => m.id !== 'live');
      setBodyMeasurements([...others, { id: 'live', ...liveData }]);
    } else {
      setLiveMeasurement(null);
      setBodyMeasurements((prev) => prev.filter((m) => m.id !== 'live'));
    }
  };

  const startActivityMeasurement = async () => {
    if (!selectedActivity) {
      toast({
        title: "Select an activity",
        description: "Please choose an activity before starting measurement.",
        variant: "destructive",
      });
      return;
    }

    setMeasuring(true);
    setMeasurementType('activity');

    try {
      toast({
        title: `Starting ${selectedActivity} measurement 🏃‍♂️`,
        description: "ESP32 is now tracking your activity performance...",
      });

      const measurements = await esp32Communication.startMeasurement('activity');

      const newMeasurement = {
        id: Date.now(),
        activity: selectedActivity,
        ...measurements,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      };

      const updated = [...activityMeasurements, newMeasurement];
      setActivityMeasurements(updated);
      localStorage.setItem('activityMeasurements', JSON.stringify(updated));
      mockFirebase.database.ref('activityMeasurements').push(newMeasurement);

      toast({
        title: "Activity measurement complete! 🏆",
        description: `Your ${selectedActivity} performance has been recorded.`,
      });
    } catch (error) {
      toast({
        title: "Measurement failed",
        description: "Please check ESP32 connection and try again.",
        variant: "destructive",
      });
    } finally {
      setMeasuring(false);
      setMeasurementType('');
    }
  };

  const handleDeleteHistory = () => {
    setBodyMeasurements([]);
    localStorage.removeItem('bodyMeasurements');
  };
  
  const handleProfileUpdate = (newProfile) => {
    setUserProfile(newProfile);
    // Optionally persist to localStorage or backend
    localStorage.setItem('currentUser', JSON.stringify(newProfile));
  };

  const handleEsp32IpChange = (newIp) => {
    setEsp32Ip(newIp);
    setIpInput(newIp);
  };

  return (
    <div className="relative min-h-screen p-4 space-y-6">
      {/* Modal Overlay */}
      {showIpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Enter ESP32 IP Address</h2>
            <input
              type="text"
              value={ipInput}
              onChange={e => setIpInput(e.target.value)}
              placeholder="e.g. 192.168.0.140"
              className="border px-3 py-2 rounded mb-4 text-black"
              autoFocus
            />
            <button
              onClick={handleConnect}
              className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
            >
              Connect
            </button>
          </div>
        </div>
      )}

      {/* Main Dashboard (blurred if modal is open) */}
      <div className={showIpModal ? 'filter blur-sm pointer-events-none select-none' : ''}>
        <DashboardHeader
          profile={userProfile}
          onLogout={onLogout}
          onProfileUpdate={handleProfileUpdate}
          esp32Ip={esp32Ip}
          onEsp32IpChange={handleEsp32IpChange}
        />
        <ProfileSummary profile={userProfile} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BodyMeasurementWebSocket
            onLiveMeasurement={(liveData) => {
              if (liveData) {
                setBodyMeasurements((prev) => {
                  const others = prev.filter((m) => m.id !== 'live');
                  return [
                    ...others,
                    {
                      id: 'live',
                      ...liveData,
                      date: new Date().toLocaleDateString(),
                      time: new Date().toLocaleTimeString(),
                      name: userProfile?.name ?? 'User',
                      age: userProfile?.age ?? '-',
                      weight: userProfile?.weight ?? '-',
                    },
                  ];
                });
              } else {
                setBodyMeasurements((prev) => prev.filter((m) => m.id !== 'live'));
              }
            }}
            addFinalMeasurement={(data) => {
              const enriched = {
                ...data,
                name: userProfile?.name ?? 'User',
                age: userProfile?.age ?? '-',
                weight: userProfile?.weight ?? '-',
              };
              setBodyMeasurements((prev) => {
                const filtered = prev.filter((m) => m.id !== 'live');
                if (filtered.length === 0) {
                  return [enriched];
                } else {
                  const updated = { ...filtered[0], ...enriched };
                  return [updated, ...filtered.slice(1)];
                }
              });
            }}
            esp32Ip={esp32Ip}
          />

          <ActivityMeasurementControl
            startActivityMeasurement={startActivityMeasurement}
            measuring={measuring}
            measurementType={measurementType}
            selectedActivity={selectedActivity}
            setSelectedActivity={setSelectedActivity}
            esp32Ip={esp32Ip}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <BodyMeasurementHistory
            measurements={bodyMeasurements}
            esp32Ip={esp32Ip}
            onDeleteHistory={handleDeleteHistory}
          />
          <ActivityMeasurementHistory measurements={activityMeasurements} />
        </div>
      </div>
    </div>
  );
};

export default MeasurementDashboard;
