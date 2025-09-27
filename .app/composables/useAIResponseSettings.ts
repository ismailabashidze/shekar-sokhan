export type EmojiLevel = 'high' | 'medium' | 'low' | 'none'
export type Tone = 'formal' | 'neutral' | 'casual'
export type Kindness = 'very_kind' | 'kind' | 'neutral' | 'direct'
export type LengthPref = 'short' | 'medium' | 'long'
export type MultiMsgMode = 'single' | 'multi_short' | 'multi_medium'
export type Creativity = '0' | '1' | '2'
export type DomainStrictness = 'strict' | 'balanced' | 'loose'
export type LanguageStyle = 'professional' | 'casual' | 'friendly'
export type Disclaimers = 'always' | 'when_needed' | 'rarely' | 'never'
export type Profanity = 'block' | 'soften' | 'warn' | 'allow'
export type Formatting = 'none' | 'bullets' | 'numbers' | 'markdown' | 'rich'

export interface AiResponseSettings {
  multiMsgMode: MultiMsgMode
  lengthPref: LengthPref
  emojiLevel: EmojiLevel
  tone: Tone
  kindness: Kindness
  replySpeedMs: string
  creativity: Creativity
  domainStrictness: DomainStrictness
  languageStyle: LanguageStyle
  disclaimers: Disclaimers
  profanity: Profanity
  formatting: Formatting
  // Premium toggle
  isPremium: boolean
}

export function useAIResponseSettings() {
  const SETTINGS_STORAGE_KEY = 'aiResponseSettings.v2'
  const PREMIUM_STORAGE_KEY = 'aiResponsePremium'

  const defaults: AiResponseSettings = {
    multiMsgMode: 'multi_short',
    lengthPref: 'short',
    emojiLevel: 'high',
    tone: 'casual',
    kindness: 'very_kind',
    replySpeedMs: '350',
    creativity: '1',
    domainStrictness: 'balanced',
    languageStyle: 'friendly',
    disclaimers: 'when_needed',
    profanity: 'soften',
    formatting: 'none',
    isPremium: true, // Default to true for experimental feature
  }

  function loadSettings(): AiResponseSettings {
    try {
      // Load AI response settings
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
      const aiSettings = raw ? JSON.parse(raw) : {}

      // Load premium status
      const premiumRaw = localStorage.getItem(PREMIUM_STORAGE_KEY)
      const isPremium = premiumRaw ? JSON.parse(premiumRaw) : defaults.isPremium

      return {
        ...defaults,
        ...aiSettings,
        isPremium,
      }
    }
    catch {
      return { ...defaults }
    }
  }

  function saveSettings(settings: AiResponseSettings) {
    try {
      // Save AI response settings (excluding isPremium)
      const { isPremium, ...aiSettings } = settings
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(aiSettings))

      // Save premium status separately
      localStorage.setItem(PREMIUM_STORAGE_KEY, JSON.stringify(isPremium))
    }
    catch (error) {
      console.error('Failed to save AI response settings:', error)
    }
  }

  function setPremiumStatus(isPremium: boolean) {
    try {
      localStorage.setItem(PREMIUM_STORAGE_KEY, JSON.stringify(isPremium))
    }
    catch (error) {
      console.error('Failed to save premium status:', error)
    }
  }

  function getPremiumStatus(): boolean {
    try {
      const raw = localStorage.getItem(PREMIUM_STORAGE_KEY)
      return raw ? JSON.parse(raw) : false
    }
    catch {
      return false
    }
  }

  const settings = ref<AiResponseSettings>(loadSettings())

  // Watch for changes and auto-save
  watch(
    settings,
    (newSettings) => {
      saveSettings(newSettings)
    },
    { deep: true },
  )

  // Watch for user changes to sync premium status
  const { user } = useUser()
  watch(
    () => user.value?.hasCharge,
    (hasCharge) => {
      // Only update premium status if user is actually logged in (user.id exists) and hasCharge is defined
      if (user.value?.id && typeof hasCharge !== 'undefined') {
        const newIsPremium = !!hasCharge
        settings.value = { ...settings.value, isPremium: newIsPremium }
        setPremiumStatus(newIsPremium)
      }
    },
    { immediate: true }
  )

  return {
    settings: readonly(settings),
    updateSettings: (newSettings: Partial<AiResponseSettings>) => {
      settings.value = { ...settings.value, ...newSettings }
    },
    resetToDefaults: () => {
      settings.value = { ...defaults }
    },
    setPremiumStatus: (isPremium: boolean) => {
      settings.value.isPremium = isPremium
      setPremiumStatus(isPremium)
    },
    getPremiumStatus,
    loadSettings,
    saveSettings,
  }
}
