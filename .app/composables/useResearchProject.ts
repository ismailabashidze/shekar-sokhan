// useResearchProject.ts
export type ResearchProject = {
  id?: string;
  user?: string;
  projectType?: 'project' | 'doctoral' | 'masters' | 'article';
  status?: 'created' | 'collectingRelatedArticles' | 'Analyzing' | 'readyForContinue' | 'inProgress' | 'done';
  researchDomain?: any;
  keywords?: any;
  researchGoals?: any;
  ethicsApproval?: boolean;
  necessity?: string;
  importance?: string;
  brainstormResults?: string;
};

export interface AISuggestionRequest {
  field: 'researchDomain' | 'keywords' | 'researchGoals' | 'necessity' | 'importance';
  context?: {
    researchDomain?: string[];
    keywords?: string[];
    researchGoals?: string[];
    projectType?: string;
    necessity?: string;
    importance?: string;
    contextSummary?: string;
    brainstormResults?: string;
  };
}

export interface AISuggestionResponse {
  suggestions: unknown;
  success: boolean;
  error?: string;
}

export interface ExtractedPaperInfo {
  authors: string[];
  year: number | null;
  institution: string | null;
  country: string | null;
  abstract: string | null;
  abstractFa?: string | null;
  references: Array<{
    title: string;
    titleFa?: string | null;
    authors: string[];
    url?: string | null;
    doi?: string | null;
  }>;
  keywords: string[];
  keywordsFa?: string[] | null;
  relevanceScores: Array<{
    keyword: string;
    relevance: 'خیلی زیاد' | 'زیاد' | 'متوسط' | 'کم' | 'خیلی کم';
  }>;
  methodology?: string | null;
  methodologyFa?: string | null;
  mainFindings?: string | null;
  mainFindingsFa?: string | null;
  limitations?: string | null;
  limitationsFa?: string | null;
  problemStatement?: string | null;
  problemStatementFa?: string | null;
  theories?: string[] | null;
  theoriesFa?: string[] | null;
  researchEvidence?: string | null;
  researchEvidenceFa?: string | null;
  relatedVariables?: string[] | null;
  relatedVariablesFa?: string[] | null;
  variableRelationships?: string | null;
  variableRelationshipsFa?: string | null;
  relationshipModeling?: string | null;
  relationshipModelingFa?: string | null;
  researchGaps?: string | null;
  researchGapsFa?: string | null;
}

export interface HadiStructuredInsights {
  researchType: string | null;
  variables: string | null;
  questionsOrHypotheses: string | null;
  researchGoals: string | null;
  methodology: string | null;
  results: string | null;
  researchGap: string | null;
}

