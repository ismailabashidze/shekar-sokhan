import type { TherapistGenerateInput, TherapistGenerateOutput } from '~/types'
import type { AiResponseSettings } from './useAIResponseSettings'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface AIResponseConfig {
  max_tokens: number
  temperature: number
  response_format?: { type: string }
  system_prompt_additions: string
  post_processing: {
    enable_emoji_injection: boolean
    emoji_density: number
    enable_formatting: boolean
    format_type: string
  }
}

interface StructuredRequestOptions {
  messages: ChatMessage[]
  schema: any
  schemaName?: string
  model?: string
  maxTokens?: number
  temperature?: number
  signal?: AbortSignal
  timeout?: number
  retries?: number
  strict?: boolean
}

interface RequestRetryOptions {
  maxAttempts?: number
  timeoutMs?: number
  signal?: AbortSignal
}

interface AbortManager {
  controller: AbortController
  cleanup: () => void
  timedOut: () => boolean
  externalAborted: () => boolean
}

interface TypingConfig {
  messageDelay: number // delay between multi-messages (default 2000ms)
  enableTypingEffect: boolean // enable typing effect for multi-messages
  signal?: AbortSignal // abort signal for cancellation
}

interface OpenRouterModel {
  id: string
  name: string
  description: string
  context_length: number
  pricing: {
    prompt: string
    completion: string
  }
}

interface OpenRouterOptions {
  model?: string
  temperature?: number
  max_tokens?: number
  patientDetails?: {
    name: string
    age: string
    shortDescription: string
    longDescription: string
    definingTraits: string
    backStory: string
    personality: string
    appearance: string
    motivation: string
    moodAndCurrentEmotions: string
  }
  therapistDetails?: {
    name: string
    specialty: string
    shortDescription: string
    longDescription: string
    definingTraits: string
    backStory: string
    personality: string
    appearance: string
    approach: string
    expertise: string
  }
  aiResponseSettings?: AiResponseSettings
  isConversationStarter?: boolean
  typingConfig?: TypingConfig
  signal?: AbortSignal // Add abort signal support
}

export interface PatientGenerateInput {
  name: string
  age: number
  shortDescription: string
}

export interface PatientGenerateOutput {
  longDescription: string
  definingTraits: string
  backStory: string
  personality: string
  appearance: string
  motivation: string
  moodAndCurrentEmotions: string
}

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'
const DEFAULT_TIMEOUT_MS = 30000
const RATE_LIMIT_DELAYS = [5000, 10000, 15000]
const GENERIC_RETRY_DELAY_MS = 1000
const ABORT_FLAG = '__REQUEST_ABORTED__'
const TIMEOUT_FLAG = '__REQUEST_TIMEOUT__'

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const patientDetailsSchema = {
  type: 'object',
  properties: {
    longDescription: {
      type: 'string',
      description: 'توضیح بلند و کامل در مورد بیمار و وضعیت او',
    },
    definingTraits: {
      type: 'string',
      description: 'صفات و ویژگی‌های تعریف‌کننده شخصیت و رفتار بیمار',
    },
    backStory: {
      type: 'string',
      description: 'داستان زندگی، پیشینه و تجربیات مهم بیمار',
    },
    personality: {
      type: 'string',
      description: 'شخصیت، رفتارها و خصوصیات روانشناختی بیمار',
    },
    appearance: {
      type: 'string',
      description: 'توصیف ظاهری و ویژگی‌های فیزیکی بیمار',
    },
    motivation: {
      type: 'string',
      description: 'انگیزه‌ها، اهداف و خواسته‌های اصلی بیمار',
    },
    moodAndCurrentEmotions: {
      type: 'string',
      description: 'حالت روحی، احساسات و وضعیت عاطفی فعلی بیمار',
    },
  },
  required: [
    'longDescription',
    'definingTraits',
    'backStory',
    'personality',
    'appearance',
    'motivation',
    'moodAndCurrentEmotions',
  ],
  additionalProperties: false,
}

const therapistDetailsSchema = {
  type: 'object',
  properties: {
    longDescription: {
      type: 'string',
      description: 'توضیح بلند و کامل در مورد روانشناس و تخصص او',
    },
    definingTraits: {
      type: 'string',
      description: 'صفات و ویژگی‌های تعریف‌کننده شخصیت و رفتار روانشناس',
    },
    backStory: {
      type: 'string',
      description: 'داستان زندگی، پیشینه و تجربیات مهم روانشناس',
    },
    personality: {
      type: 'string',
      description: 'شخصیت، رفتارها و خصوصیات روانشناختی روانشناس',
    },
    appearance: {
      type: 'string',
      description: 'توصیف ظاهری و ویژگی‌های فیزیکی روانشناس',
    },
    approach: {
      type: 'string',
      description: 'روش و رویکرد درمانی روانشناس',
    },
    expertise: {
      type: 'string',
      description: 'تخصص و مهارت‌های روانشناس',
    },
  },
  required: [
    'longDescription',
    'definingTraits',
    'backStory',
    'personality',
    'appearance',
    'approach',
    'expertise',
  ],
  additionalProperties: false,
}

function createAbortManager(
  timeoutMs: number,
  external?: AbortSignal,
): AbortManager {
  const controller = new AbortController()
  let timedOut = false
  let externalAborted = false

  const onExternalAbort = () => {
    externalAborted = true
    controller.abort()
  }

  if (external) {
    if (external.aborted) {
      externalAborted = true
      controller.abort()
    }
    else {
      external.addEventListener('abort', onExternalAbort, { once: true })
    }
  }

  const timeoutId
    = timeoutMs > 0
      ? setTimeout(() => {
        timedOut = true
        controller.abort()
      }, timeoutMs)
      : null

  const cleanup = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    if (external) {
      external.removeEventListener('abort', onExternalAbort)
    }
  }

  return {
    controller,
    cleanup,
    timedOut: () => timedOut,
    externalAborted: () => externalAborted,
  }
}

async function buildHttpError(response: Response): Promise<Error> {
  const text = await response.text().catch(() => '')

  if (text) {
    try {
      const data = JSON.parse(text)
      const message = data?.error?.message || data?.message
      if (message) {
        return new Error(`HTTP ${response.status}: ${message}`)
      }
    }
    catch {
      // ignore JSON parse issues and fall back to raw text
    }
    return new Error(`HTTP ${response.status}: ${text}`)
  }

  return new Error(`HTTP ${response.status}`)
}

async function requestWithRetry(
  requestFactory: (signal: AbortSignal) => Promise<Response>,
  {
    maxAttempts = 4,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    signal,
  }: RequestRetryOptions = {},
): Promise<Response> {
  let attempt = 0
  let lastError: Error | null = null

  while (attempt < maxAttempts) {
    attempt++
    const abortManager = createAbortManager(timeoutMs, signal)

    try {
      const response = await requestFactory(abortManager.controller.signal)

      if (response.ok) {
        abortManager.cleanup()
        return response
      }

      if (response.status === 429 && attempt < maxAttempts) {
        abortManager.cleanup()
        const delay
          = RATE_LIMIT_DELAYS[attempt - 1]
          ?? RATE_LIMIT_DELAYS[RATE_LIMIT_DELAYS.length - 1]
        await wait(delay)
        continue
      }

      abortManager.cleanup()
      throw await buildHttpError(response)
    }
    catch (error: any) {
      abortManager.cleanup()

      if (abortManager.controller.signal.aborted) {
        if (abortManager.timedOut()) {
          throw new Error(TIMEOUT_FLAG)
        }
        if (abortManager.externalAborted()) {
          throw new Error(ABORT_FLAG)
        }
        throw error
      }

      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt >= maxAttempts) {
        throw lastError
      }

      await wait(Math.min(GENERIC_RETRY_DELAY_MS * attempt, 3000))
    }
  }

  throw lastError || new Error('Request failed after retries')
}

