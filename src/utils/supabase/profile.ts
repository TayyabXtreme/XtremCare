import { supabase } from './client';

export interface UserProfile {
  id: string;
  clerk_id: string;
  full_name?: string;
  age?: number;
  gender?: string;
  blood_group?: string;
  height_cm?: number;
  weight_kg?: number;
  bmi?: number;
  chronic_diseases?: string;
  allergies?: string;
  current_medications?: string;
  past_surgeries?: string;
  family_history?: string;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  heart_rate?: number;
  blood_sugar?: number;
  cholesterol?: number;
  oxygen_level?: number;
  primary_goal?: string;
  target_weight?: number;
  activity_level?: string;
  dietary_preferences?: string;
  sleep_hours?: number;
  report_file_url?: string;
  report_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProfileData {
  clerk_id: string;
  full_name?: string;
  age?: number;
  gender?: string;
  blood_group?: string;
  height_cm?: number;
  weight_kg?: number;
  chronic_diseases?: string;
  allergies?: string;
  current_medications?: string;
  past_surgeries?: string;
  family_history?: string;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  heart_rate?: number;
  blood_sugar?: number;
  cholesterol?: number;
  oxygen_level?: number;
  primary_goal?: string;
  target_weight?: number;
  activity_level?: string;
  dietary_preferences?: string;
  sleep_hours?: number;
}

export interface UpdateProfileData extends Partial<CreateProfileData> {
  updated_at?: string;
}

/**
 * Get user profile by Clerk ID
 */
export const getUserProfile = async (clerkId: string): Promise<{ data: UserProfile | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

/**
 * Create a new user profile
 */
export const createUserProfile = async (profileData: CreateProfileData): Promise<{ data: UserProfile | null; error: Error | null }> => {
  try {
    // Calculate BMI if height and weight are provided
    let bmi = null;
    if (profileData.height_cm && profileData.weight_kg) {
      const heightInMeters = profileData.height_cm / 100;
      bmi = parseFloat((profileData.weight_kg / (heightInMeters * heightInMeters)).toFixed(1));
    }

    const { data, error } = await supabase
      .from('users')
      .insert([{
        ...profileData,
        bmi,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (clerkId: string, profileData: UpdateProfileData): Promise<{ data: UserProfile | null; error: Error | null }> => {
  try {
    // Calculate BMI if height and weight are provided
    let bmi = null;
    if (profileData.height_cm && profileData.weight_kg) {
      const heightInMeters = profileData.height_cm / 100;
      bmi = parseFloat((profileData.weight_kg / (heightInMeters * heightInMeters)).toFixed(1));
    }

    const updateData = {
      ...profileData,
      ...(bmi && { bmi }),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('clerk_id', clerkId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

/**
 * Upsert user profile (create if doesn't exist, update if exists)
 */
export const upsertUserProfile = async (profileData: CreateProfileData): Promise<{ data: UserProfile | null; error: Error | null }> => {
  try {
    // First check if profile exists
    const { data: existingProfile } = await getUserProfile(profileData.clerk_id);
    
    if (existingProfile) {
      // Update existing profile
      return await updateUserProfile(profileData.clerk_id, profileData);
    } else {
      // Create new profile
      return await createUserProfile(profileData);
    }
  } catch (error) {
    console.error('Error upserting user profile:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

/**
 * Delete user profile
 */
export const deleteUserProfile = async (clerkId: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('clerk_id', clerkId);

    if (error) {
      throw error;
    }

    return { error: null };
  } catch (error) {
    console.error('Error deleting user profile:', error);
    return { error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

interface HealthSummary {
  basicInfo: {
    fullName?: string;
    age?: number;
    gender?: string;
    bloodGroup?: string;
  };
  vitals: {
    height?: number;
    weight?: number;
    bmi?: number;
    bloodPressure?: string | null;
    heartRate?: number;
    bloodSugar?: number;
    cholesterol?: number;
    oxygenLevel?: number;
  };
  medical: {
    chronicDiseases?: string;
    allergies?: string;
    currentMedications?: string;
    pastSurgeries?: string;
    familyHistory?: string;
  };
  lifestyle: {
    primaryGoal?: string;
    targetWeight?: number;
    activityLevel?: string;
    dietaryPreferences?: string;
    sleepHours?: number;
  };
}

/**
 * Get health summary from profile
 */
export const getHealthSummary = async (clerkId: string): Promise<{ data: HealthSummary | null; error: Error | null }> => {
  try {
    const { data: profile, error } = await getUserProfile(clerkId);
    
    if (error || !profile) {
      return { data: null, error };
    }

    const summary: HealthSummary = {
      basicInfo: {
        fullName: profile.full_name,
        age: profile.age,
        gender: profile.gender,
        bloodGroup: profile.blood_group,
      },
      vitals: {
        height: profile.height_cm,
        weight: profile.weight_kg,
        bmi: profile.bmi,
        bloodPressure: profile.blood_pressure_systolic && profile.blood_pressure_diastolic 
          ? `${profile.blood_pressure_systolic}/${profile.blood_pressure_diastolic}` 
          : null,
        heartRate: profile.heart_rate,
        bloodSugar: profile.blood_sugar,
        cholesterol: profile.cholesterol,
        oxygenLevel: profile.oxygen_level,
      },
      medical: {
        chronicDiseases: profile.chronic_diseases,
        allergies: profile.allergies,
        currentMedications: profile.current_medications,
        pastSurgeries: profile.past_surgeries,
        familyHistory: profile.family_history,
      },
      lifestyle: {
        primaryGoal: profile.primary_goal,
        targetWeight: profile.target_weight,
        activityLevel: profile.activity_level,
        dietaryPreferences: profile.dietary_preferences,
        sleepHours: profile.sleep_hours,
      }
    };

    return { data: summary, error: null };
  } catch (error) {
    console.error('Error getting health summary:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

interface HealthMetrics {
  bmiStatus?: string;
  bpStatus?: string;
  sugarStatus?: string;
  cholesterolStatus?: string;
}

/**
 * Calculate health metrics
 */
export const calculateHealthMetrics = (profile: UserProfile): HealthMetrics => {
  const metrics: HealthMetrics = {};

  // BMI Status
  if (profile.bmi) {
    if (profile.bmi < 18.5) metrics.bmiStatus = 'Underweight';
    else if (profile.bmi < 25) metrics.bmiStatus = 'Normal';
    else if (profile.bmi < 30) metrics.bmiStatus = 'Overweight';
    else metrics.bmiStatus = 'Obese';
  }

  // Blood Pressure Status
  if (profile.blood_pressure_systolic && profile.blood_pressure_diastolic) {
    const systolic = profile.blood_pressure_systolic;
    const diastolic = profile.blood_pressure_diastolic;
    
    if (systolic < 120 && diastolic < 80) metrics.bpStatus = 'Normal';
    else if (systolic < 130 && diastolic < 80) metrics.bpStatus = 'Elevated';
    else if (systolic < 140 || diastolic < 90) metrics.bpStatus = 'High Stage 1';
    else metrics.bpStatus = 'High Stage 2';
  }

  // Blood Sugar Status (fasting glucose)
  if (profile.blood_sugar) {
    if (profile.blood_sugar < 100) metrics.sugarStatus = 'Normal';
    else if (profile.blood_sugar < 126) metrics.sugarStatus = 'Prediabetes';
    else metrics.sugarStatus = 'Diabetes';
  }

  // Cholesterol Status
  if (profile.cholesterol) {
    if (profile.cholesterol < 200) metrics.cholesterolStatus = 'Desirable';
    else if (profile.cholesterol < 240) metrics.cholesterolStatus = 'Borderline High';
    else metrics.cholesterolStatus = 'High';
  }

  return metrics;
};
