import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { User, Weight, Calendar, Save } from 'lucide-react';

const AthleteProfile = ({ onProfileComplete }) => {
  const [profile, setProfile] = useState({
    name: '',
    weight: '',
    age: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load existing profile from localStorage
    const savedProfile = localStorage.getItem('athleteProfile');
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile(parsedProfile);
      if (parsedProfile.name && parsedProfile.weight && parsedProfile.age) {
        onProfileComplete(parsedProfile);
      }
    }
  }, [onProfileComplete]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save profile to localStorage
      localStorage.setItem('athleteProfile', JSON.stringify(profile));
      
      toast({
        title: "Profile saved! 🎯",
        description: "Your athlete profile has been updated successfully.",
      });
      
      onProfileComplete(profile);
    } catch (error) {
      toast({
        title: "Error saving profile",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <Card className="bg-gradient-to-br from-slate-900/90 to-blue-900/90 backdrop-blur-xl border-blue-500/20 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center"
            >
              <User className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Athlete Profile
            </CardTitle>
            <CardDescription className="text-gray-300">
              Set up your profile to start measuring your performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-200">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-gray-200">Weight (kg)</Label>
                <div className="relative">
                  <Weight className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter your weight"
                    value={profile.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-blue-500"
                    min="30"
                    max="200"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age" className="text-gray-200">Age</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={profile.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-blue-500"
                    min="10"
                    max="100"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Profile & Continue
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AthleteProfile;