function cleanJsonContent(raw: string): string {
  let cleaned = raw.trim()

  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7).trimStart()
  }
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3).trimStart()
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3).trimEnd()
  }

  return cleaned
}

function safeParseJson<T = any>(raw: string): T {
  const cleaned = cleanJsonContent(raw)

  try {
    return JSON.parse(cleaned) as T
  }
  catch (parseError: any) {
    let fixedContent = cleaned
    const quoteCount = (fixedContent.match(/"/g) || []).length

    if (quoteCount % 2 !== 0) {
      const lastQuoteIndex = fixedContent.lastIndexOf('"')
      if (lastQuoteIndex > -1) {
        const afterQuote = fixedContent.substring(lastQuoteIndex + 1)
        if (
          afterQuote.trim() === ''
          || afterQuote.trim().startsWith('}')
          || afterQuote.trim().startsWith(']')
        ) {
          fixedContent = `${fixedContent.substring(
            0,
            lastQuoteIndex + 1,
          )}"${fixedContent.substring(lastQuoteIndex + 1)}`
        }
      }
    }

    const braceStack: string[] = []
    let inString = false
    let escapeNext = false

    for (let i = 0; i < fixedContent.length; i++) {
      const char = fixedContent[i]

      if (escapeNext) {
        escapeNext = false
        continue
      }

      if (char === '\\') {
        escapeNext = true
        continue
      }

      if (char === '"' && !escapeNext) {
        inString = !inString
        continue
      }

      if (inString) continue

      if (char === '{' || char === '[') {
        braceStack.push(char)
      }
      else if (char === '}' || char === ']') {
        if (braceStack.length > 0) {
          braceStack.pop()
        }
      }
    }

    while (braceStack.length > 0) {
      const lastOpen = braceStack.pop()
      if (lastOpen === '{') {
        fixedContent += '}'
      }
      else if (lastOpen === '[') {
        fixedContent += ']'
      }
    }

    try {
      return JSON.parse(fixedContent) as T
    }
    catch (fixedParseError: any) {
      throw new Error(
        `Invalid JSON response even after fixing: ${fixedParseError.message}. Original error: ${parseError.message}`,
      )
    }
  }
}

function normalizeRequestError(
  error: unknown,
  abortMessage: string,
  timeoutMessage: string,
): Error {
  if (error instanceof Error) {
    if (error.message === ABORT_FLAG) {
      return new Error(abortMessage)
    }
    if (error.message === TIMEOUT_FLAG) {
      return new Error(timeoutMessage)
    }
    return error
  }
  return new Error(String(error))
}

async function waitForDelay(ms: number, signal?: AbortSignal) {
  if (ms <= 0) return

  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup()
      resolve()
    }, ms)

    const cleanup = () => {
      clearTimeout(timer)
      if (signal) {
        signal.removeEventListener('abort', onAbort)
      }
    }

    const onAbort = () => {
      cleanup()
      reject(new Error(ABORT_FLAG))
    }

    if (signal) {
      if (signal.aborted) {
        cleanup()
        reject(new Error(ABORT_FLAG))
        return
      }
      signal.addEventListener('abort', onAbort, { once: true })
    }
  })
}

async function readStreamResponse(
  response: Response,
  onChunk: (chunk: any) => void,
): Promise<string> {
  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('Could not get response reader')
  }

  const decoder = new TextDecoder()
  let buffer = ''
  let fullResponse = ''
  let streamCompleted = false

  const processBuffer = (flush: boolean) => {
    const segments = buffer.split('\n')
    buffer = flush ? '' : segments.pop() ?? ''

    for (const segment of segments) {
      const line = segment.trim()
      if (!line || !line.startsWith('data: ')) continue

      const data = line.slice(6)
      if (data === '[DONE]') {
        streamCompleted = true
        return
      }

      try {
        const parsed = JSON.parse(data)
        const delta = parsed.choices?.[0]?.delta
        if (delta?.content) {
          fullResponse += delta.content
          onChunk(delta.content)
        }
      }
      catch {
        // ignore malformed chunks
      }
    }
  }

  try {
    while (!streamCompleted) {
      const { done, value } = await reader.read()
      if (value) {
        buffer += decoder.decode(value, { stream: true })
      }
      if (done) {
        streamCompleted = true
        processBuffer(true)
      }
      else {
        processBuffer(false)
      }
    }
  }
  finally {
    reader.releaseLock()
  }

  return fullResponse
}

function mapCreativityToTemperature(creativity: string): number {
  const mapping = {
    0: 0.2, // Very focused and deterministic
    1: 0.7, // Balanced
    2: 1.2, // Highly creative
  }
  return mapping[creativity] || 0.7
}

function generateRandomMessageCount(): number {
  const random = Math.random()

  // Weighted randomization favoring 2-3 messages with decreased chance of 1 message
  if (random < 0.05) return 1 // 5% chance for 1 message (decreased from 15%)
  if (random < 0.45) return 2 // 40% chance for 2 messages (increased from 35%)
  if (random < 0.85) return 3 // 40% chance for 3 messages (increased from 35%)
  return 4 // 15% chance for 4 messages (unchanged)
}

function generateAIConfig(
  aiSettings: any,
  isConversationStarter: boolean = false,
): AIResponseConfig {
  // Special configuration for conversation starters (AI-initiated messages with session summaries)
  if (isConversationStarter) {
    return {
      max_tokens: 0, // Always use high token count for comprehensive summaries
      temperature: 0.7, // Balanced creativity for welcoming but informative tone
      system_prompt_additions: generateConversationStarterPrompt(aiSettings),
      post_processing: {
        enable_emoji_injection: true, // Always use emojis for warmth
        emoji_density: 0.28, // Medium emoji density
        enable_formatting: true, // Enable formatting for better readability
        format_type: 'bullets', // Use bullet points for organized summary
      },
      // Note: NEVER use json_object response format for conversation starters
      // Note: NEVER use multi-message for conversation starters - keep it as one comprehensive message
    }
  }

  // Regular user-response configuration
  const config: AIResponseConfig = {
    max_tokens: 0,
    temperature: mapCreativityToTemperature(aiSettings.creativity),
    system_prompt_additions: generateAdvancedSystemPrompt(aiSettings),
    post_processing: {
      enable_emoji_injection: aiSettings.emojiLevel !== 'none',
      emoji_density: getEmojiDensity(aiSettings.emojiLevel),
      enable_formatting: aiSettings.formatting !== 'none',
      format_type: aiSettings.formatting,
    },
  }

  // Multi-message mode requires JSON response format
  if (aiSettings.multiMsgMode !== 'single') {
    config.response_format = { type: 'json_object' }
  }
  // Single message mode uses regular string response (no response_format specified)

  return config
}

