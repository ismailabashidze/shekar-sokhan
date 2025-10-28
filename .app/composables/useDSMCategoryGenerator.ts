import { useNuxtApp } from '#app';
import { ref, readonly } from 'vue';

export interface CategoryStats {
  count: number;
  onsetPeriod: string;
  prevalence: string;
}

export interface ImpactArea {
  icon: string;
  text: string;
  color: string;
}

export interface CategoryOverview {
  title: string;
  description: string;
}

export interface CategoryResource {
  icon: string;
  title: string;
  description: string;
  color: string;
}

export interface BriefDisorder {
  code: string;
  titleFa: string;
  titleEn: string;
  prevalence: string;
  ageOfOnset: string;
  course: string;
  description: string;
  coreSymptoms: string[];
  associatedFeatures: string[];
  treatmentApproaches: string[];
}

export interface CategoryInfo {
  code: string;
  titleFa: string;
  titleEn: string;
  icon: string;
  description: string;
  stats: CategoryStats;
  keyFeatures: string[];
  impactAreas: ImpactArea[];
  overview: CategoryOverview;
  resources: CategoryResource[];
  disorders: BriefDisorder[];
}

// Define section names for detailed progress tracking
export const CATEGORY_SECTIONS = [
  { id: 'basicInfo', name: 'اطلاعات کلی', nameEn: 'Basic Info' },
  { id: 'stats', name: 'آمار دسته‌بندی', nameEn: 'Category Stats' },
  { id: 'keyFeatures', name: 'ویژگی‌های کلیدی', nameEn: 'Key Features' },
  { id: 'impactAreas', name: 'حیطه‌های تأثیرگذاری', nameEn: 'Impact Areas' },
  { id: 'overview', name: 'اطلاعات کلی', nameEn: 'Overview' },
  { id: 'resources', name: 'منابع مفید', nameEn: 'Resources' },
  { id: 'disorders', name: 'اختلالات خلاصه', nameEn: 'Brief Disorders' },
] as const;

export type CategorySectionId = typeof CATEGORY_SECTIONS[number]['id'];

export interface CategoryProgress {
  categoryName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  sections: Record<CategorySectionId, {
    status: 'pending' | 'processing' | 'completed' | 'failed';
    error?: string;
    startTime?: number;
    endTime?: number;
  }>;
  startTime?: number;
  endTime?: number;
}

