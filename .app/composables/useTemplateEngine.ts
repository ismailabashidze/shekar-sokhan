import type PocketBase from 'pocketbase'

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

export const useTemplateEngine = () => {
  const { $pb } = useNuxtApp()
  const pb = $pb as PocketBase

  /**
   * Regular expression to match template variables: {{variableName}} or {{object.property}}
   */
  const VARIABLE_REGEX = /\{\{([^}]+)\}\}/g

  /**
   * Extract variables from a template string
   */
  const extractVariables = (template: string): string[] => {
    const matches = template.match(VARIABLE_REGEX)
    if (!matches) return []
    
    return matches.map(match => match.replace(/[{}]/g, '').trim())
  }

  /**
   * Get value from context using dot notation (e.g., "user.name", "session.id")
   */
  const getContextValue = (context: TemplateContext, path: string): any => {
    const keys = path.split('.')
    let value: any = context
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key]
      } else {
        return undefined
      }
    }
    
    return value
  }

  /**
   * Format value based on type and format specification
   */
  const formatValue = (value: any, variable?: TemplateVariable): string => {
    if (value === null || value === undefined) {
      return variable?.defaultValue?.toString() || ''
    }

    switch (variable?.type) {
      case 'date':
        if (value instanceof Date || typeof value === 'string') {
          const date = new Date(value)
          if (isNaN(date.getTime())) return value.toString()
          
          // Apply format if specified
          if (variable.format) {
            try {
              return new Intl.DateTimeFormat('fa-IR', {
                ...parseFormatOptions(variable.format)
              }).format(date)
            } catch {
              return date.toLocaleDateString('fa-IR')
            }
          }
          return date.toLocaleDateString('fa-IR')
        }
        break
        
      case 'number':
        if (typeof value === 'number' || !isNaN(Number(value))) {
          const num = Number(value)
          if (variable.format) {
            try {
              return new Intl.NumberFormat('fa-IR', {
                ...parseFormatOptions(variable.format)
              }).format(num)
            } catch {
              return num.toLocaleString('fa-IR')
            }
          }
          return num.toLocaleString('fa-IR')
        }
        break
        
      case 'boolean':
        return value ? 'بله' : 'خیر' // Persian yes/no
        
      default:
        return value.toString()
    }
    
    return value.toString()
  }

  /**
   * Parse format options from format string
   */
  const parseFormatOptions = (format: string): any => {
    try {
      return JSON.parse(format)
    } catch {
      // Handle simple format strings
      if (format.includes('currency')) {
        return { style: 'currency', currency: 'IRR' }
      }
      if (format.includes('percent')) {
        return { style: 'percent' }
      }
      if (format.includes('short')) {
        return { dateStyle: 'short' }
      }
      if (format.includes('long')) {
        return { dateStyle: 'long' }
      }
      return {}
    }
  }

  /**
   * Validate template syntax and variables
   */
  const validateTemplate = (template: MessageTemplate): TemplateValidationResult => {
    const errors: TemplateValidationError[] = []
    const warnings: TemplateValidationWarning[] = []

    // Fields to validate
    const fields: Array<keyof MessageTemplate> = [
      'title_template',
      'body_template',
      'action_text_template',
      'action_url_template'
    ]

    for (const field of fields) {
      const templateText = template[field] as string
      if (!templateText) continue

      // Extract variables from template
      const variables = extractVariables(templateText)
      const definedVariables = template.variables?.map(v => v.name) || []

      // Check for undefined variables
      for (const variable of variables) {
        if (!definedVariables.includes(variable) && !isBuiltInVariable(variable)) {
          warnings.push({
            field: field as any,
            message: `Variable '${variable}' is not defined in template variables`,
            variable
          })
        }
      }

      // Check for malformed variable syntax
      const malformedMatches = templateText.match(/\{[^}]*\}|\{[^{]*\{\{/g)
      if (malformedMatches) {
        for (const match of malformedMatches) {
          if (!match.match(/^\{\{[^}]+\}\}$/)) {
            errors.push({
              field: field as any,
              message: `Malformed variable syntax: ${match}`,
              position: templateText.indexOf(match)
            })
          }
        }
      }

      // Validate URL templates
      if (field === 'action_url_template' && templateText) {
        try {
          // Try to validate URL structure (basic check)
          const urlPattern = /^(https?:\/\/|\/)/
          const hasVariables = variables.length > 0
          
          if (!hasVariables && !urlPattern.test(templateText)) {
            warnings.push({
              field: field as any,
              message: 'URL should start with http://, https://, or /'
            })
          }
        } catch (error) {
          warnings.push({
            field: field as any,
            message: 'Invalid URL format'
          })
        }
      }
    }

    // Check for required variables
    if (template.variables) {
      for (const variable of template.variables) {
        if (variable.required) {
          const isUsed = fields.some(field => {
            const templateText = template[field] as string
            return templateText && extractVariables(templateText).includes(variable.name)
          })
          
          if (!isUsed) {
            warnings.push({
              field: 'title_template',
              message: `Required variable '${variable.name}' is not used in any template`,
              variable: variable.name
            })
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Check if a variable is a built-in system variable
   */
  const isBuiltInVariable = (variable: string): boolean => {
    const builtInVariables = [
      'user.id', 'user.name', 'user.email', 'user.role',
      'session.id', 'session.type', 'session.duration',
      'system.app_name', 'system.current_date', 'system.current_time',
      'system.timezone'
    ]
    
    return builtInVariables.includes(variable) || 
           variable.startsWith('user.') || 
           variable.startsWith('session.') || 
           variable.startsWith('system.') ||
           variable.startsWith('custom.')
  }

  /**
   * Render template with provided context
   */
  const renderTemplate = (options: TemplateRenderOptions): RenderedTemplate => {
    const { template, context, strictMode = false } = options

    // Validate template first
    const validation = validateTemplate(template)
    if (!validation.isValid && strictMode) {
      throw new Error(`Template validation failed: ${validation.errors.map((e: TemplateValidationError) => e.message).join(', ')}`)
    }

    // Create variable lookup map
    const variableMap = new Map<string, TemplateVariable>()
    if (template.variables) {
      for (const variable of template.variables) {
        variableMap.set(variable.name, variable)
      }
    }

    // Render each field
    const renderField = (templateText: string): string => {
      if (!templateText) return ''

      return templateText.replace(VARIABLE_REGEX, (match, variableName) => {
        const trimmedName = variableName.trim()
        const variable = variableMap.get(trimmedName)
        
        // Get value from context
        let value = getContextValue(context, trimmedName)
        
        // Handle missing values
        if (value === undefined || value === null) {
          if (variable?.defaultValue !== undefined) {
            value = variable.defaultValue
          } else if (strictMode && variable?.required) {
            throw new Error(`Required variable '${trimmedName}' is missing from context`)
          } else {
            return '' // Return empty string for missing optional variables
          }
        }

        // Format the value
        return formatValue(value, variable)
      })
    }

    return {
      title: renderField(template.title_template),
      body: renderField(template.body_template),
      actionText: template.action_text_template ? renderField(template.action_text_template) : undefined,
      actionUrl: template.action_url_template ? renderField(template.action_url_template) : undefined
    }
  }

  /**
   * Generate sample context for template preview
   */
  const generateSampleContext = (template: MessageTemplate): TemplateContext => {
    const now = new Date()
    
    return {
      user: {
        id: 'sample-user-id',
        name: 'علی احمدی',
        email: 'ali@example.com',
        role: 'patient',
        last_active_at: now.toISOString(),
        session_count: 15
      },
      session: {
        id: 'sample-session-id',
        type: 'therapy',
        duration: 45,
        completed_at: now.toISOString(),
        analysis_score: 85
      },
      system: {
        app_name: 'ذهنا',
        current_date: now.toLocaleDateString('fa-IR'),
        current_time: now.toLocaleTimeString('fa-IR'),
        timezone: 'Asia/Tehran'
      },
      custom: {
        reminder_count: 3,
        streak_days: 7,
        next_session: 'فردا ساعت ۱۰'
      }
    }
  }

  /**
   * Preview template with sample or provided context
   */
  const previewTemplate = (options: TemplatePreviewOptions): RenderedTemplate => {
    const { template, context, sampleData = true } = options

    let previewContext: TemplateContext

    if (sampleData) {
      // Generate sample context and merge with provided context
      previewContext = {
        ...generateSampleContext(template),
        ...context
      }
    } else {
      previewContext = context || {}
    }

    return renderTemplate({
      template,
      context: previewContext,
      strictMode: false // Don't throw errors in preview mode
    })
  }

  /**
   * Get template by ID from PocketBase
   */
  const getTemplate = async (templateId: string): Promise<MessageTemplate | null> => {
    try {
      const template = await pb.collection('message_templates').getOne(templateId)
      return template as unknown as MessageTemplate
    } catch (error) {
      console.error('❌ Error fetching template:', error)
      return null
    }
  }

  /**
   * Get templates by category and language
   */
  const getTemplates = async (filters?: {
    category?: 'session' | 'admin' | 'system'
    language?: 'fa' | 'en'
    isActive?: boolean
  }): Promise<MessageTemplate[]> => {
    try {
      const filterParts: string[] = []
      
      if (filters?.category) {
        filterParts.push(`category = "${filters.category}"`)
      }
      
      if (filters?.language) {
        filterParts.push(`language = "${filters.language}"`)
      }
      
      if (filters?.isActive !== undefined) {
        filterParts.push(`is_active = ${filters.isActive}`)
      }

      const result = await pb.collection('message_templates').getList(1, 100, {
        filter: filterParts.length > 0 ? filterParts.join(' && ') : undefined,
        sort: 'name'
      })

      return result.items as unknown as MessageTemplate[]
    } catch (error) {
      console.error('❌ Error fetching templates:', error)
      return []
    }
  }

  /**
   * Find best matching template for user and context
   */
  const findBestTemplate = async (
    category: 'session' | 'admin' | 'system',
    userLanguage: 'fa' | 'en' = 'fa',
    fallbackLanguage: 'fa' | 'en' = 'en'
  ): Promise<MessageTemplate | null> => {
    try {
      // First try to find template in user's preferred language
      let templates = await getTemplates({
        category,
        language: userLanguage,
        isActive: true
      })

      if (templates.length === 0 && userLanguage !== fallbackLanguage) {
        // Fallback to fallback language
        templates = await getTemplates({
          category,
          language: fallbackLanguage,
          isActive: true
        })
      }

      // Return first active template (could be enhanced with more sophisticated selection)
      return templates.length > 0 ? templates[0] : null
    } catch (error) {
      console.error('❌ Error finding best template:', error)
      return null
    }
  }

  /**
   * Create context from user and session data
   */
  const createContextFromData = async (
    userId?: string,
    sessionId?: string,
    customData?: Record<string, any>
  ): Promise<TemplateContext> => {
    const context: TemplateContext = {
      system: {
        app_name: 'ذهنا',
        current_date: new Date().toLocaleDateString('fa-IR'),
        current_time: new Date().toLocaleTimeString('fa-IR'),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      custom: customData || {}
    }

    try {
      // Fetch user data if userId provided
      if (userId) {
        const user = await pb.collection('users').getOne(userId)
        context.user = {
          id: user.id,
          name: user.name || user.email,
          email: user.email,
          role: user.role,
          last_active_at: user.last_active_at,
          session_count: user.session_count || 0
        }
      }

      // Fetch session data if sessionId provided
      if (sessionId) {
        const session = await pb.collection('sessions').getOne(sessionId)
        context.session = {
          id: session.id,
          type: session.type,
          duration: session.duration,
          completed_at: session.completed_at,
          analysis_score: session.analysis_score
        }
      }
    } catch (error) {
      console.error('❌ Error creating context from data:', error)
    }

    return context
  }

  return {
    // Core rendering functions
    renderTemplate,
    previewTemplate,
    validateTemplate,
    
    // Template management
    getTemplate,
    getTemplates,
    findBestTemplate,
    
    // Context utilities
    createContextFromData,
    generateSampleContext,
    
    // Utility functions
    extractVariables,
    formatValue,
    isBuiltInVariable
  }
}