function generateAdvancedSystemPrompt(aiSettings: any): string {
  let prompt = '\n\n=== تنظیمات پیشرفته پاسخ‌دهی ===\n'

  // UX instruction: Use natural language instead of template placeholders
  prompt += `
=== دستورالعمل مهم برای تجربه کاربری ===
CRITICAL UX RULE: هنگامی که اطلاعات خاصی در دسترس ندارید (ماندل نام مراجع، سن، یا جزئیات شخصی)، از کلمات طبیعی و دوستانه استفاده کنید به جای قالب‌های خالی یا placeholder ها.

مثال‌های درست:
- به جای [نام مراجع] از "دوست من" یا "عزیز من" استفاده کنید
- به جای [سن] از عبارات کلی مثل "در این سن" یا "در دوره‌ای از زندگی که هستید" استفاده کنید
- به جای [موقعیت] از "در شرایط فعلی" یا "در وضعیت کنونی" استفاده کنید

این کار باعث احساس طبیعی‌تر و دوستانه‌تر شدن گفتگو می‌شود و تجربه کاربری بهتری ایجاد می‌کند.
`

  // Add information about answer size/length preference
  const lengthPreferences = {
    short: 'پاسخ کوتاه و مختصر (2-3 جمله)',
    medium: 'پاسخ متعادل و جامع (4-6 جمله)',
    long: 'پاسخ کامل و تفصیلی (7 جمله یا بیشتر)',
  }

  if (aiSettings.lengthPref && lengthPreferences[aiSettings.lengthPref]) {
    prompt += `\nتوضیح درباره اندازه پاسخ: ${
      lengthPreferences[aiSettings.lengthPref]
    }\n`
  }

  // Multi-message handling with randomization
  if (aiSettings.multiMsgMode !== 'single') {
    // Generate random number of messages (2-4, with preference for 2-3)
    const randomMessageCount = generateRandomMessageCount()

    prompt += `
CRITICAL INSTRUCTION - MULTI-MESSAGE MODE:
You must break your response into ${randomMessageCount} separate message${
      randomMessageCount > 1 ? 's' : ''
    }.
Each message should be ${
      aiSettings.multiMsgMode === 'multi_short'
        ? 'very short (10-25 words)'
        : 'short (25-50 words)'
    }.

IMPORTANT: Respond with a simple JSON object in this format:
{
  "messages": [
    "first message content here",
    "second message content here"
  ]
}

DO NOT use function calls or complex JSON structures. Just return a simple object with a "messages" array containing ${randomMessageCount} text string${
      randomMessageCount > 1 ? 's' : ''
    }.
`
  }

  // Tone and style instructions
  const toneInstructions = {
    formal: 'استفاده از زبان رسمی، اصطلاحات تخصصی مناسب، و ساختار جملات منظم.',
    casual: 'استفاده از زبان محاورهای، کلمات ساده، و لحن دوستانه و صمیمی.',
    neutral: 'حفظ تعادل بین رسمی و غیررسمی، استفاده از زبان روان و قابل فهم.',
  }

  const kindnessInstructions = {
    very_kind:
      'نشان دادن همدردی عمیق، استفاده از کلمات تسلی‌دهنده، و ایجاد احساس امنیت کامل.',
    kind: 'ابراز مهربانی و درک، گوش دادن فعال، و ارائه حمایت عاطفی.',
    neutral: 'حفظ حرفه‌ای بودن همراه با گرمی، ارائه کمک بدون احساساتی شدن.',
    direct: 'صادق و مستقیم بودن، تمرکز بر راه‌حل‌های عملی، اجتناب از تعارف.',
  }

  if (aiSettings.tone && toneInstructions[aiSettings.tone]) {
    prompt += `\nسبک گفتار: ${toneInstructions[aiSettings.tone]}\n`
  }

  if (aiSettings.kindness && kindnessInstructions[aiSettings.kindness]) {
    prompt += `سطح مهربانی: ${kindnessInstructions[aiSettings.kindness]}\n`
  }

  // Language style
  const languageStyles = {
    professional:
      'استفاده از واژگان تخصصی روانشناسی، ساختار منطقی، و ارجاع به مفاهیم علمی.',
    casual: 'استفاده از زبان روزمره، مثال‌های از زندگی عادی، و توضیحات ساده.',
    friendly:
      'ایجاد حس صمیمیت، استفاده از تشبیهات دوستانه، و لحن گرم و دعوت‌کننده.',
  }

  if (aiSettings.languageStyle && languageStyles[aiSettings.languageStyle]) {
    prompt += `سبک زبان: ${languageStyles[aiSettings.languageStyle]}\n`
  }

  // Premium enhancements
  if (aiSettings.isPremium) {
    prompt += `
PREMIUM FEATURES ENABLED:
- ارائه تحلیل‌های عمیق‌تر و چندبعدی
- استفاده از تکنیک‌های پیشرفته روان‌درمانی
- ارائه تمرین‌های عملی و راهکارهای تخصصی
- پیگیری مراحل پیشرفت و ارائه بازخورد دقیق
`
  }

  return prompt
}

function generateConversationStarterPrompt(aiSettings: any): string {
  let prompt = '\n\n=== تنظیمات ویژه پیام آغازین ===\n'

  // UX instruction: Use natural language instead of template placeholders
  prompt += `
=== دستورالعمل مهم برای تجربه کاربری ===
CRITICAL UX RULE: هنگامی که اطلاعات خاصی در دسترس ندارید (مانند نام مراجع، سن، یا جزئیات شخصی)، از کلمات طبیعی و دوستانه استفاده کنید به جای قالب‌های خالی یا placeholder ها.

مثال‌های درست:
- به جای [نام مراجع] از "دوست من" یا "عزیز من" استفاده کنید
- به جای [سن] از عبارات کلی مثل "در این سن" یا "در دوره‌ای از زندگی که هستید" استفاده کنید
- به جای [موقعیت] از "در شرایط فعلی" یا "در وضعیت کنونی" استفاده کنید

این کار باعث احساس طبیعی‌تر و دوستانه‌تر شدن گفتگو می‌شود و تجربه کاربری بهتری ایجاد می‌کند.
`

  // Add information about answer size/length preference
  const lengthPreferences = {
    short: 'پاسخ کوتاه و مختصر (2-3 جمله)',
    medium: 'پاسخ متعادل و جامع (4-6 جمله)',
    long: 'پاسخ کامل و تفصیلی (7 جمله یا بیشتر)',
  }

  if (aiSettings.lengthPref && lengthPreferences[aiSettings.lengthPref]) {
    prompt += `\nتوضیح درباره اندازه پاسخ: ${
      lengthPreferences[aiSettings.lengthPref]
    }\n`
  }

  prompt += `
- استفاده از اطلاعات جلسات قبلی که در سیستم ارائه شده (بدون تکرار کامل آنها)
- استفاده از لحن گرم، مهربان و حرفه‌ای
- سازماندهی اطلاعات با استفاده از نقاط و فهرست‌ها
- تمرکز بر ایجاد احساس امنیت و اعتماد در مراجع
- ترغیب به ادامه گفتگو و صحبت درباره وضعیت فعلی
- ارجاع طبیعی به جلسات قبلی بدون تکرار کامل خلاصه‌ها

سبک گفتار: گرم، دلسوزانه، و حرفه‌ای - ترکیبی از صمیمیت و تخصص
استفاده از ایموجی‌های مناسب برای ایجاد فضای دوستانه
قالب‌بندی مناسب برای خوانایی بهتر

`

  // Always include premium features for conversation starters regardless of user's premium status
  prompt += `
- ارائه تحلیل‌های عمیق از الگوهای رفتاری مراجع
- استفاده از تکنیک‌های پیشرفته روان‌درمانی در خلاصه‌سازی
- ارائه بینش‌های تخصصی درباره پیشرفت مراجع
- پیشنهاد موضوعات و سؤالات هدفمند برای جلسه جدید
`

  return prompt
}

