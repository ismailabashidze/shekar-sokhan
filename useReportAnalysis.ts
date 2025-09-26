import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

// Types based on the OpenAPI specification
interface AnalysisFactor {
  id: string
  key: string
  title: string
  value: any
  valueType: 'NUMBER' | 'STRING' | 'BOOLEAN' | 'OBJECT' | 'ARRAY'
  unit?: string
  category?: string
  description?: string
  confidence?: number
  implications?: string[]
  factors?: AnalysisFactor[]
  metadata?: Record<string, any>
}

interface Resource {
  id: string
  type: string
  title: string
  description: string
  url: string
  tags: string[]
}

interface Recommendation {
  id: string
  key: string
  title: string
  description: string
  category: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  actionable: boolean
  resources?: Resource[]
  metadata?: Record<string, any>
}

interface Insight {
  id: string
  key: string
  title: string
  description: string
  category: string
  confidence: number
  data: Record<string, any>
  metadata?: Record<string, any>
}

interface AnalysisMetadata {
  version: string
  modelVersion?: string
  processingTime?: number
  tags?: string[]
  customFields?: Record<string, any>
}

interface AnalysisError {
  code: string
  message: string
  details?: Record<string, any>
  retryable: boolean
}

interface Analysis {
  id: string
  userId: string
  sourceId: string
  analysisType: string
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  factors: AnalysisFactor[]
  recommendations: Recommendation[]
  insights: Insight[]
  createdAt: string
  completedAt?: string
  metadata: AnalysisMetadata
  error?: AnalysisError
}

interface SessionAnalysis {
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  completedAt?: string
  analysis?: Analysis
}

interface PairAnalysis {
  userId: string
  compatibilityScore: number
  analysis: Analysis
  createdAt: string
}

interface LearningReport {
  id: string
  reportType: 'LEARNING_PROGRESS' | 'KNOWLEDGE_GAPS'
  analysis: Analysis
}

interface AssessmentResult {
  id: string
  assessmentId: string
  userId: string
  summary: string
  scores: Record<string, any>[]
  analysis: Analysis
  generatedAt: string
}

interface MatchmakingAnalysis {
  userId: string
  compatibilityScore: number
  analysis: Analysis
  createdAt: string
  expiresAt?: string
}

// Hook functions
export const useSessionAnalysis = (sessionId: string) => {
  return useQuery<SessionAnalysis, Error>({
    queryKey: ['sessionAnalysis', sessionId],
    queryFn: async () => {
      const response = await axios.get<SessionAnalysis>(
        `/api/v1/counseling/sessions/${sessionId}/analysis`,
      )
      return response.data
    },
    enabled: !!sessionId,
  })
}

export const useGenerateSessionReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await axios.post(
        `/api/v1/counseling/sessions/${sessionId}/report`,
      )
      return response.data
    },
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({
        queryKey: ['sessionAnalysis', sessionId],
      })
    },
  })
}

export const useLearningReports = (userId: string) => {
  return useQuery<LearningReport[], Error>({
    queryKey: ['learningReports', userId],
    queryFn: async () => {
      const response = await axios.get<LearningReport[]>(
        `/api/v1/education/reports?userId=${userId}`,
      )
      return response.data
    },
    enabled: !!userId,
  })
}

export const useAssessmentAnalyses = (params?: {
  userId?: string
  templateId?: string
}) => {
  return useQuery<AssessmentResult[], Error>({
    queryKey: ['assessmentAnalyses', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams()
      if (params?.userId) queryParams.append('userId', params.userId)
      if (params?.templateId)
        queryParams.append('templateId', params.templateId)

      const response = await axios.get<AssessmentResult[]>(
        `/api/v1/assessment/analysis?${queryParams.toString()}`,
      )
      return response.data
    },
  })
}

export const useMatchmakingAnalyses = (params?: {
  limit?: number
  page?: number
}) => {
  return useQuery<MatchmakingAnalysis[], Error>({
    queryKey: ['matchmakingAnalyses', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams()
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.page) queryParams.append('page', params.page.toString())

      const response = await axios.get<MatchmakingAnalysis[]>(
        `/api/v1/matchmaking/analysis?${queryParams.toString()}`,
      )
      return response.data
    },
  })
}

export const usePairAnalysis = (userId: string) => {
  return useQuery<PairAnalysis, Error>({
    queryKey: ['pairAnalysis', userId],
    queryFn: async () => {
      const response = await axios.get<PairAnalysis>(
        `/api/v1/matchmaking/analysis/pairs/${userId}`,
      )
      return response.data
    },
    enabled: !!userId,
  })
}
