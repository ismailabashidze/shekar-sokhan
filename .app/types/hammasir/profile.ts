import type { UserProfile, HumanHandbook, ProgressSummary } from '~/composables/hammasir/useApplicantProfileService'

// Profile completion status
export interface ProfileCompletionStatus {
  overallPercentage: number
  sectionsCompleted: number
  totalSections: number
  missingFields: string[]
  nextRequiredSection?: string
}

// Profile section metadata
export interface ProfileSectionMeta {
  key: string
  title: string
  description: string
  icon: string
  order: number
  required: boolean
  completed: boolean
  progress: number
  locked: boolean
  lockedReason?: string
  lastUpdated?: string
}

// Profile analytics data
export interface ProfileAnalytics {
  completionHistory: {
    date: string
    percentage: number
    sectionsCompleted: number
  }[]
  assessmentScores: {
    category: string
    score: number
    maxScore: number
    trend: 'up' | 'down' | 'stable'
  }[]
  growthMetrics: {
    personalGrowth: number
    relationshipSkills: number
    emotionalMaturity: number
    lifeSkills: number
    overallReadiness: number
  }
  improvementAreas: {
    area: string
    currentScore: number
    targetScore: number
    priority: 'high' | 'medium' | 'low'
    recommendedActions: string[]
  }[]
}

// Profile display preferences
export interface ProfileDisplayPreferences {
  showPrivateInfo: boolean
  showAnalytics: boolean
  showProgress: boolean
  showHandbook: boolean
  compactMode: boolean
  sortSectionsBy: 'order' | 'completion' | 'importance'
}

// Profile export options
export interface ProfileExportOptions {
  includePersonalInfo: boolean
  includeAnalytics: boolean
  includeHandbook: boolean
  includeProgress: boolean
  format: 'pdf' | 'json' | 'csv'
  language: 'fa' | 'en'
}

// Profile sharing settings
export interface ProfileSharingSettings {
  shareWithCounselors: boolean
  shareWithAdmins: boolean
  shareWithMatching: boolean
  shareAnalytics: boolean
  shareProgress: boolean
  expirationDate?: string
}

// Handbook section with display metadata
export interface HandbookSectionDisplay {
  id: string
  title: string
  analysisType: string
  source: {
    type: string
    name: string
    completedAt: string
  }
  summary: string
  keyInsights: string[]
  recommendations: string[]
  visualizations?: {
    type: 'chart' | 'graph' | 'progress'
    data: any
  }[]
  lastUpdated: string
  priority: 'high' | 'medium' | 'low'
}

// Extended profile with display enhancements
export interface ProfileDisplayData extends UserProfile {
  completionStatus: ProfileCompletionStatus
  sections: ProfileSectionMeta[]
  analytics?: ProfileAnalytics
  handbook?: HandbookSectionDisplay[]
  displayPreferences: ProfileDisplayPreferences
  sharingSettings: ProfileSharingSettings
}

// Profile edit context
export interface ProfileEditContext {
  isEditing: boolean
  currentSection?: string
  hasUnsavedChanges: boolean
  lastSaved?: Date
  autoSaveEnabled: boolean
  validationErrors: Record<string, string[]>
}

// Profile comparison data (for counselors/admins)
export interface ProfileComparisonData {
  baseline: UserProfile
  current: UserProfile
  changes: {
    field: string
    oldValue: any
    newValue: any
    changedAt: string
    changedBy: string
  }[]
  improvementMetrics: {
    category: string
    improvement: number
    timeframe: string
  }[]
}

// Profile access permissions
export interface ProfileAccessPermissions {
  canView: boolean
  canEdit: boolean
  canDelete: boolean
  canExport: boolean
  canShare: boolean
  canViewAnalytics: boolean
  canViewHandbook: boolean
  canViewProgress: boolean
  restrictedFields?: string[]
}

// Profile notification settings
export interface ProfileNotificationSettings {
  completionReminders: boolean
  progressUpdates: boolean
  analyticsReports: boolean
  assessmentDue: boolean
  counselorNotes: boolean
  emailFrequency: 'immediate' | 'daily' | 'weekly' | 'never'
  pushNotifications: boolean
}

// Profile backup/restore
export interface ProfileBackup {
  id: string
  userId: string
  createdAt: string
  data: UserProfile
  metadata: {
    version: string
    source: 'manual' | 'auto' | 'migration'
    reason?: string
  }
}

// Profile validation result
export interface ProfileValidationResult {
  isValid: boolean
  score: number
  maxScore: number
  issues: {
    severity: 'error' | 'warning' | 'info'
    field: string
    message: string
    suggestion?: string
  }[]
  completionRequirements: {
    field: string
    required: boolean
    completed: boolean
    description: string
  }[]
}