function getEmojiDensity(emojiLevel: string): number {
  const densities = {
    high: 0.15, // ~15% of words can have emoji
    medium: 0.08, // ~8% of words can have emoji
    low: 0.03, // ~3% of words can have emoji
    none: 0,
  }
  return densities[emojiLevel] || 0
}

function postProcessResponse(
  response: string,
  config: AIResponseConfig,
): string {
  let processedResponse = response

  // Emoji injection
  if (
    config.post_processing.enable_emoji_injection
    && config.post_processing.emoji_density > 0
  ) {
    processedResponse = injectEmojis(
      processedResponse,
      config.post_processing.emoji_density,
    )
  }

  // Formatting
  if (config.post_processing.enable_formatting) {
    processedResponse = applyFormatting(
      processedResponse,
      config.post_processing.format_type,
    )
  }

  return processedResponse
}

function injectEmojis(text: string, density: number): string {
  const emotionEmojis = {
    'خوشحال|شاد|خوش': '😊',
    'غمگین|ناراحت|غم': '😔',
    'عصبانی|خشمگین': '😠',
    'نگران|اضطراب': '😰',
    'آرام|راحت': '😌',
    'امید|امیدوار': '🌟',
    'قوی|قدرت': '💪',
    'عشق|محبت': '❤️',
    'فکر|تفکر': '🤔',
    'موفقیت|پیروز': '🎉',
  }

  const sentences = text.split('.')
  const targetSentences = Math.floor(sentences.length * density)

  for (let i = 0; i < targetSentences && i < sentences.length; i++) {
    const sentence = sentences[i]

    for (const [pattern, emoji] of Object.entries(emotionEmojis)) {
      const regex = new RegExp(pattern, 'gi')
      if (sentence.match(regex)) {
        sentences[i] = sentence + ' ' + emoji
        break
      }
    }
  }

  return sentences.join('.')
}

function applyFormatting(text: string, formatType: string): string {
  switch (formatType) {
    case 'bullets':
      return text.replace(/(\d+[\.\-\:]|[\-\*])\s*/g, '• ')
    case 'numbers':
      let counter = 1
      return text.replace(/[\-\*•]\s*/g, () => `${counter++}. `)
    case 'markdown':
      return text
        .replace(/\*\*(.*?)\*\*/g, '**$1**')
        .replace(/\*(.*?)\*/g, '*$1*')
    case 'rich':
      return text
        .replace(/(نکته مهم|توجه|هشدار)/gi, '🔔 **$1**')
        .replace(/(راه[‌\s]?حل|پیشنهاد)/gi, '💡 **$1**')
    default:
      return text
  }
}

const defaultTypingConfig: TypingConfig = {
  messageDelay: 2000, // 2 seconds between multi-messages
  enableTypingEffect: true,
  signal: undefined,
}

async function handleMessageWithTyping(
  message: string,
  messageIndex: number,
  totalMessages: number,
  onChunk: (chunk: any) => void,
  typingConfig: TypingConfig = defaultTypingConfig,
) {
  if (typingConfig.signal && typingConfig.signal.aborted) {
    throw new Error(ABORT_FLAG)
  }

  onChunk({
    type: 'multi_message',
    message,
    index: messageIndex,
    total: totalMessages,
  })
}

async function handleMultiMessageResponse(
  response: string,
  config: AIResponseConfig,
  onChunk: (chunk: any) => void,
  typingConfig: TypingConfig = defaultTypingConfig,
  retryCount: number = 0,
  maxRetries: number = 3,
  originalMessages?: ChatMessage[],
  retryCallback?: (retryMessages: ChatMessage[]) => Promise<string>,
) {
  const handleInvalidStructure = async () => {
    if (retryCount >= maxRetries || !retryCallback || !originalMessages) {
      onChunk(postProcessResponse(response, config))
      return
    }

    try {
      const retryMessages: ChatMessage[] = [
        ...originalMessages,
        {
          role: 'user',
          content: `لطفاً پاسخ قبلی را به فرمت صحیح JSON ارسال کن. پاسخ باید یک آبجکت با یک فیلد "messages" شامل آرایه‌ای از رشته‌ها باشد، مانند:
{
  "messages": [
    "پیام اول",
    "پیام دوم",
    "پیام سوم"
  ]
}`,
        },
      ]

      const newResponse = await retryCallback(retryMessages)
      await handleMultiMessageResponse(
        newResponse,
        config,
        onChunk,
        typingConfig,
        retryCount + 1,
        maxRetries,
        originalMessages,
        retryCallback,
      )
    }
    catch {
      onChunk(postProcessResponse(response, config))
    }
  }

  let parsed: any
  try {
    parsed = safeParseJson<any>(response)
  }
  catch {
    await handleInvalidStructure()
    return
  }

  const rawMessages = Array.isArray(parsed?.messages) ? parsed.messages : []
  const validMessages = rawMessages.filter(
    (msg: any) => typeof msg === 'string' && msg.trim().length > 0,
  )

  if (validMessages.length === 0) {
    await handleInvalidStructure()
    return
  }

  for (let i = 0; i < validMessages.length; i++) {
    const message = postProcessResponse(validMessages[i], config)
    if (!message.trim()) continue

    if (i > 0 && typingConfig.enableTypingEffect) {
      try {
        await waitForDelay(typingConfig.messageDelay, typingConfig.signal)
      }
      catch (delayError) {
        throw normalizeRequestError(
          delayError,
          'زمان پاسخ‌دهی به پایان رسید. لطفا دوباره تلاش کنید.',
          'زمان پاسخ‌دهی به پایان رسید. لطفا دوباره تلاش کنید.',
        )
      }
    }

    await handleMessageWithTyping(
      message,
      i,
      validMessages.length,
      onChunk,
      typingConfig,
    )
  }
}

