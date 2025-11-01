'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  X,
  User, 
  Heart,
  Activity,
  Target,
  Stethoscope,
  Save,
  Loader2,
  Calculator,
  Info
} from 'lucide-react';
import { getUserProfile, upsertUserProfile, UserProfile, calculateHealthMetrics } from '@/utils/supabase/profile';
import { toast } from 'sonner';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdate?: (profile: UserProfile) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onProfileUpdate }) => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [profile, setProfile] = useState<Partial<UserProfile>>({});

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id || !isOpen) return;
      
      try {
        setIsLoading(true);
        const { data: userProfile } = await getUserProfile(user.id);
        if (userProfile) {
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id, isOpen]);

  const handleInputChange = (field: string, value: unknown) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      setIsSaving(true);
      
      const profileData = {
        clerk_id: user.id,
        full_name: profile.full_name || user.fullName || '',
        ...profile
      };

      const { data: updatedProfile, error } = await upsertUserProfile(profileData);
      
      if (error) {
        throw error;
      }

      toast.success('Profile updated successfully!');
      if (onProfileUpdate && updatedProfile) {
        onProfileUpdate(updatedProfile);
      }
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const calculateBMI = () => {
    if (profile.height_cm && profile.weight_kg) {
      const heightInMeters = profile.height_cm / 100;
      const bmi = parseFloat((profile.weight_kg / (heightInMeters * heightInMeters)).toFixed(1));
      handleInputChange('bmi', bmi);
      toast.success(`BMI calculated: ${bmi}`);
    } else {
      toast.error('Please enter both height and weight to calculate BMI');
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'vitals', label: 'Vitals', icon: Heart },
    { id: 'medical', label: 'Medical', icon: Stethoscope },
    { id: 'lifestyle', label: 'Lifestyle', icon: Target },
  ];

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            <span className="ml-2">Loading profile...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl lg:max-w-6xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Health Profile</DialogTitle>
        <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 dark:text-green-400" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Health Profile
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage your personal health information
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row overflow-hidden max-h-[calc(90vh-200px)]">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4 p-4 sm:p-6 border-b lg:border-r lg:border-b-0 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-all text-sm sm:text-base ${
                    activeTab === tab.id
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 shadow-sm'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto modal-scrollbar">
            {activeTab === 'basic' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={profile.full_name || ''}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={profile.age || ''}
                      onChange={(e) => handleInputChange('age', parseInt(e.target.value) || null)}
                      placeholder="Enter your age"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      value={profile.gender || ''}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="blood_group">Blood Group</Label>
                    <select
                      id="blood_group"
                      value={profile.blood_group || ''}
                      onChange={(e) => handleInputChange('blood_group', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                {/* Physical Measurements */}
                <Card className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-950">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="text-sm sm:text-base font-semibold text-blue-900 dark:text-blue-100">Physical Measurements</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="height_cm">Height (cm)</Label>
                      <Input
                        id="height_cm"
                        type="number"
                        step="0.1"
                        value={profile.height_cm || ''}
                        onChange={(e) => handleInputChange('height_cm', parseFloat(e.target.value) || null)}
                        placeholder="170"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="weight_kg">Weight (kg)</Label>
                      <Input
                        id="weight_kg"
                        type="number"
                        step="0.1"
                        value={profile.weight_kg || ''}
                        onChange={(e) => handleInputChange('weight_kg', parseFloat(e.target.value) || null)}
                        placeholder="70"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bmi">BMI</Label>
                      <div className="flex gap-2">
                        <Input
                          id="bmi"
                          type="number"
                          step="0.1"
                          value={profile.bmi || ''}
                          onChange={(e) => handleInputChange('bmi', parseFloat(e.target.value) || null)}
                          placeholder="Auto-calculated"
                          readOnly
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={calculateBMI}
                          className="px-2 sm:px-3 shrink-0"
                        >
                          <Calculator className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'vitals' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Vital Signs</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="blood_pressure_systolic">Systolic BP (mmHg)</Label>
                    <Input
                      id="blood_pressure_systolic"
                      type="number"
                      value={profile.blood_pressure_systolic || ''}
                      onChange={(e) => handleInputChange('blood_pressure_systolic', parseInt(e.target.value) || null)}
                      placeholder="120"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="blood_pressure_diastolic">Diastolic BP (mmHg)</Label>
                    <Input
                      id="blood_pressure_diastolic"
                      type="number"
                      value={profile.blood_pressure_diastolic || ''}
                      onChange={(e) => handleInputChange('blood_pressure_diastolic', parseInt(e.target.value) || null)}
                      placeholder="80"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="heart_rate">Heart Rate (BPM)</Label>
                    <Input
                      id="heart_rate"
                      type="number"
                      value={profile.heart_rate || ''}
                      onChange={(e) => handleInputChange('heart_rate', parseInt(e.target.value) || null)}
                      placeholder="72"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="blood_sugar">Blood Sugar (mg/dL)</Label>
                    <Input
                      id="blood_sugar"
                      type="number"
                      step="0.1"
                      value={profile.blood_sugar || ''}
                      onChange={(e) => handleInputChange('blood_sugar', parseFloat(e.target.value) || null)}
                      placeholder="90"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cholesterol">Cholesterol (mg/dL)</Label>
                    <Input
                      id="cholesterol"
                      type="number"
                      step="0.1"
                      value={profile.cholesterol || ''}
                      onChange={(e) => handleInputChange('cholesterol', parseFloat(e.target.value) || null)}
                      placeholder="180"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="oxygen_level">Oxygen Level (%)</Label>
                    <Input
                      id="oxygen_level"
                      type="number"
                      step="0.1"
                      value={profile.oxygen_level || ''}
                      onChange={(e) => handleInputChange('oxygen_level', parseFloat(e.target.value) || null)}
                      placeholder="98"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'medical' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Medical History</h3>
                
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <Label htmlFor="chronic_diseases">Chronic Diseases</Label>
                    <Textarea
                      id="chronic_diseases"
                      value={profile.chronic_diseases || ''}
                      onChange={(e) => handleInputChange('chronic_diseases', e.target.value)}
                      placeholder="List any chronic conditions (diabetes, hypertension, etc.)"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="allergies">Allergies</Label>
                    <Textarea
                      id="allergies"
                      value={profile.allergies || ''}
                      onChange={(e) => handleInputChange('allergies', e.target.value)}
                      placeholder="Food allergies, medication allergies, environmental allergies"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="current_medications">Current Medications</Label>
                    <Textarea
                      id="current_medications"
                      value={profile.current_medications || ''}
                      onChange={(e) => handleInputChange('current_medications', e.target.value)}
                      placeholder="List current medications with dosages"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="past_surgeries">Past Surgeries</Label>
                    <Textarea
                      id="past_surgeries"
                      value={profile.past_surgeries || ''}
                      onChange={(e) => handleInputChange('past_surgeries', e.target.value)}
                      placeholder="Previous surgical procedures and dates"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="family_history">Family History</Label>
                    <Textarea
                      id="family_history"
                      value={profile.family_history || ''}
                      onChange={(e) => handleInputChange('family_history', e.target.value)}
                      placeholder="Family medical history (heart disease, diabetes, cancer, etc.)"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'lifestyle' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Lifestyle & Goals</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="primary_goal">Primary Health Goal</Label>
                    <select
                      id="primary_goal"
                      value={profile.primary_goal || ''}
                      onChange={(e) => handleInputChange('primary_goal', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                    >
                      <option value="">Select Primary Goal</option>
                      <option value="weight-loss">Weight Loss</option>
                      <option value="weight-gain">Weight Gain</option>
                      <option value="maintain-weight">Maintain Weight</option>
                      <option value="muscle-gain">Muscle Gain</option>
                      <option value="improve-fitness">Improve Fitness</option>
                      <option value="manage-condition">Manage Health Condition</option>
                      <option value="general-wellness">General Wellness</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="target_weight">Target Weight (kg)</Label>
                    <Input
                      id="target_weight"
                      type="number"
                      step="0.1"
                      value={profile.target_weight || ''}
                      onChange={(e) => handleInputChange('target_weight', parseFloat(e.target.value) || null)}
                      placeholder="65"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sleep_hours">Sleep Hours (per night)</Label>
                    <Input
                      id="sleep_hours"
                      type="number"
                      step="0.5"
                      value={profile.sleep_hours || ''}
                      onChange={(e) => handleInputChange('sleep_hours', parseFloat(e.target.value) || null)}
                      placeholder="8"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="activity_level">Activity Level</Label>
                    <select
                      id="activity_level"
                      value={profile.activity_level || ''}
                      onChange={(e) => handleInputChange('activity_level', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                    >
                      <option value="">Select Activity Level</option>
                      <option value="sedentary">Sedentary (little or no exercise)</option>
                      <option value="lightly-active">Lightly Active (light exercise 1-3 days/week)</option>
                      <option value="moderately-active">Moderately Active (moderate exercise 3-5 days/week)</option>
                      <option value="very-active">Very Active (hard exercise 6-7 days/week)</option>
                      <option value="extra-active">Extra Active (very hard exercise, physical job)</option>
                    </select>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <Label htmlFor="dietary_preferences">Dietary Preferences</Label>
                    <Textarea
                      id="dietary_preferences"
                      value={profile.dietary_preferences || ''}
                      onChange={(e) => handleInputChange('dietary_preferences', e.target.value)}
                      placeholder="Vegetarian, vegan, keto, Mediterranean, food restrictions, etc."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 sticky bottom-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <Info className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Your health data is secure and private</span>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Button 
                variant="outline" 
                onClick={onClose} 
                disabled={isSaving}
                className="flex-1 sm:flex-none text-sm"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isSaving} 
                className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none text-sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Save Profile
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
