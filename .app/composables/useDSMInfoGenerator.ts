import { useNuxtApp } from '#app'
import { ref, readonly, computed } from 'vue'

export interface DiagnosisCriterion {
  alphabet: string
  description: string
  subsets: CriterionSubset[]
}

export interface CriterionSubset {
  number: string
  description: string
}

export interface Specifier {
  title: string
  conditions: string[]
}

export interface DiagnosticFeature {
  title: string
  description: string
}

export interface AssociatedFeature {
  category: string
  items: string[]
}

export interface DiagnosticMarker {
  category: string
  markers: string[]
}

export interface DifferentialDiagnosis {
  disorder: string
  disorderEn: string
  code: string
  differentiatingFeatures: string[]
}

export interface RiskAndPrognosticFactor {
  category: string
  factors: string[]
}

export interface CultureRelatedDiagnosticIssue {
  aspect: string
  considerations: string[]
}

export interface GenderRelatedDiagnosticIssue {
  aspect: string
  considerations: string[]
}

export interface DisorderInfo {
  code: string
  title: string
  titleEn: string
  description: string
  minimumCriteria: string
  specialNote: string
  Prevalence: string
  developmentAndCourse: string
  suicideRisk: string
  diagnosisCriteria: DiagnosisCriterion[]
  specifiers: Specifier[]
  diagnosticFeatures: DiagnosticFeature[]
  associated_features: AssociatedFeature[]
  diagnosticMarkers: DiagnosticMarker[]
  differentialDiagnosis: DifferentialDiagnosis[]
  riskAndPrognosticFactors: RiskAndPrognosticFactor[]
  cultureRelatedDiagnosticIssues: CultureRelatedDiagnosticIssue[]
  genderRelatedDiagnosticIssues: GenderRelatedDiagnosticIssue[]
}

// Define section names for detailed progress tracking
export const DISORDER_SECTIONS = [
  { id: 'basicInfo', name: 'اطلاعات کلی', nameEn: 'Basic Info' },
  { id: 'diagnosisCriteria', name: 'معیارهای تشخیصی', nameEn: 'Diagnosis Criteria' },
  { id: 'specifiers', name: 'مشخص‌کننده‌ها', nameEn: 'Specifiers' },
  { id: 'diagnosticFeatures', name: 'ویژگی‌های تشخیصی', nameEn: 'Diagnostic Features' },
  { id: 'associatedFeatures', name: 'ویژگی‌های همراه', nameEn: 'Associated Features' },
  { id: 'diagnosticMarkers', name: 'نشانگرهای تشخیصی', nameEn: 'Diagnostic Markers' },
  { id: 'differentialDiagnosis', name: 'تشخیص افتراقی', nameEn: 'Differential Diagnosis' },
  { id: 'riskFactors', name: 'عوامل خطر', nameEn: 'Risk Factors' },
  { id: 'cultureIssues', name: 'مسائل فرهنگی', nameEn: 'Culture Issues' },
  { id: 'genderIssues', name: 'مسائل جنسیتی', nameEn: 'Gender Issues' }
] as const

export type SectionId = typeof DISORDER_SECTIONS[number]['id']

export interface DisorderProgress {
  disorderName: string
  categoryTitle: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error?: string
  sections: Record<SectionId, {
    status: 'pending' | 'processing' | 'completed' | 'failed'
    error?: string
    startTime?: number
    endTime?: number
  }>
  startTime?: number
  endTime?: number
}

export const useDSMInfoGenerator = () => {
  const nuxtApp = useNuxtApp()
  const error = ref<string | null>(null)
  const processing = ref(false)
  const disorderProgress = ref<Map<string, DisorderProgress>>(new Map())

  const generateBasicInfo = async (disorderEnglishName: string) => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useRuntimeConfig().public.openRouterApiKey}`,
          'X-Title': 'DSM-5 Basic Info Generator',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-saba',
          messages: [
            {
              role: 'system',
              content: 'شما یک متخصص روانشناسی بالینی هستید که اطلاعات دقیق و کامل DSM-5 ارائه می‌دهید. هیچ‌گونه خلاصه‌سازی نکنید. تمام جزئیات را کامل و بدون حذف به زبان فارسی ارائه دهید. فقط در صورت درخواست صریح از زبان انگلیسی استفاده کنید.'
            },
            {
              role: 'user',
              content: `لطفا اطلاعات کامل و غیرخلاصه شده اختلال "${disorderEnglishName}" را بر اساس DSM-5 ارائه دهید. معیارهای حداقلی باید کامل و جزئی باشد، نه خلاصه. 

