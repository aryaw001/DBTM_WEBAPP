import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Weight, Calendar } from 'lucide-react';

const ProfileSummary = ({ profile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="bg-gradient-to-r from-slate-900/90 to-purple-900/90 backdrop-blur-xl border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <User className="w-5 h-5" />
            Athlete Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
              <User className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Name</p>
                <p className="font-semibold text-white">{profile.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
              <Weight className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Weight</p>
                <p className="font-semibold text-white">{profile.weight} kg</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
              <Calendar className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Age</p>
                <p className="font-semibold text-white">{profile.age} years</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileSummary;