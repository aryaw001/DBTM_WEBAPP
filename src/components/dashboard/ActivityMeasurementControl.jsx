import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Activity, Target, Loader2 } from 'lucide-react';

// ✅ Replaced with DB-based activities only
const activities = [
  { value: '1030_sprint', label: '1030 Sprint' },
  { value: '300_yard_shuttle', label: '300 Yard Shuttle' },
  { value: '3gaterunning', label: '3Gate Running' },
  { value: '3run', label: '3Run' },
  { value: '505_agility', label: '505 Agility' },
  { value: '5105_agility', label: '5105 Agility' },
  { value: 'broadjump', label: 'Broad Jump' },
  { value: 'dropjump', label: 'Drop Jump' },
  { value: 'jump', label: 'Jump' },

  { value: 'reflex', label: 'Reflex' },
  { value: 'running_speed', label: 'Running Speed' },
  { value: 'sprint', label: 'Sprint' },
  { value: 't_test', label: 'T-Test' },
  { value: 'yoyo', label: 'Yoyo' }
];

const ActivityMeasurementControl = ({
  startActivityMeasurement,
  measuring,
  measurementType,
  selectedActivity,
  setSelectedActivity
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-xl border-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Activity className="w-5 h-5" />
            Activity Measurements
          </CardTitle>
          <CardDescription className="text-green-200">
            Track your performance during DBTM physical tests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedActivity} onValueChange={setSelectedActivity}>
            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
              <SelectValue placeholder="Select an activity" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600 max-h-64 overflow-y-auto">
              {activities.map((activity) => (
                <SelectItem
                  key={activity.value}
                  value={activity.value}
                  className="text-white"
                >
                  {activity.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={startActivityMeasurement}
            disabled={measuring || !selectedActivity}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3"
          >
            {measuring && measurementType === 'activity' ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Measuring...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Start Activity Measurement
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ActivityMeasurementControl;