**مهم: فقط JSON معتبر و کامل ارائه دهید. هیچ متن اضافی قبل یا بعد از JSON نباشد. JSON باید دقیقاً با { شروع و با } تمام شود.**`
            }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'basic_disorder_info',
              schema: {
                type: 'object',
                properties: {
                  code: {
                    type: 'string',
                    description: 'DSM-5 diagnostic code (e.g., 315.8 (F88))'
                  },
                  title: {
                    type: 'string',
                    description: 'Persian/Farsi title of the disorder'
                  },
                  titleEn: {
                    type: 'string',
                    description: 'English title of the disorder'
                  },
                  description: {
                    type: 'string',
                    description: 'Comprehensive description in Persian'
                  },
                  minimumCriteria: {
                    type: 'string',
                    description: 'Minimum diagnostic criteria in Persian'
                  },
                  specialNote: {
                    type: 'string',
                    description: 'Special diagnostic notes in Persian'
                  },
                  Prevalence: {
                    type: 'string',
                    description: 'Prevalence rate'
                  },
                  developmentAndCourse: {
                    type: 'string',
                    description: 'Development and course information in Persian'
                  },
                  suicideRisk: {
                    type: 'string',
                    description: 'Suicide risk level in Persian'
                  }
                },
                required: ['code', 'title', 'titleEn', 'description', 'minimumCriteria', 'specialNote', 'Prevalence', 'developmentAndCourse', 'suicideRisk']
              }
            }
          },
          temperature: 0.8,
          max_tokens: 6000
        })
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      const content = data.choices[0].message.content
      return typeof content === 'string' ? parseJSONSafely(content) : content
    } catch (e: any) {
      console.error('Error generating basic info:', e)
      throw e
    }
  }

  const generateDiagnosisCriteria = async (disorderEnglishName: string) => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useRuntimeConfig().public.openRouterApiKey}`,
          'X-Title': 'DSM-5 Diagnosis Criteria Generator',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-saba',
          messages: [
            {
              role: 'system',
              content: 'شما یک متخصص روانشناسی بالینی هستید. معیارهای تشخیصی DSM-5 را بدون هیچ‌گونه خلاصه‌سازی، کامل و دقیق به زبان فارسی ارائه دهید. هر معیار و زیرمعیار باید کامل باشد. فقط در صورت درخواست صریح از زبان انگلیسی استفاده کنید.'
            },
            {
              role: 'user',
              content: `لطفا معیارهای تشخیصی کامل و غیرخلاصه شده DSM-5 برای اختلال "${disorderEnglishName}" را ارائه دهید. هیچ جزئیات را حذف نکنید. تمام معیارهای A، B، C، D و غیره باید کامل باشد.

**مهم: فقط JSON معتبر و کامل ارائه دهید. هیچ متن اضافی، توضیح، یا نظر قبل یا بعد از JSON نباشد.**`
            }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'diagnosis_criteria',
              schema: {
                type: 'object',
                properties: {
                  diagnosisCriteria: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        alphabet: {
                          type: 'string',
                          description: 'Criterion letter (A, B, C, etc.)'
                        },
                        description: {
                          type: 'string',
                          description: 'Main criterion description in Persian'
                        },
                        subsets: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              number: {
                                type: 'string',
                                description: 'Subset number'
                              },
                              description: {
                                type: 'string',
                                description: 'Subset description in Persian'
                              }
                            },
                            required: ['number', 'description']
                          }
                        }
                      },
                      required: ['alphabet', 'description', 'subsets']
                    },
                    minItems: 3,
                    maxItems: 8
                  }
                },
                required: ['diagnosisCriteria']
              }
            }
          },
          temperature: 0.8,
          max_tokens: 4000
        })
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      const content = data.choices[0].message.content
      return typeof content === 'string' ? parseJSONSafely(content) : content
    } catch (e: any) {
      console.error('Error generating diagnosis criteria:', e)
      throw e
    }
  }

  const generateSpecifiers = async (disorderEnglishName: string) => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useRuntimeConfig().public.openRouterApiKey}`,
          'X-Title': 'DSM-5 Specifiers Generator',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-saba',
          messages: [
            {
              role: 'system',
              content: 'شما یک متخصص روانشناسی بالینی هستید. مشخص‌کننده‌های DSM-5 را بدون خلاصه‌سازی، کامل و جامع به زبان فارسی ارائه دهید. فقط در صورت درخواست صریح از زبان انگلیسی استفاده کنید.'
            },
            {
              role: 'user',
              content: `لطفا تمام مشخص‌کننده‌های (Specifiers) DSM-5 برای اختلال "${disorderEnglishName}" را بدون هیچ‌گونه حذفیات کامل ارائه دهید.

**مهم: فقط JSON معتبر ارائه دهید. بدون هیچ متن اضافی.**`
            }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'specifiers',
              schema: {
                type: 'object',
                properties: {
                  specifiers: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: {
                          type: 'string',
                          description: 'Specifier title in Persian'
                        },
                        conditions: {
                          type: 'array',
                          items: {
                            type: 'string'
                          },
                          description: 'List of conditions in Persian'
                        }
                      },
                      required: ['title', 'conditions']
                    },
                    minItems: 1,
                    maxItems: 5
                  }
                },
                required: ['specifiers']
              }
            }
          },
          temperature: 0.8,
          max_tokens: 4000
        })
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      const content = data.choices[0].message.content
      return typeof content === 'string' ? parseJSONSafely(content) : content
    } catch (e: any) {
      console.error('Error generating specifiers:', e)
      throw e
    }
  }

  const generateDiagnosticFeatures = async (disorderEnglishName: string) => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useRuntimeConfig().public.openRouterApiKey}`,
          'X-Title': 'DSM-5 Diagnostic Features Generator',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-saba',
          messages: [
            {
              role: 'system',
              content: 'شما یک متخصص روانشناسی بالینی هستید. ویژگی‌های تشخیصی DSM-5 را بدون خلاصه‌سازی، کامل و با تمام جزئیات به زبان فارسی ارائه دهید. فقط در صورت درخواست صریح از زبان انگلیسی استفاده کنید.'
            },
            {
              role: 'user',
              content: `لطفا تمام ویژگی‌های تشخیصی (Diagnostic Features) DSM-5 برای اختلال "${disorderEnglishName}" را بدون حذف هیچ‌گونه جزئیات ارائه دهید.

**مهم: فقط JSON معتبر ارائه دهید.**`
            }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'diagnostic_features',
              schema: {
                type: 'object',
                properties: {
                  diagnosticFeatures: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: {
                          type: 'string',
                          description: 'Feature title in Persian'
                        },
                        description: {
                          type: 'string',
                          description: 'Feature description in Persian'
                        }
                      },
                      required: ['title', 'description']
                    },
                    minItems: 3,
                    maxItems: 8
                  }
                },
                required: ['diagnosticFeatures']
              }
            }
          },
          temperature: 0.8,
          max_tokens: 6000
        })
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      const content = data.choices[0].message.content
      return typeof content === 'string' ? parseJSONSafely(content) : content
    } catch (e: any) {
      console.error('Error generating diagnostic features:', e)
      throw e
    }
  }

  const generateAssociatedFeatures = async (disorderEnglishName: string) => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useRuntimeConfig().public.openRouterApiKey}`,
          'X-Title': 'DSM-5 Associated Features Generator',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-saba',
          messages: [
            {
              role: 'system',
              content: 'شما یک متخصص روانشناسی بالینی هستید. ویژگی‌های همراه DSM-5 را به زبان فارسی ارائه دهید. فقط در صورت درخواست صریح از زبان انگلیسی استفاده کنید.'
            },
            {
              role: 'user',
              content: `لطفا ویژگی‌های همراه (Associated Features) DSM-5 برای اختلال "${disorderEnglishName}" را دسته‌بندی شده ارائه دهید.

