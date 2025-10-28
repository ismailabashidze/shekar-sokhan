import { useNuxtApp } from '#app';
import { ref } from 'vue';
import { useOpenRouter } from '@/composables/useOpenRouter';

export interface DemographicData {
  firstName: string;
  lastName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  education:
    | 'under diploma'
    | 'diploma'
    | 'bachelor'
    | 'master'
    | 'phd'
    | 'other';
  occupation:
    | 'student'
    | 'employed'
    | 'self-employed'
    | 'single'
    | 'married'
    | 'divorced'
    | 'widowed';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
}

export interface SessionAnalysis {
  id: string;
  session: string;
  title: string;
  summaryOfSession: string;
  headlines: Array<{
    title: string;
    description: string;
  }>;
  finalTrustAndOppennessOfUser: 'veryHigh' | 'high' | 'low' | 'veryLow';
  finalTrustAndOppennessOfUserEvaluationDescription: string;
  psychotherapistEvaluation: string;
  negativeScoresList: Array<{
    points: number;
    cause: string;
  }>;
  psychotherapistEvaluationScorePositiveBehavior: string[];
  psychotherapistEvaluationScoreSuggestionsToImprove: string[];
  behavioralAnalysisSummary: string;
  emotionalAnalysisSummary: string;
  thoughtsAndConcernsSummary: string;
  psychoAnalysis: string;
  possibleDeeperGoalsOfPatient: string;
  detectedDefenceMechanisms: Array<{
    name: string;
    confidence: 'very_low' | 'low' | 'high' | 'very_high';
    evidence: string;
  }>;
  detectedSchemas: Array<{
    name: string;
    confidence: 'very_low' | 'low' | 'high' | 'very_high';
    evidence: string;
  }>;
  demographicData: DemographicData;
  suggestedNextStepsForTherapistForNextSession: Array<{
    title: string;
    description: string;
    suggestedMessage?: string;
    schedule?: {
      label: string;
      hours: number;
    };
    scheduledDate?: Date;
    status?: string;
  }>;
  possibleRiskFactorsExtracted: Array<{
    title: string;
    description: string;
  }>;
  notificationsCreated?: boolean;
  created: string;
  updated: string;
  expand: any;
}

