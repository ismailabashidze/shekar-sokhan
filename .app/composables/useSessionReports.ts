// Type definitions for session reports
export interface SessionReport {
  id: string
  session_id: string
  user_id: string
  therapist_id: string
  type: 'technical' | 'patient'
  created_at: string
}

export interface TechnicalReport extends SessionReport {
  type: 'technical'
  diagnostic_summary: string
  dsm5_assessments: DSM5Assessment[]
  risk_assessment: RiskAssessment
  goal_progress: GoalProgress[]
  emotional_patterns: EmotionalPattern[]
  communication_style: string
  therapeutic_alliance: string
  cultural_considerations: string
  next_session_focus: string[]
  intervention_recommendations: string[]
  referral_needed: boolean
  session_duration: number
  message_count: number
  raw_ai_analysis: string
}

export interface PatientReport extends SessionReport {
  type: 'patient'
  session_summary: string
  key_insights: string[]
  emotional_journey: string
  progress_made: string
  areas_explored: AreaExplored[]
  strengths_identified: string[]
  homework_suggestions: string[]
  next_session_preview: string
  self_care_tips: string[]
  coping_strategies: string[]
  session_duration_friendly: string
  raw_content: string
}

export interface DSM5Assessment {
  category: string
  confidence: number
  evidence: string
  assessment: string
}

export interface RiskAssessment {
  level: 'low' | 'moderate' | 'high'
  factors: string[]
  suicide_risk: 'low' | 'moderate' | 'high'
  intervention_needed: boolean
}

export interface GoalProgress {
  goal_id: string
  title: string
  category: string
  confidence_before: number
  confidence_after: number
  evidence_collected: string
  progress_notes: string
}

export interface EmotionalPattern {
  timestamp: string
  primary_emotions: string[]
  intensity: string
  context: string
}

export interface AreaExplored {
  area: string
  description: string
  progress: number
  next_steps: string
}

export interface TherapyGoal {
  id: string
  title: string
  progress_percentage: number
  status: string
  dsm5_aspects?: {
    dsm5_category?: string
    diagnostic_confidence?: number
    criteria_evidence?: string
  }
}

export interface SessionReportData {
  sessionId: string
  userId: string
  therapistId: string
  sessionDuration: number
  messageCount: number
  goals: TherapyGoal[]
  conversationSummary: string
  emotionalProgression: any[]
  riskAssessment: 'low' | 'moderate' | 'high'
  interventionNeeded: boolean
  keyInsights: string[]
  nextSessionRecommendations: string[]
}

