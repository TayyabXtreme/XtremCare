'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Heart, 
  Activity, 
  Target, 
  FileText,
  CheckCircle2,
  Upload,
  Loader2
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { submitUserHealthProfile, FormData } from '@/utils/supabase/users';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { getUserProfile } from '@/utils/supabase/profile';

const SyncData = () => {
  const { user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({ isTop: true, isBottom: false });
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    // Basic Bio Data
    fullName: user?.fullName || '',
    age: '',
    gender: '',
    bloodGroup: '',
    height: '', // in cm
    weight: '', // in kg
    bmi: '',
    
    // Medical Background
    chronicDiseases: '',
    allergies: '',
    currentMedications: '',
    pastSurgeries: '',
    familyHistory: '',
    
    // Health Metrics & Vitals
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    bloodSugar: '',
    cholesterol: '',
    oxygenLevel: '',
    
    // Health Goals
    primaryGoal: '',
    targetWeight: '',
    activityLevel: '',
    dietaryPreferences: '',
    sleepHours: '',
    
    // Medical Report Upload
    reportFile: null,
    reportNotes: '',
  });

  // Check if user already has synced data
  useEffect(() => {
    const checkUserProfile = async () => {
      if (!user?.id) {
        setIsCheckingUser(false);
        return;
      }

      try {
        const { data: profile } = await getUserProfile(user.id);
        
        if (profile) {
          // User already has data synced, redirect to dashboard
          toast.success('Profile already exists! Redirecting to dashboard...');
          // Keep loading state while redirecting to prevent UI flash
          setTimeout(() => {
            router.push('/dashboard');
          }, 800);
        } else {
          // No profile found, user can proceed with sync
          setIsCheckingUser(false);
        }
      } catch (error) {
        console.error('Error checking user profile:', error);
        // On error, allow user to proceed with sync
        setIsCheckingUser(false);
      }
    };

    checkUserProfile();
  }, [user?.id, router]);

  // Calculate BMI automatically
  useEffect(() => {
    if (formData.height && formData.weight) {
      const heightInMeters = parseFloat(formData.height) / 100;
      const weightInKg = parseFloat(formData.weight);
      const bmiValue = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
      setFormData(prev => ({ ...prev, bmi: bmiValue }));
    }
  }, [formData.height, formData.weight]);

  // Handle scroll events for scroll indicators
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isTop = scrollTop === 0;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 1;
      
      setScrollState({ isTop, isBottom });
    };

    // Initial check
    handleScroll();

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentStep]); // Re-run when step changes

  const steps = [
    {
      title: 'Basic Bio Data',
      icon: User,
      description: 'Apni basic information dijiye',
    },
    {
      title: 'Medical Background',
      icon: Heart,
      description: 'Medical history share karein',
    },
    {
      title: 'Health Metrics & Vitals',
      icon: Activity,
      description: 'Current health readings',
    },
    {
      title: 'Health Goals',
      icon: Target,
      description: 'Apne sehat ke goals set karein',
    },
    {
      title: 'Medical Report Upload',
      icon: FileText,
      description: 'Reports upload karein',
    },
  ];

  const handleInputChange = (field: string, value: string | File | null) => {
    // File validation for report upload
    if (field === 'reportFile' && value) {
      const file = value as File;
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      
      if (file.size > maxSize) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only PDF, JPG, JPEG, and PNG files are allowed');
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error('User not authenticated. Please sign in again.');
      return; 
    }

    // Basic validation for required fields
    const requiredFields = ['fullName', 'age', 'gender', 'bloodGroup', 'height', 'weight'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]);
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields marked with *');
      return;
    }

    setIsLoading(true);
    
    try {
      toast.loading('Saving your health profile...', { id: 'saving' });
      
      const result = await submitUserHealthProfile(formData, user.id);
      
      toast.dismiss('saving');
      
      if (result.success) {
        toast.success('Health profile saved successfully! 🎉');
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        toast.error(result.error || 'Failed to save health profile. Please try again.');
      }
    } catch (error) {
      toast.dismiss('saving');
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Submit error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  // Show loading state while checking if user exists
  if (isCheckingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-950 dark:via-gray-900 dark:to-green-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 dark:text-green-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Verifying your profile...</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-950 dark:via-gray-900 dark:to-green-950 flex items-center justify-center p-4">
      <div className="container mx-auto max-w-5xl h-screen max-h-screen flex flex-col">
        {/* Compact Header with Step Info */}
        <div className="flex items-center justify-between py-6 px-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-t-3xl border-2 border-green-200/60 dark:border-green-800/60 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-600 via-green-700 to-green-800 dark:from-green-500 dark:via-green-600 dark:to-green-700 flex items-center justify-center shadow-xl">
                {React.createElement(steps[currentStep].icon, { className: "w-8 h-8 text-white" })}
                <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                {steps[currentStep].title}
              </h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">
                {steps[currentStep].description}
              </p>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {currentStep + 1}/{steps.length}
              </span>
              <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <span className="text-xs font-semibold text-green-600 dark:text-green-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
        </div>

        {/* Compact Form Card */}
        <Card className="flex-1 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-t-0 border-2 border-green-200/60 dark:border-green-800/60 rounded-t-none rounded-b-3xl shadow-2xl overflow-hidden flex flex-col">
          {/* Step Content - Scrollable */}
          <div 
            className={`scroll-container flex-1 ${scrollState.isTop ? 'scroll-top' : ''} ${scrollState.isBottom ? 'scroll-bottom' : ''}`}
          >
            <div className="scroll-hint"></div>
            <div 
              ref={scrollContainerRef}
              className="h-full overflow-y-auto pr-2 custom-scrollbar"
            >
            {/* Step 0: Basic Bio Data */}
            {currentStep === 0 && (
              <div className="space-y-3 animate-in fade-in slide-in-from-right duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Muhammad Ahmad"
                      className="mt-1 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="age" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Age (Years) *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="25"
                      className="mt-1 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="gender" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Gender *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleInputChange('gender', value)}
                    >
                      <SelectTrigger className="mt-1 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bloodGroup" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Blood Group *</Label>
                    <Select
                      value={formData.bloodGroup}
                      onValueChange={(value) => handleInputChange('bloodGroup', value)}
                    >
                      <SelectTrigger className="mt-1 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500">
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="height" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Height (cm) *</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      placeholder="170"
                      className="mt-1 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Weight (kg) *</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      placeholder="70"
                      className="mt-1 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="bmi" className="text-sm font-semibold text-gray-700 dark:text-gray-300">BMI (Auto)</Label>
                    <Input
                      id="bmi"
                      value={formData.bmi}
                      placeholder="--"
                      className="mt-1 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600"
                      disabled
                    />
                  </div>
                </div>

                {formData.bmi && (
                  <div className={`p-3 rounded-xl text-center ${
                    parseFloat(formData.bmi) < 18.5 
                      ? 'bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800'
                      : parseFloat(formData.bmi) < 25
                      ? 'bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800'
                      : parseFloat(formData.bmi) < 30
                      ? 'bg-yellow-50 dark:bg-yellow-950 border-2 border-yellow-200 dark:border-yellow-800'
                      : 'bg-red-50 dark:bg-red-950 border-2 border-red-200 dark:border-red-800'
                  }`}>
                    <p className="text-sm font-bold">
                      BMI Category: <span className="font-extrabold">{
                        parseFloat(formData.bmi) < 18.5 ? 'Underweight'
                        : parseFloat(formData.bmi) < 25 ? 'Normal Weight'
                        : parseFloat(formData.bmi) < 30 ? 'Overweight'
                        : 'Obese'
                      }</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 1: Medical Background */}
            {currentStep === 1 && (
              <div className="space-y-3 animate-in fade-in slide-in-from-right duration-500">
                <div>
                  <Label htmlFor="chronicDiseases" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Chronic Diseases</Label>
                  <Textarea
                    id="chronicDiseases"
                    value={formData.chronicDiseases}
                    onChange={(e) => handleInputChange('chronicDiseases', e.target.value)}
                    placeholder="e.g., Diabetes, Hypertension, Asthma (agar koi nahi to 'None' likhen)"
                    className="mt-1 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 transition-colors resize-none"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="allergies" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Allergies</Label>
                  <Textarea
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                    placeholder="e.g., Peanuts, Penicillin, Pollen (agar koi nahi to 'None' likhen)"
                    className="mt-1 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 transition-colors resize-none"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="currentMedications" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Current Medications</Label>
                  <Textarea
                    id="currentMedications"
                    value={formData.currentMedications}
                    onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                    placeholder="Medicine names aur dosage (agar koi nahi to 'None' likhen)"
                    className="mt-1 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 transition-colors resize-none"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="pastSurgeries" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Past Surgeries</Label>
                  <Textarea
                    id="pastSurgeries"
                    value={formData.pastSurgeries}
                    onChange={(e) => handleInputChange('pastSurgeries', e.target.value)}
                    placeholder="Previous surgeries ki details (agar koi nahi to 'None' likhen)"
                    className="mt-1 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 transition-colors resize-none"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="familyHistory" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Family Medical History</Label>
                  <Textarea
                    id="familyHistory"
                    value={formData.familyHistory}
                    onChange={(e) => handleInputChange('familyHistory', e.target.value)}
                    placeholder="Family me koi genetic diseases? (e.g., Diabetes, Heart Disease)"
                    className="mt-1 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 transition-colors resize-none"
                    rows={2}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Health Metrics & Vitals */}
            {currentStep === 2 && (
              <div className="space-y-3 animate-in fade-in slide-in-from-right duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="bpSystolic" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Blood Pressure - Systolic (mmHg)</Label>
                    <Input
                      id="bpSystolic"
                      type="number"
                      value={formData.bloodPressureSystolic}
                      onChange={(e) => handleInputChange('bloodPressureSystolic', e.target.value)}
                      placeholder="120"
                      className="mt-1 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 transition-colors"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bpDiastolic" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Blood Pressure - Diastolic (mmHg)</Label>
                    <Input
                      id="bpDiastolic"
                      type="number"
                      value={formData.bloodPressureDiastolic}
                      onChange={(e) => handleInputChange('bloodPressureDiastolic', e.target.value)}
                      placeholder="80"
                      className="mt-1 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="heartRate" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Heart Rate (BPM)</Label>
                    <Input
                      id="heartRate"
                      type="number"
                      value={formData.heartRate}
                      onChange={(e) => handleInputChange('heartRate', e.target.value)}
                      placeholder="72"
                      className="mt-1 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 transition-colors"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bloodSugar" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Blood Sugar (mg/dL)</Label>
                    <Input
                      id="bloodSugar"
                      type="number"
                      value={formData.bloodSugar}
                      onChange={(e) => handleInputChange('bloodSugar', e.target.value)}
                      placeholder="100"
                      className="mt-1 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="cholesterol" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Cholesterol (mg/dL)</Label>
                    <Input
                      id="cholesterol"
                      type="number"
                      value={formData.cholesterol}
                      onChange={(e) => handleInputChange('cholesterol', e.target.value)}
                      placeholder="200"
                      className="mt-1 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 transition-colors"
                    />
                  </div>
                  <div>
                    <Label htmlFor="oxygenLevel" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Oxygen Level (SpO2 %)</Label>
                    <Input
                      id="oxygenLevel"
                      type="number"
                      value={formData.oxygenLevel}
                      onChange={(e) => handleInputChange('oxygenLevel', e.target.value)}
                      placeholder="98"
                      className="mt-1 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 transition-colors"
                      max="100"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-3">
                  <p className="text-sm text-blue-800 dark:text-blue-200 text-center font-medium">
                    💡 <strong>Tip:</strong> Yeh readings recent honi chahiye (last 7 days). Agar nahi pata to skip kar sakte hain.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Health Goals */}
            {currentStep === 3 && (
              <div className="space-y-3 animate-in fade-in slide-in-from-right duration-500">
                <div>
                  <Label htmlFor="primaryGoal" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Primary Health Goal *</Label>
                  <Select
                    value={formData.primaryGoal}
                    onValueChange={(value) => handleInputChange('primaryGoal', value)}
                  >
                    <SelectTrigger className="mt-1 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500">
                      <SelectValue placeholder="Apna main goal select karein" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight-loss">Weight Loss (Wazn kam karna)</SelectItem>
                      <SelectItem value="weight-gain">Weight Gain (Wazn barhana)</SelectItem>
                      <SelectItem value="muscle-gain">Muscle Gain (Muscle banana)</SelectItem>
                      <SelectItem value="fitness">General Fitness (Fit rehna)</SelectItem>
                      <SelectItem value="disease-management">Disease Management (Bimari control)</SelectItem>
                      <SelectItem value="maintain">Maintain Health (Health maintain karna)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="targetWeight" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Target Weight (kg)</Label>
                    <Input
                      id="targetWeight"
                      type="number"
                      value={formData.targetWeight}
                      onChange={(e) => handleInputChange('targetWeight', e.target.value)}
                      placeholder="65"
                      className="mt-1 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 transition-colors"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sleepHours" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Average Sleep (Hours)</Label>
                    <Input
                      id="sleepHours"
                      type="number"
                      value={formData.sleepHours}
                      onChange={(e) => handleInputChange('sleepHours', e.target.value)}
                      placeholder="7"
                      className="mt-1 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 transition-colors"
                      max="24"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="activityLevel" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Physical Activity Level *</Label>
                  <Select
                    value={formData.activityLevel}
                    onValueChange={(value) => handleInputChange('activityLevel', value)}
                  >
                    <SelectTrigger className="mt-1 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500">
                      <SelectValue placeholder="Apni activity level select karein" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (Kam se kam activity)</SelectItem>
                      <SelectItem value="light">Lightly Active (Thori activity)</SelectItem>
                      <SelectItem value="moderate">Moderately Active (Regular exercise)</SelectItem>
                      <SelectItem value="very">Very Active (Daily intense exercise)</SelectItem>
                      <SelectItem value="extra">Extra Active (Athlete level)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dietaryPreferences" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Dietary Preferences</Label>
                  <Select
                    value={formData.dietaryPreferences}
                    onValueChange={(value) => handleInputChange('dietaryPreferences', value)}
                  >
                    <SelectTrigger className="mt-1 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500">
                      <SelectValue placeholder="Apni diet preference batayein" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="pescatarian">Pescatarian (Fish khate hain)</SelectItem>
                      <SelectItem value="no-preference">No Preference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 4: Medical Report Upload */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right duration-500">
                <div className="border-2 border-dashed border-green-300 dark:border-green-700 rounded-xl p-6 text-center bg-green-50/50 dark:bg-green-950/50 hover:border-green-500 dark:hover:border-green-500 transition-all cursor-pointer">
                  <Upload className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Upload Medical Reports
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Blood tests, X-rays, ya koi bhi medical report upload karein
                  </p>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="max-w-xs mx-auto h-12 rounded-xl"
                    onChange={(e) => handleInputChange('reportFile', e.target.files?.[0] || null)}
                    disabled={isLoading}
                  />
                  {formData.reportFile && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2 font-medium">
                      ✓ Selected: {formData.reportFile.name}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Supported: PDF, JPG, PNG (Max 10MB)
                  </p>
                </div>

                <div>
                  <Label htmlFor="reportNotes" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Report Notes (Optional)</Label>
                  <Textarea
                    id="reportNotes"
                    value={formData.reportNotes}
                    onChange={(e) => handleInputChange('reportNotes', e.target.value)}
                    placeholder="Report ke bare me koi additional details (optional)"
                    className="mt-1 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 transition-colors resize-none"
                    rows={3}
                  />
                </div>

                <div className="bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800 rounded-xl p-3">
                  <p className="text-sm text-green-800 dark:text-green-200 mb-2 font-semibold text-center">
                    ✅ <strong>Privacy Assurance:</strong>
                  </p>
                  <ul className="text-xs text-green-700 dark:text-green-300 space-y-1 ml-5 list-disc">
                    <li>Aapki reports end-to-end encrypted hain</li>
                    <li>Sirf aap aur AI analysis ke liye use hoga</li>
                    <li>Kisi third party ke sath share nahi hoga</li>
                  </ul>
                </div>
              </div>
            )}
            </div>
          </div>
          {/* End of scrollable content */}

          {/* Compact Navigation Buttons */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-green-200/50 dark:border-green-800/50">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0 || isLoading}
              className="border-2 border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950 px-6 py-3 font-semibold rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-green-600 dark:bg-green-500 w-8'
                      : index < currentStep
                      ? 'bg-green-400 dark:bg-green-600'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-700 hover:via-green-800 hover:to-green-900 dark:from-green-500 dark:via-green-600 dark:to-green-700 dark:hover:from-green-600 dark:hover:via-green-700 dark:hover:to-green-800 text-white px-6 py-3 font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Next Step
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-700 hover:via-green-800 hover:to-green-900 dark:from-green-500 dark:via-green-600 dark:to-green-700 dark:hover:from-green-600 dark:hover:via-green-700 dark:hover:to-green-800 text-white px-8 py-3 font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Complete Setup
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SyncData;