export const useDSMCategoryGenerator = () => {
  const nuxtApp = useNuxtApp();
  const error = ref<string | null>(null);
  const processing = ref(false);
  const categoryProgress = ref<Map<string, CategoryProgress>>(new Map());

  const generateBasicInfo = async (categoryEnglishName: string) => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useRuntimeConfig().public.openRouterApiKey}`,
          'X-Title': 'DSM-5 Category Basic Info Generator',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-saba',
          messages: [
            {
              role: 'system',
              content: 'شما یک متخصص روانشناسی بالینی هستید که اطلاعات دقیق و کامل DSM-5 برای دسته‌بندی‌ها ارائه می‌دهید. تمام جزئیات را کامل و بدون حذف به زبان فارسی ارائه دهید. فقط در صورت درخواست صریح از زبان انگلیسی استفاده کنید.',
            },
            {
              role: 'user',
              content: `لطفا اطلاعات کامل دسته‌بندی DSM-5 به نام "${categoryEnglishName}" را ارائه دهید. شامل کد دسته‌بندی، عنوان فارسی، آیکون مناسب، و توضیحات کامل.\n\n**مهم: فقط JSON معتبر و کامل ارائه دهید. هیچ متن اضافی قبل یا بعد از JSON نباشد.**`,
            },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'basic_category_info',
              schema: {
                type: 'object',
                properties: {
                  code: {
                    type: 'string',
                    description: 'Category code/identifier',
                  },
                  titleFa: {
                    type: 'string',
                    description: 'Persian/Farsi title of the category',
                  },
                  titleEn: {
                    type: 'string',
                    description: 'English title of the category',
                  },
                  icon: {
                    type: 'string',
                    description: 'Phosphor icon name (e.g., ph:brain-fill)',
                  },
                  description: {
                    type: 'string',
                    description: 'Comprehensive description in Persian',
                  },
                },
                required: ['code', 'titleFa', 'titleEn', 'icon', 'description'],
              },
            },
          },
          temperature: 0.8,
          max_tokens: 3000,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      return typeof content === 'string' ? parseJSONSafely(content) : content;
    }
    catch (e: any) {
      console.error('Error generating basic category info:', e);
      throw e;
    }
  };

  const generateStats = async (categoryEnglishName: string) => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useRuntimeConfig().public.openRouterApiKey}`,
          'X-Title': 'DSM-5 Category Stats Generator',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-saba',
          messages: [
            {
              role: 'system',
              content: 'شما یک متخصص روانشناسی بالینی هستید. آمار و اطلاعات کمی DSM-5 برای دسته‌بندی‌ها را به زبان فارسی ارائه دهید.',
            },
            {
              role: 'user',
              content: `لطفا آمار کامل دسته‌بندی DSM-5 به نام "${categoryEnglishName}" را ارائه دهید. شامل تعداد اختلالات، دوران شروع معمول، و میزان شیوع کلی.\n\n**مهم: فقط JSON معتبر ارائه دهید.**`,
            },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'category_stats',
              schema: {
                type: 'object',
                properties: {
                  stats: {
                    type: 'object',
                    properties: {
                      count: {
                        type: 'number',
                        description: 'Number of disorders in this category',
                      },
                      onsetPeriod: {
                        type: 'string',
                        description: 'Typical onset period in Persian',
                      },
                      prevalence: {
                        type: 'string',
                        description: 'Overall prevalence range in Persian',
                      },
                    },
                    required: ['count', 'onsetPeriod', 'prevalence'],
                  },
                },
                required: ['stats'],
              },
            },
          },
          temperature: 0.8,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      return typeof content === 'string' ? parseJSONSafely(content) : content;
    }
    catch (e: any) {
      console.error('Error generating category stats:', e);
      throw e;
    }
  };

  const generateKeyFeatures = async (categoryEnglishName: string) => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useRuntimeConfig().public.openRouterApiKey}`,
          'X-Title': 'DSM-5 Category Key Features Generator',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-saba',
          messages: [
            {
              role: 'system',
              content: 'شما یک متخصص روانشناسی بالینی هستید. ویژگی‌های کلیدی دسته‌بندی‌های DSM-5 را به زبان فارسی ارائه دهید.',
            },
            {
              role: 'user',
              content: `لطفا ویژگی‌های کلیدی دسته‌بندی DSM-5 به نام "${categoryEnglishName}" را ارائه دهید. این ویژگی‌ها باید مشخصه‌های اصلی و مهم این دسته‌بندی باشند.\n\n**مهم: فقط JSON معتبر ارائه دهید.**`,
            },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'key_features',
              schema: {
                type: 'object',
                properties: {
                  keyFeatures: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                    description: 'List of key features in Persian',
                    minItems: 3,
                    maxItems: 6,
                  },
                },
                required: ['keyFeatures'],
              },
            },
          },
          temperature: 0.8,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      return typeof content === 'string' ? parseJSONSafely(content) : content;
    }
    catch (e: any) {
      console.error('Error generating key features:', e);
      throw e;
    }
  };

  const generateImpactAreas = async (categoryEnglishName: string) => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useRuntimeConfig().public.openRouterApiKey}`,
          'X-Title': 'DSM-5 Category Impact Areas Generator',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-saba',
          messages: [
            {
              role: 'system',
              content: 'شما یک متخصص روانشناسی بالینی هستید. حیطه‌های تأثیرگذاری دسته‌بندی‌های DSM-5 را با آیکون‌های مناسب به زبان فارسی ارائه دهید.',
            },
            {
              role: 'user',
              content: `لطفا حیطه‌های تأثیرگذاری دسته‌بندی DSM-5 به نام "${categoryEnglishName}" را با آیکون‌های phosphor و رنگ‌های مناسب ارائه دهید.\n\n**مهم: فقط JSON معتبر ارائه دهید.**`,
            },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'impact_areas',
              schema: {
                type: 'object',
                properties: {
                  impactAreas: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        icon: {
                          type: 'string',
                          description: 'Phosphor icon name (e.g., ph:brain)',
                        },
                        text: {
                          type: 'string',
                          description: 'Impact area description in Persian',
                        },
                        color: {
                          type: 'string',
                          description: 'Tailwind color name (e.g., blue, green, purple)',
                        },
                      },
                      required: ['icon', 'text', 'color'],
                    },
                    minItems: 3,
                    maxItems: 5,
                  },
                },
                required: ['impactAreas'],
              },
            },
          },
          temperature: 0.8,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      return typeof content === 'string' ? parseJSONSafely(content) : content;
    }
    catch (e: any) {
      console.error('Error generating impact areas:', e);
      throw e;
    }
  };

  const generateOverview = async (categoryEnglishName: string) => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useRuntimeConfig().public.openRouterApiKey}`,
          'X-Title': 'DSM-5 Category Overview Generator',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-saba',
          messages: [
            {
              role: 'system',
              content: 'شما یک متخصص روانشناسی بالینی هستید. بخش overview دسته‌بندی‌های DSM-5 را به زبان فارسی ارائه دهید.',
            },
            {
              role: 'user',
              content: `لطفا بخش overview برای دسته‌بندی DSM-5 به نام "${categoryEnglishName}" را ارائه دهید. شامل عنوان و توضیحات کلی.\n\n**مهم: فقط JSON معتبر ارائه دهید.**`,
            },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'overview',
              schema: {
                type: 'object',
                properties: {
                  overview: {
                    type: 'object',
                    properties: {
                      title: {
                        type: 'string',
                        description: 'Overview title in Persian',
                      },
                      description: {
                        type: 'string',
                        description: 'Overview description in Persian',
                      },
                    },
                    required: ['title', 'description'],
                  },
                },
                required: ['overview'],
              },
            },
          },
          temperature: 0.8,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      return typeof content === 'string' ? parseJSONSafely(content) : content;
    }
    catch (e: any) {
      console.error('Error generating overview:', e);
      throw e;
    }
  };

  const generateResources = async (categoryEnglishName: string) => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useRuntimeConfig().public.openRouterApiKey}`,
          'X-Title': 'DSM-5 Category Resources Generator',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-saba',
          messages: [
            {
              role: 'system',
              content: 'شما یک متخصص روانشناسی بالینی هستید. منابع مفید و تخصصی برای دسته‌بندی‌های DSM-5 را به زبان فارسی ارائه دهید.',
            },
            {
              role: 'user',
              content: `لطفا منابع مفید برای دسته‌بندی DSM-5 به نام "${categoryEnglishName}" را با آیکون‌های مناسب ارائه دهید.\n\n**مهم: فقط JSON معتبر ارائه دهید.**`,
            },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'resources',
              schema: {
                type: 'object',
                properties: {
                  resources: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        icon: {
                          type: 'string',
                          description: 'Phosphor icon name',
                        },
                        title: {
                          type: 'string',
                          description: 'Resource title in Persian',
                        },
                        description: {
                          type: 'string',
                          description: 'Resource description in Persian',
                        },
                        color: {
                          type: 'string',
                          description: 'Tailwind color name',
                        },
                      },
                      required: ['icon', 'title', 'description', 'color'],
                    },
                    minItems: 2,
                    maxItems: 4,
                  },
                },
                required: ['resources'],
              },
            },
          },
          temperature: 0.8,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      return typeof content === 'string' ? parseJSONSafely(content) : content;
    }
    catch (e: any) {
      console.error('Error generating resources:', e);
      throw e;
    }
  };

  const generateBriefDisorders = async (categoryEnglishName: string) => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useRuntimeConfig().public.openRouterApiKey}`,
          'X-Title': 'DSM-5 Brief Disorders Generator',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-saba',
          messages: [
            {
              role: 'system',
              content: 'شما یک متخصص روانشناسی بالینی هستید. فهرست مختصر اختلالات موجود در هر دسته‌بندی DSM-5 را با اطلاعات کلیدی به زبان فارسی ارائه دهید.',
            },
            {
              role: 'user',
              content: `لطفا فهرست کاملی از اختلالات موجود در دسته‌بندی DSM-5 به نام "${categoryEnglishName}" را ارائه دهید. برای هر اختلال باید کد DSM-5، عنوان فارسی و انگلیسی، شیوع، سن شروع، سیر اختلال، توضیح مختصر، علائم اصلی، ویژگی‌های همراه و روش‌های درمان ارائه شود.\n\n**مهم: فقط JSON معتبر ارائه دهید.**`,
            },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'brief_disorders',
              schema: {
                type: 'object',
                properties: {
                  disorders: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        code: {
                          type: 'string',
                          description: 'DSM-5 diagnostic code',
                        },
                        titleFa: {
                          type: 'string',
                          description: 'Persian title',
                        },
                        titleEn: {
                          type: 'string',
                          description: 'English title',
                        },
                        prevalence: {
                          type: 'string',
                          description: 'Prevalence rate',
                        },
                        ageOfOnset: {
                          type: 'string',
                          description: 'Age of onset in Persian',
                        },
                        course: {
                          type: 'string',
                          description: 'Course of disorder in Persian',
                        },
                        description: {
                          type: 'string',
                          description: 'Brief description in Persian',
                        },
                        coreSymptoms: {
                          type: 'array',
                          items: {
                            type: 'string',
                          },
                          description: 'Core symptoms in Persian',
                        },
                        associatedFeatures: {
                          type: 'array',
                          items: {
                            type: 'string',
                          },
                          description: 'Associated features in Persian',
                        },
                        treatmentApproaches: {
                          type: 'array',
                          items: {
                            type: 'string',
                          },
                          description: 'Treatment approaches in Persian',
                        },
                      },
                      required: ['code', 'titleFa', 'titleEn', 'prevalence', 'ageOfOnset', 'course', 'description', 'coreSymptoms', 'associatedFeatures', 'treatmentApproaches'],
                    },
                    minItems: 5,
                    maxItems: 25,
                  },
                },
                required: ['disorders'],
              },
            },
          },
          temperature: 0.8,
          max_tokens: 8000,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      return typeof content === 'string' ? parseJSONSafely(content) : content;
    }
    catch (e: any) {
      console.error('Error generating brief disorders:', e);
      throw e;
    }
  };

  const generateCompleteCategoryInfo = async (
    categoryEnglishName: string,
    enableDetailedProgress: boolean = false,
  ): Promise<CategoryInfo> => {
    processing.value = true;
    error.value = null;

    // Initialize progress tracking if detailed progress is enabled
    if (enableDetailedProgress) {
      initializeCategoryProgress(categoryEnglishName);
    }

    try {
      console.log(`🏗️ Starting category generation: ${categoryEnglishName} (${CATEGORY_SECTIONS.length} sections)`);

      // Update overall status
      if (enableDetailedProgress) {
        updateCategoryStatus(categoryEnglishName, 'processing');
      }

      // Define the generation functions with their corresponding section IDs
      const generationTasks = [
        { sectionId: 'basicInfo' as CategorySectionId, fn: () => generateBasicInfo(categoryEnglishName) },
        { sectionId: 'stats' as CategorySectionId, fn: () => generateStats(categoryEnglishName) },
        { sectionId: 'keyFeatures' as CategorySectionId, fn: () => generateKeyFeatures(categoryEnglishName) },
        { sectionId: 'impactAreas' as CategorySectionId, fn: () => generateImpactAreas(categoryEnglishName) },
        { sectionId: 'overview' as CategorySectionId, fn: () => generateOverview(categoryEnglishName) },
        { sectionId: 'resources' as CategorySectionId, fn: () => generateResources(categoryEnglishName) },
        { sectionId: 'disorders' as CategorySectionId, fn: () => generateBriefDisorders(categoryEnglishName) },
      ];

      // Run all generation requests in parallel with section tracking
      const results = await Promise.allSettled(
        generationTasks.map(async ({ sectionId, fn }) => {
          if (enableDetailedProgress) {
            updateSectionStatus(categoryEnglishName, sectionId, 'processing');
          }

          try {
            const sectionInfo = CATEGORY_SECTIONS.find(s => s.id === sectionId);
            const sectionName = sectionInfo ? sectionInfo.name : sectionId;

            const result = await retryWithBackoff(fn, 5, sectionName);

            if (enableDetailedProgress) {
              updateSectionStatus(categoryEnglishName, sectionId, 'completed');
            }

            return { sectionId, result, success: true };
          }
          catch (error: any) {
            if (enableDetailedProgress) {
              updateSectionStatus(categoryEnglishName, sectionId, 'failed', error.message);
            }

            console.error(`Section ${sectionId} failed for ${categoryEnglishName}:`, error);
            return { sectionId, result: null, success: false, error: error.message };
          }
        }),
      );

      console.log(`✅ Completed category generation: ${categoryEnglishName}`);

      // Process results and separate successful from failed ones
      const successfulResults: Array<{ sectionId: CategorySectionId; result: any; success: boolean }> = [];
      const failedResults: Array<{ sectionId: CategorySectionId; success: boolean; error?: string }> = [];

      results.forEach((settledResult) => {
        if (settledResult.status === 'fulfilled') {
          const { sectionId, result, success, error } = settledResult.value;
          if (success) {
            successfulResults.push({ sectionId, result, success });
          }
          else {
            failedResults.push({ sectionId, success: false, error });
          }
        }
        else {
          failedResults.push({ sectionId: 'basicInfo' as CategorySectionId, success: false, error: settledResult.reason?.message });
        }
      });

      const successCount = successfulResults.length;
      const totalCount = generationTasks.length;
      const failedCount = failedResults.length;

      if (failedCount > 0) {
        console.log(`⚠️  ${categoryEnglishName}: ${successCount}/${totalCount} sections successful, ${failedCount} failed`);
      }

      if (successCount >= 6) { // Allow completion with at least 6/7 sections
        const sectionResults = successfulResults.reduce((acc, { sectionId, result }) => {
          acc[sectionId] = result;
          return acc;
        }, {} as Record<CategorySectionId, any>);

        const completeInfo = buildCompleteCategoryInfo(sectionResults);

        if (enableDetailedProgress) {
          updateCategoryStatus(categoryEnglishName, 'completed');
        }

        return completeInfo;
      }
      else {
        const errorMessage = `Only ${successCount}/${totalCount} sections completed. Failed sections: ${failedResults.map(f => f.sectionId).join(', ')}`;

        if (enableDetailedProgress) {
          updateCategoryStatus(categoryEnglishName, 'failed', errorMessage);
        }

        throw new Error(errorMessage);
      }
    }
    catch (e: any) {
      console.error(`Failed parallel generation for: ${categoryEnglishName}`, e);
      error.value = e.message;

      if (enableDetailedProgress) {
        updateCategoryStatus(categoryEnglishName, 'failed', e.message);
      }

      throw e;
    }
    finally {
      processing.value = false;
    }
  };

  // Progress tracking functions
  const initializeCategoryProgress = (categoryName: string) => {
    const sections = {} as Record<CategorySectionId, CategoryProgress['sections'][CategorySectionId]>;

    CATEGORY_SECTIONS.forEach((section) => {
      sections[section.id] = {
        status: 'pending',
      };
    });

    const progress: CategoryProgress = {
      categoryName,
      status: 'pending',
      sections,
      startTime: Date.now(),
    };

    categoryProgress.value.set(categoryName, progress);
  };

  const updateCategoryStatus = (categoryName: string, status: CategoryProgress['status'], error?: string) => {
    const progress = categoryProgress.value.get(categoryName);
    if (progress) {
      progress.status = status;
      if (error) progress.error = error;
      if (status === 'completed' || status === 'failed') {
        progress.endTime = Date.now();
      }
      categoryProgress.value.set(categoryName, progress);
    }
  };

  const updateSectionStatus = (
    categoryName: string,
    sectionId: CategorySectionId,
    status: CategoryProgress['sections'][CategorySectionId]['status'],
    error?: string,
  ) => {
    const progress = categoryProgress.value.get(categoryName);
    if (progress) {
      const section = progress.sections[sectionId];
      section.status = status;
      if (error) section.error = error;

      if (status === 'processing') {
        section.startTime = Date.now();
      }
      else if (status === 'completed' || status === 'failed') {
        section.endTime = Date.now();
      }

      categoryProgress.value.set(categoryName, progress);
    }
  };

  const clearProgress = () => {
    categoryProgress.value.clear();
  };

  const getProgressForCategory = (categoryName: string): CategoryProgress | undefined => {
    return categoryProgress.value.get(categoryName);
  };

  const getAllProgress = (): CategoryProgress[] => {
    return Array.from(categoryProgress.value.values());
  };

  // Helper function to build complete category info from successful results
  const buildCompleteCategoryInfo = (sectionResults: Record<CategorySectionId, any>): CategoryInfo => {
    return {
      ...sectionResults.basicInfo,
      stats: sectionResults.stats?.stats || { count: 0, onsetPeriod: '', prevalence: '' },
      keyFeatures: sectionResults.keyFeatures?.keyFeatures || [],
      impactAreas: sectionResults.impactAreas?.impactAreas || [],
      overview: sectionResults.overview?.overview || { title: '', description: '' },
      resources: sectionResults.resources?.resources || [],
      disorders: sectionResults.disorders?.disorders || [],
    };
  };

  // Retry mechanism with exponential backoff
  const retryWithBackoff = async <T>(fn: () => Promise<T>, maxRetries = 5, sectionName?: string): Promise<T> => {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (sectionName && attempt > 1) {
          console.log(`${sectionName}: Retry attempt ${attempt}/${maxRetries}`);
        }
        const result = await fn();

        if (attempt > 1) {
          console.log(`✓ ${sectionName ? sectionName : 'Request'} succeeded on attempt ${attempt}`);
        }
        return result;
      }
      catch (error: any) {
        lastError = error;
        if (sectionName) {
          console.warn(`✗ ${sectionName}: Attempt ${attempt}/${maxRetries} failed:`, error.message);
        }

        if (attempt === maxRetries) {
          console.error(`${sectionName ? sectionName : 'Request'} failed after ${maxRetries} attempts`);
          throw error;
        }

        let delay = Math.pow(2, attempt) * 200;

        if (error.message.includes('JSON') || error.message.includes('Unterminated string')) {
          delay = delay * 1.5;
        }

        if (error.status === 429 || error.message.includes('rate limit')) {
          delay = delay * 2;
        }

        console.log(`${sectionName ? sectionName + ': ' : ''}Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  };

  // Enhanced JSON parsing with error handling
  const parseJSONSafely = (content: string): any => {
    try {
      return JSON.parse(content);
    }
    catch (error) {
      console.error('JSON parsing failed, attempting to fix...', error);

      let fixedContent = content.trim();

      // Remove trailing commas
      fixedContent = fixedContent.replace(/,(\s*[}\]])/g, '$1');

      // Fix unterminated strings
      const lastQuoteIndex = fixedContent.lastIndexOf('"');
      const lastOpenBrace = Math.max(
        fixedContent.lastIndexOf('{'),
        fixedContent.lastIndexOf('['),
      );

      if (lastQuoteIndex > lastOpenBrace && !fixedContent.endsWith('"')) {
        fixedContent = fixedContent + '"';
      }

      // Complete JSON structure
      const openBraces = (fixedContent.match(/\{/g) || []).length;
      const closeBraces = (fixedContent.match(/\}/g) || []).length;
      const openBrackets = (fixedContent.match(/\[/g) || []).length;
      const closeBrackets = (fixedContent.match(/\]/g) || []).length;

      const missingCloseBraces = openBraces - closeBraces;
      const missingCloseBrackets = openBrackets - closeBrackets;

      if (missingCloseBraces > 0 || missingCloseBrackets > 0) {
        fixedContent += '}'.repeat(missingCloseBraces);
        fixedContent += ']'.repeat(missingCloseBrackets);
      }

      try {
        return JSON.parse(fixedContent);
      }
      catch (secondError) {
        console.error('All JSON fix strategies failed, throwing original error');
        throw error;
      }
    }
  };

  return {
    error,
    processing,
    categoryProgress: readonly(categoryProgress),
    generateBasicInfo,
    generateStats,
    generateKeyFeatures,
    generateImpactAreas,
    generateOverview,
    generateResources,
    generateBriefDisorders,
    generateCompleteCategoryInfo,
    initializeCategoryProgress,
    updateCategoryStatus,
    updateSectionStatus,
    clearProgress,
    getProgressForCategory,
    getAllProgress,
    buildCompleteCategoryInfo,
  };
};