**مهم: فقط JSON معتبر ارائه دهید.**`
            }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'associated_features',
              schema: {
                type: 'object',
                properties: {
                  associated_features: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        category: {
                          type: 'string',
                          description: 'Category name in Persian'
                        },
                        items: {
                          type: 'array',
                          items: {
                            type: 'string'
                          },
                          description: 'List of features in this category'
                        }
                      },
                      required: ['category', 'items']
                    },
                    minItems: 2,
                    maxItems: 6
                  }
                },
                required: ['associated_features']
              }
            }
          },
          temperature: 0.8,
          max_tokens: 3000
        })
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      const content = data.choices[0].message.content
      return typeof content === 'string' ? parseJSONSafely(content) : content
    } catch (e: any) {
      console.error('Error generating associated features:', e)
      throw e
    }
  }

  const generateDiagnosticMarkers = async (disorderEnglishName: string) => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useRuntimeConfig().public.openRouterApiKey}`,
          'X-Title': 'DSM-5 Diagnostic Markers Generator',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-saba',
          messages: [
            {
              role: 'system',
              content: 'شما یک متخصص روانشناسی بالینی هستید. نشانگرهای تشخیصی DSM-5 را به زبان فارسی ارائه دهید. فقط در صورت درخواست صریح از زبان انگلیسی استفاده کنید.'
            },
            {
              role: 'user',
              content: `لطفا نشانگرهای تشخیصی (Diagnostic Markers) DSM-5 برای اختلال "${disorderEnglishName}" را دسته‌بندی شده ارائه دهید.

**مهم: فقط JSON معتبر ارائه دهید.**`
            }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'diagnostic_markers',
              schema: {
                type: 'object',
                properties: {
                  diagnosticMarkers: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        category: {
                          type: 'string',
                          description: 'Marker category in Persian'
                        },
                        markers: {
                          type: 'array',
                          items: {
                            type: 'string'
                          },
                          description: 'List of markers in this category'
                        }
                      },
                      required: ['category', 'markers']
                    },
                    minItems: 1,
                    maxItems: 5
                  }
                },
                required: ['diagnosticMarkers']
              }
            }
          },
          temperature: 0.8,
          max_tokens: 3000
        })
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      const content = data.choices[0].message.content
      return typeof content === 'string' ? parseJSONSafely(content) : content
    } catch (e: any) {
      console.error('Error generating diagnostic markers:', e)
      throw e
    }
  }

  const generateDifferentialDiagnosis = async (disorderEnglishName: string) => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useRuntimeConfig().public.openRouterApiKey}`,
          'X-Title': 'DSM-5 Differential Diagnosis Generator',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-saba',
          messages: [
            {
              role: 'system',
              content: 'شما یک متخصص روانشناسی بالینی هستید. تشخیص افتراقی DSM-5 را بدون خلاصه‌سازی، کامل و جامع به زبان فارسی ارائه دهید. تمام اختلالات مشابه و ویژگی‌های متمایزکننده را ذکر کنید. فقط در صورت درخواست صریح از زبان انگلیسی استفاده کنید.'
            },
            {
              role: 'user',
              content: `لطفا تشخیص افتراقی (Differential Diagnosis) کامل DSM-5 برای اختلال "${disorderEnglishName}" را ارائه دهید. تمام اختلالات مشابه، کدهای DSM-5 و ویژگی‌های متمایزکننده را بدون حذف ارائه دهید.

**مهم: فقط JSON معتبر ارائه دهید.**`
            }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'differential_diagnosis',
              schema: {
                type: 'object',
                properties: {
                  differentialDiagnosis: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        disorder: {
                          type: 'string',
                          description: 'Persian name of the disorder'
                        },
                        disorderEn: {
                          type: 'string',
                          description: 'English name of the disorder'
                        },
                        code: {
                          type: 'string',
                          description: 'DSM-5 code'
                        },
                        differentiatingFeatures: {
                          type: 'array',
                          items: {
                            type: 'string'
                          },
                          description: 'Differentiating features in Persian'
                        }
                      },
                      required: ['disorder', 'disorderEn', 'code', 'differentiatingFeatures']
                    },
                    minItems: 3,
                    maxItems: 8
                  }
                },
                required: ['differentialDiagnosis']
              }
            }
          },
          temperature: 0.8,
          max_tokens: 6000
        })
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      const content = data.choices[0].message.content
      return typeof content === 'string' ? parseJSONSafely(content) : content
    } catch (e: any) {
      console.error('Error generating differential diagnosis:', e)
      throw e
    }
  }

  const generateRiskAndPrognosticFactors = async (disorderEnglishName: string) => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useRuntimeConfig().public.openRouterApiKey}`,
          'X-Title': 'DSM-5 Risk and Prognostic Factors Generator',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-saba',
          messages: [
            {
              role: 'system',
              content: 'شما یک متخصص روانشناسی بالینی هستید. عوامل خطر و پیش‌آگهی DSM-5 را بدون خلاصه‌سازی، کامل و جامع به زبان فارسی ارائه دهید. تمام عوامل را ذکر کنید. فقط در صورت درخواست صریح از زبان انگلیسی استفاده کنید.'
            },
            {
              role: 'user',
              content: `لطفا تمام عوامل خطر و پیش‌آگهی (Risk and Prognostic Factors) DSM-5 برای اختلال "${disorderEnglishName}" را بدون حذف هیچ عاملی، کامل و دسته‌بندی شده ارائه دهید.

**مهم: فقط JSON معتبر ارائه دهید.**`
            }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'risk_prognostic_factors',
              schema: {
                type: 'object',
                properties: {
                  riskAndPrognosticFactors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        category: {
                          type: 'string',
                          description: 'Factor category in Persian'
                        },
                        factors: {
                          type: 'array',
                          items: {
                            type: 'string'
                          },
                          description: 'List of factors in this category'
                        }
                      },
                      required: ['category', 'factors']
                    },
                    minItems: 2,
                    maxItems: 6
                  }
                },
                required: ['riskAndPrognosticFactors']
              }
            }
          },
          temperature: 0.8,
          max_tokens: 3000
        })
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      const content = data.choices[0].message.content
      return typeof content === 'string' ? parseJSONSafely(content) : content
    } catch (e: any) {
      console.error('Error generating risk and prognostic factors:', e)
      throw e
    }
  }

  const generateCultureRelatedIssues = async (disorderEnglishName: string) => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useRuntimeConfig().public.openRouterApiKey}`,
          'X-Title': 'DSM-5 Culture Related Issues Generator',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-saba',
          messages: [
            {
              role: 'system',
              content: 'شما یک متخصص روانشناسی بالینی هستید. مسائل تشخیصی مرتبط با فرهنگ DSM-5 را بدون خلاصه‌سازی، کامل و جامع به زبان فارسی ارائه دهید. فقط در صورت درخواست صریح از زبان انگلیسی استفاده کنید.'
            },
            {
              role: 'user',
              content: `لطفا تمام مسائل تشخیصی مرتبط با فرهنگ (Culture-Related Diagnostic Issues) DSM-5 برای اختلال "${disorderEnglishName}" را بدون حذف هیچ ملاحظه‌ای، کامل ارائه دهید.

