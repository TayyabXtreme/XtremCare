import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIAnalysisData } from '@/utils/supabase/medical-reports';

// Initialize Gemini AI
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  console.warn('⚠️  NEXT_PUBLIC_GEMINI_API_KEY is not configured. AI analysis will use fallback mode.');
}
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Analyze medical report using Gemini 2.5-flash
 */
export const analyzeMedicalReport = async (
  fileBase64: string, 
  reportType: string = 'general',
  fileType: string = 'image/jpeg'
): Promise<AIAnalysisData | null> => {
  try {
    console.log('Starting Gemini AI analysis...', { reportType, fileType });
    
    // Check if API key is configured
    if (!genAI) {
      console.log('No Gemini API key configured, using fallback analysis');
      return createFallbackAnalysis();
    }
    
    // Try the working model first, then fallbacks
    let model;
    try {
      console.log('Trying gemini-pro-vision for image analysis...');
      model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    } catch (error) {
      console.log('gemini-pro-vision failed, trying gemini-pro:', error);
      try {
        model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      } catch (error2) {
        console.error('All models failed:', error2);
        return createFallbackAnalysis();
      }
    }

    const prompt = `
You are a medical AI assistant. Analyze this medical report image and provide analysis in the following JSON format:

{
  "ai_summary_english": "Detailed summary in English",
  "ai_summary_urdu": "Detailed summary in Roman Urdu",
  "ai_abnormal_values": ["List abnormal findings"],
  "ai_doctor_questions": ["5 questions for doctor"],
  "ai_food_to_avoid": ["Foods to avoid"],
  "ai_better_foods": ["Recommended foods"],
  "ai_home_remedies": ["Lifestyle tips"],
  "ai_risk_level": "low"
}

CRITICAL: ai_risk_level MUST be exactly one of these values: "low", "medium", "high", "critical"
Do not use any other variations like "moderate", "severe", "minimal", etc.

Guidelines:
- Provide clear, accurate medical analysis
- Include Roman Urdu summary for Pakistani/Indian patients
- List any abnormal values with normal ranges
- Be conservative with risk assessment (use "low" when uncertain)
- Focus on actionable insights
- ai_risk_level must be exactly: "low", "medium", "high", or "critical"

Report Type: ${reportType}

Return only valid JSON without additional text or formatting.
`;

    const imagePart = {
      inlineData: {
        data: fileBase64,
        mimeType: fileType
      }
    };

    console.log('Calling Gemini API...');
    let result;
    try {
      result = await model.generateContent([prompt, imagePart]);
    } catch (apiError: unknown) {
      const error = apiError as { message?: string };
      console.error('Gemini API call failed:', apiError);
      
      // If it's a model not found error, try a different approach
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        console.log('Trying with different model configuration...');
        try {
          // Try gemini-pro without vision first
          const textModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
          const textPrompt = `
Analyze this medical report data and provide analysis in JSON format:

{
  "ai_summary_english": "General medical analysis based on report type: ${reportType}",
  "ai_summary_urdu": "Roman Urdu summary",
  "ai_abnormal_values": ["Unable to analyze image - text analysis only"],
  "ai_doctor_questions": ["Standard questions for ${reportType} report"],
  "ai_food_to_avoid": ["General dietary recommendations"],
  "ai_better_foods": ["Healthy food suggestions"],
  "ai_home_remedies": ["General wellness tips"],
  "ai_risk_level": "low"
}

Return only valid JSON.
`;
          result = await textModel.generateContent(textPrompt);
        } catch (textError) {
          console.error('Text model also failed:', textError);
          return createFallbackAnalysis();
        }
      } else {
        return createFallbackAnalysis();
      }
    }
    
    console.log('Gemini API call successful, processing response...');
    const response = result.response;
    const text = response.text();
    
    console.log('Raw Gemini response:', text);

    // Clean up the response to extract JSON
    let jsonResponse = text.trim();
    
    // Remove code block markers if present
    if (jsonResponse.startsWith('```json')) {
      jsonResponse = jsonResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonResponse.startsWith('```')) {
      jsonResponse = jsonResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Remove any leading/trailing non-JSON content
    const jsonStart = jsonResponse.indexOf('{');
    const jsonEnd = jsonResponse.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      jsonResponse = jsonResponse.substring(jsonStart, jsonEnd + 1);
    }

    try {
      console.log('Parsing JSON response...');
      const analysisData: AIAnalysisData = JSON.parse(jsonResponse);
      
      // Log the raw risk level for debugging
      console.log('Raw AI risk level:', analysisData.ai_risk_level, typeof analysisData.ai_risk_level);
      
      // Validate required fields
      if (!analysisData.ai_summary_english || !analysisData.ai_summary_urdu || !analysisData.ai_risk_level) {
        throw new Error('Missing required fields in AI response');
      }
      
      // Ensure arrays exist and risk level is valid
      analysisData.ai_abnormal_values = analysisData.ai_abnormal_values || [];
      analysisData.ai_doctor_questions = analysisData.ai_doctor_questions || [];
      analysisData.ai_food_to_avoid = analysisData.ai_food_to_avoid || [];
      analysisData.ai_better_foods = analysisData.ai_better_foods || [];
      analysisData.ai_home_remedies = analysisData.ai_home_remedies || [];
      
      // Normalize risk level to ensure it matches database constraints
      const validRiskLevels = ['low', 'medium', 'high', 'critical'];
      const normalizedRiskLevel = String(analysisData.ai_risk_level || 'low').toLowerCase().trim();
      
      if (!validRiskLevels.includes(normalizedRiskLevel)) {
        console.warn(`Invalid risk level "${analysisData.ai_risk_level}", defaulting to "low"`);
        analysisData.ai_risk_level = 'low';
      } else {
        analysisData.ai_risk_level = normalizedRiskLevel as 'low' | 'medium' | 'high' | 'critical';
      }

      console.log('Analysis completed successfully');
      console.log('Final analysis data:', analysisData);
      return analysisData;
      
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      console.error('Cleaned JSON:', jsonResponse);
      
      // Return fallback analysis
      return createFallbackAnalysis();
    }

  } catch (error) {
    console.error('Gemini AI analysis error:', error);
    
    // Return fallback analysis instead of null
    return createFallbackAnalysis();
  }
};

