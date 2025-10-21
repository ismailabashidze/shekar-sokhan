// Campaign Management Types

export interface NotificationCampaign {
  id: string
  name: string
  description: string
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed'
  creator_id: string
  target_groups: string[] // relation to user_groups
  template_id: string // relation to message_templates
  schedule: CampaignSchedule
  sent_count: number
  delivered_count: number
  opened_count: number
  clicked_count: number
  created: string
  updated: string
}

export interface CampaignSchedule {
  type: 'immediate' | 'scheduled' | 'recurring'
  startDate?: string
  endDate?: string
  frequency?: 'daily' | 'weekly' | 'monthly'
  timezone: string
}

export interface MessageTemplate {
  id: string
  name: string
  description: string
  category: 'session' | 'admin' | 'system'
  language: 'fa' | 'en'
  title_template: string
  body_template: string
  action_text_template?: string
  action_url_template?: string
  variables: TemplateVariable[]
  is_active: boolean
  created: string
  updated: string
}

export interface TemplateVariable {
  name: string
  type: 'string' | 'number' | 'date' | 'boolean'
  source: 'user' | 'session' | 'system'
  fallback?: any
  description?: string
}

export interface UserGroup {
  id: string
  name: string
  description: string
  criteria: GroupCriteria
  user_count: number
  is_dynamic: boolean // auto-update based on criteria
  created_by: string
  created: string
  updated: string
}

export interface GroupCriteria {
  rules: GroupRule[]
  operator: 'AND' | 'OR'
}

export interface GroupRule {
  field: string // 'role', 'last_active', 'session_count', etc.
  operator: 'eq' | 'gt' | 'lt' | 'contains' | 'in'
  value: any
}

export interface NotificationPreferences {
  id: string
  user_id: string
  enabled: boolean
  session_reminders: boolean
  admin_messages: boolean
  system_alerts: boolean
  quiet_hours_start: string
  quiet_hours_end: string
  frequency: 'immediate' | 'hourly' | 'daily'
  timezone: string
  created: string
  updated: string
}

// Form interfaces for creating/editing
export interface CampaignForm {
  name: string
  description: string
  target_groups: string[]
  template_id: string
  schedule: CampaignSchedule
}

export interface TemplateForm {
  name: string
  description: string
  category: 'session' | 'admin' | 'system'
  language: 'fa' | 'en'
  title_template: string
  body_template: string
  action_text_template?: string
  action_url_template?: string
  variables: TemplateVariable[]
}

export interface UserGroupForm {
  name: string
  description: string
  criteria: GroupCriteria
  is_dynamic: boolean
}

// Analytics interfaces
export interface CampaignMetrics {
  sent_count: number
  delivered_count: number
  opened_count: number
  clicked_count: number
  delivery_rate: number
  open_rate: number
  click_rate: number
}

export interface CampaignAnalytics {
  campaign: NotificationCampaign
  metrics: CampaignMetrics
  performance_trend: Array<{
    date: string
    sent: number
    delivered: number
    opened: number
    clicked: number
  }>
}