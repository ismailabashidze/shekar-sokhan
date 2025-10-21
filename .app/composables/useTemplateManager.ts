import type PocketBase from 'pocketbase'
import type { 
  MessageTemplate, 
  TemplateContext, 
  RenderedTemplate,
  TemplateValidationResult,
  TemplateVariable
} from './useTemplateEngine'

export const useTemplateManager = () => {
  const { $pb } = useNuxtApp()
  const pb = $pb as PocketBase

  /**
   * Create a new message template
   */
  const createTemplate = async (templateData: Partial<MessageTemplate>): Promise<MessageTemplate | null> => {
    try {
      // Validate required fields
      if (!templateData.name || !templateData.category || !templateData.language) {
        throw new Error('نام، دسته‌بندی و زبان قالب الزامی است')
      }

      if (!templateData.title_template || !templateData.body_template) {
        throw new Error('قالب عنوان و متن الزامی است')
      }

      // Set default values
      const template = {
        is_active: true,
        variables: [],
        ...templateData
      }

      // Validate template before creating
      const { validateTemplate } = useTemplateEngine()
      const validation = validateTemplate(template as MessageTemplate)
      if (!validation.isValid) {
        throw new Error(`خطاهای اعتبارسنجی: ${validation.errors.map((e: any) => e.message).join(', ')}`)
      }

      const created = await pb.collection('message_templates').create(template)
      console.log('✅ Template created successfully:', created.id)
      
      return created as unknown as MessageTemplate
    } catch (error) {
      console.error('❌ Error creating template:', error)
      throw error
    }
  }

  /**
   * Update an existing message template
   */
  const updateTemplate = async (templateId: string, updates: Partial<MessageTemplate>): Promise<MessageTemplate | null> => {
    try {
      // Get existing template
      const existing = await pb.collection('message_templates').getOne(templateId)
      
      // Merge updates
      const updated = { ...existing, ...updates }

      // Validate updated template
      const { validateTemplate } = useTemplateEngine()
      const validation = validateTemplate(updated as MessageTemplate)
      if (!validation.isValid) {
        throw new Error(`خطاهای اعتبارسنجی: ${validation.errors.map((e: any) => e.message).join(', ')}`)
      }

      const result = await pb.collection('message_templates').update(templateId, updates)
      console.log('✅ Template updated successfully:', templateId)
      
      return result as unknown as MessageTemplate
    } catch (error) {
      console.error('❌ Error updating template:', error)
      throw error
    }
  }

  /**
   * Delete a message template
   */
  const deleteTemplate = async (templateId: string): Promise<boolean> => {
    try {
      await pb.collection('message_templates').delete(templateId)
      console.log('✅ Template deleted successfully:', templateId)
      return true
    } catch (error) {
      console.error('❌ Error deleting template:', error)
      return false
    }
  }

  /**
   * Get template by ID
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
   * Get all templates with filtering and pagination
   */
  const getTemplates = async (options?: {
    category?: 'session' | 'admin' | 'system'
    language?: 'fa' | 'en'
    isActive?: boolean
    search?: string
    page?: number
    perPage?: number
  }): Promise<{
    items: MessageTemplate[]
    totalItems: number
    totalPages: number
    page: number
    perPage: number
  }> => {
    try {
      const { 
        category, 
        language, 
        isActive, 
        search, 
        page = 1, 
        perPage = 20 
      } = options || {}

      // Build filter
      const filterParts: string[] = []
      
      if (category) {
        filterParts.push(`category = "${category}"`)
      }
      
      if (language) {
        filterParts.push(`language = "${language}"`)
      }
      
      if (isActive !== undefined) {
        filterParts.push(`is_active = ${isActive}`)
      }
      
      if (search) {
        filterParts.push(`(name ~ "${search}" || description ~ "${search}")`)
      }

      const filter = filterParts.length > 0 ? filterParts.join(' && ') : undefined

      const result = await pb.collection('message_templates').getList(page, perPage, {
        filter,
        sort: '-updated'
      })

      return {
        items: result.items as unknown as MessageTemplate[],
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        page: result.page,
        perPage: result.perPage
      }
    } catch (error) {
      console.error('❌ Error fetching templates:', error)
      return {
        items: [],
        totalItems: 0,
        totalPages: 0,
        page: 1,
        perPage: 20
      }
    }
  }

  /**
   * Duplicate a template
   */
  const duplicateTemplate = async (templateId: string, newName?: string): Promise<MessageTemplate | null> => {
    try {
      const original = await getTemplate(templateId)
      if (!original) {
        throw new Error('قالب اصلی یافت نشد')
      }

      // Create duplicate with new name
      const duplicate = {
        ...original,
        name: newName || `${original.name} - کپی`,
        is_active: false // Start as inactive
      }

      // Remove system fields
      delete (duplicate as any).id
      delete (duplicate as any).created
      delete (duplicate as any).updated

      return await createTemplate(duplicate)
    } catch (error) {
      console.error('❌ Error duplicating template:', error)
      return null
    }
  }

  /**
   * Render template for specific user and context
   */
  const renderTemplateForUser = async (
    templateId: string,
    userId?: string,
    sessionId?: string,
    customContext?: Record<string, any>
  ): Promise<RenderedTemplate | null> => {
    try {
      const template = await getTemplate(templateId)
      if (!template) {
        throw new Error('قالب یافت نشد')
      }

      const { createContextFromData, renderTemplate } = useTemplateEngine()
      const context = await createContextFromData(userId, sessionId, customContext)
      
      return renderTemplate({
        template,
        context,
        strictMode: false
      })
    } catch (error) {
      console.error('❌ Error rendering template for user:', error)
      return null
    }
  }

  /**
   * Get template statistics
   */
  const getTemplateStats = async (): Promise<{
    total: number
    byCategory: Record<'session' | 'admin' | 'system', number>
    byLanguage: Record<'fa' | 'en', number>
    active: number
    inactive: number
  }> => {
    try {
      const [total, byCategory, byLanguage, active] = await Promise.all([
        // Total count
        pb.collection('message_templates').getList(1, 1, { filter: '' }),
        
        // By category
        Promise.all([
          pb.collection('message_templates').getList(1, 1, { filter: 'category = "session"' }),
          pb.collection('message_templates').getList(1, 1, { filter: 'category = "admin"' }),
          pb.collection('message_templates').getList(1, 1, { filter: 'category = "system"' })
        ]),
        
        // By language
        Promise.all([
          pb.collection('message_templates').getList(1, 1, { filter: 'language = "fa"' }),
          pb.collection('message_templates').getList(1, 1, { filter: 'language = "en"' })
        ]),
        
        // Active count
        pb.collection('message_templates').getList(1, 1, { filter: 'is_active = true' })
      ])

      return {
        total: total.totalItems,
        byCategory: {
          session: byCategory[0].totalItems,
          admin: byCategory[1].totalItems,
          system: byCategory[2].totalItems
        },
        byLanguage: {
          fa: byLanguage[0].totalItems,
          en: byLanguage[1].totalItems
        },
        active: active.totalItems,
        inactive: total.totalItems - active.totalItems
      }
    } catch (error) {
      console.error('❌ Error fetching template stats:', error)
      return {
        total: 0,
        byCategory: { session: 0, admin: 0, system: 0 },
        byLanguage: { fa: 0, en: 0 },
        active: 0,
        inactive: 0
      }
    }
  }

  /**
   * Bulk operations on templates
   */
  const bulkUpdateTemplates = async (
    templateIds: string[],
    updates: Partial<MessageTemplate>
  ): Promise<{ success: number; failed: number; errors: string[] }> => {
    const results = { success: 0, failed: 0, errors: [] as string[] }

    for (const id of templateIds) {
      try {
        await updateTemplate(id, updates)
        results.success++
      } catch (error) {
        results.failed++
        results.errors.push(`خطا در به‌روزرسانی قالب ${id}: ${error}`)
      }
    }

    return results
  }

  /**
   * Bulk delete templates
   */
  const bulkDeleteTemplates = async (templateIds: string[]): Promise<{ 
    success: number; 
    failed: number; 
    errors: string[] 
  }> => {
    const results = { success: 0, failed: 0, errors: [] as string[] }

    for (const id of templateIds) {
      try {
        await deleteTemplate(id)
        results.success++
      } catch (error) {
        results.failed++
        results.errors.push(`خطا در حذف قالب ${id}: ${error}`)
      }
    }

    return results
  }

  /**
   * Export templates to JSON
   */
  const exportTemplates = async (templateIds?: string[]): Promise<MessageTemplate[]> => {
    try {
      let templates: MessageTemplate[]

      if (templateIds && templateIds.length > 0) {
        // Export specific templates
        templates = []
        for (const id of templateIds) {
          const template = await getTemplate(id)
          if (template) {
            templates.push(template)
          }
        }
      } else {
        // Export all templates
        const result = await getTemplates({ perPage: 1000 })
        templates = result.items
      }

      // Remove system fields for export
      return templates.map(template => {
        const exported = { ...template }
        delete (exported as any).id
        delete (exported as any).created
        delete (exported as any).updated
        return exported
      })
    } catch (error) {
      console.error('❌ Error exporting templates:', error)
      return []
    }
  }

  /**
   * Import templates from JSON
   */
  const importTemplates = async (
    templates: Partial<MessageTemplate>[],
    options?: {
      overwriteExisting?: boolean
      skipInvalid?: boolean
    }
  ): Promise<{
    imported: number
    skipped: number
    errors: string[]
  }> => {
    const results = { imported: 0, skipped: 0, errors: [] as string[] }
    const { overwriteExisting = false, skipInvalid = true } = options || {}

    for (const templateData of templates) {
      try {
        // Validate template data
        if (!templateData.name || !templateData.category || !templateData.language) {
          if (skipInvalid) {
            results.skipped++
            results.errors.push(`قالب نامعتبر رد شد: ${templateData.name || 'بدون نام'}`)
            continue
          } else {
            throw new Error('داده‌های قالب ناقص است')
          }
        }

        // Check if template exists
        const existing = await pb.collection('message_templates').getList(1, 1, {
          filter: `name = "${templateData.name}" && category = "${templateData.category}" && language = "${templateData.language}"`
        })

        if (existing.items.length > 0) {
          if (overwriteExisting) {
            await updateTemplate(existing.items[0].id, templateData)
            results.imported++
          } else {
            results.skipped++
            results.errors.push(`قالب موجود رد شد: ${templateData.name}`)
          }
        } else {
          await createTemplate(templateData)
          results.imported++
        }
      } catch (error) {
        results.skipped++
        results.errors.push(`خطا در وارد کردن قالب ${templateData.name}: ${error}`)
      }
    }

    return results
  }

  return {
    // CRUD operations
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplate,
    getTemplates,
    duplicateTemplate,
    
    // Rendering
    renderTemplateForUser,
    
    // Statistics and analytics
    getTemplateStats,
    
    // Bulk operations
    bulkUpdateTemplates,
    bulkDeleteTemplates,
    
    // Import/Export
    exportTemplates,
    importTemplates,
    
    // Additional utility functions will be added as needed
  }
}