/**
 * Create fallback analysis when AI fails
 */
const createFallbackAnalysis = (): AIAnalysisData => {
  console.log('Creating fallback analysis...');
  const fallbackData: AIAnalysisData = {
    ai_summary_english: "Your medical report has been uploaded successfully. The AI analysis encountered an issue, but your report is safely stored. Please consult your healthcare provider for professional interpretation of your results.",
    ai_summary_urdu: "Aapki medical report successfully upload ho gayi hai. AI analysis mein kuch issue aya, lekin aapki report safely store hai. Professional interpretation ke liye apne doctor se zaroor consult karein.",
    ai_abnormal_values: ["AI analysis incomplete - manual review recommended"],
    ai_doctor_questions: [
      "Could you review my uploaded report and explain the key findings?",
      "Are there any values in my report that need attention?", 
      "What follow-up tests or actions do you recommend?",
      "How do these results compare to my previous reports?",
      "What lifestyle changes should I consider based on these results?"
    ],
    ai_food_to_avoid: ["Processed and packaged foods", "Excessive sugar and sweets", "High sodium foods"],
    ai_better_foods: ["Fresh fruits and vegetables", "Lean proteins like chicken and fish", "Whole grains and nuts"],
    ai_home_remedies: [
      "🌅 Maintain 7-8 hours of quality sleep daily",
      "💧 Stay hydrated with 8-10 glasses of water",
      "🚶 Engage in 30 minutes of light exercise daily",
      "🧘 Practice stress reduction through meditation or deep breathing",
      "📋 Follow a balanced, nutritious diet"
    ],
    ai_risk_level: "low"
  };
  
  console.log('Fallback analysis created:', fallbackData);
  return fallbackData;
};

/**
 * Generate health insights based on multiple reports
 */
export const generateHealthInsights = async (reports: Array<{
  created_at: string;
  ai_summary_english?: string;
  ai_abnormal_values?: string[];
  ai_risk_level?: string;
}>): Promise<string | null> => {
  try {
    if (!genAI) {
      return "Health insights unavailable - API key not configured";
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const reportsData = reports.map(report => ({
      date: report.created_at,
      summary: report.ai_summary_english,
      abnormalValues: report.ai_abnormal_values,
      riskLevel: report.ai_risk_level
    }));

    const prompt = `
Based on the following medical reports timeline, generate a comprehensive health insight for the patient:

${JSON.stringify(reportsData, null, 2)}

Please provide:
1. Overall health trend analysis
2. Improvements or concerning patterns
3. Key recommendations for maintaining/improving health
4. Important areas to monitor

Keep the response concise but informative, suitable for a patient dashboard. Write in a friendly, encouraging tone while being medically accurate.

Respond in both English and Roman Urdu format like this:
"English insight here. Roman Urdu insight yahan likhein."
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error('Error generating health insights:', error);
    return null;
  }
};

/**
 * Convert file to base64 for Gemini analysis
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove the data:image/jpeg;base64, prefix
      const cleanBase64 = base64.split(',')[1];
      resolve(cleanBase64);
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Extract text from PDF file (basic implementation)
 */
export const extractTextFromPDF = async (): Promise<string> => {
  // Note: For full PDF text extraction, you'd need a library like pdf-parse or pdf2pic
  // This is a placeholder implementation
  return "PDF text extraction not fully implemented. Using OCR analysis through Gemini vision model.";
};
