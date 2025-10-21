// Message Template Types
export interface MessageTemplate {
  id: string
  name: string
  description?: string
  category: 'session' | 'admin' | 'system'
  language: 'fa' | 'en'
  title_template: string
  body_template: string
  action_text_template?: string
  action_url_template?: string
  variables?: TemplateVariable[]
  is_active: boolean
  created: string
  updated: string
}

export interface TemplateVariable {
  name: string
  type: 'string' | 'number' | 'date' | 'boolean'
  source: 'user' | 'session' | 'system' | 'custom'
  description?: string
  required?: boolean
  defaultValue?: any
  format?: string // For date formatting, number formatting, etc.
}

export interface TemplateContext {
  user?: {
    id: string
    name?: string
    email?: string
    role?: string
    last_active_at?: string
    session_count?: number
    [key: string]: any
  }
  session?: {
    id: string
    type?: string
    duration?: number
    completed_at?: string
    analysis_score?: number
    [key: string]: any
  }
  system?: {
    app_name: string
    current_date: string
    current_time: string
    timezone: string
    [key: string]: any
  }
  custom?: Record<string, any>
}

export interface RenderedTemplate {
  title: string
  body: string
  actionText?: string
  actionUrl?: string
}

export interface TemplateValidationResult {
  isValid: boolean
  errors: TemplateValidationError[]
  warnings: TemplateValidationWarning[]
}

export interface TemplateValidationError {
  field: 'title_template' | 'body_template' | 'action_text_template' | 'action_url_template'
  message: string
  position?: number
  variable?: string
}

export interface TemplateValidationWarning {
  field: 'title_template' | 'body_template' | 'action_text_template' | 'action_url_template'
  message: string
  variable?: string
}

export interface TemplatePreviewOptions {
  template: MessageTemplate
  context?: Partial<TemplateContext>
  language?: 'fa' | 'en'
  sampleData?: boolean
}

export interface TemplateRenderOptions {
  template: MessageTemplate
  context: TemplateContext
  fallbackLanguage?: 'fa' | 'en'
  strictMode?: boolean // If true, throw errors for missing variables
}