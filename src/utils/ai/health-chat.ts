import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserHealthContext } from '@/utils/supabase/chat';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

/**
 * Generate AI chat response with user's health context
 */
export async function generateHealthChatResponse(
  userMessage: string,
  healthContext: UserHealthContext | null,
  chatHistory: { role: string; text: string }[] = []
) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Build context-aware system prompt
    const systemPrompt = buildSystemPrompt(healthContext);

    // Build conversation history
    const conversationHistory = chatHistory.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    // Start chat with history
    const chat = model.startChat({
      history: conversationHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // Send message with context
    const fullMessage = chatHistory.length === 0 
      ? `${systemPrompt}\n\nUser Question: ${userMessage}`
      : userMessage;

    const result = await chat.sendMessage(fullMessage);
    const response = result.response;
    const text = response.text();

    return {
      success: true,
      response: text,
      error: null,
    };
  } catch (error) {
    console.error('Error generating chat response:', error);
    return {
      success: false,
      response: null,
      error: error instanceof Error ? error.message : 'Failed to generate response',
    };
  }
}

/**
 * Build system prompt with user's health context
 */
function buildSystemPrompt(healthContext: UserHealthContext | null): string {
  let prompt = `You are HealthMate AI, a compassionate and knowledgeable health assistant. You provide health advice in a bilingual format (English + Roman Urdu) to make healthcare accessible to everyone.

🏥 YOUR ROLE:
- Provide accurate, evidence-based health information
- Answer questions about medical reports, symptoms, and general health
- Give advice in both English and Roman Urdu (Roman Urdu mein jawab dein)
- Be empathetic and supportive
- Always include medical disclaimers

⚠️ IMPORTANT RULES:
1. Always add this disclaimer: "⚠️ Disclaimer: Yeh AI advice hai, medical treatment nahi. Apne doctor se zaroor consult karein."
2. Never diagnose serious conditions - always recommend seeing a doctor
3. For emergencies, immediately advise calling emergency services
4. Be culturally sensitive and use simple language
5. Provide actionable, practical advice

📋 RESPONSE FORMAT:
- Use emojis to make responses friendly
- Structure answers clearly with bullet points
- Include both English and Roman Urdu explanations
- Keep responses concise (under 500 words)

`;

  // Add user's health context if available
  if (healthContext) {
    prompt += `\n👤 USER'S HEALTH PROFILE:\n`;

    if (healthContext.full_name) prompt += `Name: ${healthContext.full_name}\n`;
    if (healthContext.age) prompt += `Age: ${healthContext.age} years\n`;
    if (healthContext.gender) prompt += `Gender: ${healthContext.gender}\n`;
    if (healthContext.blood_group) prompt += `Blood Group: ${healthContext.blood_group}\n`;
    if (healthContext.bmi) prompt += `BMI: ${healthContext.bmi} (${getBMICategory(healthContext.bmi)})\n`;
    if (healthContext.weight_kg) prompt += `Weight: ${healthContext.weight_kg} kg\n`;
    if (healthContext.height_cm) prompt += `Height: ${healthContext.height_cm} cm\n`;
    
    if (healthContext.blood_pressure_systolic && healthContext.blood_pressure_diastolic) {
      prompt += `Blood Pressure: ${healthContext.blood_pressure_systolic}/${healthContext.blood_pressure_diastolic} mmHg\n`;
    }
    if (healthContext.heart_rate) prompt += `Heart Rate: ${healthContext.heart_rate} BPM\n`;
    if (healthContext.blood_sugar) prompt += `Blood Sugar: ${healthContext.blood_sugar} mg/dL\n`;
    if (healthContext.cholesterol) prompt += `Cholesterol: ${healthContext.cholesterol} mg/dL\n`;
    if (healthContext.oxygen_level) prompt += `Oxygen Level: ${healthContext.oxygen_level}%\n`;

    if (healthContext.chronic_diseases) prompt += `\n🏥 Chronic Diseases: ${healthContext.chronic_diseases}\n`;
    if (healthContext.allergies) prompt += `⚠️ Allergies: ${healthContext.allergies}\n`;
    if (healthContext.current_medications) prompt += `💊 Current Medications: ${healthContext.current_medications}\n`;
    if (healthContext.past_surgeries) prompt += `🔪 Past Surgeries: ${healthContext.past_surgeries}\n`;
    if (healthContext.family_history) prompt += `👨‍👩‍👧‍👦 Family History: ${healthContext.family_history}\n`;

    if (healthContext.primary_goal) prompt += `\n🎯 Health Goal: ${healthContext.primary_goal}\n`;
    if (healthContext.target_weight) prompt += `Target Weight: ${healthContext.target_weight} kg\n`;
    if (healthContext.activity_level) prompt += `Activity Level: ${healthContext.activity_level}\n`;
    if (healthContext.dietary_preferences) prompt += `Dietary Preferences: ${healthContext.dietary_preferences}\n`;
    if (healthContext.sleep_hours) prompt += `Sleep Hours: ${healthContext.sleep_hours} hours\n`;

    prompt += `\nℹ️ Use this context to personalize your responses. If the user asks about their health, refer to this data.\n`;
  } else {
    prompt += `\n⚠️ Note: User health profile not available. Ask them to complete their profile for personalized advice.\n`;
  }

  return prompt;
}

/**
 * Get BMI category
 */
function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

/**
 * Extract topic from conversation
 */
export function extractTopic(message: string): string {
  const keywords = {
    'diabetes': ['diabetes', 'sugar', 'blood sugar', 'insulin', 'glucose'],
    'blood-pressure': ['blood pressure', 'bp', 'hypertension', 'high bp', 'low bp'],
    'heart': ['heart', 'cardiac', 'chest pain', 'heart rate', 'pulse'],
    'weight': ['weight', 'obesity', 'diet', 'exercise', 'fitness'],
    'medication': ['medicine', 'medication', 'pills', 'dawai', 'tablet'],
    'symptoms': ['pain', 'fever', 'cough', 'headache', 'dizzy'],
    'nutrition': ['food', 'diet', 'nutrition', 'khana', 'vitamins'],
    'sleep': ['sleep', 'insomnia', 'neend', 'rest'],
    'mental-health': ['stress', 'anxiety', 'depression', 'mental', 'mood'],
  };

  const lowerMessage = message.toLowerCase();

  for (const [topic, words] of Object.entries(keywords)) {
    if (words.some(word => lowerMessage.includes(word))) {
      return topic;
    }
  }

  return 'general';
}