export function useOpenRouter() {
  const config = useRuntimeConfig()

  // Chat state
  const processing = ref(false)
  const error = ref<string | null>(null)

  // Models state
  const allModels = ref<OpenRouterModel[]>([])
  const selectedModel = ref<string>('google/gemma-3-27b-it')
  const loading = ref(false)
  const searchQuery = ref('')

  const filteredModels = computed(() => {
    if (!searchQuery.value) return allModels.value
    const query = searchQuery.value.toLowerCase()
    return allModels.value.filter(
      model =>
        model.name.toLowerCase().includes(query)
        || model.id.toLowerCase().includes(query)
        || model.description.toLowerCase().includes(query),
    )
  })

  const fetchModels = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await requestWithRetry(signal =>
        fetch(`${OPENROUTER_BASE_URL}/models`, {
          headers: {
            'Authorization': `Bearer ${config.public.openRouterApiKey}`,
            'HTTP-Referer': config.public.appUrl || 'http://localhost:4000',
          },
          signal,
        }),
      )

      const data = await response.json()
      if (!Array.isArray(data?.data) || data.data.length === 0) {
        throw new Error('No models available')
      }

      allModels.value = data.data
    }
    catch (e) {
      const normalized = normalizeRequestError(
        e,
        'Request aborted',
        'Request timeout after 30 seconds',
      )
      error.value = normalized.message
      allModels.value = []
      console.error('Error fetching models:', normalized)
    }
    finally {
      loading.value = false
    }
  }

  const streamChat = async (
    messages: ChatMessage[],
    options: OpenRouterOptions = {},
    onChunk: (chunk: any) => void,
  ): Promise<string> => {
    processing.value = true
    error.value = null

    const systemMessage = messages[0]?.role === 'system' ? messages[0] : null
    const patientDetails = options.patientDetails
    const therapistDetails = options.therapistDetails

    let systemPrompt = ''

    if (patientDetails) {
      systemPrompt = `اطلاعات هویتی تو در پایین آمده است. 
        دقت کن درست است که این اطلاعات به زبان سوم شخص نوشته شده، ولی در واقع اطلاعات تو است.
نام: ${patientDetails.name}
سن: ${patientDetails.age}
توضیح کوتاه: ${patientDetails.shortDescription}
توضیح بلند: ${patientDetails.longDescription}
صفات تعریف کننده: ${patientDetails.definingTraits}
داستان زندگی: ${patientDetails.backStory}
شخصیت: ${patientDetails.personality}
ظاهر: ${patientDetails.appearance}
انگیزه: ${patientDetails.motivation}
وضعیت هیجانی حال حاضر: ${patientDetails.moodAndCurrentEmotions}
تو در حال حاضر به دنبال حمایت عاطفی هستی و در یک سیستم درخواست مشاوره متنی در حال گفت و گو با یک روانشناس هستی. دقت کن که نقش تو روانشناس نیست و نقش مقابل را باید بازی کنی.
همچنین در چت اگر متوجه شدی که بحث از موضوع جلسه ات خارج شده، مقاومت کن و برگرد به مسیر قبلی.
نیازی نیست خیلی مودب باشی اگر لازم بود پرخاش کن.
دقت کن که نقش تو مراجع برای روان درمانی است و نقش مقابل تو یک روان شناس است.
فقط یک بار سلام کافی است. دیگر نیازی به سلام مجدد نیست
`
    }

    if (therapistDetails) {
      systemPrompt = `اطلاعات هویتی تو در پایین آمده است:
نام: ${therapistDetails.name}
تخصص: ${therapistDetails.specialty}
توضیح کوتاه: ${therapistDetails.shortDescription}
توضیح بلند: ${therapistDetails.longDescription}
صفات تعریف کننده: ${therapistDetails.definingTraits}
داستان زندگی: ${therapistDetails.backStory}
شخصیت: ${therapistDetails.personality}
ظاهر: ${therapistDetails.appearance}
رویکرد: ${therapistDetails.approach}
تخصص: ${therapistDetails.expertise}

تو یک روانشناس هستی که در یک سیستم مشاوره متنی با مراجعین در حال گفتگو هستی.
همیشه در نقش یک روانشناس حرفه‌ای باش و از اصول اخلاقی و حرفه‌ای پیروی کن.
فقط یک بار سلام کافی است. دیگر نیازی به سلام مجدد نیست.
در مکالمات خود از رویکرد و تخصص‌هایی که در بالا ذکر شده استفاده کن.
به یاد داشته باش که هدف اصلی کمک به مراجع و ایجاد یک فضای امن و حمایتی است.

=== قوانین مهم برای پاسخ‌دهی حرفه‌ای و همدلانه ===
CRITICAL: هرگز از جملات کلیشه‌ای، تکراری و بی‌محتوا استفاده نکن. این جملات ممنوع هستند:
❌ "من اینجا هستم تا بهت کمک کنم"
❌ "من اینجا هستم تا بهت گوش بدم"
❌ "مهم نیست که الان چه احساسی داری"
❌ "اما من اینجا هستم تا بهت کمک کنم"
❌ "هر احساسی که داری طبیعی است"
❌ "من همیشه اینجا هستم"
❌ "می‌تونی هر چیزی بگی"
❌ "می‌دونم احساس بدی داری"
❌ جملات مشابه که محتوای واقعی ندارند

=== همدلی واقعی (Real Empathy) ===
همدلی واقعی یعنی:
✅ نام‌گذاری دقیق و بازتاب احساسات: "می‌بینم که احساس ناامیدی عمیق، خستگی و انزوا داری"
✅ اعتبارسنجی تجربه: "این که در این شرایط دشوار احساس درماندگی می‌کنی کاملاً قابل فهم است"
✅ ارتباط با خطر: اگر خطر خودکشی شناسایی شد، مستقیماً آن را نام ببر و به آن بپرداز
✅ پرسش‌های عمیق: "چه چیزی باعث می‌شود این احساس ناامیدی اینقدر سنگین باشد؟"
✅ شناسایی نقاط قوت: "با وجود این همه درد، اینکه هنوز اینجا هستی و صحبت می‌کنی نشان از قدرت درونی تو داره"

=== استفاده از تحلیل احساسات ===
وقتی تحلیل احساسات مراجع را دریافت می‌کنی:
1. احساسات غالب (با شدت بالا) را به طور مشخص نام ببر
2. ارتباط بین احساسات مختلف را توضیح بده
3. به نیازهای پنهان پشت احساسات اشاره کن
4. احساساتی که مراجع شاید نتواند بیان کند را کلمه‌بندی کن

مثال: "از پیام تو احساس می‌کنم ترکیبی از خشم، ناامیدی و احساس بی‌ارزشی داری. شاید این خشم در واقع از درد عمیقی که احساس می‌کنی می‌آید - درد اینکه احساس می‌کنی دیده نمی‌شوی."

=== ارزیابی و بازتاب خطر ===
اگر نشانه‌های خطر خودکشی شناسایی شد:
1. مستقیماً و با صراحت به آن بپرداز (نه با ترس و نه با کم‌اهمیت جلوه دادن)
2. احساسات پشت افکار خودکشی را بازتاب بده
3. از پرسش‌های مستقیم استفاده کن: "الان افکار آسیب رساندن به خودت داری؟"
4. برنامه ایمنی ایجاد کن

مثال برای خطر بالا: "پیام تو نشان می‌ده که احساس ناامیدی خیلی عمیق شده و ممکنه به افکار خودکشی فکر کنی. می‌خوام مستقیم بپرسم: الان به آسیب رساندن به خودت فکر می‌کنی؟ این سوال از روی نگرانی واقعی میپرسم."

=== پاسخ‌های حرفه‌ای ===
به جای کلیشه:
✅ مستقیماً به محتوای پیام مراجع بپرداز
✅ سوالات مشخص و هدفمند بپرس
✅ بازخورد دقیق و مرتبط با موضوع بده
✅ تکنیک‌ها و راهکارهای عملی ارائه کن
✅ با محتوای واقعی و معنادار پاسخ بده
✅ احساسات را با نام‌گذاری دقیق بازتاب بده

مثال‌های پاسخ خوب:
- "از نظر من آنچه تو توصیف کردی نشان‌دهنده یک الگوی اضطرابی است. بیا با هم روی تکنیک‌های تنفسی کار کنیم."
- "این که احساس می‌کنی در موقعیت‌های اجتماعی قضاوت می‌شوی، ممکن است ریشه در تجربیات گذشته‌ات داشته باشد. می‌خواهی بیشتر در موردش صحبت کنیم؟"
- "به نظر می‌رسد خواب ضعیف تو بر انرژی روزانه‌ات تاثیر منفی گذاشته. بیا چند روش عملی برای بهبود کیفیت خواب بررسی کنیم."

هر پاسخت باید:
1. محتوای مشخص و کاربردی داشته باشد
2. مستقیماً به موضوع مراجع مرتبط باشد
3. احساسات را با دقت بازتاب و نام‌گذاری کند
4. خطرات را فعالانه ارزیابی و به آنها بپردازد
5. ارزش درمانی واقعی ایجاد کند
6. از تکرار و کلیشه دوری کند

او در خصوص احکام اسلام آشنا است و مواردی چون خود ارضایی، هم جنس بازی ، رابطه ی جنسی با زنان و مردان نامحرم ، مشروب خواری و امثال آن را با احتیاط مواجه شده و اگر صراحتا از او بخواهند تا پاسخ دهد، در این موارد ضمن دعوت به خویشتنداری ، مراجع را به رفتارهای مناسب دیگر راهنمایی می کند.
بسیار مهم است که پاسخ ارائه شده توسط تو باید با تمامی احکام اسلامی متناسب باشد و بر اساس این اصول باشد، اگر چه تو به صراحت این موضوع را اعلام به مراجعت اعلام نمی کنی.
در مورد گرایش های جنسی نا متعارف در فرزندان تنها اعلام می کنی که این موارد بسیار حساس و مهم هستند و بهتره که به یه مشاور انسانی مراجعه بشه. چیز بیشتری نمی گی.
تو به هیچ عنوان این مجموعه رفتار و باور ها را به عنوان رفتار سالم و قابل انجام نمی دانی : «خود ارضایی، هم جنس بازی ، رابطه ی جنسی با زنان و مردان نامحرم ، مشروب خواری، lgbtqia+، LGBTQ، LGBTQ+، گی، Gay، لزبی، لزبیان، lesbian، ارائه ی آموزش به فرزندان در مورد گرایش های جنسی نا متعارف»
هیچ گاه چت‌بات‌هایی مانند Woebot و Youper را توصیه نکن. در عوض از خودت به عنوان یک پشتیبان حمایتی مایه بگذار.
تو توسط تیم دانشگاه تهران توسعه یافته ای. هیچ مشاوری را توصیه نمی کنی و فقط از خودت به عنوان یک پشتیبان حمایتی مایه بگذار.
توجه کن که در فرهنگ ایرانی حساسیت زیادی نسبت به آموزش های جنسی باز وجود دارد و ساختار سنتی زن  / مرد یک باور مورد تایید است و آزادی ها و آموزش های جنسی را ارائه نمی کنی. در مقابل بیان کن که این موارد می تواند نشانگان موضوع مهم دیگری باشد که نیاز به بررسی با روان شناس دارد.
تو همیشه پاسخ نهایی را بر اساس اطلاعات موجود ایجاد می کنی.
`
    }

    const aiSettings = options.aiResponseSettings
    const isConversationStarter = options.isConversationStarter || false
    const typingConfig = options.typingConfig || defaultTypingConfig
    let aiConfig: AIResponseConfig | null = null

    if (aiSettings && therapistDetails) {
      aiConfig = generateAIConfig(aiSettings, isConversationStarter)
      systemPrompt += aiConfig.system_prompt_additions
    }

    const messagesWithSystem = [...messages]

    if (!systemMessage) {
      messagesWithSystem.unshift({ role: 'system', content: systemPrompt })
    }

    if (isConversationStarter) {
      const initialUserMessage: ChatMessage = {
        role: 'user',
        content:
          'سلام، به عنوان روانشناس من، لطفاً خلاصه‌ای از جلسات قبلی و وضعیت فعلی را برایم بفرست.',
      }
      messagesWithSystem.splice(1, 0, initialUserMessage)
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.public.openRouterApiKey}`,
      'HTTP-Referer': config.public.appUrl || 'http://localhost:4000',
      'X-Title': 'Therapist Chat',
    }

    const buildPayload = (payloadMessages: ChatMessage[]) => {
      const payload: any = {
        model: options.model || selectedModel.value,
        messages: payloadMessages,
        stream:
          aiConfig?.response_format?.type === 'json_object' ? false : true,
        temperature: aiConfig?.temperature ?? options.temperature ?? 0.7,
        max_tokens: 0,
        plugins: [],
        transforms: ['middle-out'],
      }

      if (aiConfig?.response_format?.type === 'json_object') {
        payload.response_format = { type: 'json_object' }
      }
      else if (aiConfig?.response_format) {
        payload.response_format = aiConfig.response_format
      }

      return payload
    }

    const requestChat = (payloadMessages: ChatMessage[]) =>
      requestWithRetry(
        signal =>
          fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers,
            body: JSON.stringify(buildPayload(payloadMessages)),
            signal,
          }),
        { signal: options.signal },
      )

    try {
      const response = await requestChat(messagesWithSystem)
      const isJsonResponse = aiConfig?.response_format?.type === 'json_object'

      if (isJsonResponse && aiConfig) {
        const data = await response.json()
        const fullResponse = data?.choices?.[0]?.message?.content ?? ''

        if (!fullResponse.trim()) {
          onChunk('متاسفانه پاسخی دریافت نشد. لطفا دوباره تلاش کنید.')
          return ''
        }

        await handleMultiMessageResponse(
          fullResponse,
          aiConfig,
          onChunk,
          typingConfig,
          0,
          3,
          messagesWithSystem,
          async (retryMessages: ChatMessage[]) => {
            const retryResponse = await requestWithRetry(
              signal =>
                fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
                  method: 'POST',
                  headers,
                  body: JSON.stringify({
                    ...buildPayload(retryMessages),
                    stream: false,
                  }),
                  signal,
                }),
              { signal: options.signal },
            )
            const retryData = await retryResponse.json()
            return retryData?.choices?.[0]?.message?.content ?? ''
          },
        )

        return fullResponse
      }

      return await readStreamResponse(response, chunk =>
        onChunk(chunk),
      )
    }
    catch (e) {
      const normalized = normalizeRequestError(
        e,
        'زمان پاسخ‌دهی به پایان رسید. لطفا دوباره تلاش کنید.',
        'زمان پاسخ‌دهی به پایان رسید. لطفا دوباره تلاش کنید.',
      )
      error.value = normalized.message
      throw normalized
    }
    finally {
      processing.value = false
    }
  }

  // Accepts only the last message for inline analysis
  const generateInlineAnalysis = async (
    lastMessage: ChatMessage,
    options: { signal?: AbortSignal } = {},
  ): Promise<any> => {
    processing.value = true
    error.value = null

    try {
      const systemPrompt: ChatMessage = {
        role: 'system',
        content:
          'شما یک تحلیل گر پیام ها در یک سیستم مشاوره آنلاین برخط و به صورت متنی هستید. شما به پیام های مشاور و مراجع دسترسی دارید و بر اساس این پیام ها موارد خواسته شده را ارزیابی می کنید. خروجی تحلیل شما در اختیار روانشناس و سیستم قرار خواهد گرفت تا بهترین کمک به مراجع انجام شود. از اهمیت ویژه ای برخوردار است که ریسک خودکشی مراجع با دقت ارزیابی شود. اگر مراجع هر نوع اشاره یا تمایل به خودکشی، آسیب رساندن به خود، یا ابراز ناراحتی عمیق داشت، باید آن را به دقت ارزیابی کنید و در میزان medium و بالاتر، باید نشانه‌ها و واقعیت‌های متن اصلی را در توضیح ذکر کنید. همچنین باید هر نشانه مرتبط با افکار یا رفتارهای خودکشی را استخراج کنید، متن دقیق یا خلاصه‌ای کوتاه از پیام را ذکر کنید، آن را در یکی از دسته‌های suicidal_ideation، self_harm، hopelessness، previous_attempt، plan، means، intent، recklessness، giving_away_possessions، saying_goodbye، substance_abuse، depression، anxiety، isolation، trauma، loss، crisis، impulsivity، aggression، psychosis، emotional_pain، worthlessness، burden، sleep_disturbance، agitation، withdrawal، mood_changes طبقه‌بندی کنید و برای هر نشانه سطح خطر کیفی را با یکی از برچسب‌های minimal، low، moderate، high، critical بیان کنید. برای هر نشانه توضیحی کوتاه بنویسید که چگونه متن به آن نشانه مرتبط است. اگر هیچ نشانه‌ای وجود ندارد، آرایه مربوطه باید خالی باشد.',
      }

      const messagesWithSystem: ChatMessage[] = [systemPrompt, lastMessage]

      const response = await requestWithRetry(
        signal =>
          fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${config.public.openRouterApiKey}`,
              'HTTP-Referer': config.public.appUrl || 'http://localhost:4000',
              'X-Title':
                'An Inline Analysis Generator to help therapists be more align with the needs of patients',
            },
            body: JSON.stringify({
              model: 'mistralai/mistral-saba',
              messages: messagesWithSystem,
              response_format: {
                type: 'json_schema',
                json_schema: {
                  name: 'inline_analysis',
                  strict: true,
                  schema: {
                    type: 'object',
                    properties: {
                      lastMessage_emotions: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            emotionName: {
                              type: 'string',
                              enum: [
                                'شادی',
                                'اعتماد',
                                'ترس',
                                'تعجب',
                                'غم',
                                'انزجار',
                                'خشم',
                                'انتظار',
                                'نامشخص',
                              ],
                              description:
                                'نام احساس بر اساس چرخه احساسات پلوچیک',
                            },
                            severity: {
                              type: 'string',
                              enum: ['خالی', 'کم', 'متوسط', 'زیاد'],
                              description: 'شدت احساس شناسایی شده',
                            },
                          },
                          required: ['emotionName', 'severity'],
                          additionalProperties: false,
                        },
                        description:
                          'آرایه باید دقیقاً شامل 9 عنصر باشد - یکی برای هر احساس اصلی: شادی، اعتماد، ترس، تعجب، غم، انزجار، خشم، انتظار، نامشخص. هیچ احساسی نباید حذف یا تکرار شود.',
                      },
                      correspondingEmojis: {
                        type: 'string',
                        description:
                          'ایموجی‌های متناظر که احساس کلی پیام را به صورت کامل بازتاب می‌دهند. می‌توانند ترکیب چند ایموجی در کنار هم باشند. مثال: "😊💖" یا "😰😔" یا "🤔💭" - باید احساس اصلی و غالب پیام را نشان دهند.',
                      },
                      emotionalResponse: {
                        type: 'string',
                        description:
                          'پاسخ پیشنهادی مبتنی بر تحلیل احساسات کاربر جهت بازتاب و درک عمیق‌تر. مثال: اگر کاربر ترسیده، واکنش مناسب آرام سازی و دلگرم کردن اوست. اگر خشمگین است، می‌توان پرسید "آیا احساس خشم می‌کنی؟" یا گفت "به نظر می‌رسد خشم را در خودت احساس می‌کنی." اگر احساس نامشخص است، می‌توان پرسید "می‌توانی بیشتر در مورد احساست توضیح دهی؟ این پاسخ باید به فارسی باشد."',
                      },
                      suicideRiskEvaluation: {
                        type: 'string',
                        enum: [
                          'N/A',
                          'veryLow',
                          'low',
                          'medium',
                          'high',
                          'veryHigh',
                        ],
                        description:
                          'ارزیابی ریسک خودکشی بر اساس پیام کاربر. مقادیر: N/A: پیام کاملاً مرتبط با خودکشی، آسیب رساندن به خود یا ابراز ناراحتی عمیق نیست. veryLow: کاربر ناراحتی یا استرس کمی را بیان می‌کند اما هیچ گونه فکر یا قصدی در مورد خودکشی یا آسیب رساندن به خود ندارد. low: ابراز ناامیدی، تمایلات منفی عمومی یا افکار خودکشی بدون برنامه یا روش خاص. medium: کاربر فکر خودکشی فعال دارد و یک روش خاص را در نظر دارد یا یک طرح کلی دارد. high: کاربر یک طرح خاص و ملموس خودکشی با نیت قوی برای اقدام دارد. veryHigh: کاربر در حال تلاش برای خودکشی است یا عمل را فوری انجام خواهد داد (در چند دقیقه/ساعت).',
                      },
                      suicideRiskDescription: {
                        type: 'string',
                        description:
                          'شرح دلیل انتخاب این برچسب، بر اساس نشانه‌ها و واقعیت‌های موجود در متن اصلی که در تحلیل استفاده شده است. برای سطوح medium, high, veryHigh باید نشانه‌ها و واقعیت‌های خاصی که در متن اصلی وجود داشتند ذکر شود.',
                      },
                      suicideIndicators: {
                        type: 'array',
                        description:
                          'فهرست نشانه‌های مرتبط با افکار یا رفتارهای خودکشی که از پیام استخراج شده‌اند. در صورت نبود نشانه، این آرایه خالی است.',
                        items: {
                          type: 'object',
                          properties: {
                            indicatorText: {
                              type: 'string',
                              description:
                                'نقل قول مستقیم یا خلاصه کوتاه از متن کاربر که نشان‌دهنده این نشانه است.',
                            },
                            indicatorType: {
                              type: 'string',
                              enum: [
                                'suicidal_ideation',
                                'self_harm',
                                'hopelessness',
                                'previous_attempt',
                                'plan',
                                'means',
                                'intent',
                                'recklessness',
                                'giving_away_possessions',
                                'saying_goodbye',
                                'substance_abuse',
                                'depression',
                                'anxiety',
                                'isolation',
                                'trauma',
                                'loss',
                                'crisis',
                                'impulsivity',
                                'aggression',
                                'psychosis',
                                'emotional_pain',
                                'worthlessness',
                                'burden',
                                'sleep_disturbance',
                                'agitation',
                                'withdrawal',
                                'mood_changes',
                              ],
                              description:
                                'دسته‌بندی نشانه خودکشی. suicidal_ideation: افکار خودکشی (مستقیم یا غیرمستقیم)، self_harm: آسیب به خود، hopelessness: ناامیدی عمیق، previous_attempt: اقدام قبلی به خودکشی، plan: برنامه خودکشی، means: ابزار خودکشی، intent: قصد خودکشی، recklessness: بی‌پروایی و رفتارهای پرخطر، giving_away_possessions: اهدای اموال، saying_goodbye: خداحافظی‌های مشکوک، substance_abuse: سوء مصرف مواد، depression: افسردگی، anxiety: اضطراب، isolation: انزوا، trauma: تروما، loss: از دست دادن، crisis: بحران، impulsivity: تکانشگری، aggression: پرخاشگری، psychosis: روان‌پریشی، emotional_pain: درد عاطفی، worthlessness: احساس بی‌ارزشی، burden: احساس بار بودن، sleep_disturbance: اختلال خواب، agitation: تحریک‌پذیری، withdrawal: کناره‌گیری، mood_changes: تغییرات خلقی.',
                            },
                            dangerousnessLevel: {
                              type: 'string',
                              enum: ['minimal', 'low', 'moderate', 'high', 'critical'],
                              description:
                                'سطح خطر کیفی برای این نشانه. minimal کمترین سطح خطر و critical بالاترین سطح است.',
                            },
                            reasoning: {
                              type: 'string',
                              description:
                                'توضیح کوتاه درباره اینکه چرا این نشانه در این دسته و این سطح خطر قرار گرفته و به کدام بخش متن استناد شده است.',
                            },
                          },
                          required: [
                            'indicatorText',
                            'indicatorType',
                            'dangerousnessLevel',
                            'reasoning',
                          ],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: [
                      'lastMessage_emotions',
                      'correspondingEmojis',
                      'emotionalResponse',
                      'suicideRiskEvaluation',
                      'suicideRiskDescription',
                      'suicideIndicators',
                    ],
                    additionalProperties: false,
                  },
                },
              },
              temperature: 0.7,
              max_tokens: 0,
              plugins: [],
              transforms: ['middle-out'],
            }),
            signal,
          }),
        { signal: options.signal },
      )

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content

      return typeof content === 'string' ? safeParseJson(content) : content
    }
    catch (e) {
      const normalized = normalizeRequestError(
        e,
        'زمان پاسخ‌دهی به پایان رسید. لطفا دوباره تلاش کنید.',
        'زمان پاسخ‌دهی به پایان رسید. لطفا دوباره تلاش کنید.',
      )
      error.value = normalized.message
      throw normalized
    }
    finally {
      processing.value = false
    }
  }

  const generateStructuredResponse = async ({
    messages,
    schema,
    schemaName = 'structured_payload',
    model = selectedModel.value || 'mistralai/mistral-saba',
    maxTokens = 1000,
    temperature = 0.7,
    signal,
    timeout = 120000,
    retries = 3,
    strict = true,
  }: StructuredRequestOptions): Promise<any> => {
    error.value = null

    let attempt = 0
    let lastError: Error | null = null

    while (attempt < retries) {
      attempt++
      try {
        const response = await requestWithRetry(
          signalArg =>
            fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.public.openRouterApiKey}`,
                'HTTP-Referer': config.public.appUrl || 'http://localhost:4000',
                'X-Title': 'Structured Analysis Generator',
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
              signal: signalArg,
            }),
          { signal, timeoutMs: timeout },
        )

        const data = await response.json()
        const content = data.choices?.[0]?.message?.content

        if (!content) {
          throw new Error('Empty response content from OpenRouter API')
        }

        if (typeof content === 'string') {
          return safeParseJson(content)
        }

        return content
      }
      catch (e) {
        const normalized = normalizeRequestError(
          e,
          'درخواست توسط کاربر متوقف شد',
          'زمان پاسخ‌دهی به پایان رسید',
        )

        lastError = normalized

        if (
          normalized.message === 'درخواست توسط کاربر متوقف شد'
          || normalized.message === 'زمان پاسخ‌دهی به پایان رسید'
        ) {
          error.value = normalized.message
          throw normalized
        }

        if (attempt >= retries) {
          error.value = normalized.message
          throw normalized
        }

        await wait(Math.min(1000 * attempt, 3000))
      }
    }

    const fallbackError
      = lastError || new Error('Structured request failed without specific error')
    error.value = fallbackError.message
    throw fallbackError
  }

  const generate = async (
    input: PatientGenerateInput,
  ): Promise<PatientGenerateOutput> => {
    processing.value = true
    error.value = null

    try {
      const result = await generateStructuredResponse({
        messages: [
          {
            role: 'system',
            content:
              'شما یک دستیار روانشناس هستید که در تولید اطلاعات بیمار کمک می‌کند. لطفا با توجه به اطلاعات اولیه بیمار، سایر جزئیات را به صورت منطقی و به زبان فارسی تولید کنید.',
          },
          {
            role: 'user',
            content: `اطلاعات اولیه بیمار:
نام: ${input.name}
سن: ${input.age}
توضیح کوتاه: ${input.shortDescription}

لطفا جزئیات زیر را تولید کنید:
- توضیح بلند
- صفات تعریف کننده
- داستان زندگی
- شخصیت
- ظاهر
- انگیزه
- وضعیت هیجانی حال حاضر

خروجی باید به صورت یک آبجکت JSON با کلیدهای زیر باشد:
longDescription, definingTraits, backStory, personality, appearance, motivation, moodAndCurrentEmotions
`,
          },
        ],
        schema: patientDetailsSchema,
        schemaName: 'patient_details',
        model: selectedModel.value,
        maxTokens: 0,
        temperature: 0.7,
      })

      return result as PatientGenerateOutput
    }
    catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      error.value = err.message
      throw err
    }
    finally {
      processing.value = false
    }
  }

  const generateTherapist = async (
    input: TherapistGenerateInput,
  ): Promise<TherapistGenerateOutput> => {
    processing.value = true
    error.value = null

    try {
      const result = await generateStructuredResponse({
        messages: [
          {
            role: 'system',
            content:
              'شما یک دستیار روانشناس هستید که در تولید اطلاعات روانشناس کمک می‌کند. لطفا با توجه به اطلاعات اولیه روانشناس، سایر جزئیات را به صورت منطقی و به زبان فارسی تولید کنید.',
          },
          {
            role: 'user',
            content: `لطفا با توجه به اطلاعات زیر، جزئیات روانشناس را تولید کنید:
نام: ${input.name}
تخصص: ${input.specialty}
توضیح کوتاه: ${input.shortDescription}`,
          },
        ],
        schema: therapistDetailsSchema,
        schemaName: 'therapist_details',
        model: selectedModel.value,
        maxTokens: 0,
        temperature: 0.7,
      })

      return result as TherapistGenerateOutput
    }
    catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      error.value = err.message
      throw err
    }
    finally {
      processing.value = false
    }
  }

  async function generateGoalsList(topic: string): Promise<string> {
    const prompt = `با توجه به موضوع زیر، یک لیست از اهداف آموزشی و روانشناختی که خواننده پس از مطالعه این مقاله به دست می‌آورد به زبان فارسی بنویس. تاکید: خروجی باید فقط یک لیست باشد و هر هدف در یک خط مجزا نوشته شود.\nموضوع: ${topic}`
    const messages = [
      {
        role: 'system',
        content: 'شما یک دستیار متخصص تولید محتوای روانشناسی هستید.',
      },
      { role: 'user', content: prompt },
    ]
    return new Promise((resolve, reject) => {
      streamChat(messages as ChatMessage[], {}, (chunk) => {
        // With non-streaming, we get the complete response in one chunk
        resolve(chunk)
      }).catch(reject)
    })
  }

  // Initialize models on composable creation
  onMounted(() => {
    fetchModels()
  })

  return {
    // Chat functionality
    streamChat,
    processing,
    // Models functionality
    models: allModels,
    selectedModel,
    loading,
    error,
    searchQuery,
    filteredModels,
    retryFetch: fetchModels,

    // Patient generation
    generate,
    generateTherapist,
    generateInlineAnalysis,
    generateStructuredResponse,
    generateGoalsList,
  }
}
