export type MemoryCategory = 
  | 'personal_info'      // Names, age, family info, etc.
  | 'goals'             // Therapy goals and objectives  
  | 'symptoms'          // Mental health symptoms
  | 'triggers'          // Stress triggers and patterns
  | 'relationships'     // Family, friends, relationships
  | 'progress'          // Therapeutic progress notes
  | 'preferences'       // User preferences and style
  | 'therapy_notes'     // Important therapeutic insights
  | 'important_events'  // Significant life events
  | 'other'             // Other miscellaneous information

export type MemorySource = 
  | 'therapy_session'   // Extracted from therapy conversation
  | 'user_input'        // Directly provided by user
  | 'system_inference'  // Inferred by AI system
  | 'therapist_note'    // Added by therapist

export interface MemoryItem {
  id?: string
  user: string
  content: string
  category: MemoryCategory
  importance: number // 1-10 scale
  source_type: MemorySource
  source_id?: string
  session_id?: string
  tags: string[]
  metadata: Record<string, any>
  is_active: boolean
  last_accessed?: string
  access_count: number
  created?: string
  updated?: string
}

export interface MemorySearchOptions {
  limit?: number
  category?: MemoryCategory
  minImportance?: number
  sessionId?: string
  includeMem0?: boolean
  tags?: string[]
}

export interface MemorySearchResult {
  id: string
  content: string
  score?: number
  source: 'mem0' | 'local'
  metadata?: Record<string, any>
  category?: MemoryCategory
  importance?: number
}

export interface MemoryStats {
  total: number
  byCategory: Record<MemoryCategory, number>
  success: boolean
}

export interface SessionContext {
  memories: MemorySearchResult[]
  contextPrompt: string
  success: boolean
}