export function useSessionReports() {
  const nuxtApp = useNuxtApp()
  const { streamChat } = useOpenRouter()
  const config = useRuntimeConfig()

  // Structured JSON generation functions
  const generateStructuredTechnicalReport = async (prompt: string, sessionData: SessionReportData): Promise<any> => {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.public.openRouterApiKey}`,
        'HTTP-Referer': config.public.appUrl || 'http://localhost:3000',
        'X-Title': 'Technical Report Generator',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-saba',
        messages: [{ role: 'system', content: prompt }],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'technical_report',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                diagnostic_summary: {
                  type: 'string',
                  description: 'Comprehensive clinical diagnostic assessment',
                },
                dsm5_assessments: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      category: { type: 'string' },
                      confidence: { type: 'number', minimum: 0, maximum: 100 },
                      evidence: { type: 'string' },
                      assessment: { type: 'string' },
                    },
                    required: ['category', 'confidence', 'evidence', 'assessment'],
                  },
                },
                risk_assessment: {
                  type: 'object',
                  properties: {
                    level: { type: 'string', enum: ['low', 'moderate', 'high'] },
                    factors: { type: 'array', items: { type: 'string' } },
                    suicide_risk: { type: 'string', enum: ['low', 'moderate', 'high'] },
                    intervention_needed: { type: 'boolean' },
                  },
                  required: ['level', 'factors', 'suicide_risk', 'intervention_needed'],
                },
                goal_progress: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      goal_id: { type: 'string' },
                      title: { type: 'string' },
                      category: { type: 'string' },
                      confidence_before: { type: 'number' },
                      confidence_after: { type: 'number' },
                      evidence_collected: { type: 'string' },
                      progress_notes: { type: 'string' },
                    },
                    required: ['goal_id', 'title', 'category', 'confidence_before', 'confidence_after', 'evidence_collected', 'progress_notes'],
                  },
                },
                emotional_patterns: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      timestamp: { type: 'string' },
                      primary_emotions: { type: 'array', items: { type: 'string' } },
                      intensity: { type: 'string' },
                      context: { type: 'string' },
                    },
                    required: ['timestamp', 'primary_emotions', 'intensity', 'context'],
                  },
                },
                communication_style: { type: 'string' },
                therapeutic_alliance: { type: 'string' },
                cultural_considerations: { type: 'string' },
                next_session_focus: { type: 'array', items: { type: 'string' } },
                intervention_recommendations: { type: 'array', items: { type: 'string' } },
                referral_needed: { type: 'boolean' },
              },
              required: ['diagnostic_summary', 'dsm5_assessments', 'risk_assessment', 'goal_progress', 'emotional_patterns', 'communication_style', 'therapeutic_alliance', 'cultural_considerations', 'next_session_focus', 'intervention_recommendations', 'referral_needed'],
            },
          },
        },
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error(`Technical report API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content
    return typeof content === 'string' ? JSON.parse(content) : content
  }

  const generateStructuredPatientReport = async (prompt: string, sessionData: SessionReportData, technicalReport: TechnicalReport): Promise<any> => {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.public.openRouterApiKey}`,
        'HTTP-Referer': config.public.appUrl || 'http://localhost:3000',
        'X-Title': 'Patient Report Generator',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-saba',
        messages: [{ role: 'system', content: prompt }],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'patient_report',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                session_summary: { type: 'string', description: 'Patient-friendly session overview' },
                key_insights: { type: 'array', items: { type: 'string' }, description: 'Main discoveries in encouraging language' },
                emotional_journey: { type: 'string', description: 'Emotional progress during session' },
                progress_made: { type: 'string', description: 'Celebration of achievements' },
                areas_explored: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      area: { type: 'string' },
                      description: { type: 'string' },
                      progress: { type: 'number' },
                      next_steps: { type: 'string' },
                    },
                    required: ['area', 'description', 'progress', 'next_steps'],
                  },
                },
                strengths_identified: { type: 'array', items: { type: 'string' } },
                homework_suggestions: { type: 'array', items: { type: 'string' } },
                next_session_preview: { type: 'string' },
                self_care_tips: { type: 'array', items: { type: 'string' } },
                coping_strategies: { type: 'array', items: { type: 'string' } },
              },
              required: ['session_summary', 'key_insights', 'emotional_journey', 'progress_made', 'areas_explored', 'strengths_identified', 'homework_suggestions', 'next_session_preview', 'self_care_tips', 'coping_strategies'],
            },
          },
        },
        temperature: 0.7,
        max_tokens: 1500,
      }),
    })

    if (!response.ok) {
      throw new Error(`Patient report API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content
    return typeof content === 'string' ? JSON.parse(content) : content
  }

  const generateTechnicalReport = async (sessionData: SessionReportData): Promise<TechnicalReport> => {
    // Use structured JSON for reliable technical report generation
    const prompt = createTechnicalReportPrompt(sessionData)
    const technicalReportContent = await generateStructuredTechnicalReport(prompt, sessionData)

    const report: TechnicalReport = {
      id: crypto.randomUUID(),
      session_id: sessionData.sessionId,
      user_id: sessionData.userId,
      therapist_id: sessionData.therapistId,
      type: 'technical',
      created_at: new Date().toISOString(),

      // Technical Analysis - now from structured JSON
      diagnostic_summary: technicalReportContent.diagnostic_summary || '',
      dsm5_assessments: technicalReportContent.dsm5_assessments || [],
      risk_assessment: {
        level: technicalReportContent.risk_assessment?.level || sessionData.riskAssessment,
        factors: technicalReportContent.risk_assessment?.factors || [],
        suicide_risk: technicalReportContent.risk_assessment?.suicide_risk || assessSuicideRisk(sessionData),
        intervention_needed: technicalReportContent.risk_assessment?.intervention_needed || sessionData.interventionNeeded,
      },

      // Session Progress
      goal_progress: technicalReportContent.goal_progress || sessionData.goals.map(goal => ({
        goal_id: goal.id,
        title: goal.title,
        category: goal.dsm5_aspects?.dsm5_category || '',
        confidence_before: goal.dsm5_aspects?.diagnostic_confidence || 0,
        confidence_after: Math.min(100, (goal.dsm5_aspects?.diagnostic_confidence || 0) + 5),
        evidence_collected: goal.dsm5_aspects?.criteria_evidence || '',
        progress_notes: `Goal in progress - confidence: ${goal.dsm5_aspects?.diagnostic_confidence || 0}%`,
      })),

      // Clinical Observations
      emotional_patterns: technicalReportContent.emotional_patterns || extractEmotionalPatterns(sessionData.emotionalProgression),
      communication_style: technicalReportContent.communication_style || assessTherapeuticAlliance(sessionData),
      therapeutic_alliance: technicalReportContent.therapeutic_alliance || assessTherapeuticAlliance(sessionData),
      cultural_considerations: technicalReportContent.cultural_considerations || '',

      // Recommendations
      next_session_focus: technicalReportContent.next_session_focus || sessionData.nextSessionRecommendations,
      intervention_recommendations: technicalReportContent.intervention_recommendations || [],
      referral_needed: technicalReportContent.referral_needed || sessionData.interventionNeeded,

      // Metadata
      session_duration: sessionData.sessionDuration,
      message_count: sessionData.messageCount,
      raw_ai_analysis: JSON.stringify(technicalReportContent),
    }

    return report
  }

  const generatePatientReport = async (sessionData: SessionReportData, technicalReport: TechnicalReport): Promise<PatientReport> => {
    // Use structured JSON for reliable patient report generation
    const prompt = createPatientReportPrompt(sessionData, technicalReport)
    const patientReportContent = await generateStructuredPatientReport(prompt, sessionData, technicalReport)

    const report: PatientReport = {
      id: crypto.randomUUID(),
      session_id: sessionData.sessionId,
      user_id: sessionData.userId,
      therapist_id: sessionData.therapistId,
      type: 'patient',
      created_at: new Date().toISOString(),

      // Patient-friendly content - now from structured JSON
      session_summary: patientReportContent.session_summary || 'خلاصه جلسه در دسترس نیست',
      key_insights: patientReportContent.key_insights || [],
      emotional_journey: patientReportContent.emotional_journey || '',

      // Progress tracking
      progress_made: patientReportContent.progress_made || '',
      areas_explored: patientReportContent.areas_explored || sessionData.goals.map(goal => ({
        area: goal.title,
        description: simplifyGoalDescription(goal),
        progress: calculateProgressPercentage(goal),
        next_steps: 'ادامه کاوش در جلسات آینده',
      })),

      // Encouragement and guidance
      strengths_identified: patientReportContent.strengths_identified || [],
      homework_suggestions: patientReportContent.homework_suggestions || [],
      next_session_preview: patientReportContent.next_session_preview || '',

      // Wellness tips
      self_care_tips: patientReportContent.self_care_tips || [],
      coping_strategies: patientReportContent.coping_strategies || [],

      // Metadata
      session_duration_friendly: formatDurationFriendly(sessionData.sessionDuration),
      raw_content: JSON.stringify(patientReportContent),
    }

    return report
  }

  const saveTechnicalReport = async (report: TechnicalReport): Promise<TechnicalReport> => {
    try {
      return await nuxtApp.$pb.collection('technical_reports').create(report)
    }
    catch (error) {
      console.error('Error saving technical report:', error)
      throw error
    }
  }

  const savePatientReport = async (report: PatientReport): Promise<PatientReport> => {
    try {
      return await nuxtApp.$pb.collection('patient_reports').create(report)
    }
    catch (error) {
      console.error('Error saving patient report:', error)
      throw error
    }
  }

  const generateDualReports = async (sessionData: SessionReportData): Promise<{ technical: TechnicalReport, patient: PatientReport }> => {
    try {
      console.log('Generating technical report...')
      const technicalReport = await generateTechnicalReport(sessionData)
      const savedTechnical = await saveTechnicalReport(technicalReport)

      console.log('Generating patient report...')
      const patientReport = await generatePatientReport(sessionData, technicalReport)
      const savedPatient = await savePatientReport(patientReport)

      return {
        technical: savedTechnical,
        patient: savedPatient,
      }
    }
    catch (error) {
      console.error('Error generating dual reports:', error)
      throw error
    }
  }

  // Helper Functions
  const createTechnicalReportPrompt = (sessionData: SessionReportData): string => {
    return `
You are generating a comprehensive technical diagnostic report for a therapy session. 
Analyze the provided session data and generate a detailed clinical assessment.

SESSION DATA:
- Duration: ${sessionData.sessionDuration} minutes
- Messages: ${sessionData.messageCount}
- Risk Level: ${sessionData.riskAssessment}
- Intervention Needed: ${sessionData.interventionNeeded}
- Goals: ${sessionData.goals.map(g => `${g.title} (${g.dsm5_aspects?.dsm5_category})`).join(', ')}

CONVERSATION SUMMARY:
${sessionData.conversationSummary}

KEY INSIGHTS:
${sessionData.keyInsights.join('\n')}

Generate a structured technical report with these sections:

## DIAGNOSTIC SUMMARY
[Comprehensive clinical assessment based on session content]

## DSM-5 ASSESSMENT
[Analysis of each goal category with evidence and confidence levels]

## RISK FACTORS
[Detailed risk assessment including suicide risk, self-harm, crisis indicators]

## COMMUNICATION ANALYSIS
[Patient's communication patterns, cognitive style, emotional expression]

## CULTURAL FACTORS
[Cultural, religious, social factors affecting diagnosis and treatment]

## INTERVENTIONS
[Recommended therapeutic interventions and techniques]

## NEXT SESSION FOCUS
[Specific areas to explore in future sessions]

Use clinical terminology and DSM-5 criteria. Be thorough and objective.
Write in Persian (Farsi) for cultural relevance.
`
  }

  const createPatientReportPrompt = (sessionData: SessionReportData, technicalReport: TechnicalReport): string => {
    return `
You are creating a patient-friendly summary of a therapy session.
Transform the technical clinical information into supportive, encouraging, and understandable language.

TECHNICAL REPORT SUMMARY:
${technicalReport.diagnostic_summary}

GOALS PROGRESS:
${technicalReport.goal_progress.map(g => `${g.title}: ${g.confidence_after}% progress`).join('\n')}

PATIENT CONTEXT:
- Session Duration: ${sessionData.sessionDuration} minutes
- Goals Worked On: ${sessionData.goals.length}
- Risk Level: ${sessionData.riskAssessment}

Generate a warm, supportive report with these sections:

## SESSION SUMMARY
[Friendly overview of what was accomplished in the session]

## KEY INSIGHTS
[Main discoveries and realizations in encouraging language]

## EMOTIONAL JOURNEY
[Description of emotional progress during the session]

## PROGRESS MADE
[Celebration of achievements and steps forward]

## STRENGTHS
[Personal strengths and positive qualities identified]

## HOMEWORK
[Gentle suggestions for self-reflection or activities]

## SELF CARE
[Practical self-care tips and wellness suggestions]

## COPING STRATEGIES
[Simple, actionable coping techniques]

## NEXT SESSION
[Positive preview of what to explore next time]

Use warm, non-clinical language. Be encouraging and hopeful.
Write in Persian (Farsi) with cultural sensitivity.
Avoid diagnostic labels - focus on growth and healing.
`
  }

  const extractSection = (content: string, sectionTitle: string): string | null => {
    const regex = new RegExp(`##\\s*${sectionTitle}[\\s\\S]*?(?=##|$)`, 'i')
    const match = content.match(regex)
    if (match) {
      return match[0].replace(`## ${sectionTitle}`, '').trim()
    }
    return null
  }

  const extractDSM5Assessments = (content: string, goals: TherapyGoal[]) => {
    return goals.map(goal => ({
      category: goal.dsm5_aspects?.dsm5_category || '',
      confidence: goal.dsm5_aspects?.diagnostic_confidence || 0,
      evidence: goal.dsm5_aspects?.criteria_evidence || '',
      assessment: extractSection(content, `${goal.title} ASSESSMENT`) || '',
    }))
  }

  const assessSuicideRisk = (sessionData: SessionReportData): 'low' | 'moderate' | 'high' => {
    // Simple risk assessment based on available data
    if (sessionData.riskAssessment === 'high' || sessionData.interventionNeeded) {
      return 'high'
    }

    const riskKeywords = ['خودکشی', 'مرگ', 'تمام کردن', 'فایده ندارد']
    const hasRiskKeywords = riskKeywords.some(keyword =>
      sessionData.conversationSummary.includes(keyword),
    )

    return hasRiskKeywords ? 'moderate' : 'low'
  }

  const extractEmotionalPatterns = (emotionalProgression: any[]) => {
    return emotionalProgression.map(emotion => ({
      timestamp: emotion.timestamp,
      primary_emotions: emotion.primaryEmotions || [],
      intensity: emotion.intensity || 'medium',
      context: emotion.context || '',
    }))
  }

  const assessTherapeuticAlliance = (sessionData: SessionReportData): string => {
    if (sessionData.messageCount > 20) return 'Strong engagement and communication'
    if (sessionData.messageCount > 10) return 'Moderate engagement'
    return 'Building rapport'
  }

  const simplifyGoalDescription = (goal: TherapyGoal): string => {
    // Convert clinical goal to patient-friendly description
    const category = goal.dsm5_aspects?.dsm5_category || ''

    if (category.includes('Depressive')) return 'بررسی احساسات و خلق'
    if (category.includes('Anxiety')) return 'مدیریت اضطراب و نگرانی'
    if (category.includes('Sleep')) return 'بهبود کیفیت خواب'
    if (category.includes('Trauma')) return 'پردازش تجربیات دشوار'

    return goal.title
  }

  const calculateProgressPercentage = (goal: TherapyGoal): number => {
    return goal.progress_percentage || goal.dsm5_aspects?.diagnostic_confidence || 0
  }

  const extractGoalProgress = (content: string, goalTitle: string): string => {
    return extractSection(content, `${goalTitle} PROGRESS`) || 'در حال بررسی'
  }

  const extractGoalNextSteps = (content: string, goalTitle: string): string => {
    return extractSection(content, `${goalTitle} NEXT STEPS`) || 'ادامه کاوش در جلسات آینده'
  }

  const formatDurationFriendly = (minutes: number): string => {
    if (minutes < 60) return `${minutes} دقیقه`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours} ساعت و ${remainingMinutes} دقیقه`
  }

  return {
    generateTechnicalReport,
    generatePatientReport,
    generateDualReports,
    saveTechnicalReport,
    savePatientReport,
  }
}