export function useResearchProject() {
  const nuxtApp = useNuxtApp();
  const config = useRuntimeConfig();

  // Helper functions for API calls
  const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  function cleanJsonContent(raw: string): string {
    let cleaned = raw.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.substring(7).trimStart();
    }
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.substring(3).trimStart();
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.substring(0, cleaned.length - 3).trimEnd();
    }
    return cleaned;
  }

  function safeParseJson<T = any>(raw: string): T {
    const cleaned = cleanJsonContent(raw);
    try {
      return JSON.parse(cleaned) as T;
    } catch {
      try {
        return JSON.parse(cleaned) as T;
      } catch {
        throw new Error('Failed to parse JSON response');
      }
    }
  }

  interface StructuredRequestOptions {
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
    schema: any;
    schemaName?: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
    signal?: AbortSignal;
    timeout?: number;
    retries?: number;
    strict?: boolean;
  }

  const generateStructuredResponse = async ({
    messages,
    schema,
    schemaName = 'structured_payload',
    model = 'mistralai/mistral-saba',
    maxTokens = 1000,
    temperature = 0.7,
    signal,
    timeout = 120000,
    retries = 3,
    strict = true,
  }: StructuredRequestOptions): Promise<any> => {
    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt < retries) {
      attempt++;
      try {
        const controller = new AbortController();
        const timeoutId = timeout > 0 ? setTimeout(() => controller.abort(), timeout) : null;

        try {
          const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${config.public.openRouterApiKey}`,
              'HTTP-Referer': config.public.appUrl || 'http://localhost:4000',
              'X-Title': 'Research Project Analysis',
            },
            body: JSON.stringify({
              model,
              messages,
              response_format: {
                type: 'json_schema',
                json_schema: {
                  name: schemaName,
                  strict,
                  schema,
                },
              },
              temperature,
              max_tokens: maxTokens > 0 ? maxTokens : 0,
              plugins: [],
              transforms: ['middle-out'],
            }),
            signal: signal || controller.signal,
          });

          if (timeoutId) clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;

          if (!content) {
            throw new Error('Empty response content from OpenRouter API');
          }

          if (typeof content === 'string') {
            return safeParseJson(content);
          }

          return content;
        } catch (e: any) {
          if (timeoutId) clearTimeout(timeoutId);
          throw e;
        }
      } catch (e: any) {
        const errorMessage = e.message || 'Unknown error';
        lastError = e instanceof Error ? e : new Error(errorMessage);

        if (errorMessage.includes('aborted') || errorMessage.includes('timeout')) {
          throw lastError;
        }

        if (attempt >= retries) {
          throw lastError;
        }

        await wait(Math.min(1000 * attempt, 3000));
      }
    }

    throw lastError || new Error('Structured request failed without specific error');
  };

  const getResearchProjects = async () => {
    return await nuxtApp.$pb.collection('research_projects').getFullList({
      sort: '-created',
    });
  };

  const getResearchProject = async (id: string) => {
    return await nuxtApp.$pb.collection('research_projects').getOne(id);
  };

  const getResearchProjectsByUser = async (userId: string) => {
    try {
      const result = await nuxtApp.$pb.collection('research_projects').getList(1, 50, {
        filter: `user = "${userId}"`,
        sort: '-created',
      });

      return result.items;
    } catch (error) {
      console.error('Failed to get research projects by user:', error);
      return [];
    }
  };

  const createResearchProject = async (project: ResearchProject) => {
    return await nuxtApp.$pb.collection('research_projects').create(project);
  };

  const updateResearchProject = async (id: string, project: ResearchProject) => {
    return await nuxtApp.$pb.collection('research_projects').update(id, project);
  };

  const deleteResearchProject = async (id: string) => {
    return await nuxtApp.$pb.collection('research_projects').delete(id);
  };

  // AI Suggestion Functions
  // Specific method for research domain suggestions
  const suggestResearchDomain = async (context: {
    projectType?: string;
    researchDomain?: string[];
    keywords?: string[];
    researchGoals?: string[];
  }): Promise<string[]> => {
    try {
      const response = await generateAISuggestions({
        field: 'researchDomain',
        context,
      });

      if (!response.success) {
        throw new Error(response.error || 'خطا در دریافت پیشنهادات حوزه دانشی');
      }

      return Array.isArray(response.suggestions) ? response.suggestions : [];
    } catch (error: any) {
      console.error('Error in suggestResearchDomain:', error);
      throw error;
    }
  };

  // Specific method for keywords suggestions
  const suggestKeywords = async (context: {
    projectType?: string;
    researchDomain?: string[];
    keywords?: string[];
    researchGoals?: string[];
  }): Promise<string[]> => {
    try {
      if (!context.researchDomain?.length) {
        throw new Error('لطفاً ابتدا حوزه دانشی را وارد کنید');
      }

      const response = await generateAISuggestions({
        field: 'keywords',
        context,
      });

      if (!response.success) {
        throw new Error(response.error || 'خطا در دریافت پیشنهادات کلیدواژه');
      }

      return Array.isArray(response.suggestions) ? response.suggestions : [];
    } catch (error: any) {
      console.error('Error in suggestKeywords:', error);
      throw error;
    }
  };

  // Specific method for research goals suggestions
  const suggestResearchGoals = async (context: {
    projectType?: string;
    researchDomain?: string[];
    keywords?: string[];
    researchGoals?: string[];
  }): Promise<string[]> => {
    try {
      const response = await generateAISuggestions({
        field: 'researchGoals',
        context,
      });

      if (!response.success) {
        throw new Error(response.error || 'خطا در دریافت پیشنهادات اهداف پژوهشی');
      }

      return Array.isArray(response.suggestions) ? response.suggestions : [];
    } catch (error: any) {
      console.error('Error in suggestResearchGoals:', error);
      throw error;
    }
  };

  const normalizeTextSuggestion = (value: unknown, fieldKey?: string): string => {
    if (!value) return '';

    if (
      fieldKey &&
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      fieldKey in (value as Record<string, unknown>)
    ) {
      return normalizeTextSuggestion((value as Record<string, unknown>)[fieldKey]);
    }

    if (typeof value === 'string') {
      return value.trim();
    }

    if (Array.isArray(value)) {
      return value
        .map((entry) => (typeof entry === 'string' ? entry.trim() : JSON.stringify(entry)))
        .filter(Boolean)
        .join('\n')
        .trim();
    }

    if (typeof value === 'object') {
      return Object.values(value as Record<string, unknown>)
        .map((entry) => (typeof entry === 'string' ? entry.trim() : JSON.stringify(entry)))
        .filter(Boolean)
        .join('\n')
        .trim();
    }

    return '';
  };

  // Specific method for necessity suggestions
  const suggestNecessity = async (context: {
    projectType?: string;
    researchDomain?: string[];
    keywords?: string[];
    researchGoals?: string[];
  }): Promise<string> => {
    try {
      const response = await generateAISuggestions({
        field: 'necessity',
        context,
      });

      if (!response.success) {
        throw new Error(response.error || 'خطا در دریافت پیشنهاد ضرورت تحقیق');
      }

      const normalized = normalizeTextSuggestion(response.suggestions, 'necessity');

      if (!normalized) {
        throw new Error('پاسخی از هوش مصنوعی دریافت نشد. لطفاً دوباره تلاش کنید.');
      }

      return normalized;
    } catch (error: any) {
      console.error('Error in suggestNecessity:', error);
      throw error;
    }
  };

  // Specific method for importance suggestions
  const suggestImportance = async (context: {
    projectType?: string;
    researchDomain?: string[];
    keywords?: string[];
    researchGoals?: string[];
  }): Promise<string> => {
    try {
      const response = await generateAISuggestions({
        field: 'importance',
        context,
      });

      if (!response.success) {
        throw new Error(response.error || 'خطا در دریافت پیشنهاد اهمیت تحقیق');
      }

      const normalized = normalizeTextSuggestion(response.suggestions, 'importance');

      if (!normalized) {
        throw new Error('پاسخی از هوش مصنوعی دریافت نشد. لطفاً دوباره تلاش کنید.');
      }

      return normalized;
    } catch (error: any) {
      console.error('Error in suggestImportance:', error);
      throw error;
    }
  };

  // General AI suggestion method (kept for backward compatibility)
  const generateAISuggestions = async (request: AISuggestionRequest): Promise<AISuggestionResponse> => {
    try {
      const { field, context } = request;

      const prompts = {
        researchDomain: {
          system: 'شما یک دستیار پژوهشی متخصص و خلاق هستید که حوزه‌های دانشی مرتبط، خلاقانه و مکمل را پیشنهاد می‌دهید.',
          user: `بر اساس اطلاعات زیر، ۵-۷ حوزه دانشی خلاقانه، مرتبط و مکمل برای این پژوهش پیشنهاد دهید:
${context?.projectType ? `نوع پروژه: ${context.projectType}` : ''}
${context?.researchDomain?.length ? `حوزه‌های فعلی انتخاب شده: ${context.researchDomain.join(', ')}` : ''}
${context?.keywords?.length ? `کلیدواژه‌ها: ${context.keywords.join(', ')}` : ''}
${context?.researchGoals?.length ? `اهداف: ${context.researchGoals.join(', ')}` : ''}

لطفاً پیشنهادهای شما:
- مرتبط با حوزه‌های انتخاب شده باشد
- خلاقانه و نوآورانه باشد
- بین‌رشته‌ای و مکمل باشد
- متنوع و جامع باشد
${context?.researchDomain?.length ? '- متفاوت از حوزه‌های انتخاب شده باشد' : '- مناسب برای نوع پروژه باشد'}

فقط یک آرایه JSON معتبر با فرمت زیر برگردان:
["حوزه اول", "حوزه دوم", "حوزه سوم", "حوزه چهارم", "حوزه پنجم"]`,
          schema: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        keywords: {
          system: 'شما یک دستیار پژوهشی متخصص هستید که کلیدواژه‌های تخصصی پیشنهاد می‌دهید.',
          user: `بر اساس اطلاعات زیر، ۵ کلیدواژه تخصصی و مهم برای این پژوهش پیشنهاد دهید:
${context?.researchDomain?.length ? `حوزه‌های دانشی: ${context.researchDomain.join(', ')}` : ''}
${context?.projectType ? `نوع پروژه: ${context.projectType}` : ''}
${context?.researchGoals?.length ? `اهداف: ${context.researchGoals.join(', ')}` : ''}

کلیدواژه‌ها باید:
- تخصصی و دقیق باشند
- برای جستجو در پایگاه‌های علمی مناسب باشند
- فارسی باشند

فقط یک آرایه JSON معتبر با فرمت زیر برگردان:
["کلیدواژه اول", "کلیدواژه دوم", "کلیدواژه سوم", "کلیدواژه چهارم", "کلیدواژه پنجم"]`,
          schema: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        researchGoals: {
          system: 'شما یک دستیار پژوهشی متخصص هستید که اهداف پژوهشی کاربردی پیشنهاد می‌دهید.',
          user: `بر اساس اطلاعات زیر، ۳ هدف پژوهشی کاربردی و قابل دستیابی پیشنهاد دهید:
${context?.researchDomain?.length ? `حوزه‌های دانشی: ${context.researchDomain.join(', ')}` : ''}
${context?.projectType ? `نوع پروژه: ${context.projectType}` : ''}
${context?.keywords?.length ? `کلیدواژه‌ها: ${context.keywords.join(', ')}` : ''}

اهداف باید:
- کاربردی و قابل دستیابی باشند
- با حوزه دانشی مرتبط باشند
- SMART (مشخص، قابل اندازه‌گیری، دست یافتنی، مرتبط، زمان‌دار) باشند
- فارسی باشند

فقط یک آرایه JSON معتبر با فرمت زیر برگردان:
["هدف اول", "هدف دوم", "هدف سوم"]`,
          schema: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        necessity: {
          system: 'شما یک دستیار پژوهشی متخصص هستید که ضرورت تحقیق را تحلیل و توضیح می‌دهید.',
          user: `بر اساس اطلاعات زیر، ضرورت انجام این پژوهش را در ۲-۳ پاراگراف توضیح دهید:
${context?.researchDomain?.length ? `حوزه‌های دانشی: ${context.researchDomain.join(', ')}` : ''}
${context?.projectType ? `نوع پروژه: ${context.projectType}` : ''}
${context?.keywords?.length ? `کلیدواژه‌ها: ${context.keywords.join(', ')}` : ''}
${context?.researchGoals?.length ? `اهداف: ${context.researchGoals.join(', ')}` : ''}

متن باید شامل:
- چه مشکلی قرار است حل شود
- چه خلاء دانشی را پر می‌کند
- چرا این تحقیق الان ضروری است
- چه نیاز اجتماعی یا علمی پاسخ داده می‌شود

متن ضرورت تحقیق را به فارسی و به صورت علمی بنویسید.

فقط یک آبجکت JSON معتبر با فرمت زیر برگردان:
{"necessity": "متن ضرورت تحقیق"}
`,
          schema: {
            type: 'object',
            properties: {
              necessity: {
                type: 'string',
                description: 'متن ضرورت تحقیق به زبان فارسی',
              },
            },
            required: ['necessity'],
            additionalProperties: false,
          },
        },
        importance: {
          system: 'شما یک دستیار پژوهشی متخصص هستید که اهمیت تحقیق را تحلیل و توضیح می‌دهید.',
          user: `بر اساس اطلاعات زیر، اهمیت این پژوهش را در ۲-۳ پاراگراف توضیح دهید:
${context?.researchDomain?.length ? `حوزه‌های دانشی: ${context.researchDomain.join(', ')}` : ''}
${context?.projectType ? `نوع پروژه: ${context.projectType}` : ''}
${context?.keywords?.length ? `کلیدواژه‌ها: ${context.keywords.join(', ')}` : ''}
${context?.researchGoals?.length ? `اهداف: ${context.researchGoals.join(', ')}` : ''}

متن باید شامل:
- تأثیر علمی، عملیاتی یا اجتماعی پژوهش
- چه ارزشی برای علم، جامعه یا صنعت دارد
- چگونه به دانش فعلی اضافه می‌کند
- کاربردهای عملی یافته‌ها

متن اهمیت تحقیق را به فارسی و به صورت علمی بنویسید.

فقط یک آبجکت JSON معتبر با فرمت زیر برگردان:
{"importance": "متن اهمیت تحقیق"}
`,
          schema: {
            type: 'object',
            properties: {
              importance: {
                type: 'string',
                description: 'متن اهمیت تحقیق به زبان فارسی',
              },
            },
            required: ['importance'],
            additionalProperties: false,
          },
        },
      };

      const promptConfig = prompts[field];
      if (!promptConfig) {
        throw new Error(`Field ${field} not supported`);
      }

      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: promptConfig.system },
        { role: 'user', content: promptConfig.user },
      ];

      const response = await generateStructuredResponse({
        messages,
        schema: promptConfig.schema,
        schemaName: `${field}_suggestions`,
        model: 'google/gemma-3-27b-it',
        maxTokens: 1000,
        temperature: 0.7,
        strict: false,
      });

      return {
        suggestions: response,
        success: true,
      };
    } catch (error: any) {
      console.error(`Error generating AI suggestions for ${request.field}:`, error);
      return {
        suggestions: [],
        success: false,
        error: error.message || 'خطا در دریافت پیشنهادات هوش مصنوعی',
      };
    }
  };

  // Helper function to truncate content
  const truncateContent = (content: string, maxLength: number = 50000): string => {
    if (content.length <= maxLength) return content;
    return `${content.substring(
      0,
      maxLength,
    )}\n\n[محتوا به دلیل طولانی بودن کوتاه شده است. فقط بخش اول مقاله برای استخراج استفاده شده است.]`;
  };

  // Extract basic metadata (authors, year, institution, country, abstract, keywords, relevance)
  const extractBasicMetadata = async (
    truncatedContent: string,
    projectKeywords: string[],
  ): Promise<Partial<ExtractedPaperInfo>> => {
    const schema = {
      type: 'object',
      properties: {
        authors: {
          type: 'array',
          items: { type: 'string' },
          description: 'لیست نویسندگان مقاله',
        },
        year: {
          type: 'number',
          nullable: true,
          description: 'سال انتشار مقاله',
        },
        institution: {
          type: 'string',
          nullable: true,
          description: 'نام پژوهشگاه یا مؤسسه',
        },
        country: {
          type: 'string',
          nullable: true,
          description: 'کشور نویسنده یا مؤسسه',
        },
        abstract: {
          type: 'string',
          nullable: true,
          description: 'چکیده مقاله به زبان اصلی',
        },
        abstractFa: {
          type: 'string',
          nullable: true,
          description: 'ترجمه فارسی چکیده',
        },
        keywords: {
          type: 'array',
          items: { type: 'string' },
          description: 'کلیدواژه‌های مقاله به زبان اصلی',
        },
        keywordsFa: {
          type: 'array',
          items: { type: 'string' },
          nullable: true,
          description: 'ترجمه فارسی کلیدواژه‌ها',
        },
        relevanceScores: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              keyword: { type: 'string', description: 'کلیدواژه پروژه' },
              relevance: {
                type: 'string',
                enum: ['خیلی زیاد', 'زیاد', 'متوسط', 'کم', 'خیلی کم'],
                description: 'میزان ارتباط',
              },
            },
            required: ['keyword', 'relevance'],
          },
          description: 'میزان ارتباط با کلیدواژه‌های پروژه',
        },
      },
      required: ['authors', 'abstract', 'abstractFa', 'keywords', 'keywordsFa', 'relevanceScores'],
      additionalProperties: false,
    };

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      {
        role: 'system',
        content: 'شما یک متخصص تحلیل مقالات علمی هستید. اطلاعات پایه و متادیتای مقاله را استخراج می‌کنید.',
      },
      {
        role: 'user',
        content: `لطفاً اطلاعات پایه زیر را از محتوای مارکداون مقاله استخراج کنید:

${truncatedContent}

${projectKeywords.length > 0 ? `کلیدواژه‌های پروژه برای ارزیابی ارتباط: ${projectKeywords.join(', ')}` : ''}

اطلاعات مورد نیاز:
- نویسندگان: لیست کامل نویسندگان
- سال انتشار: سال انتشار مقاله
- پژوهشگاه/مؤسسه: نام مؤسسه یا دانشگاه
- کشور: کشور نویسنده اصلی یا مؤسسه (در صورت مشخص بودن)
- چکیده: متن چکیده مقاله (به زبان اصلی مقاله)
- چکیده فارسی: ترجمه فارسی چکیده
- کلیدواژه‌ها: کلیدواژه‌های مقاله (به زبان اصلی)
- کلیدواژه‌های فارسی: ترجمه فارسی کلیدواژه‌ها
- میزان ارتباط: برای هر کلیدواژه پروژه، میزان ارتباط را ارزیابی کنید (خیلی زیاد، زیاد، متوسط، کم، خیلی کم)

اگر اطلاعاتی موجود نیست، مقدار null قرار دهید.`,
      },
    ];

    const response = await generateStructuredResponse({
      messages,
      schema,
      schemaName: 'basic_metadata',
      model: 'google/gemma-3-27b-it',
      maxTokens: 3000,
      temperature: 0.7,
      strict: false,
      timeout: 60000,
      retries: 2,
    });

    return response as Partial<ExtractedPaperInfo>;
  };

  // Extract references
  const extractReferences = async (truncatedContent: string): Promise<Partial<ExtractedPaperInfo>> => {
    const schema = {
      type: 'object',
      properties: {
        references: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string', description: 'عنوان مقاله مرجع به زبان اصلی' },
              titleFa: { type: 'string', nullable: true, description: 'ترجمه فارسی عنوان مرجع' },
              authors: {
                type: 'array',
                items: { type: 'string' },
                description: 'نویسندگان مقاله مرجع',
              },
              url: { type: 'string', nullable: true, description: 'لینک مقاله مرجع (در صورت موجود بودن)' },
              doi: { type: 'string', nullable: true, description: 'DOI مقاله مرجع (در صورت موجود بودن)' },
            },
            required: ['title', 'authors'],
          },
          description: 'لیست مقالات استفاده شده',
        },
      },
      required: ['references'],
      additionalProperties: false,
    };

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      {
        role: 'system',
        content: 'شما یک متخصص تحلیل مقالات علمی هستید. مراجع مقاله را استخراج می‌کنید.',
      },
      {
        role: 'user',
        content: `لطفاً مراجع (مقالات استفاده شده) را از محتوای مارکداون مقاله استخراج کنید:

${truncatedContent}

برای هر مرجع، این اطلاعات را استخراج کنید:
- عنوان مقاله (به زبان اصلی)
- ترجمه فارسی عنوان
- نویسندگان
- URL (در صورت موجود بودن)
- DOI (در صورت موجود بودن)

اگر مرجعی موجود نیست، آرایه خالی برگردانید.`,
      },
    ];

    const response = await generateStructuredResponse({
      messages,
      schema,
      schemaName: 'references',
      model: 'google/gemma-3-27b-it',
      maxTokens: 4000,
      temperature: 0.7,
      strict: false,
      timeout: 60000,
      retries: 2,
    });

    return response as Partial<ExtractedPaperInfo>;
  };

  // Extract problem statement and theories
  const extractProblemAndTheories = async (truncatedContent: string): Promise<Partial<ExtractedPaperInfo>> => {
    const schema = {
      type: 'object',
      properties: {
        problemStatement: {
          type: 'string',
          nullable: true,
          description: 'بیان مسئله یا مشکل اصلی که مقاله به آن می‌پردازد (به زبان اصلی)',
        },
        problemStatementFa: {
          type: 'string',
          nullable: true,
          description: 'ترجمه فارسی بیان مسئله',
        },
        theories: {
          type: 'array',
          items: { type: 'string' },
          nullable: true,
          description: 'لیست نظریه‌ها، مدل‌ها یا چارچوب‌های نظری استفاده شده در مقاله (به زبان اصلی)',
        },
        theoriesFa: {
          type: 'array',
          items: { type: 'string' },
          nullable: true,
          description: 'ترجمه فارسی نظریه‌ها',
        },
      },
      required: ['problemStatement', 'problemStatementFa', 'theories', 'theoriesFa'],
      additionalProperties: false,
    };

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      {
        role: 'system',
        content: 'شما یک متخصص تحلیل مقالات علمی هستید. بیان مسئله و نظریه‌های استفاده شده را استخراج می‌کنید.',
      },
      {
        role: 'user',
        content: `لطفاً بیان مسئله و نظریه‌های استفاده شده را از محتوای مارکداون مقاله استخراج کنید:

${truncatedContent}

اطلاعات مورد نیاز:
- بیان مسئله: مسئله یا مشکل اصلی که مقاله به آن می‌پردازد (به زبان اصلی مقاله)
- بیان مسئله فارسی: ترجمه فارسی بیان مسئله
- نظریه‌های استفاده شده: لیست نظریه‌ها، مدل‌ها یا چارچوب‌های نظری که در مقاله استفاده شده‌اند (به زبان اصلی)
- نظریه‌های فارسی: ترجمه فارسی نظریه‌ها

اگر اطلاعاتی موجود نیست، مقدار null قرار دهید.`,
      },
    ];

    const response = await generateStructuredResponse({
      messages,
      schema,
      schemaName: 'problem_theories',
      model: 'google/gemma-3-27b-it',
      maxTokens: 3000,
      temperature: 0.7,
      strict: false,
      timeout: 60000,
      retries: 2,
    });

    return response as Partial<ExtractedPaperInfo>;
  };

  // Extract variables and relationships
  const extractVariablesAndRelationships = async (truncatedContent: string): Promise<Partial<ExtractedPaperInfo>> => {
    const schema = {
      type: 'object',
      properties: {
        relatedVariables: {
          type: 'array',
          items: { type: 'string' },
          nullable: true,
          description: 'متغیرهای مرتبط شناسایی شده در مقاله (به زبان اصلی)',
        },
        relatedVariablesFa: {
          type: 'array',
          items: { type: 'string' },
          nullable: true,
          description: 'ترجمه فارسی متغیرهای مرتبط',
        },
        variableRelationships: {
          type: 'string',
          nullable: true,
          description: 'توضیح روابط بین متغیرها (به زبان اصلی)',
        },
        variableRelationshipsFa: {
          type: 'string',
          nullable: true,
          description: 'ترجمه فارسی روابط بین متغیرها',
        },
        relationshipModeling: {
          type: 'string',
          nullable: true,
          description: 'توضیح مدل‌سازی روابط بین متغیرها (به زبان اصلی)',
        },
        relationshipModelingFa: {
          type: 'string',
          nullable: true,
          description: 'ترجمه فارسی مدل‌سازی روابط',
        },
      },
      required: [
        'relatedVariables',
        'relatedVariablesFa',
        'variableRelationships',
        'variableRelationshipsFa',
        'relationshipModeling',
        'relationshipModelingFa',
      ],
      additionalProperties: false,
    };

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      {
        role: 'system',
        content: 'شما یک متخصص تحلیل مقالات علمی هستید. متغیرها و روابط بین آن‌ها را استخراج می‌کنید.',
      },
      {
        role: 'user',
        content: `لطفاً متغیرهای مرتبط و روابط بین آن‌ها را از محتوای مارکداون مقاله استخراج کنید:

${truncatedContent}

اطلاعات مورد نیاز:
- متغیرهای مرتبط: متغیرهای مرتبط شناسایی شده در مقاله (به زبان اصلی)
- متغیرهای مرتبط فارسی: ترجمه فارسی متغیرهای مرتبط
- روابط بین متغیرها: توضیح روابط بین متغیرها (به زبان اصلی)
- روابط بین متغیرها فارسی: ترجمه فارسی روابط بین متغیرها
- مدل‌سازی روابط: توضیح مدل‌سازی روابط بین متغیرها (به زبان اصلی)
- مدل‌سازی روابط فارسی: ترجمه فارسی مدل‌سازی روابط

اگر اطلاعاتی موجود نیست، مقدار null قرار دهید.`,
      },
    ];

    const response = await generateStructuredResponse({
      messages,
      schema,
      schemaName: 'variables_relationships',
      model: 'google/gemma-3-27b-it',
      maxTokens: 3000,
      temperature: 0.7,
      strict: false,
      timeout: 60000,
      retries: 2,
    });

    return response as Partial<ExtractedPaperInfo>;
  };

  // Extract research evidence and gaps
  const extractEvidenceAndGaps = async (truncatedContent: string): Promise<Partial<ExtractedPaperInfo>> => {
    const schema = {
      type: 'object',
      properties: {
        researchEvidence: {
          type: 'string',
          nullable: true,
          description: 'شواهد پژوهشی که در تایید یا رد ارائه می‌شود (به زبان اصلی)',
        },
        researchEvidenceFa: {
          type: 'string',
          nullable: true,
          description: 'ترجمه فارسی شواهد پژوهشی',
        },
        researchGaps: {
          type: 'string',
          nullable: true,
          description: 'خلاء‌های پژوهشی بیان شده در مقاله (به زبان اصلی)',
        },
        researchGapsFa: {
          type: 'string',
          nullable: true,
          description: 'ترجمه فارسی خلاء‌های پژوهشی',
        },
      },
      required: ['researchEvidence', 'researchEvidenceFa', 'researchGaps', 'researchGapsFa'],
      additionalProperties: false,
    };

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      {
        role: 'system',
        content: 'شما یک متخصص تحلیل مقالات علمی هستید. شواهد پژوهشی و خلاء‌های پژوهشی را استخراج می‌کنید.',
      },
      {
        role: 'user',
        content: `لطفاً شواهد پژوهشی و خلاء‌های پژوهشی را از محتوای مارکداون مقاله استخراج کنید:

${truncatedContent}

اطلاعات مورد نیاز:
- شواهد پژوهشی: شواهد پژوهشی که در تایید یا رد ارائه می‌شود (به زبان اصلی)
- شواهد پژوهشی فارسی: ترجمه فارسی شواهد پژوهشی
- خلاء‌های پژوهشی: خلاء‌های پژوهشی بیان شده در مقاله (به زبان اصلی)
- خلاء‌های پژوهشی فارسی: ترجمه فارسی خلاء‌های پژوهشی

اگر اطلاعاتی موجود نیست، مقدار null قرار دهید.`,
      },
    ];

    const response = await generateStructuredResponse({
      messages,
      schema,
      schemaName: 'evidence_gaps',
      model: 'google/gemma-3-27b-it',
      maxTokens: 3000,
      temperature: 0.7,
      strict: false,
      timeout: 60000,
      retries: 2,
    });

    return response as Partial<ExtractedPaperInfo>;
  };

  // Extract methodology, findings, and limitations
  const extractMethodologyAndResults = async (truncatedContent: string): Promise<Partial<ExtractedPaperInfo>> => {
    const schema = {
      type: 'object',
      properties: {
        methodology: {
          type: 'string',
          nullable: true,
          description: 'روش‌شناسی تحقیق به زبان اصلی',
        },
        methodologyFa: {
          type: 'string',
          nullable: true,
          description: 'ترجمه فارسی روش‌شناسی',
        },
        mainFindings: {
          type: 'string',
          nullable: true,
          description: 'یافته‌های اصلی به زبان اصلی',
        },
        mainFindingsFa: {
          type: 'string',
          nullable: true,
          description: 'ترجمه فارسی یافته‌های اصلی',
        },
        limitations: {
          type: 'string',
          nullable: true,
          description: 'محدودیت‌های تحقیق به زبان اصلی',
        },
        limitationsFa: {
          type: 'string',
          nullable: true,
          description: 'ترجمه فارسی محدودیت‌ها',
        },
      },
      required: ['methodology', 'methodologyFa', 'mainFindings', 'mainFindingsFa', 'limitations', 'limitationsFa'],
      additionalProperties: false,
    };

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      {
        role: 'system',
        content: 'شما یک متخصص تحلیل مقالات علمی هستید. روش‌شناسی، یافته‌ها و محدودیت‌ها را استخراج می‌کنید.',
      },
      {
        role: 'user',
        content: `لطفاً روش‌شناسی، یافته‌های اصلی و محدودیت‌ها را از محتوای مارکداون مقاله استخراج کنید:

${truncatedContent}

اطلاعات مورد نیاز:
- روش‌شناسی: روش تحقیق استفاده شده (به زبان اصلی)
- روش‌شناسی فارسی: ترجمه فارسی روش‌شناسی
- یافته‌های اصلی: یافته‌های کلیدی مقاله (به زبان اصلی)
- یافته‌های اصلی فارسی: ترجمه فارسی یافته‌های اصلی
- محدودیت‌ها: محدودیت‌های تحقیق (به زبان اصلی)
- محدودیت‌های فارسی: ترجمه فارسی محدودیت‌ها

اگر اطلاعاتی موجود نیست، مقدار null قرار دهید.`,
      },
    ];

    const response = await generateStructuredResponse({
      messages,
      schema,
      schemaName: 'methodology_results',
      model: 'google/gemma-3-27b-it',
      maxTokens: 3000,
      temperature: 0.7,
      strict: false,
      timeout: 60000,
      retries: 2,
    });

    return response as Partial<ExtractedPaperInfo>;
  };

  // Generate English keywords for paper search
  const generateEnglishKeywords = async (context: {
    projectType?: string;
    researchDomain?: string[];
    keywords?: string[];
    researchGoals?: string[];
  }): Promise<string[]> => {
    try {
      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        {
          role: 'system',
          content:
            'You are a research assistant specialized in generating English keywords for academic paper searches. Generate relevant, precise, and searchable English keywords suitable for scientific databases like SciHub, PubMed, and Google Scholar.',
        },
        {
          role: 'user',
          content: `Based on the following research project information, generate 5-7 English keywords that are suitable for searching academic papers:

${context.projectType ? `Project Type: ${context.projectType}` : ''}
${context.researchDomain?.length ? `Research Domains: ${context.researchDomain.join(', ')}` : ''}
${context.keywords?.length ? `Current Keywords (Persian): ${context.keywords.join(', ')}` : ''}
${context.researchGoals?.length ? `Research Goals: ${context.researchGoals.join(', ')}` : ''}

The keywords should be:
- In English
- Specific and precise
- Suitable for academic database searches
- Relevant to the research topic
- Professional and scientific

Return only a valid JSON array in this format:
["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]`,
        },
      ];

      const response = await generateStructuredResponse({
        messages,
        schema: {
          type: 'array',
          items: { type: 'string' },
        },
        schemaName: 'english_keywords',
        model: 'mistralai/mistral-saba',
        maxTokens: 500,
        temperature: 0.7,
        strict: false,
      });

      const keywords = Array.isArray(response) ? response : [];

      if (keywords.length === 0) {
        throw new Error('هیچ کلیدواژه‌ای تولید نشد.');
      }

      return keywords;
    } catch (error: any) {
      console.error('Error generating English keywords:', error);
      throw error;
    }
  };

  // Extract structured information from paper markdown
  const extractPaperStructure = async (
    markdownContent: string,
    projectKeywords: string[] = [],
  ): Promise<ExtractedPaperInfo> => {
    try {
      // Limit content length to avoid token limits
      const maxContentLength = 50000;
      const truncatedContent = truncateContent(markdownContent, maxContentLength);

      console.log('شروع استخراج اطلاعات مقاله به صورت موازی (6 درخواست هم‌زمان)...');

      // Execute all extraction tasks in parallel
      const [
        basicMetadata,
        references,
        problemAndTheories,
        variablesAndRelationships,
        evidenceAndGaps,
        methodologyAndResults,
      ] = await Promise.all([
        extractBasicMetadata(truncatedContent, projectKeywords).catch((error) => {
          console.error('خطا در استخراج اطلاعات پایه:', error);
          return {} as Partial<ExtractedPaperInfo>;
        }),
        extractReferences(truncatedContent).catch((error) => {
          console.error('خطا در استخراج مراجع:', error);
          return { references: [] } as Partial<ExtractedPaperInfo>;
        }),
        extractProblemAndTheories(truncatedContent).catch((error) => {
          console.error('خطا در استخراج بیان مسئله و نظریه‌ها:', error);
          return {} as Partial<ExtractedPaperInfo>;
        }),
        extractVariablesAndRelationships(truncatedContent).catch((error) => {
          console.error('خطا در استخراج متغیرها و روابط:', error);
          return {} as Partial<ExtractedPaperInfo>;
        }),
        extractEvidenceAndGaps(truncatedContent).catch((error) => {
          console.error('خطا در استخراج شواهد و خلاء‌های پژوهشی:', error);
          return {} as Partial<ExtractedPaperInfo>;
        }),
        extractMethodologyAndResults(truncatedContent).catch((error) => {
          console.error('خطا در استخراج روش‌شناسی، یافته‌ها و محدودیت‌ها:', error);
          return {} as Partial<ExtractedPaperInfo>;
        }),
      ]);

      console.log('تمام درخواست‌های استخراج کامل شدند.');

      // Combine all results
      const result: ExtractedPaperInfo = {
        ...basicMetadata,
        ...references,
        ...problemAndTheories,
        ...variablesAndRelationships,
        ...evidenceAndGaps,
        ...methodologyAndResults,
      } as ExtractedPaperInfo;

      console.log('استخراج اطلاعات مقاله با موفقیت انجام شد.');

      return result;
    } catch (error: any) {
      console.error('Error extracting paper structure:', error);

      // Provide more helpful error messages
      let errorMessage = 'خطای ناشناخته';
      if (error.message) {
        if (error.message.includes('JSON') || error.message.includes('parse')) {
          errorMessage = 'خطا در پردازش پاسخ هوش مصنوعی. لطفاً دوباره تلاش کنید یا محتوای مقاله را بررسی کنید.';
        } else if (error.message.includes('timeout') || error.message.includes('زمان')) {
          errorMessage = 'زمان پاسخ‌دهی به پایان رسید. لطفاً دوباره تلاش کنید.';
        } else {
          errorMessage = error.message;
        }
      }

      throw new Error(`خطا در استخراج اطلاعات مقاله: ${errorMessage}`);
    }
  };

  const extractHadiStructuredInsights = async (
    markdownContent: string,
  ): Promise<HadiStructuredInsights> => {
    const schema = {
      type: 'object',
      properties: {
        researchType: { type: 'string', nullable: true, description: 'نوع تحقیق یا حوزه کلی به زبان فارسی' },
        variables: { type: 'string', nullable: true, description: 'متغیرهای بررسی شده در تحقیق' },
        questionsOrHypotheses: {
          type: 'string',
          nullable: true,
          description: 'سوالات یا فرضیات تحقیق',
        },
        researchGoals: { type: 'string', nullable: true, description: 'اهداف تحقیق' },
        methodology: { type: 'string', nullable: true, description: 'روش پژوهش' },
        results: { type: 'string', nullable: true, description: 'نتایج یا یافته‌های اصلی' },
        researchGap: { type: 'string', nullable: true, description: 'خلاء پژوهشی شناسایی شده' },
      },
      required: [
        'researchType',
        'variables',
        'questionsOrHypotheses',
        'researchGoals',
        'methodology',
        'results',
        'researchGap',
      ],
      additionalProperties: false,
    };

    const truncatedContent = truncateContent(markdownContent, 50000);

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      {
        role: 'system',
        content:
          'شما هادی هستید؛ یک تحلیلگر پژوهشی که خروجی ساختاریافته بر اساس مقاله فارسی یا انگلیسی ارائه می‌کند.',
      },
      {
        role: 'user',
        content: `بر اساس متن زیر، موارد خواسته‌شده را به زبان فارسی استخراج کن:

متن مقاله:
${truncatedContent}

خروجی باید شامل این فیلدها باشد:
- چه تحقیقاتی: نوع یا حوزه کلی تحقیق
- با چه متغیرهایی: متغیرهای اصلی
- با چه سوال یا فرضیه‌هایی: سوالات یا فرضیات تحقیق
- مبتنی بر چه هدفی: اهداف تحقیق
- با چه روشی: روش پژوهش
- با چه نتایجی: نتایج یا یافته‌های اصلی
- خلاء پژوهشی: خلاء یا نیاز پژوهشی که مقاله اشاره کرده است

فقط یک آبجکت JSON معتبر مطابق schema برگردان.`,
      },
    ];

    const response = await generateStructuredResponse({
      messages,
      schema,
      schemaName: 'hadi_structured_summary',
      model: 'google/gemma-3-27b-it',
      maxTokens: 1500,
      temperature: 0.4,
      strict: false,
    });

    return response as HadiStructuredInsights;
  };

  return {
    getResearchProjects,
    getResearchProject,
    getResearchProjectsByUser,
    createResearchProject,
    updateResearchProject,
    deleteResearchProject,
    generateAISuggestions,
    suggestResearchDomain,
    suggestKeywords,
    suggestResearchGoals,
    suggestNecessity,
    suggestImportance,
    generateEnglishKeywords,
    extractPaperStructure,
    extractHadiStructuredInsights,
  };
}
