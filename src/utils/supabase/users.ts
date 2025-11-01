import { supabase } from './client';

// Types for our user data
export interface UserHealthData {
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
}

export interface FormData {
  fullName: string;
  age: string;
  gender: string;
  bloodGroup: string;
  height: string;
  weight: string;
  bmi: string;
  chronicDiseases: string;
  allergies: string;
  currentMedications: string;
  pastSurgeries: string;
  familyHistory: string;
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
  heartRate: string;
  bloodSugar: string;
  cholesterol: string;
  oxygenLevel: string;
  primaryGoal: string;
  targetWeight: string;
  activityLevel: string;
  dietaryPreferences: string;
  sleepHours: string;
  reportFile: File | null;
  reportNotes: string;
}

/**
 * Upload file to Supabase Storage in 'userimage' bucket
 */
export const uploadReportFile = async (clerkId: string, file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${clerkId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('userimage')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('File upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('userimage')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
};

/**
 * Convert form data to database format
 */
export const mapFormDataToUserData = (formData: FormData, clerkId: string, reportFileUrl?: string): UserHealthData => {
  // Helper function to convert string to number or undefined
  const toNumber = (value: string): number | undefined => {
    const num = parseFloat(value);
    return isNaN(num) ? undefined : num;
  };

  // Helper function to convert empty string to undefined
  const toStringOrUndefined = (value: string): string | undefined => {
    return value.trim() === '' || value.toLowerCase() === 'none' ? undefined : value.trim();
  };

  return {
    clerk_id: clerkId,
    full_name: toStringOrUndefined(formData.fullName),
    age: toNumber(formData.age),
    gender: toStringOrUndefined(formData.gender),
    blood_group: toStringOrUndefined(formData.bloodGroup),
    height_cm: toNumber(formData.height),
    weight_kg: toNumber(formData.weight),
    bmi: toNumber(formData.bmi),
    chronic_diseases: toStringOrUndefined(formData.chronicDiseases),
    allergies: toStringOrUndefined(formData.allergies),
    current_medications: toStringOrUndefined(formData.currentMedications),
    past_surgeries: toStringOrUndefined(formData.pastSurgeries),
    family_history: toStringOrUndefined(formData.familyHistory),
    blood_pressure_systolic: toNumber(formData.bloodPressureSystolic),
    blood_pressure_diastolic: toNumber(formData.bloodPressureDiastolic),
    heart_rate: toNumber(formData.heartRate),
    blood_sugar: toNumber(formData.bloodSugar),
    cholesterol: toNumber(formData.cholesterol),
    oxygen_level: toNumber(formData.oxygenLevel),
    primary_goal: toStringOrUndefined(formData.primaryGoal),
    target_weight: toNumber(formData.targetWeight),
    activity_level: toStringOrUndefined(formData.activityLevel),
    dietary_preferences: toStringOrUndefined(formData.dietaryPreferences),
    sleep_hours: toNumber(formData.sleepHours),
    report_file_url: reportFileUrl,
    report_notes: toStringOrUndefined(formData.reportNotes),
  };
};

/**
 * Upsert user health data to Supabase
 */
export const upsertUserHealthData = async (userData: UserHealthData) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          ...userData,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'clerk_id'
        }
      )
      .select();

    if (error) {
      console.error('Database upsert error:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error upserting user data:', error);
    return { data: null, error };
  }
};

/**
 * Get user health data by clerk_id
 */
export const getUserHealthData = async (clerkId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Database fetch error:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return { data: null, error };
  }
};

/**
 * Complete user health profile setup
 */
export const submitUserHealthProfile = async (formData: FormData, clerkId: string) => {
  try {
    let reportFileUrl: string | null = null;

    // Upload file if provided
    if (formData.reportFile) {
      console.log('Uploading report file...');
      reportFileUrl = await uploadReportFile(clerkId, formData.reportFile);
      
      if (!reportFileUrl) {
        throw new Error('Failed to upload report file');
      }
      console.log('File uploaded successfully:', reportFileUrl);
    }

    // Map form data to database format
    const userData = mapFormDataToUserData(formData, clerkId, reportFileUrl || undefined);

    // Upsert user data
    console.log('Saving user data to database...');
    const result = await upsertUserHealthData(userData);

    if (result.error) {
      throw result.error;
    }

    console.log('User health profile saved successfully');
    return { success: true, data: result.data };

  } catch (error) {
    console.error('Error submitting health profile:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