**مهم: فقط JSON معتبر ارائه دهید.**`
            }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'culture_related_issues',
              schema: {
                type: 'object',
                properties: {
                  cultureRelatedDiagnosticIssues: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        aspect: {
                          type: 'string',
                          description: 'Cultural aspect in Persian'
                        },
                        considerations: {
                          type: 'array',
                          items: {
                            type: 'string'
                          },
                          description: 'Cultural considerations in Persian'
                        }
                      },
                      required: ['aspect', 'considerations']
                    },
                    minItems: 2,
                    maxItems: 5
                  }
                },
                required: ['cultureRelatedDiagnosticIssues']
              }
            }
          },
          temperature: 0.8,
          max_tokens: 3000
        })
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      const content = data.choices[0].message.content
      return typeof content === 'string' ? parseJSONSafely(content) : content
    } catch (e: any) {
      console.error('Error generating culture related issues:', e)
      throw e
    }
  }

  const generateGenderRelatedIssues = async (disorderEnglishName: string) => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useRuntimeConfig().public.openRouterApiKey}`,
          'X-Title': 'DSM-5 Gender Related Issues Generator',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-saba',
          messages: [
            {
              role: 'system',
              content: 'شما یک متخصص روانشناسی بالینی هستید. مسائل مرتبط با جنسیت DSM-5 را به زبان فارسی ارائه دهید. فقط در صورت درخواست صریح از زبان انگلیسی استفاده کنید.'
            },
            {
              role: 'user',
              content: `لطفا مسائل تشخیصی مرتبط با جنسیت (Gender-Related Diagnostic Issues) DSM-5 برای اختلال "${disorderEnglishName}" را ارائه دهید.

**مهم: فقط JSON معتبر ارائه دهید.**`
            }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'gender_related_issues',
              schema: {
                type: 'object',
                properties: {
                  genderRelatedDiagnosticIssues: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        aspect: {
                          type: 'string',
                          description: 'Gender aspect in Persian'
                        },
                        considerations: {
                          type: 'array',
                          items: {
                            type: 'string'
                          },
                          description: 'Gender considerations in Persian'
                        }
                      },
                      required: ['aspect', 'considerations']
                    },
                    minItems: 1,
                    maxItems: 4
                  }
                },
                required: ['genderRelatedDiagnosticIssues']
              }
            }
          },
          temperature: 0.8,
          max_tokens: 3000
        })
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      const content = data.choices[0].message.content
      return typeof content === 'string' ? parseJSONSafely(content) : content
    } catch (e: any) {
      console.error('Error generating gender related issues:', e)
      throw e
    }
  }

  const generateCompleteDisorderInfo = async (
    disorderEnglishName: string, 
    categoryTitle?: string,
    enableDetailedProgress: boolean = false
  ): Promise<DisorderInfo> => {
    processing.value = true
    error.value = null

    // Initialize progress tracking if detailed progress is enabled
    if (enableDetailedProgress) {
      initializeDisorderProgress(disorderEnglishName, categoryTitle || 'Unknown Category')
    }

    try {
      console.log(`🧠 Starting generation: ${disorderEnglishName} (${DISORDER_SECTIONS.length} sections)`)
      
      // Update overall status
      if (enableDetailedProgress) {
        updateDisorderStatus(disorderEnglishName, 'processing')
      }

      // Define the generation functions with their corresponding section IDs
      const generationTasks = [
        { sectionId: 'basicInfo' as SectionId, fn: () => generateBasicInfo(disorderEnglishName) },
        { sectionId: 'diagnosisCriteria' as SectionId, fn: () => generateDiagnosisCriteria(disorderEnglishName) },
        { sectionId: 'specifiers' as SectionId, fn: () => generateSpecifiers(disorderEnglishName) },
        { sectionId: 'diagnosticFeatures' as SectionId, fn: () => generateDiagnosticFeatures(disorderEnglishName) },
        { sectionId: 'associatedFeatures' as SectionId, fn: () => generateAssociatedFeatures(disorderEnglishName) },
        { sectionId: 'diagnosticMarkers' as SectionId, fn: () => generateDiagnosticMarkers(disorderEnglishName) },
        { sectionId: 'differentialDiagnosis' as SectionId, fn: () => generateDifferentialDiagnosis(disorderEnglishName) },
        { sectionId: 'riskFactors' as SectionId, fn: () => generateRiskAndPrognosticFactors(disorderEnglishName) },
        { sectionId: 'cultureIssues' as SectionId, fn: () => generateCultureRelatedIssues(disorderEnglishName) },
        { sectionId: 'genderIssues' as SectionId, fn: () => generateGenderRelatedIssues(disorderEnglishName) }
      ]

      // Run all generation requests in parallel with section tracking
      const results = await Promise.allSettled(
        generationTasks.map(async ({ sectionId, fn }) => {
          if (enableDetailedProgress) {
            updateSectionStatus(disorderEnglishName, sectionId, 'processing')
          }

          try {
            const sectionInfo = DISORDER_SECTIONS.find(s => s.id === sectionId)
            const sectionName = sectionInfo ? sectionInfo.name : sectionId
            
            const result = await retryWithBackoff(fn, 5, sectionName)
            
            if (enableDetailedProgress) {
              updateSectionStatus(disorderEnglishName, sectionId, 'completed')
            }
            
            return { sectionId, result, success: true }
          } catch (error: any) {
            if (enableDetailedProgress) {
              updateSectionStatus(disorderEnglishName, sectionId, 'failed', error.message)
            }
            
            console.error(`Section ${sectionId} failed for ${disorderEnglishName}:`, error)
            return { sectionId, result: null, success: false, error: error.message }
          }
        })
      )

      console.log(`✅ Completed generation: ${disorderEnglishName}`)

      // Process results and separate successful from failed ones
      const successfulResults: Array<{ sectionId: SectionId, result: any, success: boolean }> = []
      const failedResults: Array<{ sectionId: SectionId, success: boolean, error?: string }> = []

      results.forEach((settledResult) => {
        if (settledResult.status === 'fulfilled') {
          const { sectionId, result, success, error } = settledResult.value
          if (success) {
            successfulResults.push({ sectionId, result, success })
          } else {
            failedResults.push({ sectionId, success: false, error })
          }
        } else {
          // This shouldn't happen since we're catching errors, but just in case
          failedResults.push({ sectionId: 'unknown' as SectionId, success: false, error: settledResult.reason?.message })
        }
      })

      const successCount = successfulResults.length
      const totalCount = generationTasks.length
      const failedCount = failedResults.length

      if (failedCount > 0) {
        console.log(`⚠️  ${disorderEnglishName}: ${successCount}/${totalCount} sections successful, ${failedCount} failed`)
      }

      // Check if we can do a partial save (9 out of 10 parts successful)
      const shouldPartialSave = successCount >= 9 && failedCount <= 1

      if (successCount === totalCount) {
        // All sections successful - normal flow
        const sectionResults = successfulResults.reduce((acc, { sectionId, result }) => {
          acc[sectionId] = result
          return acc
        }, {} as Record<SectionId, any>)

        const completeInfo = buildCompleteDisorderInfo(sectionResults)

        if (enableDetailedProgress) {
          updateDisorderStatus(disorderEnglishName, 'completed')
        }

        return completeInfo

      } else if (shouldPartialSave) {
        // Partial save: 9/10 or 10/10 sections successful
        console.log(`🔄 Partial save: ${disorderEnglishName} (${successCount}/${totalCount} sections)`)
        
        const partialInfo = await createPartialSave(
          disorderEnglishName, 
          categoryTitle || 'Unknown Category',
          successfulResults, 
          failedResults,
          enableDetailedProgress
        )

        if (enableDetailedProgress) {
          updateDisorderStatus(disorderEnglishName, 'completed', `Partial save: ${successCount}/${totalCount} sections`)
        }

        return partialInfo

      } else {
        // Too many failures - throw error
        const errorMessage = `Only ${successCount}/${totalCount} sections completed. Failed sections: ${failedResults.map(f => f.sectionId).join(', ')}`
        
        if (enableDetailedProgress) {
          updateDisorderStatus(disorderEnglishName, 'failed', errorMessage)
        }

        throw new Error(errorMessage)
      }
    } catch (e: any) {
      console.error(`Failed parallel generation for: ${disorderEnglishName}`, e)
      error.value = e.message
      
      if (enableDetailedProgress) {
        updateDisorderStatus(disorderEnglishName, 'failed', e.message)
      }
      
      throw e
    } finally {
      processing.value = false
    }
  }

  // Progress tracking functions
  const initializeDisorderProgress = (disorderName: string, categoryTitle: string) => {
    const sections = {} as Record<SectionId, DisorderProgress['sections'][SectionId]>
    
    DISORDER_SECTIONS.forEach(section => {
      sections[section.id] = {
        status: 'pending'
      }
    })

    const progress: DisorderProgress = {
      disorderName,
      categoryTitle,
      status: 'pending',
      sections,
      startTime: Date.now()
    }

    disorderProgress.value.set(disorderName, progress)
  }

  const updateDisorderStatus = (disorderName: string, status: DisorderProgress['status'], error?: string) => {
    const progress = disorderProgress.value.get(disorderName)
    if (progress) {
      progress.status = status
      if (error) progress.error = error
      if (status === 'completed' || status === 'failed') {
        progress.endTime = Date.now()
      }
      disorderProgress.value.set(disorderName, progress)
    }
  }

  const updateSectionStatus = (
    disorderName: string, 
    sectionId: SectionId, 
    status: DisorderProgress['sections'][SectionId]['status'],
    error?: string
  ) => {
    const progress = disorderProgress.value.get(disorderName)
    if (progress) {
      const section = progress.sections[sectionId]
      section.status = status
      if (error) section.error = error
      
      if (status === 'processing') {
        section.startTime = Date.now()
      } else if (status === 'completed' || status === 'failed') {
        section.endTime = Date.now()
      }
      
      disorderProgress.value.set(disorderName, progress)
    }
  }

  const clearProgress = () => {
    disorderProgress.value.clear()
  }

  const getProgressForDisorder = (disorderName: string): DisorderProgress | undefined => {
    return disorderProgress.value.get(disorderName)
  }

  const getAllProgress = (): DisorderProgress[] => {
    return Array.from(disorderProgress.value.values())
  }

  // Helper function to build complete disorder info from successful results
  const buildCompleteDisorderInfo = (sectionResults: Record<SectionId, any>): DisorderInfo => {
    return {
      ...sectionResults.basicInfo,
      diagnosisCriteria: sectionResults.diagnosisCriteria.diagnosisCriteria,
      specifiers: sectionResults.specifiers.specifiers,
      diagnosticFeatures: sectionResults.diagnosticFeatures.diagnosticFeatures,
      associated_features: sectionResults.associatedFeatures.associated_features,
      diagnosticMarkers: sectionResults.diagnosticMarkers.diagnosticMarkers,
      differentialDiagnosis: sectionResults.differentialDiagnosis.differentialDiagnosis,
      riskAndPrognosticFactors: sectionResults.riskFactors.riskAndPrognosticFactors,
      cultureRelatedDiagnosticIssues: sectionResults.cultureIssues.cultureRelatedDiagnosticIssues,
      genderRelatedDiagnosticIssues: sectionResults.genderIssues.genderRelatedDiagnosticIssues
    }
  }

  // Helper function to create partial save with empty objects for missing parts
  const createPartialSave = async (
    disorderEnglishName: string,
    categoryTitle: string,
    successfulResults: Array<{ sectionId: SectionId, result: any, success: boolean }>,
    failedResults: Array<{ sectionId: SectionId, success: boolean, error?: string }>,
    enableDetailedProgress: boolean
  ): Promise<DisorderInfo> => {
    
    // Create a map of successful results
    const sectionResults: Record<SectionId, any> = {}
    successfulResults.forEach(({ sectionId, result }) => {
      sectionResults[sectionId] = result
    })

    // Create empty objects for failed sections
    const emptySectionDefaults: Record<SectionId, any> = {
      basicInfo: {
        code: '',
        title: `${disorderEnglishName} - نیاز به تکمیل`,
        titleEn: `${disorderEnglishName}-need`,
        description: '',
        minimumCriteria: '',
        specialNote: '',
        Prevalence: '',
        developmentAndCourse: '',
        suicideRisk: ''
      },
      diagnosisCriteria: { diagnosisCriteria: [] },
      specifiers: { specifiers: [] },
      diagnosticFeatures: { diagnosticFeatures: [] },
      associatedFeatures: { associated_features: [] },
      diagnosticMarkers: { diagnosticMarkers: [] },
      differentialDiagnosis: { differentialDiagnosis: [] },
      riskFactors: { riskAndPrognosticFactors: [] },
      cultureIssues: { cultureRelatedDiagnosticIssues: [] },
      genderIssues: { genderRelatedDiagnosticIssues: [] }
    }

    // Fill in missing sections with empty defaults
    failedResults.forEach(({ sectionId }) => {
      if (!sectionResults[sectionId]) {
        sectionResults[sectionId] = emptySectionDefaults[sectionId]
        console.log(`📄 Empty default for failed section: ${sectionId}`)
      }
    })

    // Ensure we have all required sections
    DISORDER_SECTIONS.forEach(section => {
      if (!sectionResults[section.id]) {
        sectionResults[section.id] = emptySectionDefaults[section.id]
        console.log(`📄 Adding missing section: ${section.id}`)
      }
    })

    // Build the partial disorder info
    let partialInfo: DisorderInfo

    try {
      partialInfo = buildCompleteDisorderInfo(sectionResults)
      
      // Modify the title to indicate partial completion
      if (sectionResults.basicInfo && sectionResults.basicInfo.title) {
        partialInfo.title = `${partialInfo.title} (نیاز به تکمیل)`
      }
      if (sectionResults.basicInfo && sectionResults.basicInfo.titleEn) {
        partialInfo.titleEn = `${partialInfo.titleEn}-need`
      }

      // Add a special note about missing sections
      const missingSections = failedResults.map(f => {
        const sectionInfo = DISORDER_SECTIONS.find(s => s.id === f.sectionId)
        return sectionInfo ? sectionInfo.name : f.sectionId
      })
      
      const missingNote = `این اختلال به صورت جزئی ایجاد شده است. بخش‌های ناقص: ${missingSections.join(', ')}. نیاز به تکمیل دارد.`
      partialInfo.specialNote = partialInfo.specialNote ? 
        `${partialInfo.specialNote}\n\n${missingNote}` : 
        missingNote

      console.log(`📝 Created partial disorder: ${disorderEnglishName} (missing: ${missingSections.join(', ')})`)

    } catch (buildError: any) {
      console.error('Error building partial disorder info:', buildError)
      throw new Error(`Failed to build partial disorder info: ${buildError.message}`)
    }

    // Save partial disorder to database if we have database access
    try {
      const nuxtApp = useNuxtApp()
      const pb = nuxtApp.$pb

      const data = {
        code: partialInfo.code,
        title: partialInfo.title,
        titleEn: partialInfo.titleEn,
        description: partialInfo.description,
        minimumCriteria: partialInfo.minimumCriteria,
        specialNote: partialInfo.specialNote,
        Prevalence: partialInfo.Prevalence,
        developmentAndCourse: partialInfo.developmentAndCourse,
        suicideRisk: partialInfo.suicideRisk,
        diagnosisCriteria: JSON.stringify(partialInfo.diagnosisCriteria),
        specifiers: JSON.stringify(partialInfo.specifiers),
        diagnosticFeatures: JSON.stringify(partialInfo.diagnosticFeatures),
        diagnosticMarkers: JSON.stringify(partialInfo.diagnosticMarkers),
        associated_features: JSON.stringify(partialInfo.associated_features),
        riskAndPrognosticFactors: JSON.stringify(partialInfo.riskAndPrognosticFactors),
        cultureRelatedDiagnosticIssues: JSON.stringify(partialInfo.cultureRelatedDiagnosticIssues),
        genderRelatedDiagnosticIssues: JSON.stringify(partialInfo.genderRelatedDiagnosticIssues),
        differentialDiagnosis: JSON.stringify(partialInfo.differentialDiagnosis)
      }

      const record = await pb.collection('DSM5_disorders').create(data)
      console.log(`💾 Partial disorder saved: ${partialInfo.titleEn} (ID: ${record.id})`)
      
    } catch (dbError: any) {
      console.warn('Failed to save partial disorder to database (will still return the data):', dbError)
      // Don't throw here, just log the warning since we still want to return the partial data
    }

    return partialInfo
  }

  // Retry mechanism with exponential backoff
  const retryWithBackoff = async <T>(fn: () => Promise<T>, maxRetries = 5, sectionName?: string): Promise<T> => {
    let lastError: any
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (sectionName && attempt > 1) {
          console.log(`${sectionName}: Retry attempt ${attempt}/${maxRetries}`)
        } else if (!sectionName && attempt > 1) {
          console.log(`Attempt ${attempt}/${maxRetries}`)
        }
        const result = await fn()
        
        // If successful, return result
        if (attempt > 1) {
          console.log(`✓ ${sectionName ? sectionName : 'Request'} succeeded on attempt ${attempt}`)
        }
        return result
        
      } catch (error: any) {
        lastError = error
        if (sectionName) {
          console.warn(`✗ ${sectionName}: Attempt ${attempt}/${maxRetries} failed:`, error.message)
        } else {
          console.warn(`✗ Attempt ${attempt}/${maxRetries} failed:`, error.message)
        }
        
        // If it's the last attempt, throw the error
        if (attempt === maxRetries) {
          console.error(`${sectionName ? sectionName : 'Request'} failed after ${maxRetries} attempts`)
          throw error
        }
        
        // Determine delay based on error type (reduced by 1/5)
        let delay = Math.pow(2, attempt) * 200 // Default exponential backoff (reduced from 1000 to 200)
        
        // For JSON parsing errors, use moderate delays
        if (error.message.includes('JSON') || error.message.includes('Unterminated string')) {
          delay = delay * 1.5 // Slightly longer delay for JSON issues (reduced from 2x)
          console.log(`${sectionName ? sectionName + ': ' : ''}JSON parsing error detected, using moderate delay`)
        }
        
        // For rate limiting, use longer delays
        if (error.status === 429 || error.message.includes('rate limit')) {
          delay = delay * 2 // Double the delay for rate limiting (reduced from 3x)
          console.log(`${sectionName ? sectionName + ': ' : ''}Rate limiting detected, using extended delay`)
        }
        
        console.log(`${sectionName ? sectionName + ': ' : ''}Retrying in ${delay/1000} seconds...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    
    throw lastError
  }

  // Enhanced JSON parsing with error handling
  const parseJSONSafely = (content: string): any => {
    try {
      return JSON.parse(content)
    } catch (error) {
      console.error('JSON parsing failed, attempting to fix...', error)
      
      // Try multiple fix strategies
      let fixedContent = content.trim()
      
      // Strategy 1: Remove any trailing commas before closing braces/brackets
      fixedContent = fixedContent.replace(/,(\s*[}\]])/g, '$1')
      
      // Strategy 2: Fix unterminated strings by finding the last opening quote
      const lastQuoteIndex = fixedContent.lastIndexOf('"')
      const lastOpenBrace = Math.max(
        fixedContent.lastIndexOf('{'),
        fixedContent.lastIndexOf('[')
      )
      
      // If the content seems truncated and ends without proper closing
      if (lastQuoteIndex > lastOpenBrace && !fixedContent.endsWith('"')) {
        console.log('Adding missing closing quote...')
        fixedContent = fixedContent + '"'
      }
      
      // Strategy 3: Try to complete the JSON structure
      const openBraces = (fixedContent.match(/\{/g) || []).length
      const closeBraces = (fixedContent.match(/\}/g) || []).length
      const openBrackets = (fixedContent.match(/\[/g) || []).length
      const closeBrackets = (fixedContent.match(/\]/g) || []).length
      
      // Add missing closing braces/brackets
      const missingCloseBraces = openBraces - closeBraces
      const missingCloseBrackets = openBrackets - closeBrackets
      
      if (missingCloseBraces > 0 || missingCloseBrackets > 0) {
        console.log(`Adding ${missingCloseBraces} closing braces and ${missingCloseBrackets} closing brackets`)
        fixedContent += '}}'.repeat(missingCloseBraces)
        fixedContent += ']]'.repeat(missingCloseBrackets)
      }
      
      // Strategy 4: Try to extract valid JSON from the beginning if content is truncated
      try {
        return JSON.parse(fixedContent)
      } catch (secondError) {
        console.log('Second fix attempt failed, trying content truncation...')
        
        // Find the last complete object/array by looking for the last valid closing
        let truncatedContent = fixedContent
        const lastValidClose = Math.max(
          truncatedContent.lastIndexOf('}'),
          truncatedContent.lastIndexOf(']')
        )
        
        if (lastValidClose > 0) {
          truncatedContent = truncatedContent.substring(0, lastValidClose + 1)
          
          try {
            console.log('Trying truncated content...')
            return JSON.parse(truncatedContent)
          } catch (thirdError) {
            console.log('Truncation fix failed')
          }
        }
        
        // Strategy 5: Last resort - try to find and parse just the main object
        const firstBrace = fixedContent.indexOf('{')
        if (firstBrace >= 0) {
          let braceCount = 0
          let endIndex = firstBrace
          
          for (let i = firstBrace; i < fixedContent.length; i++) {
            if (fixedContent[i] === '{') braceCount++
            if (fixedContent[i] === '}') braceCount--
            
            if (braceCount === 0) {
              endIndex = i + 1
              break
            }
          }
          
          if (endIndex > firstBrace) {
            const extractedContent = fixedContent.substring(firstBrace, endIndex)
            try {
              console.log('Trying extracted main object...')
              return JSON.parse(extractedContent)
            } catch (extractError) {
              console.log('Main object extraction failed')
            }
          }
        }
        
        console.error('All JSON fix strategies failed, throwing original error')
        throw error
      }
    }
  }

  // PocketBase data fetching functions
  const fetchCategoryData = async (categorySlug: string) => {
    try {
      const pb = nuxtApp.$pb
      
      console.log(`🔍 Searching for category with slug: "${categorySlug}"`)
      
      // Convert slug back to proper title format for matching
      const titlePattern = categorySlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      console.log(`🔍 Converted slug to title pattern: "${titlePattern}"`)
      
      // First try exact match
      let categoryRecord
      try {
        categoryRecord = await pb.collection('DSM5_categories').getFirstListItem(
          `titleEn = "${titlePattern}"`, 
          { expand: '' }
        )
        console.log(`✅ Found exact match for: ${titlePattern}`)
      } catch (e) {
        console.log(`⚠️ Exact match failed, trying wildcard search...`)
        // Fallback to wildcard search
        categoryRecord = await pb.collection('DSM5_categories').getFirstListItem(
          `titleEn ~ "${titlePattern}"`, 
          { expand: '' }
        )
        console.log(`✅ Found wildcard match for: ${titlePattern}`)
      }
      
      if (!categoryRecord) {
        throw new Error(`Category not found: ${categorySlug}`)
      }

      // Helper function to safely parse JSON
      const safeJSONParse = (data: any, fallback: any = {}) => {
        if (typeof data === 'string') {
          // Skip parsing if it looks like '[object Object]' error
          if (data === '[object Object]') {
            console.warn('Received [object Object] instead of valid JSON, using fallback')
            return fallback
          }
          try {
            return JSON.parse(data)
          } catch (e) {
            console.warn('Failed to parse JSON:', data, e)
            return fallback
          }
        }
        // If it's already an object, return it
        if (typeof data === 'object' && data !== null) {
          return data
        }
        return data || fallback
      }

      // Parse JSON fields safely
      const categoryData = {
        id: categoryRecord.id,
        code: categoryRecord.code,
        titleFa: categoryRecord.titleFa,
        titleEn: categoryRecord.titleEn,
        icon: categoryRecord.icon,
        description: categoryRecord.description,
        stats: safeJSONParse(categoryRecord.stats, { count: 0, onsetPeriod: 'نامشخص', prevalence: 'نامشخص' }),
        keyFeatures: safeJSONParse(categoryRecord.keyFeatures, []),
        impactAreas: safeJSONParse(categoryRecord.impactAreas, []),
        overview: safeJSONParse(categoryRecord.overview, { title: '', description: '' }),
        resources: safeJSONParse(categoryRecord.resources, []),
        disorders: safeJSONParse(categoryRecord.disorders, [])
      }

      console.log(`✅ Fetched category data: ${categoryData.titleEn} with ${categoryData.disorders.length} disorders`)
      return categoryData
      
    } catch (err: any) {
      console.error('Error fetching category data:', err)
      error.value = err.message
      throw err
    }
  }

  const fetchCategoryDisorders = async (categorySlug: string) => {
    try {
      const pb = nuxtApp.$pb
      
      console.log(`🔍 Searching for disorders in category: "${categorySlug}"`)
      
      // Convert slug back to proper title format for matching
      const titlePattern = categorySlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      console.log(`🔍 Converted slug to title pattern: "${titlePattern}"`)
      
      // Find the category record which should contain disorders in its disorders field
      let categoryRecord
      try {
        categoryRecord = await pb.collection('DSM5_categories').getFirstListItem(
          `titleEn = "${titlePattern}"`, 
          { expand: '' }
        )
        console.log(`✅ Found exact match for: ${titlePattern}`)
      } catch (e) {
        console.log(`⚠️ Exact match failed, trying wildcard search...`)
        categoryRecord = await pb.collection('DSM5_categories').getFirstListItem(
          `titleEn ~ "${titlePattern}"`, 
          { expand: '' }
        )
        console.log(`✅ Found wildcard match for: ${titlePattern}`)
      }
      
      if (!categoryRecord) {
        console.warn(`Category not found for slug: ${categorySlug}`)
        return []
      }
      
      // Helper function to safely parse JSON
      const safeJSONParse = (data: any, fallback: any = []) => {
        if (typeof data === 'string') {
          // Skip parsing if it looks like '[object Object]' error
          if (data === '[object Object]') {
            console.warn('Received [object Object] instead of valid JSON, using fallback')
            return fallback
          }
          try {
            return JSON.parse(data)
          } catch (e) {
            console.warn('Failed to parse JSON:', data, e)
            return fallback
          }
        }
        // If it's already an object, return it
        if (typeof data === 'object' && data !== null) {
          return data
        }
        return data || fallback
      }
      
      // Extract disorders from the category record's disorders field
      const disordersData = safeJSONParse(categoryRecord.disorders, [])
      console.log(`🔍 Found ${disordersData.length} disorders in category record`)
      
      return disordersData
      
    } catch (err: any) {
      console.error('Error fetching category disorders:', err)
      error.value = err.message
      throw err
    }
  }

  const fetchAllCategories = async () => {
    try {
      const pb = nuxtApp.$pb
      
      const categoryRecords = await pb.collection('DSM5_categories').getFullList({
        sort: 'titleEn',
        fields: 'id,code,titleFa,titleEn,icon,description,stats,disorders'
      })
      
      const categories = categoryRecords.map(record => {
        // Helper function to safely parse JSON
        const safeJSONParse = (data: any, fallback: any = {}) => {
          if (typeof data === 'string') {
            // Skip parsing if it looks like '[object Object]' error
            if (data === '[object Object]') {
              console.warn('Received [object Object] instead of valid JSON, using fallback')
              return fallback
            }
            try {
              return JSON.parse(data)
            } catch (e) {
              console.warn('Failed to parse JSON:', data, e)
              return fallback
            }
          }
          // If it's already an object, return it
          if (typeof data === 'object' && data !== null) {
            return data
          }
          return data || fallback
        }

        return {
          id: record.id,
          code: record.code,
          titleFa: record.titleFa,
          titleEn: record.titleEn,
          icon: record.icon,
          description: record.description,
          stats: safeJSONParse(record.stats, { count: 0, onsetPeriod: 'نامشخص', prevalence: 'نامشخص' }),
          disorders: safeJSONParse(record.disorders, []),
          slug: record.titleEn.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim()
        }
      })

      console.log(`✅ Fetched ${categories.length} categories`)
      return categories
      
    } catch (err: any) {
      console.error('Error fetching all categories:', err)
      error.value = err.message
      throw err
    }
  }

  const fetchDisorderBySlug = async (disorderSlug: string) => {
    try {
      const pb = nuxtApp.$pb
      
      console.log(`🔍 Searching for disorder with slug: "${disorderSlug}"`)
      
      // Helper function for safe JSON parsing (local copy)
      const safeJSONParse = (data: any, fallback: any = {}) => {
        if (typeof data === 'string') {
          if (data === '[object Object]') {
            console.warn('Received [object Object] instead of valid JSON, using fallback')
            return fallback
          }
          try { 
            return JSON.parse(data) 
          } catch (e) { 
            console.warn('Failed to parse JSON:', data, e)
            return fallback 
          }
        }
        if (typeof data === 'object' && data !== null) { 
          return data 
        }
        return data || fallback
      }
      
      // Convert slug back to title format for matching
      const titlePattern = disorderSlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      console.log(`🔍 Converted slug to title pattern: "${titlePattern}"`)
      
      // Try exact match first
      let disorderRecord
      try {
        disorderRecord = await pb.collection('DSM5_disorders').getFirstListItem(
          `titleEn = "${titlePattern}"`
        )
        console.log('✅ Found disorder by exact titleEn match')
      } catch {
        // Try partial match
        try {
          disorderRecord = await pb.collection('DSM5_disorders').getFirstListItem(
            `titleEn ~ "${titlePattern}"`
          )
          console.log('✅ Found disorder by partial titleEn match')
        } catch {
          // Try by title field
          try {
            disorderRecord = await pb.collection('DSM5_disorders').getFirstListItem(
              `title ~ "${titlePattern}"`
            )
            console.log('✅ Found disorder by title match')
          } catch {
            // Final attempt: search all records and find best match
            const allDisorders = await pb.collection('DSM5_disorders').getFullList()
            disorderRecord = allDisorders.find(d => 
              d.titleEn?.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-') === disorderSlug ||
              d.title?.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-') === disorderSlug ||
              d.titleEn?.toLowerCase().includes(disorderSlug) ||
              d.title?.toLowerCase().includes(disorderSlug)
            )
            if (disorderRecord) {
              console.log('✅ Found disorder by manual search')
            }
          }
        }
      }
      
      if (!disorderRecord) {
        throw new Error(`Disorder not found: ${disorderSlug}`)
      }

      console.log('🔍 Found disorder record:', disorderRecord.titleEn)
      
      const disorder = {
        id: disorderRecord.id,
        code: disorderRecord.code,
        title: disorderRecord.title,
        titleEn: disorderRecord.titleEn,
        description: disorderRecord.description,
        minimumCriteria: disorderRecord.minimumCriteria,
        specialNote: disorderRecord.specialNote,
        Prevalence: disorderRecord.Prevalence,
        developmentAndCourse: disorderRecord.developmentAndCourse,
        suicideRisk: disorderRecord.suicideRisk,
        diagnosisCriteria: safeJSONParse(disorderRecord.diagnosisCriteria, []),
        specifiers: safeJSONParse(disorderRecord.specifiers, []),
        diagnosticFeatures: safeJSONParse(disorderRecord.diagnosticFeatures, {}),
        associated_features: safeJSONParse(disorderRecord.associated_features, []),
        diagnosticMarkers: safeJSONParse(disorderRecord.diagnosticMarkers, []),
        differentialDiagnosis: safeJSONParse(disorderRecord.differentialDiagnosis, []),
        riskAndPrognosticFactors: safeJSONParse(disorderRecord.riskAndPrognosticFactors, {}),
        cultureRelatedDiagnosticIssues: safeJSONParse(disorderRecord.cultureRelatedDiagnosticIssues, []),
        genderRelatedDiagnosticIssues: safeJSONParse(disorderRecord.genderRelatedDiagnosticIssues, [])
      }

      console.log(`✅ Fetched disorder: ${disorder.titleEn}`)
      return disorder
      
    } catch (err: any) {
      console.error('Error fetching disorder:', err)
      error.value = err.message
      throw err
    }
  }

  return {
    error,
    processing,
    disorderProgress: readonly(disorderProgress),
    generateBasicInfo,
    generateDiagnosisCriteria,
    generateSpecifiers,
    generateDiagnosticFeatures,
    generateAssociatedFeatures,
    generateDiagnosticMarkers,
    generateDifferentialDiagnosis,
    generateRiskAndPrognosticFactors,
    generateCultureRelatedIssues,
    generateGenderRelatedIssues,
    generateCompleteDisorderInfo,
    initializeDisorderProgress,
    updateDisorderStatus,
    updateSectionStatus,
    clearProgress,
    getProgressForDisorder,
    getAllProgress,
    buildCompleteDisorderInfo,
    createPartialSave,
    // PocketBase data fetching functions
    fetchCategoryData,
    fetchCategoryDisorders,
    fetchAllCategories,
    fetchDisorderBySlug
  }
}