interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// Advanced AI Settings Configuration System
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

// Calculate dynamic max_tokens based on length preference
function calculateMaxTokens(lengthPref: string, isPremium: boolean): number {
  const baseTokens = {
    short: 0,
    medium: 0,
    long: 0,
  }
  return baseTokens[lengthPref] || baseTokens.medium
}

// Map creativity to temperature (0-2 scale)
function mapCreativityToTemperature(creativity: string): number {
  const mapping = {
    0: 0.2, // Very focused and deterministic
    1: 0.7, // Balanced
    2: 1.2, // Highly creative
  }
  return mapping[creativity] || 0.7
}

// Generate random message count with preference for 2-3 messages
function generateRandomMessageCount(): number {
  const random = Math.random()

  // Weighted randomization favoring 2-3 messages with decreased chance of 1 message
  if (random < 0.05) return 1 // 5% chance for 1 message (decreased from 15%)
  if (random < 0.45) return 2 // 40% chance for 2 messages (increased from 35%)
  if (random < 0.85) return 3 // 40% chance for 3 messages (increased from 35%)
  return 4 // 15% chance for 4 messages (unchanged)
}

// Generate AI configuration from settings
function generateAIConfig(aiSettings: any, isConversationStarter: boolean = false): AIResponseConfig {
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

// Advanced system prompt generation
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
    prompt += `\nتوضیح درباره اندازه پاسخ: ${lengthPreferences[aiSettings.lengthPref]}\n`
  }

  // Multi-message handling with randomization
  if (aiSettings.multiMsgMode !== 'single') {
    // Generate random number of messages (2-4, with preference for 2-3)
    const randomMessageCount = generateRandomMessageCount()

    prompt += `
CRITICAL INSTRUCTION - MULTI-MESSAGE MODE:
You must break your response into ${randomMessageCount} separate message${randomMessageCount > 1 ? 's' : ''}.
Each message should be ${aiSettings.multiMsgMode === 'multi_short' ? 'very short (10-25 words)' : 'short (25-50 words)'}.

IMPORTANT: Respond with a simple JSON object in this format:
{
  "messages": [
    "first message content here",
    "second message content here"
  ]
}

DO NOT use function calls or complex JSON structures. Just return a simple object with a "messages" array containing ${randomMessageCount} text string${randomMessageCount > 1 ? 's' : ''}.
`
  }

  // Tone and style instructions
  const toneInstructions = {
    formal: 'استفاده از زبان رسمی، اصطلاحات تخصصی مناسب، و ساختار جملات منظم.',
    casual: 'استفاده از زبان محاورهای، کلمات ساده، و لحن دوستانه و صمیمی.',
    neutral: 'حفظ تعادل بین رسمی و غیررسمی، استفاده از زبان روان و قابل فهم.',
  }

  const kindnessInstructions = {
    very_kind: 'نشان دادن همدردی عمیق، استفاده از کلمات تسلی‌دهنده، و ایجاد احساس امنیت کامل.',
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
    professional: 'استفاده از واژگان تخصصی روانشناسی، ساختار منطقی، و ارجاع به مفاهیم علمی.',
    casual: 'استفاده از زبان روزمره، مثال‌های از زندگی عادی، و توضیحات ساده.',
    friendly: 'ایجاد حس صمیمیت، استفاده از تشبیهات دوستانه، و لحن گرم و دعوت‌کننده.',
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

// Generate conversation starter prompt (ignores user settings for comprehensive summaries)
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
    prompt += `\nتوضیح درباره اندازه پاسخ: ${lengthPreferences[aiSettings.lengthPref]}\n`
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

// Get emoji density based on level
function getEmojiDensity(emojiLevel: string): number {
  const densities = {
    high: 0.15, // ~15% of words can have emoji
    medium: 0.08, // ~8% of words can have emoji
    low: 0.03, // ~3% of words can have emoji
    none: 0,
  }
  return densities[emojiLevel] || 0
}

// Post-process response based on settings
function postProcessResponse(response: string, config: AIResponseConfig): string {
  let processedResponse = response

  // Emoji injection
  if (config.post_processing.enable_emoji_injection && config.post_processing.emoji_density > 0) {
    processedResponse = injectEmojis(processedResponse, config.post_processing.emoji_density)
  }

  // Formatting
  if (config.post_processing.enable_formatting) {
    processedResponse = applyFormatting(processedResponse, config.post_processing.format_type)
  }

  return processedResponse
}

// Inject contextual emojis
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

// Apply formatting based on type
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

// Configurable delays for typing effects
interface TypingConfig {
  messageDelay: number // delay between multi-messages (default 2000ms)
  enableTypingEffect: boolean // enable typing effect for multi-messages
  signal?: AbortSignal // abort signal for cancellation
}

const defaultTypingConfig: TypingConfig = {
  messageDelay: 2000, // 2 seconds between multi-messages
  enableTypingEffect: true,
  signal: undefined,
}

// Handle typing effect for multi-message by sending to UI with typing indicator
async function handleMessageWithTyping(message: string, messageIndex: number, totalMessages: number, onChunk: (chunk: any) => void, typingConfig: TypingConfig = defaultTypingConfig) {
  // Check if the operation has been aborted
  if (typingConfig.signal && typingConfig.signal.aborted) {
    throw new Error('زمان پاسخ‌دهی به پایان رسید. لطفا دوباره تلاش کنید.')
  }

  if (!typingConfig.enableTypingEffect) {
    onChunk({ type: 'multi_message', message, index: messageIndex, total: totalMessages })
    return
  }

  // Send the message immediately for typing effect display
  onChunk({ type: 'multi_message', message, index: messageIndex, total: totalMessages })
}

// Handle multi-message JSON responses with delays and retries
async function handleMultiMessageResponse(
  response: string, 
  config: AIResponseConfig, 
  onChunk: (chunk: any) => void, 
  typingConfig: TypingConfig = defaultTypingConfig,
  retryCount: number = 0,
  maxRetries: number = 3,
  originalMessages?: ChatMessage[],
  retryCallback?: (retryMessages: ChatMessage[]) => Promise<string>
) {
  try {
    console.log(`🔄 Processing multi-message response (attempt: ${retryCount + 1}):`, response)
    console.log('📏 Raw response length:', response.length)
    console.log('🧾 First 200 chars:', response.substring(0, 200))

    // Clean the response and try to parse JSON
    let cleanResponse = response.trim()

    // Remove any markdown code blocks if present
    cleanResponse = cleanResponse.replace(/```json\s*\n?/g, '').replace(/```\s*$/g, '')

    console.log('🧽 Cleaned response:', cleanResponse)
    console.log('📏 Cleaned response length:', cleanResponse.length)

    let parsedResponse: any
    let parseErrorOccurred = false
    let parseErrorMessage = ''
    
    try {
      parsedResponse = JSON.parse(cleanResponse)
      console.log('✅ Successfully parsed JSON:', parsedResponse)
      console.log('🔑 Parsed response keys:', Object.keys(parsedResponse))
    }
    catch (parseError) {
      parseErrorOccurred = true
      parseErrorMessage = (parseError as Error).message
      console.error('❌ JSON Parse Error:', parseError)
      console.log('💥 Failed to parse this response:', cleanResponse)
    }

    // Check if we have a valid messages array and valid content
    let hasValidStructure = false
    let validMessages: string[] = []

    if (!parseErrorOccurred && parsedResponse.messages && Array.isArray(parsedResponse.messages)) {
      console.log('🔍 Found messages array:', parsedResponse.messages)
      console.log('📊 Messages array length:', parsedResponse.messages.length)
      console.log('📝 Messages content:', parsedResponse.messages.map((msg, idx) => `${idx + 1}: "${msg}"`))

      // Validate messages array
      if (parsedResponse.messages.length > 0) {
        // Validate each message is a string
        validMessages = parsedResponse.messages.filter(msg =>
          typeof msg === 'string' && msg.trim().length > 0,
        )

        console.log('✅ Valid messages after filtering:', validMessages)
        console.log('📊 Valid messages count:', validMessages.length)

        if (validMessages.length > 0) {
          hasValidStructure = true
        }
      }
    }

    if (hasValidStructure) {
      console.log(`📨 Processing ${validMessages.length} valid messages`)

      // Send messages with delays and typing effect
      for (let i = 0; i < validMessages.length; i++) {
        const message = validMessages[i]
        const processedMessage = postProcessResponse(message, config)

        console.log(`📤 Sending message ${i + 1}:`, processedMessage.substring(0, 50) + '...')

        // Validate processed message
        if (!processedMessage.trim()) {
          console.warn(`⚠️ Empty processed message ${i + 1}, skipping`)
          continue
        }

        // For the first message, send immediately
        if (i === 0) {
          await handleMessageWithTyping(processedMessage, i, validMessages.length, onChunk, typingConfig)
        }
        else {
          // Use configurable delay for subsequent messages
          const delay = typingConfig.messageDelay

          setTimeout(async () => {
            await handleMessageWithTyping(processedMessage, i, validMessages.length, onChunk, typingConfig)
          }, delay * i) // Cumulative delays
        }
      }
    }
    else {
      // If we've reached the max retry count, fall back to single message
      if (retryCount >= maxRetries || !retryCallback || !originalMessages) {
        console.warn('⚠️ Invalid multi-message format after retries, falling back to single message')
        onChunk(postProcessResponse(response, config))
        return
      }

      console.log(`🔄 Attempting retry (${retryCount + 1}/${maxRetries}) for valid JSON response...`)
      
      // Create a new message to request proper JSON format
      const retryMessages: ChatMessage[] = [
        ...originalMessages,  // Include original conversation
        {
          role: 'user',
          content: `لطفاً پاسخ قبلی را به فرمت صحیح JSON ارسال کن. پاسخ باید یک آبجکت با یک فیلد "messages" شامل آرایه‌ای از رشته‌ها باشد، مانند:
{
  "messages": [
    "پیام اول",
    "پیام دوم",
    "پیام سوم"
  ]
}`
        }
      ]

      try {
        // Get new response via retry callback
        const newResponse = await retryCallback(retryMessages)
        
        // Recursively call this function with the new response and incremented retry count
        await handleMultiMessageResponse(
          newResponse,
          config,
          onChunk,
          typingConfig,
          retryCount + 1,
          maxRetries,
          originalMessages,
          retryCallback
        )
      }
      catch (retryError) {
        console.error('❌ Error during retry:', retryError)
        // If retry fails, fall back to single message
        onChunk(postProcessResponse(response, config))
      }
    }
  }
  catch (error) {
    console.error('❌ Error processing multi-message response:', error)

    // If we're in a retry attempt, don't infinitely loop on errors
    if (retryCount >= maxRetries) {
      // Fallback to single message
      onChunk(postProcessResponse(response, config))
    } else {
      // Rethrow to be handled by calling function
      throw error
    }
  }
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

import type { TherapistGenerateInput, TherapistGenerateOutput } from '~/types'
import type { AiResponseSettings } from './useAIResponseSettings'

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
    return allModels.value.filter(model =>
      model.name.toLowerCase().includes(query)
      || model.id.toLowerCase().includes(query)
      || model.description.toLowerCase().includes(query),
    )
  })

  const fetchModels = async () => {
    loading.value = true
    error.value = null

    try {
      // Implement timeout mechanism with retry
      let response: Response | null = null;
      let attempts = 0;
      const maxAttempts = 4; // Initial attempt + 3 retries for 429 errors (5s, 10s, 15s)
      
      while (attempts < maxAttempts) {
        attempts++;
        console.log(`⏳ Attempt ${attempts}/${maxAttempts} to fetch models`);
        
        try {
          response = await Promise.race([
            fetch('https://openrouter.ai/api/v1/models', {
              headers: {
                'Authorization': `Bearer ${config.public.openRouterApiKey}`,
                'HTTP-Referer': config.public.appUrl || 'http://localhost:4000',
              },
            }),
            new Promise((_, reject) => 
              setTimeout(() => {
                console.log('⏰ Request timeout after 30 seconds');
                reject(new Error('Request timeout after 30 seconds'));
              }, 30000)
            )
          ]) as Response;
          
          console.log(`✅ Request successful on attempt ${attempts}`);
          // If we get here, the request was successful
          // Check if response is valid before breaking
          if (response && response.ok) {
            break;
          } else if (response) {
            const errorText = await response.text();
            // Check if it's a 429 error (Too Many Requests)
            if (response.status === 429) {
              console.log(`⚠️ 429 Too Many Requests error received, attempt ${attempts}/${maxAttempts}`);
              if (attempts >= maxAttempts) {
                // If we've exhausted all attempts, throw the error
                throw new Error(`HTTP ${response.status}: ${errorText}`);
              }
              
              // Calculate delay based on attempt number: 5s, 10s, 15s
              let delay = 5000; // First retry after 5 seconds
              if (attempts === 2) delay = 10000; // Second retry after 10 seconds
              if (attempts === 3) delay = 15000; // Third retry after 15 seconds
              
              console.log(`⏳ Waiting ${delay / 1000}s before retrying...`);
              await new Promise(resolve => setTimeout(resolve, delay));
              continue; // Continue to next attempt
            } else {
              // For non-429 errors, throw to trigger regular retry logic
              throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
          }
        } catch (e) {
          console.log(`❌ Attempt ${attempts} failed:`, e);
          if (attempts >= maxAttempts) {
            // Last attempt failed, re-throw the error
            throw e;
          }
          // Retry after 1 second for other errors (not 429)
          console.log('🔄 Retrying in 1 second...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Additional check to ensure we have a valid response
      if (!response) {
        throw new Error('No response received from OpenRouter API after all attempts');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
        throw new Error('No models available')
      }

      allModels.value = data.data
    }
    catch (e: any) {
      error.value = e.message
      console.error('Error fetching models:', e)
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
    try {
      // Add system message with patient/therapist details at the beginning
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

      // Generate advanced AI configuration from settings
      const aiSettings = options.aiResponseSettings
      const isConversationStarter = options.isConversationStarter || false
      const typingConfig = options.typingConfig || defaultTypingConfig
      let aiConfig: AIResponseConfig | null = null

      if (aiSettings && therapistDetails) {
        aiConfig = generateAIConfig(aiSettings, isConversationStarter)
        systemPrompt += aiConfig.system_prompt_additions
      }

      // For AI-initiated conversations, we need both system prompt and initial user message
      // because some LLMs don't support starting with just a system prompt
      let messagesWithSystem = [...messages]; // Start with original messages
      
      // If there's no system message, add our system prompt at the beginning
      if (!systemMessage) {
        messagesWithSystem.unshift({ role: 'system', content: systemPrompt });
      }
      
      // If this is an AI-initiated conversation (conversation starter), 
      // add an initial user message that aligns completely with the system prompt
      // but will never be shown in the conversation
      if (isConversationStarter) {
        // Create an initial user message that aligns with the system prompt
        // This message will be sent to the LLM but not displayed in the UI
        const initialUserMessage: ChatMessage = {
          role: 'user',
          content: 'سلام، به عنوان روانشناس من، لطفاً خلاصه‌ای از جلسات قبلی و وضعیت فعلی را برایم بفرست.' // "Hello, as my psychologist, please send me a summary of previous sessions and current status."
        };
        
        // Insert the user message after the system message (which is always first now)
        messagesWithSystem.splice(1, 0, initialUserMessage);
      }

      // Implement timeout mechanism with retry
      let response: Response | null = null;
      let attempts = 0;
      const maxAttempts = 4; // Initial attempt + 3 retries for 429 errors (5s, 10s, 15s)
      
      while (attempts < maxAttempts) {
        attempts++;
        console.log(`⏳ Attempt ${attempts}/${maxAttempts} to generate chat response`);
        
        try {
          const fetchOptions: RequestInit = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${config.public.openRouterApiKey}`,
              'HTTP-Referer': config.public.appUrl || 'http://localhost:4000',
              'X-Title': 'Therapist Chat',
            },
            body: JSON.stringify({
              model: options.model || selectedModel.value,
              messages: messagesWithSystem,
              stream: aiConfig?.response_format?.type === 'json_object' ? false : true,  // JSON format requires non-streaming
              temperature: aiConfig?.temperature || options.temperature || 0.7,
              max_tokens: 0,
              ...(aiConfig?.response_format?.type !== 'json_object' && aiConfig?.response_format), // Only include response_format if not JSON
              plugins: [],
              transforms: ['middle-out'],
            }),
          };

          // Add abort signal if provided
          if (options.signal) {
            fetchOptions.signal = options.signal;
          }

          response = await Promise.race([
            fetch('https://openrouter.ai/api/v1/chat/completions', fetchOptions),
            new Promise((_, reject) => 
              setTimeout(() => {
                console.log('⏰ Request timeout after 30 seconds');
                reject(new Error('Request timeout after 30 seconds'));
              }, 30000)
            )
          ]) as Response;
          
          console.log(`✅ Request successful on attempt ${attempts}`);
          // If we get here, the request was successful
          // Check if response is valid before breaking
          if (response && response.ok) {
            break;
          } else if (response) {
            const errorText = await response.text();
            // Check if it's a 429 error (Too Many Requests)
            if (response.status === 429) {
              console.log(`⚠️ 429 Too Many Requests error received, attempt ${attempts}/${maxAttempts}`);
              if (attempts >= maxAttempts) {
                // If we've exhausted all attempts, throw the error
                throw new Error(`HTTP ${response.status}: ${errorText}`);
              }
              
              // Calculate delay based on attempt number: 5s, 10s, 15s
              let delay = 5000; // First retry after 5 seconds
              if (attempts === 2) delay = 10000; // Second retry after 10 seconds
              if (attempts === 3) delay = 15000; // Third retry after 15 seconds
              
              console.log(`⏳ Waiting ${delay / 1000}s before retrying...`);
              await new Promise(resolve => setTimeout(resolve, delay));
              continue; // Continue to next attempt
            } else {
              // For non-429 errors, throw to trigger regular retry logic
              throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
          }
        } catch (e) {
          console.log(`❌ Attempt ${attempts} failed:`, e);
          if (attempts >= maxAttempts) {
            // Last attempt failed, re-throw the error
            throw e;
          }
          // Retry after 1 second for other errors (not 429)
          console.log('🔄 Retrying in 1 second...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Additional check to ensure we have a valid response
      if (!response) {
        throw new Error('No response received from OpenRouter API after all attempts');
      }

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage: string
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData?.error?.message || errorData?.message || errorText
        }
        catch {
          errorMessage = errorText
        }

        // Handle authentication errors specifically
        if (errorMessage.includes('No auth credentials found')) {
          throw new Error(`Chat error: No auth credentials found`)
        }

        // Handle abort errors
        if (errorMessage.includes('AbortError') || (options.signal && options.signal.aborted)) {
          throw new Error('زمان پاسخ‌دهی به پایان رسید. لطفا دوباره تلاش کنید.')
        }

        throw new Error(`Chat error: ${errorMessage}`)
      }

      if (aiConfig && aiConfig.response_format?.type === 'json_object') {
        // For JSON responses, we need to get the complete response (non-streaming)
        const data = await response.json()
        const fullResponse = data.choices[0].message.content

        // Validate response is not empty
        if (!fullResponse.trim()) {
          console.error('❌ Empty JSON response received')
          onChunk('متاسفانه پاسخی دریافت نشد. لطفا دوباره تلاش کنید.')
          return ''
        }

        // Handle multi-message JSON response with retry capability
        await handleMultiMessageResponse(
          fullResponse, 
          aiConfig, 
          onChunk, 
          typingConfig,
          0, // initial retry count
          3, // max retries
          messagesWithSystem, // original messages for retry context
          async (retryMessages: ChatMessage[]) => {
            // Create a new request with the same configuration but different messages
            const retryResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.public.openRouterApiKey}`,
                'HTTP-Referer': config.public.appUrl || 'http://localhost:4000',
                'X-Title': 'Therapist Chat',
              },
              body: JSON.stringify({
                model: options.model || selectedModel.value,
                messages: retryMessages,
                stream: false,  // JSON format requires non-streaming
                temperature: aiConfig?.temperature || options.temperature || 0.7,
                max_tokens: 0,
                response_format: { type: 'json_object' }, // Ensure JSON format for retry
                plugins: [],
                transforms: ['middle-out'],
              }),
              signal: options.signal
            });

            if (!retryResponse.ok) {
              const errorText = await retryResponse.text();
              throw new Error(`Retry request failed: ${errorText}`);
            }

            const retryData = await retryResponse.json();
            return retryData.choices[0].message.content;
          }
        )
        
        return fullResponse
      }
      else {
        // Handle regular streaming text response
        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('Could not get response reader')
        }

        const decoder = new TextDecoder()
        let buffer = ''
        let fullResponse = '' // Accumulate the full response

        try {
          while (true) {
            const { done, value } = await reader.read()
            
            if (done) {
              break
            }

            // Decode the chunk and add to buffer
            const chunk = decoder.decode(value, { stream: true })
            buffer += chunk

            // Process complete lines in the buffer
            let lines = buffer.split('\n')
            buffer = lines.pop() || '' // Keep incomplete line in buffer

            for (const line of lines) {
              if (line.trim() === '') continue
              if (line.startsWith('data: ')) {
                const data = line.slice(6) // Remove 'data: ' prefix

                if (data === '[DONE]') {
                  break // Stream completed
                }

                try {
                  const parsed = JSON.parse(data)
                  
                  if (parsed.choices && parsed.choices.length > 0) {
                    const delta = parsed.choices[0].delta
                    
                    if (delta && delta.content) {
                      // Accumulate the response
                      fullResponse += delta.content
                      // Send the chunk content to the callback for real-time display
                      onChunk(delta.content)
                    }
                  }
                } catch (e) {
                  console.error('Error parsing stream data:', e)
                  console.error('Problematic data:', data)
                }
              }
            }
          }

          // Process any remaining data in buffer after stream ends
          if (buffer.trim()) {
            let lines = buffer.split('\n')
            for (const line of lines) {
              if (line.trim() === '') continue
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') {
                  break
                }

                try {
                  const parsed = JSON.parse(data)
                  
                  if (parsed.choices && parsed.choices.length > 0) {
                    const delta = parsed.choices[0].delta
                    
                    if (delta && delta.content) {
                      // Accumulate the response
                      fullResponse += delta.content
                      // Send the chunk content to the callback for real-time display
                      onChunk(delta.content)
                    }
                  }
                } catch (e) {
                  console.error('Error parsing buffered stream data:', e)
                }
              }
            }
          }
          
          return fullResponse
        } finally {
          reader.releaseLock()
        }
      }
    }
    catch (e: any) {
      error.value = e.message
      throw e
    }
    finally {
      processing.value = false
    }
  }

  // Accepts only the last message for inline analysis
  const generateInlineAnalysis = async (
    lastMessage: ChatMessage,
    options: { signal?: AbortSignal } = {}
  ): Promise<any> => {
    processing.value = true
    error.value = null

    try {
      // System prompt for analysis
      const systemPrompt: ChatMessage = {
        role: 'system',
        content: 'شما یک تحلیل گر پیام ها در یک سیستم مشاوره آنلاین برخط و به صورت متنی هستید. شما به پیام های مشاور و مراجع دسترسی دارید و بر اساس این پیام ها موارد خواسته شده را ارزیابی می کنید. برخی از این موارد مربوط به پیام آخر، برخی مربوط به سه پیام آخر و برخی نیز مربوط به کل جلسه هستند. خروجی تحلیل شما در اختیار روانشناس و سیستم قرار خواهد گرفت تا بهترین کمک به مراجع انجام شود. از اهمیت ویژه ای برخوردار است که ریسک خودکشی مراجع با دقت ارزیابی شود. اگر مراجع هر نوع اشاره یا تمایل به خودکشی، آسیب رساندن به خود، یا ابراز ناراحتی عمیق داشت، باید آن را به دقت ارزیابی کنید و در میزان medium و بالاتر، باید نشانه‌ها و واقعیت‌های متن اصلی را در توضیح ذکر کنید.',
      }
      // Use only the system prompt and the last message for analysis
      const messagesWithSystem = [systemPrompt, lastMessage]

      // Create fetch options with potential abort signal
      const fetchOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.public.openRouterApiKey}`,
          'HTTP-Referer': config.public.appUrl || 'http://localhost:4000',
          'X-Title': 'An Inline Analysis Generator to help therapists be more align with the needs of patients',
        },
        body: JSON.stringify({
          model: "mistralai/mistral-saba",
          messages: messagesWithSystem as ChatMessage[],
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
                          enum: ['شادی', 'اعتماد', 'ترس', 'تعجب', 'غم', 'انزجار', 'خشم', 'انتظار', 'نامشخص'],
                          description: 'نام احساس بر اساس چرخه احساسات پلوچیک',
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
                    description: 'آرایه باید دقیقاً شامل 9 عنصر باشد - یکی برای هر احساس اصلی: شادی، اعتماد، ترس، تعجب، غم، انزجار، خشم، انتظار، نامشخص. هیچ احساسی نباید حذف یا تکرار شود.',
                  },
                  correspondingEmojis: {
                    type: 'string',
                    description: 'ایموجی‌های متناظر که احساس کلی پیام را به صورت کامل بازتاب می‌دهند. می‌توانند ترکیب چند ایموجی در کنار هم باشند. مثال: "😊💖" یا "😰😔" یا "🤔💭" - باید احساس اصلی و غالب پیام را نشان دهند.',
                  },
                  emotionalResponse: {
                    type: 'string',
                    description: 'پاسخ پیشنهادی مبتنی بر تحلیل احساسات کاربر جهت بازتاب و درک عمیق‌تر. مثال: اگر کاربر ترسیده، واکنش مناسب آرام سازی و دلگرم کردن اوست. اگر خشمگین است، می‌توان پرسید "آیا احساس خشم می‌کنی؟" یا گفت "به نظر می‌رسد خشم را در خودت احساس می‌کنی." اگر احساس نامشخص است، می‌توان پرسید "می‌توانی بیشتر در مورد احساست توضیح دهی؟ این پاسخ باید به فارسی باشد."',
                  },
                  suicideRiskEvaluation: {
                    type: 'string',
                    enum: ['N/A', 'veryLow', 'low', 'medium', 'high', 'veryHigh'],
                    description: 'ارزیابی ریسک خودکشی بر اساس پیام کاربر. مقادیر: N/A: پیام کاملاً مرتبط با خودکشی، آسیب رساندن به خود یا ابراز ناراحتی عمیق نیست. veryLow: کاربر ناراحتی یا استرس کمی را بیان می‌کند اما هیچ گونه فکر یا قصدی در مورد خودکشی یا آسیب رساندن به خود ندارد. low: ابراز ناامیدی، تمایلات منفی عمومی یا افکار خودکشی بدون برنامه یا روش خاص. medium: کاربر فکر خودکشی فعال دارد و یک روش خاص را در نظر دارد یا یک طرح کلی دارد. high: کاربر یک طرح خاص و ملموس خودکشی با نیت قوی برای اقدام دارد. veryHigh: کاربر در حال تلاش برای خودکشی است یا عمل را فوری انجام خواهد داد (در چند دقیقه/ساعت).',
                  },
                  suicideRiskDescription: {
                    type: 'string',
                    description: 'شرح دلیل انتخاب این برچسب، بر اساس نشانه‌ها و واقعیت‌های موجود در متن اصلی که در تحلیل استفاده شده است. برای سطوح medium, high, veryHigh باید نشانه‌ها و واقعیت‌های خاصی که در متن اصلی وجود داشتند ذکر شود.',
                  },
                },
                required: [
                  'lastMessage_emotions',
                  'correspondingEmojis',
                  'emotionalResponse',
                  'suicideRiskEvaluation',
                  'suicideRiskDescription',
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
      };

      // Add abort signal if provided
      if (options.signal) {
        fetchOptions.signal = options.signal;
      }

      // Implement timeout mechanism with retry
      let response: Response | null = null;
      let attempts = 0;
      const maxAttempts = 4; // Initial attempt + 3 retries for 429 errors (5s, 10s, 15s)
      
      while (attempts < maxAttempts) {
        attempts++;
        console.log(`⏳ Attempt ${attempts}/${maxAttempts} to generate inline analysis`);
        
        try {
          response = await Promise.race([
            fetch('https://openrouter.ai/api/v1/chat/completions', fetchOptions),
            new Promise((_, reject) => 
              setTimeout(() => {
                console.log('⏰ Request timeout after 30 seconds');
                reject(new Error('Request timeout after 30 seconds'));
              }, 30000)
            )
          ]) as Response;
          
          console.log(`✅ Request successful on attempt ${attempts}`);
          // If we get here, the request was successful
          // Check if response is valid before breaking
          if (response && response.ok) {
            break;
          } else if (response) {
            const errorText = await response.text();
            // Check if it's a 429 error (Too Many Requests)
            if (response.status === 429) {
              console.log(`⚠️ 429 Too Many Requests error received, attempt ${attempts}/${maxAttempts}`);
              if (attempts >= maxAttempts) {
                // If we've exhausted all attempts, throw the error
                throw new Error(`HTTP ${response.status}: ${errorText}`);
              }
              
              // Calculate delay based on attempt number: 5s, 10s, 15s
              let delay = 5000; // First retry after 5 seconds
              if (attempts === 2) delay = 10000; // Second retry after 10 seconds
              if (attempts === 3) delay = 15000; // Third retry after 15 seconds
              
              console.log(`⏳ Waiting ${delay / 1000}s before retrying...`);
              await new Promise(resolve => setTimeout(resolve, delay));
              continue; // Continue to next attempt
            } else {
              // For non-429 errors, throw to trigger regular retry logic
              throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
          }
        } catch (e) {
          console.log(`❌ Attempt ${attempts} failed:`, e);
          if (attempts >= maxAttempts) {
            // Last attempt failed, re-throw the error
            throw e;
          }
          // Retry after 1 second for other errors (not 429)
          console.log('🔄 Retrying in 1 second...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Additional check to ensure we have a valid response
      if (!response) {
        throw new Error('No response received from OpenRouter API after all attempts');
      }

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage: string
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData?.error?.message || errorData?.message || errorText
        }
        catch {
          errorMessage = errorText
        }
        throw new Error(`Chat error: ${errorMessage}`)
      }

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage: string
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData?.error?.message || errorData?.message || errorText
        }
        catch {
          errorMessage = errorText
        }
        throw new Error(`Generate error: ${errorMessage}`)
      }

      const data = await response.json()
      const content = data.choices[0].message.content

      let result: any
      try {
        result = typeof content === 'string' ? JSON.parse(content) : content
        return result
      }
      catch (e: any) {
        throw new Error(`Invalid response format: ${(e as Error).message}`)
      }
    }
    catch (e: any) {
      error.value = e.message
      
      // Check if this is an abort error
      if (e.name === 'AbortError' || (options.signal && options.signal.aborted)) {
        throw new Error('زمان پاسخ‌دهی به پایان رسید. لطفا دوباره تلاش کنید.')
      }
      
      throw e
    }
    finally {
      processing.value = false
    }
  }

  const generate = async (input: PatientGenerateInput): Promise<PatientGenerateOutput> => {
    processing.value = true
    error.value = null

    try {
      // Implement timeout mechanism with retry
      let response: Response | null = null;
      let attempts = 0;
      const maxAttempts = 4; // Initial attempt + 3 retries for 429 errors (5s, 10s, 15s)
      
      while (attempts < maxAttempts) {
        attempts++;
        console.log(`⏳ Attempt ${attempts}/${maxAttempts} to generate patient details`);
        
        try {
          response = await Promise.race([
            fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.public.openRouterApiKey}`,
                'HTTP-Referer': config.public.appUrl || 'http://localhost:4000',
                'X-Title': 'Patient Details Generator',
              },
              body: JSON.stringify({
                model: selectedModel.value,
                messages: [
                  {
                    role: 'system',
                    content: 'شما یک دستیار روانشناس هستید که در تولید اطلاعات بیمار کمک می‌کند. لطفا با توجه به اطلاعات اولیه بیمار، سایر جزئیات را به صورت منطقی و به زبان فارسی تولید کنید.',
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
                ] as ChatMessage[], // Add type assertion here
                response_format: {
                  type: 'json_schema',
                  json_schema: {
                    name: 'patient_details',
                    strict: true,
                    schema: {
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
                    },
                  },
                },
                temperature: 0.7,
                max_tokens: 0,
                plugins: [],
                transforms: ['middle-out'],
              }),
            }),
            new Promise((_, reject) => 
              setTimeout(() => {
                console.log('⏰ Request timeout after 30 seconds');
                reject(new Error('Request timeout after 30 seconds'));
              }, 30000)
            )
          ]) as Response;
          
          console.log(`✅ Request successful on attempt ${attempts}`);
          // If we get here, the request was successful
          // Check if response is valid before breaking
          if (response && response.ok) {
            break;
          } else if (response) {
            const errorText = await response.text();
            // Check if it's a 429 error (Too Many Requests)
            if (response.status === 429) {
              console.log(`⚠️ 429 Too Many Requests error received, attempt ${attempts}/${maxAttempts}`);
              if (attempts >= maxAttempts) {
                // If we've exhausted all attempts, throw the error
                throw new Error(`HTTP ${response.status}: ${errorText}`);
              }
              
              // Calculate delay based on attempt number: 5s, 10s, 15s
              let delay = 5000; // First retry after 5 seconds
              if (attempts === 2) delay = 10000; // Second retry after 10 seconds
              if (attempts === 3) delay = 15000; // Third retry after 15 seconds
              
              console.log(`⏳ Waiting ${delay / 1000}s before retrying...`);
              await new Promise(resolve => setTimeout(resolve, delay));
              continue; // Continue to next attempt
            } else {
              // For non-429 errors, throw to trigger regular retry logic
              throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
          }
        } catch (e) {
          console.log(`❌ Attempt ${attempts} failed:`, e);
          if (attempts >= maxAttempts) {
            // Last attempt failed, re-throw the error
            throw e;
          }
          // Retry after 1 second for other errors (not 429)
          console.log('🔄 Retrying in 1 second...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Additional check to ensure we have a valid response
      if (!response) {
        throw new Error('No response received from OpenRouter API after all attempts');
      }

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage: string
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData?.error?.message || errorData?.message || errorText
        }
        catch {
          errorMessage = errorText
        }
        throw new Error(`Chat error: ${errorMessage}`)
      }

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage: string
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData?.error?.message || errorData?.message || errorText
        }
        catch {
          errorMessage = errorText
        }
        throw new Error(`Generate error: ${errorMessage}`)
      }

      const data = await response.json()
      const content = data.choices[0].message.content

      let result: PatientGenerateOutput
      try {
        result = typeof content === 'string' ? JSON.parse(content) : content
        return result
      }
      catch (e: any) {
        throw new Error(`Invalid response format: ${e.message}`)
      }
    }
    catch (e: any) {
      error.value = e.message
      throw e
    }
    finally {
      processing.value = false
    }
  }

  const generateTherapist = async (input: TherapistGenerateInput): Promise<TherapistGenerateOutput> => {
    processing.value = true
    error.value = null

    try {
      // Implement timeout mechanism with retry
      let response: Response | null = null;
      let attempts = 0;
      const maxAttempts = 4; // Initial attempt + 3 retries for 429 errors (5s, 10s, 15s)
      
      while (attempts < maxAttempts) {
        attempts++;
        console.log(`⏳ Attempt ${attempts}/${maxAttempts} to generate therapist details`);
        
        try {
          response = await Promise.race([
            fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.public.openRouterApiKey}`,
                'HTTP-Referer': config.public.appUrl || 'http://localhost:4000',
                'X-Title': 'Therapist Details Generator',
              },
              body: JSON.stringify({
                model: selectedModel.value,
                messages: [
                  {
                    role: 'system',
                    content: 'شما یک دستیار روانشناس هستید که در تولید اطلاعات روانشناس کمک می‌کند. لطفا با توجه به اطلاعات اولیه روانشناس، سایر جزئیات را به صورت منطقی و به زبان فارسی تولید کنید.',
                  },
                  {
                    role: 'user',
                    content: `لطفا با توجه به اطلاعات زیر، جزئیات روانشناس را تولید کنید:
نام: ${input.name}
تخصص: ${input.specialty}
توضیح کوتاه: ${input.shortDescription}`,
                  },
                ] as ChatMessage[], // Added type assertion to fix TS error 2345
                response_format: {
                  type: 'json_schema',
                  json_schema: {
                    name: 'therapist_details',
                    strict: true,
                    schema: {
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
                    },
                  },
                },
                temperature: 0.7,
                max_tokens: 0,
                plugins: [],
                transforms: ['middle-out'],
              }),
            }),
            new Promise((_, reject) => 
              setTimeout(() => {
                console.log('⏰ Request timeout after 30 seconds');
                reject(new Error('Request timeout after 30 seconds'));
              }, 30000)
            )
          ]) as Response;
          
          console.log(`✅ Request successful on attempt ${attempts}`);
          // If we get here, the request was successful
          // Check if response is valid before breaking
          if (response && response.ok) {
            break;
          } else if (response) {
            const errorText = await response.text();
            // Check if it's a 429 error (Too Many Requests)
            if (response.status === 429) {
              console.log(`⚠️ 429 Too Many Requests error received, attempt ${attempts}/${maxAttempts}`);
              if (attempts >= maxAttempts) {
                // If we've exhausted all attempts, throw the error
                throw new Error(`HTTP ${response.status}: ${errorText}`);
              }
              
              // Calculate delay based on attempt number: 5s, 10s, 15s
              let delay = 5000; // First retry after 5 seconds
              if (attempts === 2) delay = 10000; // Second retry after 10 seconds
              if (attempts === 3) delay = 15000; // Third retry after 15 seconds
              
              console.log(`⏳ Waiting ${delay / 1000}s before retrying...`);
              await new Promise(resolve => setTimeout(resolve, delay));
              continue; // Continue to next attempt
            } else {
              // For non-429 errors, throw to trigger regular retry logic
              throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
          }
        } catch (e) {
          console.log(`❌ Attempt ${attempts} failed:`, e);
          if (attempts >= maxAttempts) {
            // Last attempt failed, re-throw the error
            throw e;
          }
          // Retry after 1 second for other errors (not 429)
          console.log('🔄 Retrying in 1 second...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Additional check to ensure we have a valid response
      if (!response) {
        throw new Error('No response received from OpenRouter API after all attempts');
      }

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage: string
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData?.error?.message || errorData?.message || errorText
        }
        catch {
          errorMessage = errorText
        }
        throw new Error(`Chat error: ${errorMessage}`)
      }

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage: string
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData?.error?.message || errorData?.message || errorText
        }
        catch {
          errorMessage = errorText
        }
        throw new Error(`Generate error: ${errorMessage}`)
      }

      const data = await response.json()
      const content = data.choices[0].message.content

      let result: TherapistGenerateOutput
      try {
        result = typeof content === 'string' ? JSON.parse(content) : content
        return result
      }
      catch (e: any) {
        throw new Error(`Invalid response format: ${e.message}`)
      }
    }
    catch (e: any) {
      error.value = e.message
      throw e
    }
    finally {
      processing.value = false
    }
  }

  /**
   * Generate a list of educational and psychological goals for a given article topic (in Persian, as a list)
   * @param {string} topic - موضوع مقاله یا خلاصه کوتاه
   * @returns {Promise<string>} - لیست اهداف به صورت رشته چندخطی
   */
  async function generateGoalsList(topic: string): Promise<string> {
    const prompt = `با توجه به موضوع زیر، یک لیست از اهداف آموزشی و روانشناختی که خواننده پس از مطالعه این مقاله به دست می‌آورد به زبان فارسی بنویس. تاکید: خروجی باید فقط یک لیست باشد و هر هدف در یک خط مجزا نوشته شود.\nموضوع: ${topic}`
    const messages = [
      { role: 'system', content: 'شما یک دستیار متخصص تولید محتوای روانشناسی هستید.' },
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
    generateGoalsList,
  }
}