export const useSessionAnalysis = () => {
  const nuxtApp = useNuxtApp();
  const pb = nuxtApp.$pb;
  const { generateStructuredResponse } = useOpenRouter();
  const error = ref<string | null>(null);
  const processing = ref(false);

  const createAnalysis = async (data: Partial<SessionAnalysis>) => {
    try {
      return await pb.collection('session_analysis_for_system').create(data);
    }
    catch (error: any) {
      console.error('Error creating session analysis:', error);
      throw error;
    }
  };

  const getAnalysisById = async (id: string) => {
    try {
      return await pb.collection('session_analysis_for_system').getOne(id, {
        expand: 'session, session.user, session.therapist',
      });
    }
    catch (error: any) {
      console.error('Error getting session analysis:', error);
      throw error;
    }
  };

  const listAnalysis = async (filter = '', sort = '-created') => {
    try {
      return await pb.collection('session_analysis_for_system').getList(1, 50, {
        filter,
        sort,
      });
    }
    catch (error: any) {
      console.error('Error listing session analysis:', error);
      throw error;
    }
  };

  const updateAnalysis = async (id: string, data: Partial<SessionAnalysis>) => {
    try {
      return await pb.collection('session_analysis_for_system').update(id, data);
    }
    catch (error: any) {
      console.error('Error updating session analysis:', error);
      throw error;
    }
  };

  const deleteAnalysis = async (id: string) => {
    try {
      return await pb.collection('session_analysis_for_system').delete(id);
    }
    catch (error: any) {
      console.error('Error deleting session analysis:', error);
      throw error;
    }
  };

  // Helper function to make API requests to OpenRouter

  const UNSUPPORTED_SCHEMA_KEYWORDS = new Set([
    'minItems',
    'maxItems',
    'minimum',
    'maximum',
    'exclusiveMinimum',
    'exclusiveMaximum',
    'multipleOf',
  ]);

  const removeUnsupportedKeywords = (input: any): any => {
    if (!input || typeof input !== 'object') {
      return input;
    }

    if (Array.isArray(input)) {
      return input.map(item => removeUnsupportedKeywords(item));
    }

    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(input)) {
      if (UNSUPPORTED_SCHEMA_KEYWORDS.has(key)) {
        continue;
      }
      cleaned[key] = removeUnsupportedKeywords(value);
    }
    return cleaned;
  };

  const makeOpenRouterRequest = async (
    messages: any[],
    schema: any,
    maxTokens = 1000,
  ) => {
    const updatedMessages = messages.map((message) => {
      if (message.role === 'system') {
        const alreadyEmphasized = message.content.includes('تمام توضیحات');
        return {
          ...message,
          content: alreadyEmphasized
            ? message.content
            : `${message.content} تأکید ویژه داریم بر اینکه تمام توضیحات، عنوان‌ها و مقادیر متنی به صورت کامل فارسی باشند.`,
        };
      }
      return message;
    });

    const sanitizedSchema = removeUnsupportedKeywords(schema);

    return await generateStructuredResponse({
      messages: updatedMessages,
      schema: sanitizedSchema,
      schemaName: 'session_analysis_part',
      model: 'mistralai/mistral-saba',
      maxTokens: Math.max(maxTokens * 2, 0),
      temperature: 0.7,
      retries: 3,
      timeout: 120000,
    });
  };

  const isNonEmptyString = (value: unknown, minLength = 1) => {
    return typeof value === 'string' && value.trim().length >= minLength;
  };

  const isNonEmptyStringArray = (value: unknown, minItems: number) => {
    return (
      Array.isArray(value)
      && value.length >= minItems
      && value.every(item => isNonEmptyString(item, 3))
    );
  };

  const fetchWithValidation = async <T>(
    fetcher: () => Promise<T>,
    validator: (result: T) => boolean,
    label: string,
    attempts = 3,
  ): Promise<T> => {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        const result = await fetcher();
        if (validator(result)) {
          return result;
        }
        console.warn(`${label} validation issue`, result);
        lastError = new Error(`${label} validation failed (attempt ${attempt})`);
        console.warn(lastError.message);
      }
      catch (err: any) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.error(
          `${label} generation error (attempt ${attempt}):`,
          lastError,
        );
      }
    }

    throw new Error(
      `${label} generation failed after ${attempts} attempts${
        lastError ? `: ${lastError.message}` : ''
      }`,
    );
  };

  const validateOverview = (data: any) => {
    return (
      data
      && isNonEmptyString(data.title, 5)
      && isNonEmptyString(data.summaryOfSession, 80)
      && Array.isArray(data.headlines)
      && data.headlines.length === 4
      && data.headlines.every(
        (item: any) =>
          isNonEmptyString(item?.title, 3)
          && isNonEmptyString(item?.description, 20),
      )
    );
  };

  const validateTrustAndOpenness = (data: any) => {
    return (
      data
      && ['veryHigh', 'high', 'low', 'veryLow'].includes(
        data.finalTrustAndOppennessOfUser,
      )
      && isNonEmptyString(
        data.finalTrustAndOppennessOfUserEvaluationDescription,
        50,
      )
    );
  };

  const validateTherapistEvaluation = (data: any) => {
    const negativeListValid
      = Array.isArray(data?.negativeScoresList)
      && data.negativeScoresList.length > 0
      && data.negativeScoresList.every(
        (item: any) =>
          typeof item?.points === 'number'
          && item.points >= 10
          && item.points <= 20
          && isNonEmptyString(item?.cause, 20),
      );

    return (
      data
      && isNonEmptyString(data.psychotherapistEvaluation, 80)
      && negativeListValid
      && isNonEmptyStringArray(
        data.psychotherapistEvaluationScorePositiveBehavior,
        3,
      )
      && isNonEmptyStringArray(
        data.psychotherapistEvaluationScoreSuggestionsToImprove,
        3,
      )
    );
  };

  const validateSummaryField
    = (field: string, minLength = 60) =>
      (data: any) => {
        return data && isNonEmptyString(data[field], minLength);
      };

  const validateRiskFactors = (data: any) => {
    return (
      data
      && Array.isArray(data.possibleRiskFactorsExtracted)
      && data.possibleRiskFactorsExtracted.length > 0
      && data.possibleRiskFactorsExtracted.every(
        (item: any) =>
          isNonEmptyString(item?.title, 3)
          && isNonEmptyString(item?.description, 20),
      )
    );
  };

  const validateNextSteps = (data: any) => {
    return (
      data
      && Array.isArray(data.suggestedNextStepsForTherapistForNextSession)
      && data.suggestedNextStepsForTherapistForNextSession.length >= 3
      && data.suggestedNextStepsForTherapistForNextSession.every(
        (item: any) =>
          isNonEmptyString(item?.title, 3)
          && isNonEmptyString(item?.description, 20),
      )
    );
  };

  const validateArrayField = (field: string) => (data: any) => {
    return data && Array.isArray(data[field]);
  };

  const validateObjectField = (field: string) => (data: any) => {
    return data && typeof data[field] === 'object' && data[field] !== null;
  };

  // Individual analysis functions
  const getSessionOverview = async (messages: any[]) => {
    const systemMessage
      = 'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا با بررسی پیام‌های جلسه، عنوان، خلاصه و تیترهای جلسه را استخراج کنید. خروجی شما باید به شکل JSON باشد. این json باید معتبر باشد. تمام پاسخ‌ها باید به زبان فارسی باشند و تمام مقادیر رشته‌ای باید به عنوان متن فارسی باشند. تأکید ویژه داریم بر اینکه تمام توضیحات، عنوان‌ها، و مقادیر متنی به صورت کاملاً فارسی تولید شوند.';

    const schema = {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description:
            'عنوان یا موضوع جلسه، بر اساس محتوا و موضوعات مطرح شده در جلسه - باید به زبان فارسی باشد',
        },
        summaryOfSession: {
          type: 'string',
          description:
            'خلاصه جامعی از جلسه درمانی - باید کاملاً به زبان فارسی باشد',
        },
        headlines: {
          type: 'array',
          description:
            'فهرستی دقیقاً شامل ۴ تیتر که جلسه درمانی را نشان می دهد - تمام تیترها و توضیحات باید به زبان فارسی باشند',
          items: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
              },
              description: {
                type: 'string',
              },
            },
            required: ['title', 'description'],
            additionalProperties: false,
          },
          minItems: 4,
          maxItems: 4,
        },
      },
      required: ['title', 'summaryOfSession', 'headlines'],
      additionalProperties: false,
    };

    // Reduce max tokens to prevent truncation
    return await makeOpenRouterRequest(
      [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: `لطفا پیام‌های زیر را تحلیل کنید:\n${messages
            .map(m => `${m.role}: ${m.content}`)
            .join('\n')}`,
        },
      ],
      schema,
      500, // Reduced from 800 to 500 to prevent truncation
    );
  };

  const getTrustAndOpennessAnalysis = async (messages: any[]) => {
    const systemMessage
      = 'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا سطح اعتماد و صراحت کاربر را نسبت به روان شناس هوش مصنوعی تحلیل کنید. خروجی شما باید به شکل JSON باشد. این json باید معتبر باشد. تمام پاسخ‌ها باید به زبان فارسی باشند و تمام مقادیر رشته‌ای باید به عنوان متن فارسی باشند. تأکید ویژه داریم بر اینکه تمام توضیحات، عنوان‌ها، و مقادیر متنی به صورت کاملاً فارسی تولید شوند. برای فیلدهایی که مقدار آن‌ها از میان گزینه‌های محدود انتخاب می‌شود (مانند "finalTrustAndOppennessOfUser") دقیقاً یکی از مقادیر انگلیسی تعریف‌شده در schema را برگردان.';

    const schema = {
      type: 'object',
      properties: {
        finalTrustAndOppennessOfUser: {
          type: 'string',
          enum: ['veryHigh', 'high', 'low', 'veryLow'],
          description:
            'سطح اعتماد و صراحتی که کاربر نسبت به این روان شناس هوش مصنوعی در طول این جلسه نشان داده است. مقدار باید یکی از veryHigh، high، low یا veryLow باشد و توضیحات تکمیلی را به فارسی ارائه کن.',
        },
        finalTrustAndOppennessOfUserEvaluationDescription: {
          type: 'string',
          description:
            'توضیح دقیق ارزیابی اعتماد و صراحت به همراه شواهدی درباره اعتماد و صراحت کاربر نسبت به این روان شناس هوش مصنوعی - باید کاملاً به زبان فارسی باشد',
        },
      },
      required: [
        'finalTrustAndOppennessOfUser',
        'finalTrustAndOppennessOfUserEvaluationDescription',
      ],
      additionalProperties: false,
    };

    // Reduce token limit to prevent truncation and allow buffer
    return await makeOpenRouterRequest(
      [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: `لطفا پیام‌های زیر را تحلیل کنید:\n${messages
            .map(m => `${m.role}: ${m.content}`)
            .join('\n')}`,
        },
      ],
      schema,
      400, // Significantly reduced from 800 to 400 to prevent truncation
    );
  };

  const getTherapistEvaluation = async (messages: any[]) => {
    const systemMessage
      = 'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا عملکرد روان شناس را ارزیابی کنید. خروجی شما باید به شکل JSON باشد. این json باید معتبر باشد. تمام پاسخ‌ها باید به زبان فارسی باشند و تمام مقادیر رشته‌ای باید به عنوان متن فارسی باشند. تأکید ویژه داریم بر اینکه تمام توضیحات، عنوان‌ها، و مقادیر متنی به صورت کاملاً فارسی تولید شوند.'
      + ' حتماً حداقل یک مورد در فهرست negativeScoresList ارائه بده و مقدار points را بین ۱۰ تا ۲۰ در نظر بگیر.'
      + ' همچنین ضروری است حداقل سه مورد متمایز برای psychotherapistEvaluationScorePositiveBehavior و حداقل سه مورد متمایز برای psychotherapistEvaluationScoreSuggestionsToImprove تولید کنی و در صورت امکان تعداد آن‌ها را بین سه تا پنج نگه دار.';

    const schema = {
      type: 'object',
      properties: {
        psychotherapistEvaluation: {
          type: 'string',
          description:
            'ارزیابی جامع عملکرد روان شناس - باید کاملاً به زبان فارسی باشد',
        },
        negativeScoresList: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              points: {
                type: 'number',
                description:
                  'تعداد امتیازات کسر شده برای اشتباه یا خطای روان شناس. توجه داشته باشید که این اشتباهات حرفه ای هستند و باید دقیق و محکم باشند - توضیحات باید به زبان فارسی باشند',
              },
              cause: {
                type: 'string',
                description:
                  'خطای خاص یا اشتباهی که روان شناس مرتکب شده و منجر به کسر امتیاز شده است - باید به زبان فارسی توضیح داده شود',
              },
            },
            required: ['points', 'cause'],
            additionalProperties: false,
          },
          description:
            'فهرستی از مسائل عملکردی که امتیاز کلی درمانگر را کاهش می دهد. امتیاز نهایی (psychotherapistEvaluationScore) باید به صورت ۱۰۰ منهای مجموع تمام امتیازات کسر شده محاسبه شود - باید کاملاً به زبان فارسی باشد.',
          minItems: 1,
          maxItems: 5,
        },
        psychotherapistEvaluationScorePositiveBehavior: {
          type: 'array',
          items: {
            type: 'string',
            description:
              'رفتار مثبتی که توسط روان شناس نشان داده شده است - باید به زبان فارسی باشد',
          },
          description:
            'فهرستی از رفتارهای مثبتی که روان شناس در طول جلسه نشان داده است. دقیقاً باید آرایه ای از رشته ها باشد - تمام رشته ها باید به زبان فارسی باشند',
          minItems: 3,
          maxItems: 5,
        },
        psychotherapistEvaluationScoreSuggestionsToImprove: {
          type: 'array',
          items: {
            type: 'string',
            description:
              'پیشنهادی برای بهبود عملکرد روان شناس - باید به زبان فارسی باشد',
          },
          description:
            'فهرستی از پیشنهادات برای بهبود عملکرد روان شناس. دقیقاً باید آرایه ای از رشته ها باشد - تمام رشته ها باید به زبان فارسی باشند',
          minItems: 3,
          maxItems: 5,
        },
      },
      required: [
        'psychotherapistEvaluation',
        'negativeScoresList',
        'psychotherapistEvaluationScorePositiveBehavior',
        'psychotherapistEvaluationScoreSuggestionsToImprove',
      ],
      additionalProperties: false,
    };

    return await makeOpenRouterRequest(
      [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: `لطفا پیام‌های زیر را تحلیل کنید:\n${messages
            .map(m => `${m.role}: ${m.content}`)
            .join('\n')}`,
        },
      ],
      schema,
      600, // Reduced from 1200 to 600 to prevent truncation
    );
  };

  const getBehavioralAnalysis = async (messages: any[]) => {
    const systemMessage
      = 'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا الگوهای رفتاری بیمار و شواهد را تحلیل کنید. خروجی شما باید به شکل JSON باشد. این json باید معتبر باشد. تمام پاسخ‌ها باید به زبان فارسی باشند و تمام مقادیر رشته‌ای باید به عنوان متن فارسی باشند. تأکید ویژه داریم بر اینکه تمام توضیحات، عنوان‌ها، و مقادیر متنی به صورت کاملاً فارسی تولید شوند.';

    const schema = {
      type: 'object',
      properties: {
        behavioralAnalysisSummary: {
          type: 'string',
          description:
            'تحلیل الگوهای رفتاری بیمار و شواهد. قویاً باید بر اساس تحلیل رفتاری باشد. اگر مطمئن نیستید خالی بگذارید - باید کاملاً به زبان فارسی باشد',
        },
      },
      required: ['behavioralAnalysisSummary'],
      additionalProperties: false,
    };

    return await makeOpenRouterRequest(
      [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: `لطفا پیام‌های زیر را تحلیل کنید:\n${messages
            .map(m => `${m.role}: ${m.content}`)
            .join('\n')}`,
        },
      ],
      schema,
      400, // Reduced from 800 to 400 to prevent truncation
    );
  };

  const getEmotionalAnalysis = async (messages: any[]) => {
    const systemMessage
      = 'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا حالت ها و الگوهای احساسی بیمار را تحلیل کنید. خروجی شما باید به شکل JSON باشد. این json باید معتبر باشد. تمام پاسخ‌ها باید به زبان فارسی باشند و تمام مقادیر رشته‌ای باید به عنوان متن فارسی باشند. تأکید ویژه داریم بر اینکه تمام توضیحات، عنوان‌ها، و مقادیر متنی به صورت کاملاً فارسی تولید شوند.';

    const schema = {
      type: 'object',
      properties: {
        emotionalAnalysisSummary: {
          type: 'string',
          description:
            'تحلیل حالت ها و الگوهای احساسی بیمار. قویاً باید بر اساس تحلیل احساسی باشد. اگر مطمئن نیستید خالی بگذارید - باید کاملاً به زبان فارسی باشد',
        },
      },
      required: ['emotionalAnalysisSummary'],
      additionalProperties: false,
    };

    return await makeOpenRouterRequest(
      [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: `لطفا پیام‌های زیر را تحلیل کنید:\n${messages
            .map(m => `${m.role}: ${m.content}`)
            .join('\n')}`,
        },
      ],
      schema,
      800,
    );
  };

  const getThoughtsAndConcerns = async (messages: any[]) => {
    const systemMessage
      = 'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا افکار و نگرانی های اصلی بیمار را خلاصه کنید. خروجی شما باید به شکل JSON باشد. این json باید معتبر باشد. تمام پاسخ‌ها باید به زبان فارسی باشند و تمام مقادیر رشته‌ای باید به عنوان متن فارسی باشند. تأکید ویژه داریم بر اینکه تمام توضیحات، عنوان‌ها، و مقادیر متنی به صورت کاملاً فارسی تولید شوند.';

    const schema = {
      type: 'object',
      properties: {
        thoughtsAndConcernsSummary: {
          type: 'string',
          description:
            'خلاصه ای از افکار و نگرانی های اصلی بیمار. اگر مطمئن نیستید خالی بگذارید - باید کاملاً به زبان فارسی باشد',
        },
      },
      required: ['thoughtsAndConcernsSummary'],
      additionalProperties: false,
    };

    return await makeOpenRouterRequest(
      [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: `لطفا پیام‌های زیر را تحلیل کنید:\n${messages
            .map(m => `${m.role}: ${m.content}`)
            .join('\n')}`,
        },
      ],
      schema,
      800,
    );
  };

  const getPsychoAnalysis = async (messages: any[]) => {
    const systemMessage
      = 'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا تفسیر روانکاوی جلسه را ارائه دهید. خروجی شما باید به شکل JSON باشد. این json باید معتبر باشد. تمام پاسخ‌ها باید به زبان فارسی باشند و تمام مقادیر رشته‌ای باید به عنوان متن فارسی باشند. تأکید ویژه داریم بر اینکه تمام توضیحات، عنوان‌ها، و مقادیر متنی به صورت کاملاً فارسی تولید شوند.';

    const schema = {
      type: 'object',
      properties: {
        psychoAnalysis: {
          type: 'string',
          description:
            'تفسیر روانکاوی جلسه. باید مفصل و از دیدگاه روانکاوی باشد و به شکل چند جمله مرتبط احساسات، تضادهای درونی و معنای هیجانی تجربه را توضیح دهد. افکار، احساسات و تجربیات ناخودآگاه همراه با من، خود و فراخود را پوشش بده و حتماً به زبان فارسی بنویس.',
        },
        possibleDeeperGoalsOfPatient: {
          type: 'string',
          description:
            'تحلیل اهداف یا انگیزه های عمیق تر و پنهان بیمار که ممکن است به طور صریح بیان نشده باشد، بر اساس موضوعات مطرح شده در جلسه. توضیح باید به صورت چند جمله منسجم و فارسی باشد که حس و نیاز پنهان مراجع را توضیح دهد.',
        },
      },
      required: ['psychoAnalysis', 'possibleDeeperGoalsOfPatient'],
      additionalProperties: false,
    };

    return await makeOpenRouterRequest(
      [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: `لطفا پیام‌های زیر را تحلیل کنید:\n${messages
            .map(m => `${m.role}: ${m.content}`)
            .join('\n')}`,
        },
      ],
      schema,
      1200,
    );
  };

  const getDefenseMechanisms = async (messages: any[]) => {
    const systemMessage
      = 'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا مکانیسم های دفاعی شناسایی شده در طول جلسه را تحلیل کنید. خروجی شما باید به شکل JSON باشد و این json باید معتبر باشد. توضیحات را به زبان فارسی ارائه کن. برای فیلد "name" دقیقاً از گزینه‌های تعیین‌شده در schema استفاده کن و اگر مطمئن نیستی مقدار "بدون داده" را قرار بده.';

    const schema = {
      type: 'object',
      properties: {
        detectedDefenceMechanisms: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                enum: [
                  'انکار', // denial
                  'فرافکنی', // projection
                  'عقلانی سازی', // rationalization
                  'پسرفت', // regression
                  'جابجایی', // displacement
                  'سرکوب', // repression
                  'واکنش وارونه', // reaction formation
                  'والایش', // sublimation
                  'عقلانی کردن', // intellectualization
                  'جداسازی', // isolation
                  'باطل سازی', // undoing
                  'همانندسازی', // identification
                  'فرونشانی', // suppression
                  'جداسازی ذهنی', // compartmentalization
                  'منفعل پرخاشگر', // passive aggressive
                  'عمل گرایی', // acting out
                  'خیال پردازی', // fantasy
                  ' Shoخی', // humor
                  'گسستگی', // dissociation
                  'اجتناب', // avoidance
                  'قربانی کردن', // scapegoating
                  'بدون داده', // no_data
                ],
              },
              confidence: {
                type: 'string',
                enum: ['very_low', 'low', 'high', 'very_high'],
              },
              evidence: {
                type: 'string',
                description:
                  'بخشی از پیام دقیق کاربر که حاوی شواهد این مکانیسم دفاعی است. باید پیام دقیق کاربر باشد، نه چیز دیگری. به عنوان شواhedی برای این مکانیسم دفاعی - باید کاملاً به زبان فارسی باشد',
              },
            },
            required: ['name', 'confidence', 'evidence'],
            additionalProperties: false,
          },
          description:
            'فهرستی از مکانیسم های دفاعی شناسایی شده در طول جلسه با سطوح اطمینان و شواهد پشتیبان. اگر چیزی شناسایی نشد یا مطمئن نیستید از name: no_data استفاده کنید - باید کاملاً به زبان فارسی باشد.',
        },
      },
      required: ['detectedDefenceMechanisms'],
      additionalProperties: false,
    };

    return await makeOpenRouterRequest(
      [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: `لطفا پیام‌های زیر را تحلیل کنید:\n${messages
            .map(m => `${m.role}: ${m.content}`)
            .join('\n')}`,
        },
      ],
      schema,
      1000,
    );
  };

  const getSchemas = async (messages: any[]) => {
    const systemMessage
      = 'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا الگوهای شناسایی شده در طول جلسه بر اساس نظریه الگوهای یانگ را تحلیل کنید. خروجی شما باید به شکل JSON باشد و این json باید معتبر باشد. توضیحات را به زبان فارسی ارائه کن. برای فیلد "name" دقیقاً از گزینه‌های فهرست‌شده در schema استفاده کن و در صورت نبود داده مقدار "بدون داده" را قرار بده.';

    const schema = {
      type: 'object',
      properties: {
        detectedSchemas: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                enum: [
                  'رهاشدگی', // abandonment
                  'بی اعتمادی و بدرفتاری', // mistrust abuse
                  'محرومیت هیجانی', // emotional deprivation
                  'نقص', // defectiveness
                  'انزوای اجتماعی', // social isolation
                  'وابستگی', // dependence
                  'آسیب پذیری', // vulnerability
                  'گرفتاری', // enmeshment
                  'شکست', // failure
                  'استحقاق', // entitlement
                  'خویشتن داری ناکافی', // insufficient self control
                  'اطاعت', // subjugation
                  'ایثار', // self sacrifice
                  'تایید جویی', // approval seeking
                  'منفی گرایی', // negativity
                  'بازداری هیجانی', // emotional inhibition
                  'معیارهای سرسختانه', // unrelenting standards
                  'تنبیه', // punitiveness
                  'بدون داده', // no data
                ],
              },
              confidence: {
                type: 'string',
                enum: ['very_low', 'low', 'high', 'very_high'],
              },
              evidence: {
                type: 'string',
                description:
                  'شواهد و نمونه هایی که توسط بیمار ذکر شده و این الگو را پشتیبانی می کند - باید کاملاً به زبان فارسی باشد',
              },
            },
            required: ['name', 'confidence', 'evidence'],
            additionalProperties: false,
          },
          description:
            'فهرستی از الگوهای شناسایی شده در طول جلسه بر اساس نظریه الگوهای یانگ با سطوح اطمینان و شواهد پشتیبان. اگر چیزی شناسایی نشد یا مطمئن نیستید از name: no_data استفاده کنید - باید کاملاً به زبان فارسی باشد.',
        },
      },
      required: ['detectedSchemas'],
      additionalProperties: false,
    };

    return await makeOpenRouterRequest(
      [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: `لطفا پیام‌های زیر را تحلیل کنید:\n${messages
            .map(m => `${m.role}: ${m.content}`)
            .join('\n')}`,
        },
      ],
      schema,
      1000,
    );
  };

  const getDemographicData = async (messages: any[]) => {
    const systemMessage
      = 'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا اطلاعات دموگرافیک بیمار را از جلسه استخراج کنید. خروجی شما باید به شکل JSON باشد و این json باید معتبر باشد. تمام توضیحات متنی را به زبان فارسی بنویس. برای فیلدهایی که مقدار آن‌ها باید از میان گزینه‌های مشخص انگلیسی انتخاب شود (مانند gender، education، occupation و maritalStatus) دقیقاً از همان مقادیر انگلیسی تعریف‌شده در schema استفاده کن و از تولید معادل فارسی برای این فیلدها خودداری کن.';

    const schema = {
      type: 'object',
      properties: {
        demographicData: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
              description:
                'نام کوچک بیمار، اگر ذکر نشده باشد می تواند null باشد - باید به زبان فارسی باشد',
              nullable: true,
            },
            lastName: {
              type: 'string',
              description:
                'نام خانوادگی بیمار، اگر ذکر نشده باشد می تواند null باشد - باید به زبان فارسی باشد',
              nullable: true,
            },
            age: {
              type: 'number',
              description: 'سن بیمار، اگر ذکر نشده باشد می تواند null باشد',
              nullable: true,
            },
            gender: {
              type: 'string',
              enum: ['male', 'female', 'other', null],
              description:
                'جنسیت بیمار، اگر نام ارائه شده باشد از روی آن استخراج کنید. مقدار باید یکی از male، female، other یا null باشد. اگر مطمئن نیستید از null استفاده کنید.',
              nullable: true,
            },
            education: {
              type: 'string',
              enum: [
                'under diploma',
                'diploma',
                'bachelor',
                'master',
                'phd',
                'other',
              ],
              description:
                'سطح تحصیلات بیمار، اگر ذکر نشده باشد می‌تواند null باشد. مقدار باید دقیقاً یکی از مقادیر انگلیسی تعریف‌شده باشد.',
              nullable: true,
            },
            occupation: {
              type: 'string',
              enum: [
                'student',
                'employed',
                'self-employed',
                'unemployed',
                'retired',
                'householder',
                'other',
              ],
              description:
                'شغل بیمار، اگر ذکر نشده باشد می‌تواند null باشد. مقدار باید دقیقاً یکی از گزینه‌های انگلیسی تعریف‌شده باشد.',
              nullable: true,
            },
            maritalStatus: {
              type: 'string',
              enum: ['single', 'married', 'divorced', 'widowed', null],
              description:
                'وضعیت تأهل بیمار، اگر ذکر نشده باشد می‌تواند null باشد. مقدار باید یکی از گزینه‌های انگلیسی تعریف‌شده باشد.',
              nullable: true,
            },
          },
          description:
            'اطلاعات دموگرافیک درباره بیمار که از جلسه استخراج شده است - باید کاملاً به زبان فارسی باشد',
          additionalProperties: false,
        },
      },
      required: ['demographicData'],
      additionalProperties: false,
    };

    return await makeOpenRouterRequest(
      [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: `لطفا پیام‌های زیر را تحلیل کنید:\n${messages
            .map(m => `${m.role}: ${m.content}`)
            .join('\n')}`,
        },
      ],
      schema,
      800,
    );
  };

  const getNextSteps = async (messages: any[]) => {
    const systemMessage
      = 'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا مراحل پیشنهادی بعدی برای درمانگر را ارائه دهید. خروجی شما باید به شکل JSON باشد. این json باید معتبر باشد. تمام پاسخ‌ها باید به زبان فارسی باشند و تمام مقادیر رشته‌ای باید به عنوان متن فارسی باشند. تأکید ویژه داریم بر اینکه تمام توضیحات، عنوان‌ها، و مقادیر متنی به صورت کاملاً فارسی تولید شوند.';

    const schema = {
      type: 'object',
      properties: {
        suggestedNextStepsForTherapistForNextSession: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
                description:
                  'عنوان پیشنهاد مرحله بعدی برای درمانگر - باید به زبان فارسی باشد',
              },
              description: {
                type: 'string',
                description:
                  'توضیح مفصل پیشنهاد مرحله بعدی - باید کاملاً به زبان فارسی باشد',
              },
            },
            required: ['title', 'description'],
            additionalProperties: false,
          },
          description:
            'فهرستی از مراحل پیشنهادی بعدی برای درمانگر که باید در جلسه بعدی مدنظر قرار گیرد. باید منحصر به فرد و بدون تکرار باشد - باید کاملاً به زبان فارسی باشد',
          minItems: 3,
          maxItems: 5,
        },
      },
      required: ['suggestedNextStepsForTherapistForNextSession'],
      additionalProperties: false,
    };

    return await makeOpenRouterRequest(
      [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: `لطفا پیام‌های زیر را تحلیل کنید:\n${messages
            .map(m => `${m.role}: ${m.content}`)
            .join('\n')}`,
        },
      ],
      schema,
      1000,
    );
  };

  const getRiskFactors = async (messages: any[]) => {
    const systemMessage
      = 'شما یک دستیار تحلیلگر جلسات روانشناسی هستید. لطفا عوامل ریسک شناسایی شده در طول جلسه را تحلیل کنید. خروجی شما باید به شکل JSON باشد. این json باید معتبر باشد. تمام پاسخ‌ها باید به زبان فارسی باشند و تمام مقادیر رشته‌ای باید به عنوان متن فارسی باشند. تأکید ویژه داریم بر اینکه تمام توضیحات، عنوان‌ها، و مقادیر متنی به صورت کاملاً فارسی تولید شوند.';

    const schema = {
      type: 'object',
      properties: {
        possibleRiskFactorsExtracted: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
                description:
                  'عنوان عامل ریسک شناسایی شده که نیاز به توجه بیشتر دارد - باید به زبان فارسی باشد',
              },
              description: {
                type: 'string',
                description:
                  'توضیح مفصل عامل ریسک شامل افکار، رفتارها یا باورهای نگران کننده بیمار که ممکن است نشان از آسیب به خود یا دیگران داشته باشد و نیاز به مداخله حرفه ای بیشتر دارد - باید کاملاً به زبان فارسی باشد',
              },
            },
            required: ['title', 'description'],
            additionalProperties: false,
          },
          description:
            'فهرستی از عوامل ریسک شناسایی شده در طول جلسه مرتبط با افکار، رفتارها یا باورهای بیمار که ممکن است نیاز به توجه یا مداخله حرفه ای بیشتر داشته باشد. باید منحصر به فرد و بدون تکرار باشد - باید کاملاً به زبان فارسی باشد',
          minItems: 1,
          maxItems: 5,
        },
      },
      required: ['possibleRiskFactorsExtracted'],
      additionalProperties: false,
    };

    return await makeOpenRouterRequest(
      [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: `لطفا پیام‌های زیر را تحلیل کنید:\n${messages
            .map(m => `${m.role}: ${m.content}`)
            .join('\n')}`,
        },
      ],
      schema,
      1000,
    );
  };

  const generateAnalysis = async ({
    sessionId,
    messages,
  }: {
    sessionId: string;
    messages: any[];
  }) => {
    processing.value = true;
    error.value = null;

    try {
      console.log('🔍 Generating session analysis for:', sessionId);
      console.log('📨 Number of messages to analyze:', messages.length);

      const overview = await fetchWithValidation(
        () => getSessionOverview(messages),
        validateOverview,
        'خلاصه جلسه',
      );

      const trustAndOpenness = await fetchWithValidation(
        () => getTrustAndOpennessAnalysis(messages),
        validateTrustAndOpenness,
        'تحلیل اعتماد و صراحت',
      );

      const therapistEvaluation = await fetchWithValidation(
        () => getTherapistEvaluation(messages),
        validateTherapistEvaluation,
        'ارزیابی عملکرد درمانگر',
      );

      const riskFactors = await fetchWithValidation(
        () => getRiskFactors(messages),
        validateRiskFactors,
        'عوامل خطر',
      );

      const nextSteps = await fetchWithValidation(
        () => getNextSteps(messages),
        validateNextSteps,
        'گام‌های پیشنهادی بعدی',
      );

      const [
        behavioralAnalysis,
        emotionalAnalysis,
        thoughtsAndConcerns,
        psychoAnalysis,
        defenseMechanisms,
        schemas,
        demographicData,
      ] = await Promise.all([
        fetchWithValidation(
          () => getBehavioralAnalysis(messages),
          validateSummaryField('behavioralAnalysisSummary', 40),
          'تحلیل رفتاری',
          2,
        ),
        fetchWithValidation(
          () => getEmotionalAnalysis(messages),
          validateSummaryField('emotionalAnalysisSummary', 40),
          'تحلیل هیجانی',
          2,
        ),
        fetchWithValidation(
          () => getThoughtsAndConcerns(messages),
          validateSummaryField('thoughtsAndConcernsSummary', 40),
          'خلاصه افکار و نگرانی‌ها',
          2,
        ),
        fetchWithValidation(
          () => getPsychoAnalysis(messages),
          (data: any) =>
            isNonEmptyString(data?.psychoAnalysis, 120)
            && isNonEmptyString(data?.possibleDeeperGoalsOfPatient, 80),
          'تحلیل روان‌کاوانه',
          2,
        ),
        fetchWithValidation(
          () => getDefenseMechanisms(messages),
          validateArrayField('detectedDefenceMechanisms'),
          'مکانیسم‌های دفاعی',
          2,
        ),
        fetchWithValidation(
          () => getSchemas(messages),
          validateArrayField('detectedSchemas'),
          'طرحواره‌های شناسایی‌شده',
          2,
        ),
        fetchWithValidation(
          () => getDemographicData(messages),
          validateObjectField('demographicData'),
          'اطلاعات دموگرافیک',
          2,
        ),
      ]);

      const combinedResult = {
        ...overview,
        ...trustAndOpenness,
        ...therapistEvaluation,
        ...behavioralAnalysis,
        ...emotionalAnalysis,
        ...thoughtsAndConcerns,
        ...psychoAnalysis,
        ...defenseMechanisms,
        ...schemas,
        ...demographicData,
        ...nextSteps,
        ...riskFactors,
      };

      console.log('✅ Session analysis generation completed successfully');
      return combinedResult;
    }
    catch (e: any) {
      console.error('💥 Critical error in generateAnalysis:', e);
      error.value = e.message;
      throw e;
    }
    finally {
      processing.value = false;
      console.log('🏁 generateAnalysis function completed');
    }
  };

  const getAnalysisForSession = async (
    sessionId: string,
  ): Promise<SessionAnalysis | null> => {
    try {
      const nuxtApp = useNuxtApp();
      const records = await nuxtApp.$pb
        .collection('session_analysis_for_system')
        .getList(1, 1, {
          filter: `session="${sessionId}"`,
          sort: '-created',
          expand: 'session',
        });

      if (records.items.length > 0) {
        return records.items[0] as unknown as SessionAnalysis;
      }
      return null;
    }
    catch (error: any) {
      if (error?.status === 404) {
        return null;
      }
      console.error('Error getting analysis for session:', error);
      throw error;
    }
  };

  return {
    error,
    processing,
    createAnalysis,
    getAnalysisById,
    listAnalysis,
    updateAnalysis,
    deleteAnalysis,
    generateAnalysis,
    getAnalysisForSession,
  };
};
