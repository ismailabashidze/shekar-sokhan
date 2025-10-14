import type { TherapyGoal } from './goal'
import type { TherapyAssessment } from './useAssessment'

export function useGoals() {
  const nuxtApp = useNuxtApp()
  const { user } = useUser()
  const config = useRuntimeConfig()

  const streamChatForGoals = async (
    messages: any[],
    onChunk: (chunk: string) => void,
  ) => {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.public.openRouterApiKey}`,
        'HTTP-Referer': config.public.appUrl || 'http://localhost:4000',
        'X-Title': 'Therapy Goals Generation',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-saba',
        messages: messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 0,
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('Failed to create stream reader')
    }

    let buffer = ''
    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmedLine = line.trim()
        if (!trimmedLine || trimmedLine.startsWith(':')) continue

        const data = trimmedLine.startsWith('data: ') ? trimmedLine.slice(6) : trimmedLine

        if (data === '[DONE]') break

        try {
          const parsed = JSON.parse(data)
          const textChunk = parsed?.choices?.[0]?.delta?.content
          if (textChunk) {
            onChunk(textChunk)
          }
        }
        catch (e) {
          // Ignore parsing errors for streaming
        }
      }
    }
  }

  const getSessionGoals = async (sessionId: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      return await nuxtApp.$pb.collection('goals').getFullList({
        filter: `session_id = "${sessionId}"`,
        sort: '-created',
      })
    }
    catch (error) {
      console.error('Error fetching session goals:', error)
      throw error
    }
  }

  const getGoalsByUser = async (userId: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      const records = await nuxtApp.$pb.collection('suggestedDisordersToInvestigate').getFullList({
        filter: `user_id = "${userId}"`,
        sort: '-created',
      })

      // Transform to maintain compatibility with existing code
      return records.map(record => ({
        id: record.id,
        user_id: record.user_id,
        session_id: record.session_id,
        goals: {
          suggestedDisordersToInvestigate: record.suggestedDisordersToInvestigate,
        },
        created: record.created,
        updated: record.updated,
      }))
    }
    catch (error) {
      console.error('Error fetching user goals:', error)
      throw error
    }
  }

  const updateGoalProgress = async (goalId: string, progress: number, status?: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      // For the new collection, we only need to update specific fields
      // The main data is in the JSON field, so progress tracking might need to be handled differently
      const updateData: any = {
        updated: new Date().toISOString(),
      }

      // Note: The new collection structure doesn't have progress_percentage and status fields
      // You might need to store this information in the suggestedDisordersToInvestigate JSON
      console.log('Update attempt for suggestedDisordersToInvestigate collection - limited update capability')

      return await nuxtApp.$pb.collection('suggestedDisordersToInvestigate').update(goalId, updateData)
    }
    catch (error) {
      console.error('Error updating goal progress:', error)
      throw error
    }
  }

  const completeGoal = async (goalId: string) => {
    try {
      return await updateGoalProgress(goalId, 100, 'achieved')
    }
    catch (error) {
      console.error('Error completing goal:', error)
      throw error
    }
  }

  const saveGoal = async (goalData: any) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      const goalRecord = {
        user_id: user.value?.id,
        goals: {
          ...goalData,
          status: goalData.status || 'pending',
          progress_percentage: goalData.progress_percentage || 0,
        },
      }

      return await nuxtApp.$pb.collection('goals').create(goalRecord)
    }
    catch (error) {
      console.error('Error saving goal:', error)
      throw error
    }
  }

  const saveGoals = async (goals: any[], sessionId?: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      const savedGoals = []
      for (const goal of goals) {
        const goalRecord = {
          user_id: user.value?.id,
          goals: {
            // Core goal information
            goal_type: goal.goal_type || 'diagnostic',
            title: goal.title,
            description: goal.description,
            target_behaviors: goal.target_behaviors || [],
            success_criteria: goal.success_criteria || [],
            priority: goal.priority || 'medium',
            status: goal.status || 'pending',
            progress_percentage: goal.progress_percentage || 0,
            session_id: sessionId,

            // DSM-5 diagnostic information
            dsm5_criteria: goal.dsm5_criteria || [],
            icd11_criteria: goal.icd11_criteria || [],

            // Assessment and planning
            assessment_areas: goal.assessment_areas || [],
            action_plan: goal.action_plan || [],
            main_cc_investigation: goal.main_cc_investigation || [],
            comorbidity_investigation: goal.comorbidity_investigation || [],
            clinical_interview_focus: goal.clinical_interview_focus || [],
          },

          // Enhanced diagnostic fields (using the new database schema)
          dsm5_categories: goal.dsm5_categories || [],
          diagnostic_features: goal.diagnostic_features || [],
          associated_features: goal.associated_features || [],
          suicide_risk_assessment: goal.suicide_risk_assessment || {},
          functional_consequences: goal.functional_consequences || [],
          differential_diagnosis: goal.differential_diagnosis || [],
          cultural_considerations: goal.cultural_considerations || [],
          conversation_guidance: goal.conversation_guidance || {},
          goal_progression: {
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            status_history: [{
              status: 'pending',
              timestamp: new Date().toISOString(),
              notes: 'Goal created',
            }],
          },
          confidence_level: goal.confidence_level || 0.5,
          flexibility_notes: goal.flexibility_notes || '',
        }

        const saved = await nuxtApp.$pb.collection('goals').create(goalRecord)
        savedGoals.push(saved)
      }
      return savedGoals
    }
    catch (error) {
      console.error('Error saving goals:', error)
      throw error
    }
  }

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'muted'
      case 'in_progress': return 'primary'
      case 'achieved': return 'success'
      default: return 'muted'
    }
  }

  const getGoalStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'در انتظار'
      case 'in_progress': return 'در حال انجام'
      case 'achieved': return 'تحقق یافته'
      default: return 'نامشخص'
    }
  }

  const getGoalPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'muted'
    }
  }

  const getGoalPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'بالا'
      case 'medium': return 'متوسط'
      case 'low': return 'پایین'
      default: return 'نامشخص'
    }
  }

  const generateStructuredGoals = async (messages: any[], sessionNumber: number): Promise<any[]> => {
    const goalSchema = {
      type: 'object',
      additionalProperties: false,
      properties: {
        suggestedDisordersToInvestigate: {
          type: 'array',
          description: 'At least 3 DSM-5 categories with 3-5 disorders each',
          minItems: 3,
          maxItems: 6,
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              categoryTitle: {
                type: 'string',
                enum: [
                  'Neurodevelopmental Disorders',
                  'Schizophrenia Spectrum and Other Psychotic Disorders',
                  'Bipolar and Related Disorders',
                  'Depressive Disorders',
                  'Anxiety Disorders',
                  'Obsessive-Compulsive and Related Disorders',
                  'Trauma- and Stressor-Related Disorders',
                  'Dissociative Disorders',
                  'Somatic Symptom and Related Disorders',
                  'Feeding and Eating Disorders',
                  'Elimination Disorders',
                  'Sleep-Wake Disorders',
                  'Sexual Dysfunctions',
                  'Gender Dysphoria',
                  'Disruptive, Impulse-Control, and Conduct Disorders',
                  'Substance-Related and Addictive Disorders',
                  'Neurocognitive Disorders',
                  'Personality Disorders',
                  'Paraphilic Disorders',
                  'Other Mental Disorders',
                  'Medication-Induced Movement Disorders and Other Adverse Effects of Medication',
                  'Other Conditions That May Be a Focus of Clinical Attention',
                ],
              },
              categoryTitleFa: { type: 'string', description: 'عنوان فارسی دسته‌بندی' },
              categoryDescription: { type: 'string' },
              disorders: {
                type: 'array',
                description: 'Between 3-5 disorders per category',
                minItems: 3,
                maxItems: 5,
                items: {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    code: { type: 'string', description: 'DSM-5 exact coding style like 295.90 (F20.9)' },
                    title: { type: 'string', description: 'نام اختلال' },
                    description: { type: 'string', description: 'توضیح اختلال' },
                    minimumCriteria: { type: 'string', description: 'حداقل معیارهای تشخیص' },
                    specialNote: { type: 'string', description: 'نکته ویژه' },
                    Prevalence: { type: 'string', description: 'شیوع' },
                    developmentAndCourse: { type: 'string', description: 'توسعه و سیر' },
                    suicideRisk: { type: 'string', description: 'خطر خودکشی' },
                    diagnosisCriteria: {
                      type: 'array',
                      items: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          alphabet: { type: 'string' },
                          description: { type: 'string' },
                          subsets: {
                            type: 'array',
                            items: {
                              type: 'object',
                              additionalProperties: false,
                              properties: {
                                number: { type: 'string' },
                                description: { type: 'string' },
                              },
                              required: ['number', 'description'],
                            },
                          },
                        },
                        required: ['alphabet', 'description'],
                      },
                    },
                    specifiers: {
                      type: 'array',
                      items: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          title: { type: 'string' },
                          conditions: {
                            type: 'array',
                            items: { type: 'string' },
                          },
                        },
                        required: ['title', 'conditions'],
                      },
                    },
                    diagnosticFeatures: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        core_symptoms: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            mandatory: {
                              type: 'array',
                              items: {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  symptom: { type: 'string' },
                                  description: { type: 'string' },
                                  quantification: { type: 'string' },
                                },
                                required: ['symptom', 'description', 'quantification'],
                              },
                            },
                            associated: {
                              type: 'array',
                              items: {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  symptom: { type: 'string' },
                                  description: { type: 'string' },
                                  category: {
                                    type: 'string',
                                    enum: ['mood', 'anxiety', 'behavioral', 'somatic'],
                                  },
                                },
                                required: ['symptom', 'description', 'category'],
                              },
                            },
                            exclusion_criteria: { type: 'string' },
                          },
                        },
                        temporal_pattern: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            duration: { type: 'string' },
                            frequency: { type: 'string' },
                            onset: { type: 'string' },
                            remission: { type: 'string' },
                            symptom_free_period: {
                              type: 'object',
                              additionalProperties: false,
                              properties: {
                                required: { type: 'boolean' },
                                description: { type: 'string' },
                              },
                            },
                          },
                        },
                        functional_impairment: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            required: { type: 'boolean' },
                            domains: {
                              type: 'array',
                              items: {
                                type: 'string',
                                enum: ['occupational', 'social', 'academic', 'interpersonal'],
                              },
                            },
                            severity_levels: {
                              type: 'array',
                              items: {
                                type: 'string',
                                enum: ['mild', 'moderate', 'severe'],
                              },
                            },
                          },
                        },
                        contextual_factors: {
                          type: 'array',
                          items: {
                            type: 'object',
                            additionalProperties: false,
                            properties: {
                              factor: { type: 'string' },
                              impact_description: { type: 'string' },
                              type: {
                                type: 'string',
                                enum: [
                                  'cultural_background', 'gender_roles', 'religious_beliefs', 'social_tolerance',
                                  'socioeconomic_status', 'family_dynamics', 'life_stressors', 'migration_status',
                                  'medical_context', 'environmental_triggers', 'developmental_stage', 'sexual_orientation',
                                  'disability_status', 'trauma_history', 'occupational_demands', 'educational_background',
                                  'language_barriers', 'acculturation_level', 'community_support', 'political_climate',
                                  'generational_differences', 'healthcare_access', 'nutritional_status', 'substance_use_patterns',
                                  'media_influences',
                                ],
                              },
                            },
                            required: ['factor', 'impact_description', 'type'],
                          },
                        },
                        differential_diagnostics: {
                          type: 'array',
                          items: {
                            type: 'object',
                            additionalProperties: false,
                            properties: {
                              disorder: { type: 'string' },
                              distinguishing_features: {
                                type: 'array',
                                items: {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    feature: { type: 'string' },
                                    comparison: { type: 'string' },
                                  },
                                  required: ['feature', 'comparison'],
                                },
                              },
                            },
                            required: ['disorder', 'distinguishing_features'],
                          },
                        },
                      },
                    },
                    diagnosticMarkers: {
                      type: 'array',
                      items: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          name: {
                            type: 'string',
                            enum: ['biological', 'neurophysiological', 'cognitive_behavioral', 'digital', 'other'],
                          },
                          subtype: {
                            type: 'array',
                            items: { type: 'string' },
                          },
                        },
                        required: ['name', 'subtype'],
                      },
                    },
                    associated_features: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        supporting_symptoms: {
                          type: 'array',
                          items: { type: 'string' },
                        },
                        demographic_patterns: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            age_onset: { type: 'string' },
                            gender_distribution: { type: 'string' },
                            cultural_variations: { type: 'string' },
                          },
                        },
                        common_comorbidities: {
                          type: 'array',
                          items: { type: 'string' },
                        },
                        functional_impacts: {
                          type: 'array',
                          items: { type: 'string' },
                        },
                        developmental_course: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            typical_progression: { type: 'string' },
                            risk_factors: {
                              type: 'array',
                              items: { type: 'string' },
                            },
                          },
                        },
                        biological_findings: {
                          type: 'array',
                          items: { type: 'string' },
                        },
                        cognitive_emotional_patterns: {
                          type: 'array',
                          items: { type: 'string' },
                        },
                        cultural_manifestations: {
                          type: 'array',
                          items: { type: 'string' },
                        },
                      },
                    },
                    riskAndPrognosticFactors: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        Environmental: { type: 'string' },
                        geneticAndPhysiological: { type: 'string' },
                      },
                    },
                    cultureRelatedDiagnosticIssues: {
                      type: 'object',
                      additionalProperties: false,
                    },
                    genderRelatedDiagnosticIssues: {
                      type: 'object',
                      additionalProperties: false,
                    },
                    differentialDiagnosis: {
                      type: 'object',
                      additionalProperties: false,
                    },
                    comorbidity: {
                      type: 'object',
                      additionalProperties: false,
                    },
                  },
                  required: ['code', 'title', 'description', 'minimumCriteria', 'Prevalence', 'developmentAndCourse', 'suicideRisk'],
                  additionalProperties: false,
                },
              },
            },
            required: ['categoryTitle', 'categoryTitleFa', 'categoryDescription', 'disorders'],
            additionalProperties: false,
          },
        },
      },
      required: ['suggestedDisordersToInvestigate'],
      additionalProperties: false,
    }

    console.log('Making API request to OpenRouter...')
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.public.openRouterApiKey}`,
        'HTTP-Referer': config.public.appUrl || 'http://localhost:4000',
        'X-Title': 'DSM-5 Disorder Investigation Generator',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-saba',
        messages: messages,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'disorder_investigation',
            schema: goalSchema,
          },
        },
        temperature: 0.7,
        max_tokens: 0,
      }),
    })

    console.log('API response status:', response.status)
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API error response:', errorText)
      throw new Error(`Structured API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Full API response:', data)

    const content = data.choices?.[0]?.message?.content
    if (!content) {
      console.error('No content in API response:', data)
      throw new Error('No content received from API')
    }

    console.log('Raw content from API:', content)

    let result
    try {
      result = typeof content === 'string' ? JSON.parse(content) : content
    }
    catch (parseError) {
      console.error('JSON parse error. Content was:', content)
      throw new Error(`Invalid JSON response - ${parseError.message}`)
    }

    console.log('Parsed result:', result)

    const disorders = result.suggestedDisordersToInvestigate || []
    console.log('Extracted disorders:', disorders.length, 'categories')

    return disorders
  }

  const generateDiagnosisGoals = async (assessment: TherapyAssessment, sessionNumber: number = 1): Promise<any[]> => {
    try {
      // First, analyze DSM-5 categories
      const relevantCategories = analyzeDSM5Categories(assessment)

      console.log('Starting two-phase DSM-5 generation process...')

      // PHASE 1: Generate basic disorder information
      let phase1Results = []
      try {
        phase1Results = await generatePhase1BasicDisorders(assessment, relevantCategories, sessionNumber)

        if (!phase1Results || phase1Results.length === 0) {
          throw new Error('Phase 1 returned empty results')
        }

        console.log('Phase 1 completed - basic disorders generated:', phase1Results.length, 'categories')
      }
      catch (phase1Error) {
        console.error('Phase 1 failed:', phase1Error)

        // Fall back to legacy single-phase generation
        console.log('Falling back to legacy generation method...')
        try {
          return await generateStructuredGoalsOld(assessment, sessionNumber)
        }
        catch (legacyError) {
          console.error('Legacy generation also failed:', legacyError)
          throw new Error('All generation methods failed')
        }
      }

      // PHASE 2: Enhance with detailed diagnostic information
      let phase2Results = []
      try {
        phase2Results = await generatePhase2DetailedFeatures(phase1Results, assessment, sessionNumber)

        if (!phase2Results || phase2Results.length === 0) {
          console.warn('Phase 2 failed - falling back to Phase 1 results')
          return phase1Results
        }

        console.log('Phase 2 completed - detailed features added')
        return phase2Results
      }
      catch (phase2Error) {
        console.error('Phase 2 failed:', phase2Error)
        console.warn('Returning Phase 1 results without enhancement')
        return phase1Results
      }
    }
    catch (error) {
      console.error('Error in two-phase diagnosis goals generation:', error)
      throw error
    }
  }

  const generatePhase1BasicDisorders = async (assessment: TherapyAssessment, relevantCategories: any[], sessionNumber: number): Promise<any[]> => {
    const phase1Schema = {
      type: 'object',
      additionalProperties: false,
      properties: {
        suggestedDisordersToInvestigate: {
          type: 'array',
          description: 'At least 3 DSM-5 categories with 3-5 disorders each',
          minItems: 3,
          maxItems: 6,
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              categoryTitle: {
                type: 'string',
                enum: [
                  'Neurodevelopmental Disorders',
                  'Schizophrenia Spectrum and Other Psychotic Disorders',
                  'Bipolar and Related Disorders',
                  'Depressive Disorders',
                  'Anxiety Disorders',
                  'Obsessive-Compulsive and Related Disorders',
                  'Trauma- and Stressor-Related Disorders',
                  'Dissociative Disorders',
                  'Somatic Symptom and Related Disorders',
                  'Feeding and Eating Disorders',
                  'Elimination Disorders',
                  'Sleep-Wake Disorders',
                  'Sexual Dysfunctions',
                  'Gender Dysphoria',
                  'Disruptive, Impulse-Control, and Conduct Disorders',
                  'Substance-Related and Addictive Disorders',
                  'Neurocognitive Disorders',
                  'Personality Disorders',
                  'Paraphilic Disorders',
                  'Other Mental Disorders',
                  'Medication-Induced Movement Disorders and Other Adverse Effects of Medication',
                  'Other Conditions That May Be a Focus of Clinical Attention',
                ],
              },
              categoryTitleFa: { type: 'string', description: 'عنوان فارسی دسته‌بندی' },
              categoryDescription: { type: 'string' },
              disorders: {
                type: 'array',
                description: 'Between 3-5 disorders per category',
                minItems: 3,
                maxItems: 5,
                items: {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    code: { type: 'string', description: 'DSM-5 exact coding style like 295.90 (F20.9)' },
                    title: { type: 'string', description: 'نام اختلال' },
                    description: { type: 'string', description: 'توضیح اختلال' },
                    minimumCriteria: { type: 'string', description: 'حداقل معیارهای تشخیص' },
                    specialNote: { type: 'string', description: 'نکته ویژه' },
                    Prevalence: { type: 'string', description: 'شیوع' },
                    developmentAndCourse: { type: 'string', description: 'توسعه و سیر' },
                    suicideRisk: { type: 'string', description: 'خطر خودکشی' },
                  },
                  required: ['code', 'title', 'description', 'minimumCriteria', 'Prevalence', 'developmentAndCourse', 'suicideRisk'],
                  additionalProperties: false,
                },
              },
            },
            required: ['categoryTitle', 'categoryTitleFa', 'categoryDescription', 'disorders'],
            additionalProperties: false,
          },
        },
      },
      required: ['suggestedDisordersToInvestigate'],
      additionalProperties: false,
    }

    const systemPrompt = `شما یک روانشناس متخصص در تشخیص اختلالات روانی بر اساس DSM-5 هستید.

**فاز 1: تولید اطلاعات اولیه اختلالات**

بر اساس تحلیل ارزیابی بیمار، حداقل 3 دسته‌بندی DSM-5 مرتبط را شناسایی کرده و برای هر دسته‌بندی، دقیقاً بین 3 تا 5 اختلال محتمل جهت بررسی بیشتر پیشنهاد دهید.

**مهم: بر روی تمامی 22 دسته‌بندی DSM-5 توجه کنید، نه فقط دسته‌بندی‌های رایج مثل افسردگی و اضطراب.**

برای هر اختلال فقط موارد اجباری زیر را ارائه دهید (کوتاه و مختصر):
- code: کد دقیق DSM-5
- title: نام اختلال به فارسی (کوتاه)
- description: توضیح مختصر اختلال به فارسی (حداکثر 2 جمله)
- minimumCriteria: خلاصه معیارهای تشخیص (حداکثر 2 جمله)
- specialNote: نکته مهم (حداکثر 1 جمله)
- Prevalence: شیوع (کوتاه، مثل "5-10%")
- developmentAndCourse: سیر (حداکثر 1 جمله)
- suicideRisk: خطر خودکشی (کوتاه: "پایین"، "متوسط" یا "بالا")

REQUIREMENTS:
1. دقیقاً 3 دسته‌بندی
2. هر دسته 3-5 اختلال
3. پاسخ‌های مختصر
4. فقط JSON صحیح`

    const userPrompt = `بر اساس اطلاعات ارزیابی بیمار، اختلالات محتمل جهت بررسی بیشتر را شناسایی کنید:

**تحلیل دسته‌بندی‌های DSM-5:**
${relevantCategories.map(cat => `• ${cat.category}: احتمال ${(cat.likelihood * 100).toFixed(0)}% (شواهد: ${cat.evidence.join(', ')})`).join('\n')}

**پروفایل بیمار:**
• شکایت اصلی: ${assessment.mainConcerns}
• شروع علائم: ${assessment.symptomsStarted}
• محرک‌ها: ${assessment.triggerEvents}
• تأثیر عملکردی: ${assessment.impactOnLife}

**وضعیت فعلی:**
• خلق: ${assessment.mood} | اضطراب: ${assessment.anxietyLevel}/5 | استرس: ${assessment.stressLevel}/5
• خواب: ${assessment.sleepQuality}/5 | انرژی: ${assessment.energyLevel}/5 | تمرکز: ${assessment.concentrationLevel}/5
• علائم جسمی: ${assessment.physicalSymptoms?.join(', ')}
• وضعیت عاطفی: ${assessment.emotionalState?.join(', ')}

**بافت اجتماعی-فرهنگی:**
• سن: ${assessment.age} | جنسیت: ${assessment.gender}
• وضعیت رابطه: ${assessment.relationshipStatus} | زندگی: ${assessment.livingStatus}
• کار: ${assessment.workStatus} | تحصیلات: ${assessment.education}
• قومیت: ${assessment.ethnicity} | مذهب: ${assessment.religion}
• زبان: ${assessment.language} | محل سکونت: ${assessment.location}`

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]

    console.log('Phase 1: Generating basic disorder information...')

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.public.openRouterApiKey}`,
        'HTTP-Referer': config.public.appUrl || 'http://localhost:4000',
        'X-Title': 'DSM-5 Phase 1 - Basic Disorders',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-saba',
        messages: messages,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'phase1_basic_disorders',
            schema: phase1Schema,
          },
        },
        temperature: 0.1,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      throw new Error(`Phase 1 API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Phase 1 API response:', data)

    const content = data.choices?.[0]?.message?.content
    if (!content) {
      throw new Error('Phase 1: No content received from API')
    }

    console.log('Phase 1 raw content:', content)
    console.log('Phase 1 content type:', typeof content)

    // Check if content looks like valid JSON before parsing
    if (typeof content === 'string') {
      // Basic validation: should start with { and end with }
      const trimmedContent = content.trim()
      if (!trimmedContent.startsWith('{') || !trimmedContent.endsWith('}')) {
        console.error('Phase 1: Content does not look like valid JSON:', content)
        throw new Error('Phase 1: Response does not appear to be valid JSON')
      }

      // Check for obvious truncation issues
      if (trimmedContent.includes('agnostic features...') || trimmedContent.length < 100) {
        console.error('Phase 1: Content appears to be truncated:', content)
        throw new Error('Phase 1: API response appears to be truncated or incomplete')
      }
    }

    let result
    try {
      result = typeof content === 'string' ? JSON.parse(content) : content
    }
    catch (parseError) {
      console.error('Phase 1 JSON parse error. Content was:', content)
      throw new Error(`Phase 1: Invalid JSON response - ${parseError.message}`)
    }

    console.log('Phase 1 parsed result:', result)

    if (!result.suggestedDisordersToInvestigate) {
      throw new Error('Phase 1: Missing suggestedDisordersToInvestigate in response')
    }

    return result.suggestedDisordersToInvestigate
  }

  const generatePhase2DetailedFeatures = async (phase1Results: any[], assessment: TherapyAssessment, sessionNumber: number): Promise<any[]> => {
    // Create phase 2 schema for detailed features only
    const phase2Schema = {
      type: 'object',
      additionalProperties: false,
      properties: {
        enhancedDisorders: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              categoryTitle: { type: 'string' },
              disorders: {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    code: { type: 'string' },
                    diagnosisCriteria: {
                      type: 'array',
                      items: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          alphabet: { type: 'string' },
                          description: { type: 'string' },
                          subsets: {
                            type: 'array',
                            items: {
                              type: 'object',
                              additionalProperties: false,
                              properties: {
                                number: { type: 'string' },
                                description: { type: 'string' },
                              },
                              required: ['number', 'description'],
                            },
                          },
                        },
                        required: ['alphabet', 'description'],
                      },
                    },
                    specifiers: {
                      type: 'array',
                      items: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          title: { type: 'string' },
                          conditions: {
                            type: 'array',
                            items: { type: 'string' },
                          },
                        },
                        required: ['title', 'conditions'],
                      },
                    },
                    diagnosticFeatures: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        core_symptoms: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            mandatory: {
                              type: 'array',
                              items: {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  symptom: { type: 'string' },
                                  description: { type: 'string' },
                                  quantification: { type: 'string' },
                                },
                                required: ['symptom', 'description', 'quantification'],
                              },
                            },
                            associated: {
                              type: 'array',
                              items: {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  symptom: { type: 'string' },
                                  description: { type: 'string' },
                                  category: {
                                    type: 'string',
                                    enum: ['mood', 'anxiety', 'behavioral', 'somatic'],
                                  },
                                },
                                required: ['symptom', 'description', 'category'],
                              },
                            },
                            exclusion_criteria: { type: 'string' },
                          },
                        },
                        temporal_pattern: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            duration: { type: 'string' },
                            frequency: { type: 'string' },
                            onset: { type: 'string' },
                            remission: { type: 'string' },
                            symptom_free_period: {
                              type: 'object',
                              additionalProperties: false,
                              properties: {
                                required: { type: 'boolean' },
                                description: { type: 'string' },
                              },
                            },
                          },
                        },
                        functional_impairment: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            required: { type: 'boolean' },
                            domains: {
                              type: 'array',
                              items: {
                                type: 'string',
                                enum: ['occupational', 'social', 'academic', 'interpersonal'],
                              },
                            },
                            severity_levels: {
                              type: 'array',
                              items: {
                                type: 'string',
                                enum: ['mild', 'moderate', 'severe'],
                              },
                            },
                          },
                        },
                        contextual_factors: {
                          type: 'array',
                          items: {
                            type: 'object',
                            additionalProperties: false,
                            properties: {
                              factor: { type: 'string' },
                              impact_description: { type: 'string' },
                              type: {
                                type: 'string',
                                enum: [
                                  'cultural_background', 'gender_roles', 'religious_beliefs', 'social_tolerance',
                                  'socioeconomic_status', 'family_dynamics', 'life_stressors', 'migration_status',
                                  'medical_context', 'environmental_triggers', 'developmental_stage', 'sexual_orientation',
                                  'disability_status', 'trauma_history', 'occupational_demands', 'educational_background',
                                  'language_barriers', 'acculturation_level', 'community_support', 'political_climate',
                                  'generational_differences', 'healthcare_access', 'nutritional_status', 'substance_use_patterns',
                                  'media_influences',
                                ],
                              },
                            },
                            required: ['factor', 'impact_description', 'type'],
                          },
                        },
                        differential_diagnostics: {
                          type: 'array',
                          items: {
                            type: 'object',
                            additionalProperties: false,
                            properties: {
                              disorder: { type: 'string' },
                              distinguishing_features: {
                                type: 'array',
                                items: {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    feature: { type: 'string' },
                                    comparison: { type: 'string' },
                                  },
                                  required: ['feature', 'comparison'],
                                },
                              },
                            },
                            required: ['disorder', 'distinguishing_features'],
                          },
                        },
                      },
                    },
                    diagnosticMarkers: {
                      type: 'array',
                      items: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          name: {
                            type: 'string',
                            enum: ['biological', 'neurophysiological', 'cognitive_behavioral', 'digital', 'other'],
                          },
                          subtype: {
                            type: 'array',
                            items: { type: 'string' },
                          },
                        },
                        required: ['name', 'subtype'],
                      },
                    },
                    associated_features: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        supporting_symptoms: {
                          type: 'array',
                          items: { type: 'string' },
                        },
                        demographic_patterns: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            age_onset: { type: 'string' },
                            gender_distribution: { type: 'string' },
                            cultural_variations: { type: 'string' },
                          },
                        },
                        common_comorbidities: {
                          type: 'array',
                          items: { type: 'string' },
                        },
                        functional_impacts: {
                          type: 'array',
                          items: { type: 'string' },
                        },
                        developmental_course: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            typical_progression: { type: 'string' },
                            risk_factors: {
                              type: 'array',
                              items: { type: 'string' },
                            },
                          },
                        },
                        biological_findings: {
                          type: 'array',
                          items: { type: 'string' },
                        },
                        cognitive_emotional_patterns: {
                          type: 'array',
                          items: { type: 'string' },
                        },
                        cultural_manifestations: {
                          type: 'array',
                          items: { type: 'string' },
                        },
                      },
                    },
                    riskAndPrognosticFactors: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        Environmental: { type: 'string' },
                        geneticAndPhysiological: { type: 'string' },
                      },
                    },
                    cultureRelatedDiagnosticIssues: {
                      type: 'object',
                      additionalProperties: false,
                    },
                    genderRelatedDiagnosticIssues: {
                      type: 'object',
                      additionalProperties: false,
                    },
                    differentialDiagnosis: {
                      type: 'object',
                      additionalProperties: false,
                    },
                    comorbidity: {
                      type: 'object',
                      additionalProperties: false,
                    },
                  },
                  required: ['code'],
                },
              },
            },
            required: ['categoryTitle', 'disorders'],
          },
        },
      },
      required: ['enhancedDisorders'],
    }

    const systemPrompt = `شما یک روانشناس متخصص در تشخیص اختلالات روانی بر اساس DSM-5 هستید.

**فاز 2: افزودن جزئیات پیشرفته تشخیصی**

برای هر اختلال در لیست ارائه شده، موارد پیشرفته کامل زیر را بدون خلاصه‌سازی اضافه کنید:

- diagnosisCriteria: لیست کامل معیارهای تشخیصی DSM-5 با حروف الفبا (A, B, C,...) و زیرمجموعه‌های عددی دقیق
- specifiers: مشخصه‌های کامل DSM-5 برای این اختلال
- diagnosticFeatures: ویژگی‌های تشخیصی کامل شامل:
  * core_symptoms (علائم اصلی اجباری و مرتبط)
  * temporal_pattern (الگوهای زمانی دقیق)
  * functional_impairment (اختلال عملکردی)
  * contextual_factors (عوامل فرهنگی و محیطی)
  * differential_diagnostics (تشخیص افتراقی)
- diagnosticMarkers: نشانگرهای تشخیصی (بیولوژیک، نوروفیزیولوژیک، رفتاری-شناختی، دیجیتال، سایر)
- associated_features: ویژگی‌های مرتبط کامل
- riskAndPrognosticFactors: عوامل خطر و پیش‌آگهی (محیطی و ژنتیکی-فیزیولوژیک)
- cultureRelatedDiagnosticIssues: مسائل تشخیصی مرتبط با فرهنگ
- genderRelatedDiagnosticIssues: مسائل تشخیصی مرتبط با جنسیت
- differentialDiagnosis: تشخیص افتراقی کامل
- comorbidity: اختلالات همزمان

**مهم**: تمام اطلاعات باید کامل، دقیق، و بدون خلاصه‌سازی باشند. هر فیلد باید حاوی اطلاعات جامع باشد.

پاسخ فقط JSON باشد - هیچ متن اضافی ندهید.`

    // Prepare disorders list for Phase 2
    const disordersList = phase1Results.map(category => ({
      categoryTitle: category.categoryTitle,
      disorders: category.disorders.map(disorder => ({
        code: disorder.code,
        title: disorder.title,
      })),
    }))

    const userPrompt = `برای اختلالات زیر، جزئیات پیشرفته تشخیصی را اضافه کنید:

${disordersList.map(cat => `**${cat.categoryTitle}:**\n${cat.disorders.map(d => `- ${d.code}: ${d.title}`).join('\n')}`).join('\n\n')}

**بافت بیمار برای تنظیم جزئیات:**
• قومیت: ${assessment.ethnicity} | مذهب: ${assessment.religion}
• جنسیت: ${assessment.gender} | سن: ${assessment.age}
• وضعیت اجتماعی: ${assessment.relationshipStatus} | شغل: ${assessment.workStatus}`

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]

    console.log('Phase 2: Adding detailed diagnostic features...')

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.public.openRouterApiKey}`,
        'HTTP-Referer': config.public.appUrl || 'http://localhost:4000',
        'X-Title': 'DSM-5 Phase 2 - Detailed Features',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-saba',
        messages: messages,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'phase2_detailed_features',
            schema: phase2Schema,
          },
        },
        temperature: 0.7,
        max_tokens: 0,
      }),
    })

    if (!response.ok) {
      throw new Error(`Phase 2 API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Phase 2 API response:', data)

    const content = data.choices?.[0]?.message?.content
    if (!content) {
      throw new Error('Phase 2: No content received from API')
    }

    console.log('Phase 2 raw content:', content)
    console.log('Phase 2 content type:', typeof content)

    let result
    try {
      result = typeof content === 'string' ? JSON.parse(content) : content
    }
    catch (parseError) {
      console.error('Phase 2 JSON parse error. Content was:', content)
      throw new Error(`Phase 2: Invalid JSON response - ${parseError.message}`)
    }

    console.log('Phase 2 parsed result:', result)

    // Merge Phase 1 and Phase 2 results
    return phase1Results.map((category) => {
      const enhancedCategory = result.enhancedDisorders?.find(ecat => ecat.categoryTitle === category.categoryTitle)

      if (enhancedCategory) {
        return {
          ...category,
          disorders: category.disorders.map((disorder) => {
            const enhancedDisorder = enhancedCategory.disorders?.find(ed => ed.code === disorder.code)
            return enhancedDisorder ? { ...disorder, ...enhancedDisorder } : disorder
          }),
        }
      }

      return category
    })
  }

  // DSM-5 Categories for systematic evaluation
  const DSM5_CATEGORIES = [
    'Neurodevelopmental Disorders',
    'Schizophrenia Spectrum and Other Psychotic Disorders',
    'Bipolar and Related Disorders',
    'Depressive Disorders',
    'Anxiety Disorders',
    'Obsessive-Compulsive and Related Disorders',
    'Trauma- and Stressor-Related Disorders',
    'Dissociative Disorders',
    'Somatic Symptom and Related Disorders',
    'Feeding and Eating Disorders',
    'Elimination Disorders',
    'Sleep-Wake Disorders',
    'Sexual Dysfunctions',
    'Gender Dysphoria',
    'Disruptive, Impulse-Control, and Conduct Disorders',
    'Substance-Related and Addictive Disorders',
    'Neurocognitive Disorders',
    'Personality Disorders',
    'Paraphilic Disorders',
    'Other Mental Disorders',
    'Medication-Induced Movement Disorders and Other Adverse Effects of Medication',
    'Other Conditions That May Be a Focus of Clinical Attention',
  ]

  const analyzeDSM5Categories = (assessment: TherapyAssessment) => {
    const categoryScores: { [key: string]: number } = {}
    const categoryEvidence: { [key: string]: string[] } = {}

    // Analyze each category based on assessment data
    DSM5_CATEGORIES.forEach((category) => {
      categoryScores[category] = 0
      categoryEvidence[category] = []
    })

    // Depressive Disorders analysis
    if (assessment.mood === 'low' || assessment.mood === 'very-low') {
      categoryScores['Depressive Disorders'] += 0.4
      categoryEvidence['Depressive Disorders'].push('خلق پایین گزارش شده')
    }
    if (assessment.energyLevel <= 2) {
      categoryScores['Depressive Disorders'] += 0.2
      categoryEvidence['Depressive Disorders'].push('سطح انرژی پایین')
    }
    if (assessment.motivationLevel <= 2) {
      categoryScores['Depressive Disorders'] += 0.2
      categoryEvidence['Depressive Disorders'].push('انگیزه پایین')
    }
    if (assessment.sleepQuality <= 2) {
      categoryScores['Depressive Disorders'] += 0.15
      categoryEvidence['Depressive Disorders'].push('کیفیت خواب ضعیف')
    }
    if (assessment.concentrationLevel <= 2) {
      categoryScores['Depressive Disorders'] += 0.15
      categoryEvidence['Depressive Disorders'].push('مشکلات تمرکز')
    }

    // Anxiety Disorders analysis
    if (assessment.anxietyLevel >= 4) {
      categoryScores['Anxiety Disorders'] += 0.4
      categoryEvidence['Anxiety Disorders'].push('سطح اضطراب بالا')
    }
    if (assessment.stressLevel >= 4) {
      categoryScores['Anxiety Disorders'] += 0.2
      categoryEvidence['Anxiety Disorders'].push('سطح استرس بالا')
    }
    if (assessment.physicalSymptoms?.includes('تپش قلب') || assessment.physicalSymptoms?.includes('تنگی نفس')) {
      categoryScores['Anxiety Disorders'] += 0.25
      categoryEvidence['Anxiety Disorders'].push('علائم جسمانی اضطراب')
    }

    // Trauma-and Stressor-Related Disorders
    if (assessment.triggerEvents && assessment.triggerEvents.length > 0) {
      categoryScores['Trauma- and Stressor-Related Disorders'] += 0.3
      categoryEvidence['Trauma- and Stressor-Related Disorders'].push('وجود رویدادهای محرک')
    }
    if (assessment.sleepQuality <= 2 && assessment.anxietyLevel >= 4) {
      categoryScores['Trauma- and Stressor-Related Disorders'] += 0.2
      categoryEvidence['Trauma- and Stressor-Related Disorders'].push('اختلال خواب همراه اضطراب')
    }

    // Sleep-Wake Disorders
    if (assessment.sleepQuality <= 2) {
      categoryScores['Sleep-Wake Disorders'] += 0.35
      categoryEvidence['Sleep-Wake Disorders'].push('کیفیت خواب بسیار ضعیف')
    }

    // Somatic Symptom Disorders
    if (assessment.physicalSymptoms && assessment.physicalSymptoms.length >= 3) {
      categoryScores['Somatic Symptom and Related Disorders'] += 0.3
      categoryEvidence['Somatic Symptom and Related Disorders'].push('علائم جسمانی متعدد')
    }

    // Bipolar screening (if mood variability or high energy despite problems)
    if ((assessment.mood === 'excellent' && (assessment.anxietyLevel >= 4 || assessment.stressLevel >= 4))
      || (assessment.energyLevel >= 4 && assessment.sleepQuality <= 2)) {
      categoryScores['Bipolar and Related Disorders'] += 0.25
      categoryEvidence['Bipolar and Related Disorders'].push('الگوهای متناقض خلقی/انرژی')
    }

    // Substance-Related screening
    if (assessment.copingMethods?.some(method =>
      method.includes('الکل') || method.includes('سیگار') || method.includes('مواد'))) {
      categoryScores['Substance-Related and Addictive Disorders'] += 0.3
      categoryEvidence['Substance-Related and Addictive Disorders'].push('استفاده از مواد کنترل استرس')
    }

    // Other Conditions (relationship, work, social issues)
    if (assessment.relationshipStatus === 'complicated' || assessment.relationshipStatus === 'divorced') {
      categoryScores['Other Conditions That May Be a Focus of Clinical Attention'] += 0.2
      categoryEvidence['Other Conditions That May Be a Focus of Clinical Attention'].push('مسائل رابطه‌ای')
    }
    if (assessment.workStatus === 'unemployed') {
      categoryScores['Other Conditions That May Be a Focus of Clinical Attention'] += 0.15
      categoryEvidence['Other Conditions That May Be a Focus of Clinical Attention'].push('مسائل شغلی')
    }

    // Sort categories by score and return top 5
    return Object.entries(categoryScores)
      .filter(([_, score]) => score > 0.1) // Only include categories with meaningful scores
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, score]) => ({
        category,
        likelihood: Math.min(score, 1), // Cap at 1.0
        evidence: categoryEvidence[category],
      }))
  }

  const generateComorbidityScreeningGoal = (assessment: TherapyAssessment): any => {
    return {
      goal_type: 'diagnostic',
      title: 'غربالگری اختلالات همزمان',
      description: 'بررسی سیستماتیک اختلالات روانی همزمان با سوالات ساده و مستقیم',
      target_behaviors: [
        'پرسیدن سوالات غربالگری برای اختلالات شایع',
        'بررسی علائم اضطرابی، افسردگی و مانیا',
        'ارزیابی مصرف مواد و اختلالات خوردن',
        'شناسایی علائم اختلالات پسیکوتیک',
      ],
      success_criteria: [
        'تکمیل غربالگری اختلالات اصلی',
        'تعیین نیاز به ارزیابی بیشتر',
        'اولویت‌بندی اختلالات احتمالی',
        'برنامه‌ریزی ارزیابی‌های تخصصی',
      ],
      priority: 'high',
      dsm5_criteria: [
        {
          disorder_code: '300.02',
          disorder_name: 'اختلال اضطراب عمومی',
          criteria: [
            {
              criterion_letter: 'الف',
              criterion_text: 'اضطراب و نگرانی بیش از حد در مورد تعدادی رویداد یا فعالیت، برای حداقل شش ماه، در اکثر روزها',
            },
            {
              criterion_letter: 'ب',
              criterion_text: 'فرد نمی‌تواند این نگرانی را کنترل کند',
            },
            {
              criterion_letter: 'ج',
              criterion_text: 'اضطراب و نگرانی با سه (یا بیشتر) علامت زیر همراه است: 1. بی‌قراری 2. خستگی آسان 3. مشکل تمرکز 4. تحریک‌پذیری 5. تنش عضلانی 6. اختلال خواب',
            },
          ],
        },
      ],
      icd11_criteria: [
        {
          disorder_code: '6B00',
          disorder_name: 'اختلال اضطراب عمومی',
          description: 'اضطراب مداوم، منتشر، غیرقابل کنترل برای چندین ماه (حداقل 6 ماه) با علائم جسمانی و روانی مانند تنش عضلانی، بی‌قراری، خستگی، مشکل تمرکز',
        },
      ],
      assessment_areas: [
        'اختلالات خلقی',
        'اختلالات اضطرابی',
        'مصرف مواد',
        'اختلالات خوردن',
        'علائم پسیکوتیک',
      ],
      action_plan: [
        'مرحله 1: غربالگری اختلالات خلقی (10 دقیقه)',
        'مرحله 2: غربالگری اختلالات اضطرابی (10 دقیقه)',
        'مرحله 3: بررسی مصرف مواد و الکل (5 دقیقه)',
        'مرحله 4: غربالگری اختلالات خوردن (5 دقیقه)',
        'مرحله 5: بررسی علائم پسیکوتیک (5 دقیقه)',
      ],
      main_cc_investigation: [
        'آیا علائم اضطراب همراه با شکایت اصلی وجود دارد؟',
        'آیا دوره‌هایی از خلق بالا یا پایین داشته‌اید؟',
        'آیا تجربه‌های صدا شنیدن یا دیدن چیزهای غیرواقعی داشته‌اید؟',
        'آیا مشکلی در خوردن، رژیم یا وزن دارید؟',
        'آیا مشکلی با الکل، دخانیات یا مواد مخدر دارید؟',
      ],
      comorbidity_investigation: [
        'اختلال اضطراب عمومی (GAD)',
        'اختلال پانیک',
        'اختلال وسواسی-اجباری (OCD)',
        'اختلال دوقطبی',
        'اختلالات مصرف مواد',
        'اختلالات خوردن',
        'اختلال استرس پس از سانحه (PTSD)',
      ],
      clinical_interview_focus: [
        'SCID-5-RV برای اختلالات مرتبط و کمک‌تشخیصی',
        'استفاده از ابزارهای غربالگری معتبر (GAD-7, PHQ-9, CAGE)',
        'MINI International Neuropsychiatric Interview',
        'ارزیابی اولویت‌بندی شده بر اساس شدت علائم',
        'برنامه‌ریزی ارزیابی‌های تخصصی بیشتر',
      ],
    }
  }

  return {
    getSessionGoals,
    getGoalsByUser,
    updateGoalProgress,
    completeGoal,
    saveGoal,
    saveGoals,
    getGoalStatusColor,
    getGoalStatusLabel,
    getGoalPriorityColor,
    getGoalPriorityLabel,
    generateDiagnosisGoals,
  }
}
