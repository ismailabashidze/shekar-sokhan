// Utility to convert emotion analysis data to EmotionWheel format

interface EmotionData {
  emotionName: string
  severity: 'خالی' | 'کم' | 'متوسط' | 'زیاد'
}

// Mapping Persian emotion names to English categories
const emotionMapping: Record<string, string> = {
  'شادی': 'joy',
  'اعتماد': 'trust',
  'ترس': 'fear',
  'تعجب': 'surprise',
  'غم': 'sadness',
  'انزجار': 'disgust',
  'خشم': 'anger',
  'انتظار': 'anticipation',
  'نامشخص': 'unknown'
}

// Mapping severity to emotion variants (based on EmotionWheel structure)
const severityToVariant: Record<string, Record<string, string>> = {
  'joy': { 'کم': 'serenity', 'متوسط': 'joy', 'زیاد': 'ecstasy' },
  'trust': { 'کم': 'acceptance', 'متوسط': 'trust', 'زیاد': 'admiration' },
  'fear': { 'کم': 'apprehension', 'متوسط': 'fear', 'زیاد': 'terror' },
  'surprise': { 'کم': 'distraction', 'متوسط': 'surprise', 'زیاد': 'amazement' },
  'sadness': { 'کم': 'pensiveness', 'متوسط': 'sadness', 'زیاد': 'grief' },
  'disgust': { 'کم': 'boredom', 'متوسط': 'disgust', 'زیاد': 'loathing' },
  'anger': { 'کم': 'annoyance', 'متوسط': 'anger', 'زیاد': 'rage' },
  'anticipation': { 'کم': 'interest', 'متوسط': 'anticipation', 'زیاد': 'vigilance' }
}

/**
 * Convert emotion analysis data to EmotionWheel selected format
 * @param emotionsData Array of emotion objects with Persian names and severity
 * @returns Array of strings in format "category|variant" for EmotionWheel
 */
export function convertToEmotionWheel(emotionsData: EmotionData[]): string[] {
  const selected: string[] = []

  for (const emotion of emotionsData) {
    // Skip empty/unknown emotions
    if (emotion.severity === 'خالی' || emotion.emotionName === 'نامشخص') {
      continue
    }

    // Get English category
    const category = emotionMapping[emotion.emotionName]
    if (!category || !severityToVariant[category]) {
      continue
    }

    // Get variant based on severity
    const variant = severityToVariant[category][emotion.severity]
    if (!variant) {
      continue
    }

    // Add to selected in EmotionWheel format
    selected.push(`${category}|${variant}`)
  }

  return selected
}

/**
 * Get primary emotions with their intensities for display
 * @param emotionsData Array of emotion objects
 * @returns Filtered array of non-empty emotions
 */
export function getActiveEmotions(emotionsData: EmotionData[]): EmotionData[] {
  return emotionsData.filter(emotion => 
    emotion.severity !== 'خالی' && emotion.emotionName !== 'نامشخص'
  )
}

/**
 * Get the most intense emotion
 * @param emotionsData Array of emotion objects
 * @returns The emotion with highest severity, or null if none
 */
export function getDominantEmotion(emotionsData: EmotionData[]): EmotionData | null {
  const activeEmotions = getActiveEmotions(emotionsData)
  
  if (activeEmotions.length === 0) return null

  // Sort by severity priority: زیاد > متوسط > کم
  const severityOrder = { 'زیاد': 3, 'متوسط': 2, 'کم': 1, 'خالی': 0 }
  
  return activeEmotions.reduce((dominant, current) => {
    return severityOrder[current.severity] > severityOrder[dominant.severity] 
      ? current 
      : dominant
  })
} 