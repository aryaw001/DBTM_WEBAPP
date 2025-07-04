import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Heart, Zap } from 'lucide-react';

const ActivityMeasurementHistory = ({ measurements }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="bg-slate-900/90 backdrop-blur-xl border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Activity Measurement History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-700">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-gray-300">Activity</TableHead>
                  <TableHead className="text-gray-300">Heart Rate</TableHead>
                  <TableHead className="text-gray-300">Speed</TableHead>
                  <TableHead className="text-gray-300">Calories</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {measurements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-400 py-8">
                      No activity measurements yet. Select an activity and start measuring!
                    </TableCell>
                  </TableRow>
                ) : (
                  measurements.slice(-5).reverse().map((measurement) => (
                    <TableRow key={measurement.id} className="border-slate-700">
                      <TableCell className="text-white capitalize">{measurement.activity}</TableCell>
                      <TableCell className="text-white flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-400" />
                        {measurement.heartRate} bpm
                      </TableCell>
                      <TableCell className="text-white flex items-center gap-1">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        {measurement.speed} km/h
                      </TableCell>
                      <TableCell className="text-white">{measurement.calories} cal</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ActivityMeasurementHistory;