// ============================================
// SHARED TYPES - مرکز انواع مشترک
// ============================================

// Message Content Type - برای پیام‌ها
export interface MessageContent {
  message?: string
  thoughts?: string
  action?: string
  nextSteps?: string
}

// Message Types - انواع پیام
export type MessageType = 'sent' | 'received'

// Base Message Interface - رابط پایه پیام
export interface BaseMessage {
  id: string
  user: string // Relation to user record
  type: MessageType
  text: string
  time: string // ISO date string
  created?: string
  updated?: string
}

// Patient Message - پیام بیمار
export interface PatientMessage extends BaseMessage {
  patient: string // Relation to patient record
  conversation: string // Relation to conversation record
}

// Therapist Message - پیام درمانگر
export interface TherapistMessage extends BaseMessage {
  therapist: string // Relation to therapist record
  session: string // Relation to session record
}

// ============================================
// THERAPIST TYPES - انواع درمانگر
// ============================================

export interface TherapistGenerateInput {
  prompt: string
  context?: string
  sessionId?: string
  patientId?: string
}

export interface TherapistGenerateOutput {
  response: string
  suggestions?: string[]
  confidence?: number
  metadata?: Record<string, any>
}

// ============================================
// ANALYSIS TYPES - انواع تحلیل
// ============================================

export interface EmotionalJourney {
  startState: string
  endState: string
  transitions: Array<{
    from: string
    to: string
    trigger: string
    timestamp: string
  }>
  overallProgress: number
}

export interface PersonalGrowth {
  insights: string[]
  achievements: string[]
  challenges: string[]
  recommendations: string[]
  growthScore: number
}

export interface SessionProgress {
  sessionNumber: number
  goals: string[]
  achievements: string[]
  challenges: string[]
  nextSteps: string[]
  progressScore: number
}

export interface SessionAnalysisForPatient {
  sessionId: string
  patientId: string
  emotionalJourney: EmotionalJourney
  personalGrowth: PersonalGrowth
  sessionProgress: SessionProgress
  summary: string
  recommendations: string[]
  createdAt: string
}

// ============================================
// UTILITY TYPES - انواع کمکی
// ============================================

export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type PaginatedResponse<T> = {
  items: T[]
  page: number
  perPage: number
  totalItems: number
  totalPages: number
}

// ============================================
// RE-EXPORTS - صادرات مجدد
// ============================================

// Legacy aliases for backward compatibility
export type Content = MessageContent
export type Message = BaseMessage
