import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { API_BASE_URL } from '../../lib/config';

const BodyMeasurementHistory = ({ measurements, esp32Ip, onDeleteHistory }) => {
  const [showPrevious, setShowPrevious] = useState(false);

  console.log('BodyMeasurementHistory measurements:', measurements); // Add this line
  const saveHistoryToDB = async () => {
  if (!measurements || measurements.length === 0) {
    alert('No measurements to save!');
    return;
  }

  for (const measurement of measurements) {
    const {
        user_id = 1, // fallback for development
        name = 'Unknown',
        age = 0,
        weight = 0,
        crownHeight = 0,
        shoulderHeight = 0,
        elbowReach = 0,
        hipHeight = 0,
        handReach = 0,
        kneeHeight = 0,
        ankleHeight = 0,
      } = measurement;

    try {
      const res = await fetch(`${API_BASE_URL}/measurements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user_id || 1, // Replace 1 with actual logged-in user_id if needed
          name,
          age,
          weight,  
          crownHeight,
          shoulderHeight,
          elbowReach,
          hipHeight,
          handReach,
          kneeHeight,
          ankleHeight,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error('❌ Failed to save measurement:', data.error);
      } else {
        console.log('✅ Measurement saved:', data.message);
      }

    } catch (err) {
      console.error('❌ Error posting measurement:', err);
    }
  }

  alert('✅ All measurements saved to database!');
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <Card className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white text-xl">Body Measurement History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border border-slate-700">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-700">
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Name</TableHead>
                  <TableHead className="text-gray-300">Age</TableHead>
                  <TableHead className="text-gray-300">Weight (kg)</TableHead>
                  <TableHead className="text-gray-300">Crown Height (cm)</TableHead>
                  <TableHead className="text-gray-300">Shoulder Height (cm)</TableHead>
                  <TableHead className="text-gray-300">Elbow Reach (cm)</TableHead>
                  <TableHead className="text-gray-300">Hip Height (cm)</TableHead>
                  <TableHead className="text-gray-300">Hand Reach (cm)</TableHead>
                  <TableHead className="text-gray-300">Knee Height (cm)</TableHead>
                  <TableHead className="text-gray-300">Ankle Height (cm)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {measurements?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center text-gray-400 py-8">
                      No measurements found. Start your first body measurement!
                    </TableCell>
                  </TableRow>
                ) : (
                  measurements
                    .filter((m) => m && m.id !== 'live')
                    .sort((a, b) => b.id - a.id)
                    .map((m) => (
                      <TableRow key={m.id}>
                        <TableCell>{m.date}</TableCell>
                        <TableCell>{m.name}</TableCell>
                        <TableCell>{m.age}</TableCell>
                        <TableCell>{m.weight}</TableCell>
                        <TableCell>{m.crownHeight !== undefined ? Number(m.crownHeight).toFixed(2) : '-'}</TableCell>
                        <TableCell>{m.shoulderHeight !== undefined ? Number(m.shoulderHeight).toFixed(2) : '-'}</TableCell>
                        <TableCell>{m.elbowReach !== undefined ? Number(m.elbowReach).toFixed(2) : '-'}</TableCell>
                        <TableCell>{m.hipHeight !== undefined ? Number(m.hipHeight).toFixed(2) : '-'}</TableCell>
                        <TableCell>{m.handReach !== undefined ? Number(m.handReach).toFixed(2) : '-'}</TableCell>
                        <TableCell>{m.kneeHeight !== undefined ? Number(m.kneeHeight).toFixed(2) : '-'}</TableCell>
                        <TableCell>{m.ankleHeight !== undefined ? Number(m.ankleHeight).toFixed(2) : '-'}</TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
          {/* Button Row */}
          <div className="flex justify-between items-center mt-4 gap-2">
            <button
              onClick={saveHistoryToDB}
              className="px-4 py-2 bg-green-600 text-white border-2 border-green-600 rounded hover:bg-green-700 hover:border-green-700 font-semibold transition duration-200"
            >
              Save History to Database
            </button>

            <button
              onClick={onDeleteHistory}
              className="px-4 py-2 bg-red-600 text-white border-2 border-red-600 rounded hover:bg-red-700 hover:border-red-700 font-semibold transition duration-200"
            >
              Delete History
            </button>
          </div>
          {/* Previous Readings Section
          {showPrevious && (
            <div className="mt-4">
              <h3 className="text-white text-lg mb-2">Previous Readings</h3>
              <ul className="text-gray-200 list-disc pl-5">
                {measurements
                  .filter((m) => m && m.id !== 'live')
                  .map((m, idx) => (
                    <li key={m.id || idx}>
                      {m.date} - {m.name} - {m.crownHeight} cm, {m.shoulderHeight} cm, ...
                    </li>
                  ))}
              </ul>
            </div>
          )} */}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BodyMeasurementHistory;