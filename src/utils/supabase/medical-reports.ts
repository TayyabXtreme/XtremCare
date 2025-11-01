import { supabase } from './client';

// Types for medical reports
export interface MedicalReport {
  id: string;
  clerk_user_id: string;
  report_file_url: string;
  report_file_name: string;
  report_file_type?: string;
  report_type?: string;
  report_notes?: string;
  uploaded_at: string;
  ai_analyzed: boolean;
  ai_summary_english?: string;
  ai_summary_urdu?: string;
  ai_abnormal_values?: string[];
  ai_doctor_questions?: string[];
  ai_food_to_avoid?: string[];
  ai_better_foods?: string[];
  ai_home_remedies?: string[];
  ai_risk_level?: 'low' | 'medium' | 'high' | 'critical';
  ai_analyzed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateReportData {
  clerk_user_id: string;
  report_file_url: string;
  report_file_name: string;
  report_file_type?: string;
  report_type?: string;
  report_notes?: string;
}

export interface AIAnalysisData {
  ai_summary_english: string;
  ai_summary_urdu: string;
  ai_abnormal_values: string[];
  ai_doctor_questions: string[];
  ai_food_to_avoid: string[];
  ai_better_foods: string[];
  ai_home_remedies: string[];
  ai_risk_level: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Upload medical report file to Supabase Storage
 */
export const uploadMedicalReportFile = async (clerkId: string, file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `medical-reports/${clerkId}/${Date.now()}.${fileExt}`;

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
    console.error('Error uploading medical report file:', error);
    return null;
  }
};

/**
 * Create a new medical report entry
 */
export const createMedicalReport = async (reportData: CreateReportData): Promise<{ data: MedicalReport | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('medical_reports')
      .insert({
        ...reportData,
        ai_analyzed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Database insert error:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error creating medical report:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

/**
 * Update medical report with AI analysis
 */
export const updateReportWithAI = async (reportId: string, aiData: AIAnalysisData): Promise<{ data: MedicalReport | null; error: Error | null }> => {
  try {
    console.log('Updating report with ID:', reportId);
    console.log('AI data to update:', aiData);
    
    // First verify the report exists and get current user
    const { data: existingReport, error: fetchError } = await supabase
      .from('medical_reports')
      .select('id, clerk_user_id')
      .eq('id', reportId)
      .single();
      
    if (fetchError) {
      console.error('Failed to fetch existing report:', fetchError);
      throw new Error(`Report not found: ${fetchError.message}`);
    }
    
    console.log('Existing report:', existingReport);
    
    // Validate and sanitize risk level to match database constraint
    const validateRiskLevel = (riskLevel: string): 'low' | 'medium' | 'high' | 'critical' => {
      const normalizedLevel = String(riskLevel || '').toLowerCase().trim();
      console.log('Normalizing risk level:', riskLevel, '->', normalizedLevel);
      
      switch (normalizedLevel) {
        case 'low':
        case 'minimal':
        case 'safe':
          return 'low';
        case 'medium':
        case 'moderate':
        case 'mild':
          return 'medium';
        case 'high':
        case 'severe':
        case 'elevated':
          return 'high';
        case 'critical':
        case 'urgent':
        case 'emergency':
        case 'serious':
          return 'critical';
        default:
          console.warn('Unknown risk level, defaulting to low:', riskLevel);
          return 'low';
      }
    };

    // Prepare the update data with proper structure and validation
    const updateData = {
      ai_summary_english: String(aiData.ai_summary_english || ''),
      ai_summary_urdu: String(aiData.ai_summary_urdu || ''),
      ai_risk_level: validateRiskLevel(aiData.ai_risk_level),
      ai_abnormal_values: Array.isArray(aiData.ai_abnormal_values) ? aiData.ai_abnormal_values : [],
      ai_doctor_questions: Array.isArray(aiData.ai_doctor_questions) ? aiData.ai_doctor_questions : [],
      ai_food_to_avoid: Array.isArray(aiData.ai_food_to_avoid) ? aiData.ai_food_to_avoid : [],
      ai_better_foods: Array.isArray(aiData.ai_better_foods) ? aiData.ai_better_foods : [],
      ai_home_remedies: Array.isArray(aiData.ai_home_remedies) ? aiData.ai_home_remedies : [],
      ai_analyzed: true,
      ai_analyzed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    console.log('Structured update data:', updateData);

    // Attempt the update
    const { data, error } = await supabase
      .from('medical_reports')
      .update(updateData)
      .eq('id', reportId)
      .select()
      .single();

    if (error) {
      console.error('Database update error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        statusCode: (error as { statusCode?: number }).statusCode
      });
      
      // Try a simpler update to test basic functionality
      console.log('Attempting simple update to test basic functionality...');
      const { error: simpleError } = await supabase
        .from('medical_reports')
        .update({
          ai_analyzed: true,
          ai_analyzed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', reportId)
        .select()
        .single();
        
      if (simpleError) {
        console.error('Even simple update failed:', simpleError);
        throw new Error(`Database access denied: ${simpleError.message}`);
      }
      
      // If simple update worked, the issue is with the AI data
      console.log('Simple update worked, issue is with AI data structure');
      throw new Error(`AI data structure issue: ${error.message}`);
    }

    console.log('Report updated successfully:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Error updating report with AI analysis:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      reportId,
      errorType: typeof error,
      error
    });
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error occurred') };
  }
};

/**
 * Get all medical reports for a user
 */
export const getUserMedicalReports = async (clerkUserId: string): Promise<{ data: MedicalReport[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('medical_reports')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database fetch error:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching medical reports:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

/**
 * Get a specific medical report by ID
 */
export const getMedicalReportById = async (reportId: string): Promise<{ data: MedicalReport | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('medical_reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (error) {
      console.error('Database fetch error:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching medical report:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

/**
 * Delete a medical report
 */
export const deleteMedicalReport = async (reportId: string, fileUrl: string): Promise<{ success: boolean; error: Error | null }> => {
  try {
    // Extract file path from URL for storage deletion
    const urlParts = fileUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `medical-reports/${fileName}`;

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('userimage')
      .remove([filePath]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('medical_reports')
      .delete()
      .eq('id', reportId);

    if (dbError) {
      console.error('Database deletion error:', dbError);
      throw dbError;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting medical report:', error);
    return { success: false, error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

/**
 * Get report statistics for dashboard
 */
export const getReportStats = async (clerkUserId: string) => {
  try {
    const { data, error } = await supabase
      .from('medical_reports')
      .select('ai_analyzed, ai_risk_level, created_at')
      .eq('clerk_user_id', clerkUserId);

    if (error) {
      throw error;
    }

    const stats = {
      total: data.length,
      analyzed: data.filter(r => r.ai_analyzed).length,
      pending: data.filter(r => !r.ai_analyzed).length,
      highRisk: data.filter(r => r.ai_risk_level === 'high' || r.ai_risk_level === 'critical').length,
      thisMonth: data.filter(r => {
        const reportDate = new Date(r.created_at);
        const now = new Date();
        return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
      }).length,
    };

    return { data: stats, error: null };
  } catch (error) {
    console.error('Error fetching report stats:', error);
    return { data: null, error };
  }
};
